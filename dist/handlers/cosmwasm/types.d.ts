import type { Coin, StdFee } from "@cosmjs/amino";
import type { CosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import type { OfflineDirectSigner } from "@cosmjs/proto-signing";
import type { ClaimData } from "@xp/cosmos-client/dist/bridge/Bridge.types";
import type { BridgeStorage } from "../../contractsTypes/evm";
import type { DeployNFTCollection, MintNft, ReadClaimed721Event, TSingularNftChain } from "../types";
export type TCosmWasmParams = {
    bridge: string;
    chainId: string;
    rpc: string;
    storage: BridgeStorage;
    denom: string;
    nftCodeId: number;
    identifier: string;
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
export type TCosmWasmHandler = TSingularNftChain<OfflineDirectSigner, TCosmWasmClaimArgs, CosmWasmExtraArgs, ExecuteResult, CosmWasmClient> & MintNft<OfflineDirectSigner, TCosmWasmMintArgs, CosmWasmExtraArgs, ExecuteResult> & DeployNFTCollection<OfflineDirectSigner, {
    name: string;
    symbol: string;
    codeId?: number;
}, CosmWasmExtraArgs, string> & ReadClaimed721Event;
//# sourceMappingURL=types.d.ts.map