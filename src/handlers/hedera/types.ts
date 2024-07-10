import { Signer as HSigner } from "@hashgraph/sdk";
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
  ReadClaimed1155Event,
  TApproveNFT,
  TNftChain,
  TSignerAndSignature,
} from "../types";

export type TClaimHashPackNft = {
  claimHashPackNft: (
    wallet: HSigner,
    claimData: Bridge.ClaimDataStruct,
    sigs: TSignerAndSignature[],
    extraArgs: Overrides,
  ) => Promise<string>;
};

export type HederaMintArgs = {
  contract: string;
  uri: string;
};

export type THederaHandler = TNftChain<
  Signer,
  Bridge.ClaimDataStruct,
  Overrides,
  ContractTransactionResponse,
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
  ReadClaimed721Event &
  ReadClaimed1155Event &
  TClaimHashPackNft;

export type THederaParams = TEvmParams & {
  royaltySalePrice: number;
  royaltyProxy: string;
};
