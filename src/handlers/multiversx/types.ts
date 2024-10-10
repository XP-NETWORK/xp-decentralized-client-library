import {
  AddressType,
  BigUIntType,
  BytesType,
  FieldDefinition,
  StructType,
  Transaction,
} from "@multiversx/sdk-core/out";
import { INetworkProvider } from "@multiversx/sdk-network-providers/out/interface";
import { BridgeStorage } from "../../contractsTypes/evm";
import {
  DeployNFTCollection,
  MintNft,
  ReadClaimed721Event,
  ReadClaimed1155Event,
  TNftChain,
  ValidateNftData,
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

export type TMultiversXHandler = TNftChain<
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
  DeployNFTCollection<
    TMultiversXSigner,
    { name: string; ticker: string },
    { gasLimit: number },
    string
  > &
  ReadClaimed721Event &
  ReadClaimed1155Event &
  TGetTransactionStatus &
  ValidateNftData;

type TGetTransactionStatus = {
  getTransactionStatus(txHash: string): Promise<string>;
};

export type TMultiversXParams = {
  provider: INetworkProvider;
  gatewayURL: string;
  bridge: string;
  storage: BridgeStorage;
  chainId: string;
  identifier: string;
};

export const StructClaimDataType = new StructType("ClaimData", [
  new FieldDefinition("token_id", "name of the nft", new BytesType()),
  new FieldDefinition("source_chain", "attributes of the nft", new BytesType()),
  new FieldDefinition(
    "destination_chain",
    "attributes of the nft",
    new BytesType(),
  ),
  new FieldDefinition(
    "destination_user_address",
    "attributes of the nft",
    new AddressType(),
  ),
  new FieldDefinition(
    "source_nft_contract_address",
    "attributes of the nft",
    new BytesType(),
  ),
  new FieldDefinition("name", "attributes of the nft", new BytesType()),
  new FieldDefinition("symbol", "attributes of the nft", new BytesType()),
  new FieldDefinition("royalty", "attributes of the nft", new BigUIntType()),
  new FieldDefinition(
    "royalty_receiver",
    "attributes of the nft",
    new AddressType(),
  ),
  new FieldDefinition("attrs", "attributes of the nft", new BytesType()),
  new FieldDefinition(
    "transaction_hash",
    "attributes of the nft",
    new BytesType(),
  ),
  new FieldDefinition(
    "token_amount",
    "attributes of the nft",
    new BigUIntType(),
  ),
  new FieldDefinition("nft_type", "attributes of the nft", new BytesType()),
  new FieldDefinition("fee", "attributes of the nft", new BigUIntType()),
  new FieldDefinition(
    "lock_tx_chain",
    "Chain identifier on which nft was locked",
    new BytesType(),
  ),
  new FieldDefinition("img_uri", "uri of the image", new BytesType()),
]);
