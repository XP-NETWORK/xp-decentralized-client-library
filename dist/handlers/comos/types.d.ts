import { Coin, OfflineAminoSigner, StdFee } from "@cosmjs/amino";
import { CosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { ClaimData } from "@xp/cosmos-client/dist/bridge/Bridge.types";
import { BridgeStorage } from "../../contractsTypes/evm";
import { DeployCollection, MintNft, TSingularNftChain } from "../types";
export type TCosmosParams = {
    provider: CosmWasmClient;
    bridge: string;
    chainId: string;
    rpc: string;
    storage: BridgeStorage;
};
export type TCosmWasmClaimArgs = ClaimData;
export type TCosmWasmMintArgs = {
    contract: string;
    royalty_payment_address: string;
    royalty_percentage: number;
    token_id: string;
    token_uri: string;
    owner?: string;
};
export type TCosmosHandler = TSingularNftChain<OfflineAminoSigner, TCosmWasmClaimArgs, {
    fee?: "auto" | number | StdFee;
    memo?: string;
    funds?: Coin[];
}, ExecuteResult, CosmWasmClient> & MintNft<OfflineAminoSigner, TCosmWasmMintArgs, {
    fee?: "auto" | number | StdFee;
    memo?: string;
    funds?: Coin[];
}, ExecuteResult> & DeployCollection<OfflineAminoSigner, {
    name: string;
    symbol: string;
}, {
    fee?: "auto" | number | StdFee;
    memo?: string;
    funds?: Coin[];
}, ExecuteResult>;
//# sourceMappingURL=types.d.ts.map