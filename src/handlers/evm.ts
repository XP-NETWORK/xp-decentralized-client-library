import {
  ContractTransactionResponse,
  JsonRpcProvider,
  Overrides,
  Signer,
} from "ethers";
import {
  Bridge,
  Bridge__factory,
  ERC721Royalty__factory,
} from "../contractsTypes";
import type { TNftChain } from "./chain";

export type EvmHandler = TNftChain<
  Signer,
  Bridge.ClaimDataStruct,
  [tokenId: string, contract: string],
  Overrides,
  ContractTransactionResponse
>;

export type EvmParams = {
  identifier: string;
  provider: JsonRpcProvider;
  bridge: string;
  royaltySalePrice: number;
};

export function evmHandler({
  provider,
  bridge,
  royaltySalePrice,
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
    getBalance(signer) {
      return provider.getBalance(signer);
    },
    async nftData(signer, args, tokenId, contract) {
      const nft = ERC721Royalty__factory.connect(contract, signer);
      return {
        name: await nft.name({
          ...args,
        }),
        symbol: await nft.symbol(),
        royalty: (await nft.royaltyInfo("", royaltySalePrice))[1],
        metadata: await nft.tokenURI(tokenId),
      };
    },
    lockSft(
      signer,
      sourceNftAddress,
      destinationChain,
      to,
      tokenId,
      amt,
      extraArgs,
    ) {
      const contract = Bridge__factory.connect(bridge, signer);
      return contract.lock1155(
        tokenId.toString(),
        destinationChain,
        to,
        sourceNftAddress,
        amt,
        extraArgs,
      );
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
    lockNft(
      signer,
      sourceNftAddress,
      destinationChain,
      to,
      tokenId,
      extraArgs,
    ) {
      const contract = Bridge__factory.connect(bridge, signer);
      return contract.lock721(
        tokenId.toString(),
        destinationChain,
        to,
        sourceNftAddress,
        extraArgs,
      );
    },
  };
}
