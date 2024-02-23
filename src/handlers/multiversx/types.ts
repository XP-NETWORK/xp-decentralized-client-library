import { INetworkProvider } from "@multiversx/sdk-network-providers/out/interface";
import { UserAddress } from "@multiversx/sdk-wallet/out/userAddress";
import { BridgeStorage } from "../../contractsTypes/evm";
import { MintNft, TSingularNftChain } from "../types";

// Custom Interface because there is no such signer interface in mx-sdk.
export type TMultiversXSigner = {
  sign: (message: Buffer) => Promise<Buffer>;
  getAddress: () => UserAddress;
};

export type TMultiversXClaimArgs = {
  tokenId: string;
  sourceChain: string;
  destinationChain: string;
  destinationUserAddress: string;
  sourceNftContractAddress: string;
  name: string;
  symbol: string;
  royalty: string;
  royaltyReceiver: string;
  attrs: string;
  transactionHash: string;
  tokenAmount: string;
  nftType: string;
  fee: string;
  metadata: string;
};

/**
 * arguments required to issue an NFT
 */
export type NftIssueArgs = {
  readonly identifier: string;
  readonly uris: Array<string>;
  readonly name: string;
  readonly quantity?: number;
  readonly royalties?: number;
  readonly hash?: string;
  readonly attrs?: string;
};

export type TMultiversXHandler = TSingularNftChain<
  TMultiversXSigner,
  TMultiversXClaimArgs,
  unknown,
  string,
  INetworkProvider
> &
  MintNft<TMultiversXSigner, NftIssueArgs, string>;

export type TMultiversXParams = {
  provider: INetworkProvider;
  gatewayURL: string;
  bridge: string;
  storage: BridgeStorage;
};
