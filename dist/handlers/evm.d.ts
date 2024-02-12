import { ContractTransactionResponse, JsonRpcProvider, Overrides, Provider, Signer } from "ethers";
import { Bridge, BridgeStorage } from "../contractsTypes";
import type { TNftChain } from "./chain";
export type TEvmHandler = TNftChain<Signer, Bridge.ClaimDataStruct, Overrides, ContractTransactionResponse, Provider>;
export type TEvmParams = {
    identifier: string;
    provider: JsonRpcProvider;
    bridge: string;
    royaltySalePrice: number;
    storage: BridgeStorage;
};
export declare function evmHandler({ provider, bridge, royaltySalePrice, storage, }: TEvmParams): TEvmHandler;
//# sourceMappingURL=evm.d.ts.map