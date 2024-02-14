import { Sender } from "@ton/core";
import { TonClient } from "@ton/ton";
import { BridgeStorage } from "../../contractsTypes/evm";
import { ClaimData } from "../../contractsTypes/ton/tonBridge";
import { TSingularNftChain } from "../types";

export type TTonHandler = TSingularNftChain<
  Sender,
  ClaimData,
  unknown,
  undefined,
  TonClient
>;

export type TTonParams = {
  client: TonClient;
  bridgeAddress: string;
  storage: BridgeStorage;
};
