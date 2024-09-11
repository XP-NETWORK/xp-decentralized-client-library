import type {
  Signer as HederaSigner,
  TransactionReceipt,
  TransactionResponseJSON,
} from "@hashgraph/sdk";
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
  DeployNFTCollection,
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
  ContractTransactionResponse | TransactionResponseJSON,
  Provider
> &
  MintNft<
    Signer,
    HederaMintArgs,
    PayableOverrides,
    ContractTransactionResponse
  > &
  TApproveNFT<
    Signer,
    PayableOverrides,
    ContractTransactionResponse | TransactionResponseJSON
  > &
  DeployNFTCollection<
    Signer,
    {
      name: string;
      symbol: string;
    },
    Overrides,
    string
  > &
  ReadClaimed721Event & {
    injectSDK: (hsdk: typeof import("@hashgraph/sdk")) => void;
  } & {
    associateTokens: (wallet: HederaSigner) => Promise<TransactionReceipt>;
  };

export type THederaParams = TEvmParams & {
  bridgeContractId: string;
  royaltySalePrice: number;
  royaltyProxy: string;
  mirrorNodeApi: string;
};
