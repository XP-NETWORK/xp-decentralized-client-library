import { ContractTransactionResponse, JsonRpcProvider, Overrides, Signer } from "ethers";
import { Bridge } from "../contractsTypes";
import type { TNftChain } from "./chain";
export type EvmHandler = TNftChain<Signer, Bridge.ClaimDataStruct, [
    tokenId: string,
    contract: string
], Overrides, ContractTransactionResponse>;
export type EvmParams = {
    identifier: string;
    provider: JsonRpcProvider;
    bridge: string;
    royaltySalePrice: number;
};
export declare function evmHandler({ provider, bridge, royaltySalePrice, }: EvmParams): EvmHandler;
//# sourceMappingURL=evm.d.ts.map