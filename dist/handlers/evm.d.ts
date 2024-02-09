import { ContractTransactionResponse, JsonRpcProvider, Overrides, Signer } from "ethers";
import { Bridge, BridgeStorage } from "../contractsTypes";
import type { TNftChain } from "./chain";
export type EvmHandler = TNftChain<Signer, Bridge.ClaimDataStruct, Overrides, ContractTransactionResponse>;
export type EvmParams = {
    identifier: string;
    provider: JsonRpcProvider;
    bridge: string;
    royaltySalePrice: number;
    storage: BridgeStorage;
};
export declare function evmHandler({ provider, bridge, royaltySalePrice, storage, }: EvmParams): EvmHandler;
//# sourceMappingURL=evm.d.ts.map