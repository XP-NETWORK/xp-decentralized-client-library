import { Address, Cell, Sender } from "@ton/core";
import { TonClient } from "@ton/ton";
import { BridgeStorage } from "../../contractsTypes/evm";
import { ClaimData } from "../../contractsTypes/ton/tonBridge";
import {
  DeployCollection,
  MintNft,
  ReadClaimed721Event,
  TSingularNftChain,
} from "../types";
import { RoyaltyParams } from "./nftc";

export type TonDeployArgs = {
  owner_address: Address;
  collection_content: Cell;
  royalty_params: RoyaltyParams;
};
export type TonMintArgs = {
  contract: string;
  uri: string;
  owner: Address;
  token_id: bigint;
};

export type TTonHandler = TSingularNftChain<
  Sender,
  ClaimData,
  unknown,
  undefined,
  TonClient
> &
  MintNft<Sender, TonMintArgs, never, undefined> &
  DeployCollection<Sender, TonDeployArgs, never, string> &
  ReadClaimed721Event;

export type TTonParams = {
  client: TonClient;
  bridgeAddress: string;
  storage: BridgeStorage;
};
