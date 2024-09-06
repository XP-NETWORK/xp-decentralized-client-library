import { Transaction } from "@multiversx/sdk-core/out";
import { INetworkProvider } from "@multiversx/sdk-network-providers/out/interface";
import { BridgeStorage } from "../../contractsTypes/evm";
import {
  DeployCollection,
  MintNft,
  ReadClaimed721Event,
  ReadClaimed1155Event,
  TSingularNftChain,
} from "../types";

// Custom Interface because there is no such signer interface in mx-sdk.
export type TMultiversXSigner = {
  signTransaction(transaction: Transaction): Promise<Transaction>;
  getAddress: () => Promise<string>;
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
  lockTxChain: string;
  imgUri: string;
};

/**
 * arguments required to issue an NFT
 */
export type NftIssueArgs = {
  readonly uris: Array<string>;
  readonly name: string;
  readonly quantity?: number;
  readonly royalties?: number;
  readonly hash?: string;
  readonly attrs?: string;
  readonly ticker: string;
};

export type TMultiversXHandler = TSingularNftChain<
  TMultiversXSigner,
  TMultiversXClaimArgs,
  unknown,
  string,
  INetworkProvider
> &
  MintNft<
    TMultiversXSigner,
    NftIssueArgs,
    { gasLimit: number; value: number },
    string
  > &
  DeployCollection<
    TMultiversXSigner,
    { name: string; ticker: string },
    { gasLimit: number },
    string
  > &
  ReadClaimed721Event &
  ReadClaimed1155Event;

export type TMultiversXParams = {
  provider: INetworkProvider;
  gatewayURL: string;
  bridge: string;
  storage: BridgeStorage;
  chainId: string;
  identifier: string;
};
