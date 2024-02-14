import {
  ContractTransactionResponse,
  JsonRpcProvider,
  Overrides,
  Provider,
  Signer,
} from "ethers";
import { Bridge, BridgeStorage } from "../../contractsTypes/evm";
import { TNftChain } from "../types";

export type TEvmHandler = TNftChain<
  Signer,
  Bridge.ClaimDataStruct,
  Overrides,
  ContractTransactionResponse,
  Provider
>;

export type TEvmParams = {
  identifier: string;
  provider: JsonRpcProvider;
  bridge: string;
  royaltySalePrice: number;
  storage: BridgeStorage;
};
