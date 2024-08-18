import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { HexString } from "aptos";
import { raise } from "../ton";
import { TNFTData } from "../types";
import { BridgeClient } from "./bridge-client";
import { TAptosHandler, TAptosParams } from "./types";

export function aptosHandler({
  bridge,
  network,
  storage,
  identifier,
}: TAptosParams): TAptosHandler {
  const config = new AptosConfig({ network });
  const aptos = new Aptos(config);
  const bc = new BridgeClient(aptos, bridge);

  return {
    async getValidatorCount() {
      const bd = await bc.getBridgeData();
      if (!bd) throw new Error("Failed to fetch bridge data");
      return bd.validators.data.length;
    },
    async deployCollection(signer, da) {
      const transaction = await aptos.createCollectionTransaction({
        creator: signer,
        description: `Testnet Collection: ${da.name}(${da.symbol}) by XP Network.`,
        name: da.name,
        uri: "https://xp.network",
      });
      const response = await aptos.signAndSubmitTransaction({
        signer,
        transaction,
      });
      const tx = await aptos.waitForTransaction({
        transactionHash: response.hash,
        options: {
          checkSuccess: true,
        },
      });
      const alicesCollection = await aptos.getCollectionData({
        creatorAddress: signer.accountAddress,
        collectionName: da.name,
        minimumLedgerVersion: BigInt(tx.version),
      });
      return alicesCollection.collection_id;
    },
    async mintNft(signer, ma) {
      const transaction = await aptos.mintDigitalAssetTransaction({
        collection: ma.contract,
        creator: signer,
        name: ma.name,
        uri: ma.uri,
        description: "Test Asset for XP Network",
      });
      const response = await aptos.signAndSubmitTransaction({
        signer,
        transaction,
      });
      const tx = await aptos.waitForTransaction({
        transactionHash: response.hash,
        options: {
          checkSuccess: true,
        },
      });
      const assets = await aptos.getOwnedDigitalAssets({
        ownerAddress: signer.accountAddress,
        minimumLedgerVersion: BigInt(tx.version),
      });
      return (
        assets.find(
          (e) =>
            e.current_token_data?.collection_id === ma.contract &&
            e.current_token_data.token_name === ma.name,
        )?.token_data_id ?? raise("Failed to send tx")
      );
    },
    transform(input) {
      const cleanHexAddress = input.sourceNftContractAddress.startsWith("0x")
        ? input.sourceNftContractAddress.slice(2)
        : input.sourceNftContractAddress;

      return {
        destinationUserAddress: HexString.ensure(input.destinationUserAddress),
        name: input.name,
        symbol: input.symbol,
        amount: Number(input.tokenAmount),
        royaltyPercentage: Number(input.royalty),
        royaltyPayeeAddress: HexString.ensure(input.royaltyReceiver),
        fee: Number(input.fee),
        sourceChain: Buffer.from(input.sourceChain),
        destinationChain: Buffer.from(input.destinationChain),
        sourceNftContractAddress: hexStringToUint8Array(cleanHexAddress),
        transactionHash: Buffer.from(input.transactionHash),
        tokenId: Number(input.tokenId),
        nftType: Buffer.from(input.nftType),
        metadata: input.metadata,
        lockTxChain: Buffer.from(input.lockTxChain),
      };
    },
    approveNft() {
      throw new Error("Approval not required in aptos ");
    },
    async getBalance(signer) {
      const balance = await aptos.getAccountAPTAmount({
        accountAddress: signer.accountAddress,
      });
      return BigInt(balance);
    },
    getProvider() {
      return aptos;
    },
    getStorageContract() {
      return storage;
    },
    async nftData(tokenId, _contract, _extraArgs) {
      const data = await aptos.digitalAsset.getDigitalAssetData({
        digitalAssetAddress: tokenId.replace("0x", ""),
      });
      return {
        metadata: data.token_uri,
        name: data.token_name,
        royalty: 0n,
        symbol: data.current_collection?.collection_name ?? "ANFT",
      };
    },
    async getClaimData(transactionHash) {
      const tx = await aptos.waitForTransaction({ transactionHash });
      const events = await aptos.getEvents({
        options: {
          where: {
            transaction_version: {
              _eq: tx.version,
            },
          },
        },
      });
      const event = events.find((e) =>
        e.type.includes("aptos_nft_bridge::LockedEvent"),
      );
      if (!event) throw new Error("Event not found");
      const destinationChain = hexStringToUtf8(event.data.destination_chain);
      const fee = await storage.chainFee(destinationChain);
      const royaltyReceiver = await storage.chainRoyalty(destinationChain);
      let data: TNFTData = {
        metadata: "",
        name: "",
        royalty: 0n,
        symbol: "",
      };
      try {
        data = await this.nftData(
          hexStringToUtf8(event.data.collection_address),
          "",
          undefined,
        );
      } catch (e) {}
      return {
        tokenAmount: event.data.token_amount,
        sourceChain: hexStringToUtf8(event.data.self_chain),
        sourceNftContractAddress: hexStringToUtf8(
          event.data.collection_address,
        ),
        tokenId: event.data.token_id,
        destinationChain: hexStringToUtf8(event.data.destination_chain),
        destinationUserAddress: event.data.destination_user_address,
        nftType: hexStringToUtf8(event.data.nft_type),
        fee: fee.toString(),
        royaltyReceiver,
        metadata: data.metadata,
        name: data.name,
        royalty: data.royalty.toString(),
        transactionHash: transactionHash,
        symbol: data.symbol,
        lockTxChain: identifier,
      };
    },
    async claimSft(signer, claimData, sigs) {
      const signatures = sigs.map((e) =>
        Buffer.from(e.signature.replace("0x", ""), "hex"),
      );
      const signers = sigs.map((e) => Buffer.from(e.signerAddress));
      const response = await bc.claim1155(
        signer,
        claimData,
        signatures,
        signers,
      );
      return {
        hash() {
          return response.hash;
        },
        ret: response,
      };
    },
    async claimNft(signer, claimData, sigs) {
      const signatures = sigs.map((e) =>
        Buffer.from(e.signature.replace("0x", ""), "hex"),
      );
      const signers = sigs.map((e) => Buffer.from(e.signerAddress));
      const response = await bc.claim721(
        signer,
        claimData,
        signatures,
        signers,
      );
      return {
        hash() {
          return response.hash;
        },
        ret: response,
      };
    },
    async lockNft(signer, sourceNft, destinationChain, to, tokenId) {
      const lock = await bc.lock721(
        signer,
        HexString.ensure(tokenId.toString()), // ?We need to provide tokenAddress here.
        Buffer.from(destinationChain),
        to,
        HexString.ensure(sourceNft),
      );
      return {
        hash() {
          return lock.hash;
        },
        ret: lock,
      };
    },
    async lockSft(signer, sourceNft, destinationChain, to, tokenId, amount) {
      const lock = await bc.lock1155(
        signer,
        HexString.ensure(tokenId.toString()), // ?We need to provide tokenAddress here.
        Buffer.from(destinationChain),
        to,
        HexString.ensure(sourceNft),
        Number(amount),
      );
      return {
        hash() {
          return lock.hash;
        },
        tx: lock,
      };
    },
  };
}

export function hexStringToUtf8(src: string): string {
  let source = src;
  if (source.startsWith("0x")) {
    source = src.replace("0x", "");
  }
  return Buffer.from(source, "hex").toString("utf-8");
}

const hexStringToUint8Array = (hexString: string): Uint8Array => {
  return new Uint8Array(
    hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [],
  );
};
