import { Coin, StdFee } from "@cosmjs/amino";
import { CosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { ClaimData } from "@xp/cosmos-client/dist/bridge/Bridge.types";
import { BridgeStorage } from "../../contractsTypes/evm";
import { DeployCollection, MintNft, TSingularNftChain } from "../types";

export type TCosmWasmParams = {
  bridge: string;
  chainId: string;
  rpc: string;
  storage: BridgeStorage;
  denom: string;
  nftCodeId: number;
};

export type TCosmWasmClaimArgs = ClaimData;
export type TCosmWasmMintArgs = {
  contract: string;
  token_id: string;
  token_uri: string;
  owner?: string;
};

export type CosmWasmExtraArgs = {
  fee?: "auto" | number | StdFee;
  memo?: string;
  funds?: Coin[];
};

export type TCosmWasmHandler = TSingularNftChain<
  OfflineDirectSigner,
  TCosmWasmClaimArgs,
  CosmWasmExtraArgs,
  ExecuteResult,
  CosmWasmClient
> &
  MintNft<
    OfflineDirectSigner,
    TCosmWasmMintArgs,
    CosmWasmExtraArgs,
    ExecuteResult
  > &
  DeployCollection<
    OfflineDirectSigner,
    { name: string; symbol: string; codeId?: number },
    CosmWasmExtraArgs,
    string
  >;
