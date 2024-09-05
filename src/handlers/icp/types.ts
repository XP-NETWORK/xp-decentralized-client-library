import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { BridgeStorage } from "../../contractsTypes/evm";
import { ClaimData } from "../../contractsTypes/icp/bridge/bridge.types";
import { Value } from "../../contractsTypes/icp/nft/nft.types";
import {
  DeployCollection,
  MintNft,
  ReadClaimed721Event,
  TNFTList,
  TSingularNftChain,
} from "../types";

export type TICPParams = {
  agent: HttpAgent;
  bridge: Principal;
  storage: BridgeStorage;
  identifier: string;
};

export type TICPMintArgs = {
  metadata: string;
  token_id: bigint;
  contract: string;
  owner: string;
};
export type TICPClaimArgs = ClaimData;

export type TICPHandler = TSingularNftChain<
  HttpAgent,
  TICPClaimArgs,
  undefined,
  string,
  HttpAgent
> &
  MintNft<HttpAgent, TICPMintArgs, undefined, string> &
  DeployCollection<
    HttpAgent,
    { name: string; symbol: string },
    undefined,
    string
  > &
  ReadClaimed721Event &
  TNFTList<[string, Value][]>;
