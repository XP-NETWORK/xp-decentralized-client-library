import {
  Bridge__factory,
  ERC721Royalty__factory,
} from "../../contractsTypes/evm";
import { retryFn } from "../utils";

import { TEvmHandler, TEvmParams } from "./types";

export function evmHandler({
  provider,
  bridge,
  royaltySalePrice,
  storage,
  identifier,
}: TEvmParams): TEvmHandler {
  return {
    async claimNft(wallet, claimData, sigs, extraArgs) {
      const contract = Bridge__factory.connect(bridge, wallet);
      const ret = await contract.claimNFT721(
        claimData,
        sigs.map((e) => e.signature),
        {
          ...extraArgs,
          value: claimData.fee,
        },
      );
      return {
        ret: ret,
        hash: () => ret.hash,
      };
    },
    async readClaimed721Event(hash) {
      const receipt = await provider.getTransactionReceipt(hash);
      if (!receipt) {
        throw new Error("Transaction not found");
      }
      const log = receipt.logs.find((e) =>
        e.topics.includes(
          Bridge__factory.createInterface().getEvent("Claimed721").topicHash,
        ),
      );
      if (!log) {
        throw new Error("Log not found");
      }
      const claimed = Bridge__factory.createInterface().parseLog({
        data: log.data,
        topics: log.topics as string[],
      });
      if (!claimed) {
        throw new Error("Failed to parse log");
      }
      return {
        nft_contract: claimed.args.nftContract,
        source_chain: claimed.args.sourceChain,
        token_id: claimed.args.tokenId,
        transaction_hash: claimed.args.transactionHash,
      };
    },
    async readClaimed1155Event(hash) {
      const receipt = await provider.getTransactionReceipt(hash);
      if (!receipt) {
        throw new Error("Transaction not found");
      }
      const log = receipt.logs.find((e) =>
        e.topics.includes(
          Bridge__factory.createInterface().getEvent("Claim1155").topicHash,
        ),
      );
      if (!log) {
        throw new Error("Log not found");
      }
      const claimed = Bridge__factory.createInterface().parseLog({
        data: log.data,
        topics: log.topics as string[],
      });
      if (!claimed) {
        throw new Error("Failed to parse log");
      }
      return {
        nft_contract: claimed.args.nftContract,
        source_chain: claimed.args.sourceChain,
        token_id: claimed.args.tokenId,
        transaction_hash: claimed.args.transactionHash,
        amount: claimed.args.amount,
      };
    },
    async deployCollection(signer, da, ga) {
      const contract = await new ERC721Royalty__factory(signer).deploy(
        da.name,
        da.symbol,
        da.owner ?? signer,
        {
          ...ga,
          from: await signer.getAddress(),
        },
      );
      return await contract.getAddress();
    },
    async mintNft(signer, ma, gas) {
      const minter = ERC721Royalty__factory.connect(ma.contract, signer);
      const response = await minter.mint(
        await signer.getAddress(),
        ma.tokenId,
        ma.royalty,
        ma.royaltyReceiver,
        ma.uri,
        {
          ...gas,
        },
      );
      await response.wait();
      return response;
    },
    getProvider() {
      return provider;
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
        tokenId: locked.args.tokenId.toString(),
        tokenAmount: locked.args.tokenAmount.toString(),
        nftType: locked.args.nftType,
        sourceChain: locked.args.sourceChain,
        fee: fee.toString(),
        royaltyReceiver: royaltyReceiver,
        transactionHash: txHash,
        metadata: data.metadata,
        name: data.name,
        symbol: data.symbol,
        royalty: data.royalty.toString(),
        lockTxChain: identifier,
      };
    },
    getBalance(signer) {
      return provider.getBalance(signer);
    },
    transform(input) {
      return { ...input };
    },
    getStorageContract() {
      return storage;
    },
    async getValidatorCount() {
      return Number(
        await Bridge__factory.connect(bridge, provider).validatorsCount(),
      );
    },
    async nftData(tokenId, contract, overrides) {
      const nft = ERC721Royalty__factory.connect(contract, provider);
      const code = await provider.getCode(contract).catch(() => "");

      const name = await retryFn(
        () => nft.name({ ...overrides }),
        `Trying to fetch name() for ${contract}`,
        nft.name.fragment.selector,
        code,
      );

      const symbol = await retryFn(
        () => nft.symbol(),
        `Trying to fetch symbol() for ${contract}`,
        nft.symbol.fragment.selector,
        code,
      );

      const royalty = await retryFn(
        () => nft.royaltyInfo(tokenId, royaltySalePrice),
        `Trying to fetch royaltyInfo() for ${contract}`,
        nft.royaltyInfo.fragment.selector,
        code,
      );

      const metadata = await retryFn(
        () => nft.tokenURI(tokenId),
        `Trying to fetch tokenURI() for ${contract}`,
        nft.tokenURI.fragment.selector,
        code,
      );

      return {
        name: name || "XP Wrapped Nft",
        symbol: symbol || "XPNFT",
        // If undefined, set royalty as zero.
        royalty: (royalty ?? [0n, 0n])[1],
        metadata: metadata || "",
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
        {
          ...extraArgs,
        },
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
    async claimSft(wallet, claimData, sigs, extraArgs) {
      const contract = Bridge__factory.connect(bridge, wallet);
      const ret = await contract.claimNFT1155(
        claimData,
        sigs.map((e) => e.signature),
        {
          ...extraArgs,
          value: claimData.fee,
        },
      );
      return {
        ret,
        hash: () => ret.hash,
      };
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
        {
          ...extraArgs,
        },
      );
      return {
        ret: tx,
        hash() {
          return tx.hash;
        },
      };
    },
  };
}
