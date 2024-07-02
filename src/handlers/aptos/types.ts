import { Account, Aptos, PendingTransactionResponse } from "@aptos-labs/ts-sdk";
import { Network } from "aptos";
import { BridgeStorage } from "../../contractsTypes/evm";
import { TNftChain } from "../types";
import { TClaimData } from "./bridge-client";

export type TAptosHandler = TNftChain<
  Account,
  TClaimData,
  never,
  PendingTransactionResponse,
  Aptos
>;

export type TAptosParams = {
  bridge: string;
  network: Network;
  storage: BridgeStorage;
};
