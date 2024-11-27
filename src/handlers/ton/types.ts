import type { Address, Sender } from "@ton/core";
import type { TonClient } from "@ton/ton";
import type { BridgeStorage } from "../../contractsTypes/evm";
import type { ClaimData } from "../../contractsTypes/ton/tonBridge";
import type {
  DeployNFTCollection,
  MintNft,
  ReadClaimed721Event,
  TSingularNftChain,
} from "../types";
import type { RoyaltyParams } from "./nftc";

export type TonDeployArgs = {
  owner_address: Address;
  collection_meta: {
    name: string;
    description: string;
    image?: string;
    symbol: string;
  };
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
  DeployNFTCollection<Sender, TonDeployArgs, never, string> &
  ReadClaimed721Event;

export type TTonParams = {
  client: TonClient;
  bridgeAddress: string;
  storage: BridgeStorage;
  identifier: string;
};
