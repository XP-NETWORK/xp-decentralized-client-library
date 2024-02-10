import {
  ContractTransactionResponse,
  JsonRpcProvider,
  Overrides,
  Signer,
} from "ethers";
import {
  Bridge,
  BridgeStorage,
  Bridge__factory,
  ERC721Royalty__factory,
} from "../contractsTypes";
import type { TNftChain } from "./chain";

export type EvmHandler = TNftChain<
  Signer,
  Bridge.ClaimDataStruct,
  Overrides,
  ContractTransactionResponse
>;

export type EvmParams = {
  identifier: string;
  provider: JsonRpcProvider;
  bridge: string;
  royaltySalePrice: number;
  storage: BridgeStorage;
};

export function evmHandler({
  provider,
  bridge,
  royaltySalePrice,
  storage,
}: EvmParams): EvmHandler {
  return {
    claimNft(wallet, claimData, extraArgs, sigs) {
      const contract = Bridge__factory.connect(bridge, wallet);
      return contract.claimNFT1155(
        claimData,
        sigs.map((e) => e.signature),
        extraArgs,
      );
    },
    async getClaimData(txHash) {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) {
        throw new Error("Transaction not found");
      }
      const log = receipt.logs.find((e) =>
        e.topics.includes(
          Bridge__factory.createInterface().getEvent("Locked").topicHash,
        ),
      );
      if (!log) {
        throw new Error("Lock event not found");
      }
      const locked = Bridge__factory.createInterface().parseLog({
        data: log.data,
        topics: log.topics as string[],
      });
      if (!locked) {
        throw new Error("Failed to parse log");
      }
      const fee = await storage.chainFee(locked.args.destinationChain);
      const royaltyReceiver = await storage.chainRoyalty(
        locked.args.destinationChain,
      );
      const data = await this.nftData(
        locked.args.tokenId,
        locked.args.sourceNftContractAddress,
        {},
      );
      return {
        destinationChain: locked.args.destinationChain,
        destinationUserAddress: locked.args.destinationUserAddress,
        sourceNftContractAddress: locked.args.sourceNftContractAddress,
        tokenId: locked.args.tokenId,
        tokenAmount: locked.args.tokenAmount,
        nftType: locked.args.nftType,
        sourceChain: locked.args.sourceChain,
        fee: fee.toString(),
        royaltyReceiver: royaltyReceiver,
        transactionHash: txHash,
        metadata: data.metadata,
        name: data.name,
        symbol: data.symbol,
        royalty: data.royalty.toString(),
      };
    },
    getBalance(signer) {
      return provider.getBalance(signer);
    },
    async nftData(tokenId, contract, overrides) {
      const nft = ERC721Royalty__factory.connect(contract, provider);
      return {
        name: await nft.name({
          ...overrides,
        }),
        symbol: await nft.symbol(),
        royalty: (await nft.royaltyInfo("", royaltySalePrice))[1],
        metadata: await nft.tokenURI(tokenId),
      };
    },
    async lockSft(
      signer,
      sourceNftAddress,
      destinationChain,
      to,
      tokenId,
      amt,
      extraArgs,
    ) {
      const contract = Bridge__factory.connect(bridge, signer);
      const tx = await contract.lock1155(
        tokenId.toString(),
        destinationChain,
        to,
        sourceNftAddress,
        amt,
        extraArgs,
      );
      return {
        tx,
        hash() {
          return tx.hash;
        },
      };
    },
    async approveNft(signer, tokenId, contract, extraArgs) {
      return ERC721Royalty__factory.connect(contract, signer).approve(
        bridge,
        tokenId,
        {
          ...extraArgs,
        },
      );
    },
    claimSft(wallet, claimData, sigs, extraArgs) {
      const contract = Bridge__factory.connect(bridge, wallet);
      return contract.claimNFT1155(
        claimData,
        sigs.map((e) => e.signature),
        extraArgs,
      );
    },
    async lockNft(
      signer,
      sourceNftAddress,
      destinationChain,
      to,
      tokenId,
      extraArgs,
    ) {
      const contract = Bridge__factory.connect(bridge, signer);
      const tx = await contract.lock721(
        tokenId.toString(),
        destinationChain,
        to,
        sourceNftAddress,
        extraArgs,
      );
      return {
        tx,
        hash() {
          return tx.hash;
        },
      };
    },
  };
}
