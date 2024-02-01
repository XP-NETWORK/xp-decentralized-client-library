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
import { NftChain } from "./chain";

export type EvmHandler = NftChain<
  Signer,
  Bridge.ClaimDataStruct,
  Overrides,
  ContractTransactionResponse
>;

export type EvmParams = {
  identifier: string;
  rpc: string;
  bridge: string;
  royaltySalePrice: number;
};

export function evmHandler({
  rpc,
  bridge,
  royaltySalePrice,
}: EvmParams): EvmHandler {
  const provider = new JsonRpcProvider(rpc);

  return {
    claimNft(wallet, claimData, ex, sigs) {
      const contract = Bridge__factory.connect(bridge, wallet);
      return contract.claimNFT1155(
        claimData,
        sigs.map((e) => e.signature),
        ex,
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
    lockSft(signer, sourceNftAddress, destinationChain, to, tokenId, amt, ex) {
      const contract = Bridge__factory.connect(bridge, signer);
      return contract.lock1155(
        tokenId.toString(),
        destinationChain,
        to,
        sourceNftAddress,
        amt,
        ex,
      );
    },
    claimSft(wallet, claimData, sigs, ex) {
      const contract = Bridge__factory.connect(bridge, wallet);
      return contract.claimNFT1155(
        claimData,
        sigs.map((e) => e.signature),
        ex,
      );
    },
    lockNft(signer, sourceNftAddress, destinationChain, to, tokenId, ex) {
      const contract = Bridge__factory.connect(bridge, signer);
      return contract.lock721(
        tokenId.toString(),
        destinationChain,
        to,
        sourceNftAddress,
        ex,
      );
    },
  };
}
