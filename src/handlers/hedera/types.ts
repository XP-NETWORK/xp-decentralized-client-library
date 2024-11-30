import type {
  Signer as HederaSigner,
  TransactionReceipt,
  TransactionResponseJSON,
} from "@hashgraph/sdk";
import type {
  ContractTransactionResponse,
  Overrides,
  Provider,
  Signer,
} from "ethers";
import type { Bridge } from "../../contractsTypes/evm";
import type { PayableOverrides } from "../../contractsTypes/evm/common";
import type { TEvmParams } from "../evm/types";
import type {
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
