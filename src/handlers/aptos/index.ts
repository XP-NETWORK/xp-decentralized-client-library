import { Aptos, AptosConfig, isBcsAddress } from "@aptos-labs/ts-sdk";
import { createSurfClient } from "@thalalabs/surf";
import { HexString } from "aptos";
import { raise } from "../ton";
import { ABI } from "./abi";
import { TAptosHandler, TAptosParams } from "./types";

export function aptosHandler({
  bridge,
  network,
  storage,
  identifier,
}: TAptosParams): TAptosHandler {
  const config = new AptosConfig({ network });
  const aptos = new Aptos(config);
  const bc = createSurfClient(aptos).useABI(ABI(bridge));

  return {
    validateAddress(address) {
      return Promise.resolve(isBcsAddress(address));
    },
    identifier,
    async getValidatorCount() {
      const [bd] = await bc.view.validator_count({
        functionArguments: [],
        typeArguments: [],
      });
      if (!bd) throw new Error("Failed to fetch bridge data");
      return Number.parseInt(bd);
    },
    async deployNftCollection(signer, da) {
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
      await aptos.waitForTransaction({
        transactionHash: response.hash,
        options: {
          checkSuccess: true,
        },
      });
      return da.name;
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
            e.current_token_data?.current_collection?.collection_name ===
              ma.contract && e.current_token_data?.token_name === ma.name,
        )?.token_data_id ?? raise("Failed to send tx")
      );
    },
    transform(input) {
      return {
        amount: BigInt(input.tokenAmount),
        collection: input.sourceNftContractAddress,
        description: input.sourceNftContractAddress,
        destinationChain: Buffer.from(input.destinationChain),
        fee: BigInt(input.fee),
        metadata: input.metadata,
        uri: input.metadata,
        royaltyPayeeAddress: HexString.ensure(input.royaltyReceiver),
        royaltyPointsNumerator: Number(input.royalty),
        royaltyPointsDenominator: 10000,
        sourceChain: Buffer.from(input.sourceChain),
        nftType: Buffer.from(input.nftType),
        symbol: input.symbol,
        iconUri: input.metadata,
        projectUri: input.metadata,
        tokenId: input.tokenId,
        transactionHash: Buffer.from(input.transactionHash),
        sourceNftContractAddress: Buffer.from(input.sourceNftContractAddress),
        destination_chain: input.destinationChain,
        destinationUserAddress: input.destinationUserAddress as `0x${string}`,
        name: input.name,
        nft_type: input.nftType,
        royaltyPercentage: BigInt(input.royalty),
        royaltyReceiver: input.royaltyReceiver as `0x${string}`,
        source_chain: input.sourceChain,
        source_nft_contract_address: input.sourceNftContractAddress,
        token_id: BigInt(input.tokenId),
        transaction_hash: input.transactionHash,
      };
    },
    approveNft() {
      throw new Error("Approval not required in aptos");
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
    async decodeLockedEvent(transactionHash) {
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
      return {
        tokenAmount: event.data.token_amount,
        sourceChain: hexStringToUtf8(event.data.self_chain),
        sourceNftContractAddress: hexStringToUtf8(
          event.data.source_nft_contract_address,
        ),
        tokenId: event.data.token_id,
        destinationChain: hexStringToUtf8(event.data.destination_chain),
        destinationUserAddress: event.data.destination_user_address,
        nftType: hexStringToUtf8(event.data.nft_type),
        transactionHash: transactionHash,
        lockTxChain: identifier,
        metaDataUri: "",
      };
    },
    async claimSft(signer, claimData, sigs) {
      const signatures = sigs.map((e) =>
        Buffer.from(e.signature.replace("0x", ""), "hex"),
      );
      const signers = sigs.map((e) => Buffer.from(e.signerAddress));
      const response = await bc.entry.claim_1155({
        account: signer,
        functionArguments: [
          claimData.destinationUserAddress,
          claimData.name,
          claimData.uri,
          claimData.royaltyPercentage,
          claimData.royaltyReceiver,
          claimData.fee,
          signatures,
          signers,
          claimData.destination_chain,
          claimData.source_chain,
          claimData.source_nft_contract_address,
          claimData.token_id,
          claimData.transaction_hash,
          claimData.nft_type,
          claimData.metadata,
          claimData.symbol,
          claimData.amount,
        ],
        typeArguments: [],
      });
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
      const response = await bc.entry.claim_721({
        account: signer,
        functionArguments: [
          claimData.destinationUserAddress,
          claimData.name,
          claimData.uri,
          claimData.royaltyPercentage,
          claimData.royaltyReceiver,
          claimData.fee,
          signatures,
          signers,
          claimData.destination_chain,
          claimData.source_chain,
          claimData.source_nft_contract_address,
          claimData.token_id,
          claimData.transaction_hash,
          claimData.nft_type,
          claimData.metadata,
          claimData.symbol,
        ],
        typeArguments: [],
      });
      return {
        hash() {
          return response.hash;
        },
        ret: response,
      };
    },
    async lockNft(
      signer,
      sourceNft,
      destinationChain,
      destinationUserAddress,
      tokenId,
      metadataUri,
    ) {
      const lock = await bc.entry.lock_721({
        account: signer,
        functionArguments: [
          tokenId as `0x${string}`,
          destinationChain,
          destinationUserAddress,
          sourceNft as `0x${string}`,
          metadataUri,
        ],
        typeArguments: [],
      });
      return {
        hash() {
          return lock.hash;
        },
        ret: lock,
      };
    },
    async lockSft(
      signer,
      sourceNft,
      destinationChain,
      destinationUserAddress,
      tokenId,
      amount,
      metadataUri,
    ) {
      const lock = await bc.entry.lock_1155({
        account: signer,
        functionArguments: [
          tokenId as `0x${string}`,
          destinationChain,
          destinationUserAddress,
          sourceNft as `0x${string}`,
          amount,
          metadataUri,
        ],
        typeArguments: [],
      });
      return {
        hash() {
          return lock.hash;
        },
        ret: lock,
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
