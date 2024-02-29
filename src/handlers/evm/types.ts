import {
  ContractTransactionResponse,
  JsonRpcProvider,
  Overrides,
  Provider,
  Signer,
} from "ethers";
import { Bridge, BridgeStorage } from "../../contractsTypes/evm";

import { PayableOverrides } from "../../contractsTypes/evm/common";
import { DeployCollection, MintNft, TNftChain } from "../types";

export type TEvmHandler = TNftChain<
  Signer,
  Bridge.ClaimDataStruct,
  Overrides,
  ContractTransactionResponse,
  Provider
> &
  MintNft<
    Signer,
    {
      contract: string;
      uri: string;
      tokenId: bigint;
      royalty: bigint;
      royaltyReceiver: string;
    },
    PayableOverrides,
    ContractTransactionResponse
  > &
  DeployCollection<
    Signer,
    {
      name: string;
      symbol: string;
      owner?: string;
    },
    Overrides,
    string
  >;

export type TEvmParams = {
  identifier: string;
  provider: JsonRpcProvider;
  bridge: string;
  royaltySalePrice: number;
  storage: BridgeStorage;
};
