import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { HexString } from "aptos";
import { BridgeClient } from "./bridge-client";
import { TAptosHandler, TAptosParams } from "./types";

export function aptosHelper({
  bridge,
  network,
  storage,
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
    transform(input) {
      return {
        amount: Number(input.tokenAmount),
        collection: input.sourceNftContractAddress,
        description: input.sourceNftContractAddress,
        destinationChain: Buffer.from(input.destinationChain),
        fee: Number(input.fee),
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
    async nftData(_tokenId, contract, _extraArgs) {
      const data = await aptos.digitalAsset.getDigitalAssetData({
        digitalAssetAddress: contract,
      });
      return {
        metadata: data.token_uri,
        name: data.token_name,
        royalty: 0n,
        symbol: data.current_collection?.collection_name ?? "ANFT",
      };
    },
    async getClaimData(_) {
      throw new Error("Unimplemented");
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
    async lockNft(signer, sourceNft, destinationChain, _, tokenId) {
      const lock = await bc.lock721(
        signer,
        sourceNft,
        tokenId.toString(),
        Buffer.from(destinationChain),
        0,
        Buffer.from(sourceNft),
      );
      return {
        hash() {
          return lock.hash;
        },
        ret: lock,
      };
    },
    async lockSft(signer, sourceNft, destinationChain, _, tokenId, amount) {
      const lock = await bc.lock1155(
        signer,
        sourceNft,
        tokenId.toString(),
        Number(amount),
        Buffer.from(destinationChain),
        0,
        Buffer.from(sourceNft),
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
