import { Signer as HederaSigner, TransactionResponse } from "@hashgraph/sdk";
import {
  ContractTransactionResponse,
  Overrides,
  Provider,
  Signer,
} from "ethers";
import { Bridge } from "../../contractsTypes/evm";
import { PayableOverrides } from "../../contractsTypes/evm/common";
import { TEvmParams } from "../evm/types";
import {
  DeployCollection,
  MintNft,
  ReadClaimed721Event,
  TApproveNFT,
  TSingularNftChain,
} from "../types";

export type HederaMintArgs = {
  contract: string;
  uri: string;
};

export type THederaHandler = TSingularNftChain<
  Signer | HederaSigner,
  Bridge.ClaimDataStruct,
  Overrides,
  ContractTransactionResponse | TransactionResponse,
  Provider
> &
  MintNft<
    Signer,
    HederaMintArgs,
    PayableOverrides,
    ContractTransactionResponse
  > &
  TApproveNFT<Signer, PayableOverrides, ContractTransactionResponse> &
  DeployCollection<
    Signer,
    {
      name: string;
      symbol: string;
    },
    Overrides,
    string
  > &
  ReadClaimed721Event;

export type THederaParams = TEvmParams & {
  royaltySalePrice: number;
  royaltyProxy: string;
};
