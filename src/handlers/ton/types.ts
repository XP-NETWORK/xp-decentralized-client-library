import { Sender } from "@ton/core";
import { TonClient } from "@ton/ton";
import { BridgeStorage } from "../../contractsTypes/evm";
import { ClaimData } from "../../contractsTypes/ton/tonBridge";
import { DeployCollection, MintNft, TSingularNftChain } from "../types";
import { collectionData } from "./nft";

export type TonMintArgs = collectionData;

export type TTonHandler = TSingularNftChain<
  Sender,
  ClaimData,
  unknown,
  undefined,
  TonClient
> &
  MintNft<Sender, TonMintArgs, never, undefined> &
  DeployCollection<Sender, TonMintArgs, never, string>;

export type TTonParams = {
  client: TonClient;
  bridgeAddress: string;
  storage: BridgeStorage;
};
