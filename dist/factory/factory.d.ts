import { ChainParams } from "./config";
import { InferChainH, InferChainParam, SupportedChain, TChainFactory } from "./type-utils";
export declare namespace Chain {
    const MULTIVERSX = "MULTIVERSX";
    const SECRET = "SECRET";
    const TON = "TON";
    const ETH = "ETH";
    const BSC = "BSC";
    const TEZOS = "TEZOS";
}
export declare function ChainFactory(cp: Partial<ChainParams>): TChainFactory;
type ChainData<T extends SupportedChain> = {
    constructor: (p: InferChainParam<T>) => InferChainH<T>;
};
type ChainInfo = {
    set<T extends SupportedChain>(k: T, v: ChainData<T> | undefined): void;
    get<T extends SupportedChain>(k: T): ChainData<T> | undefined;
} & Map<SupportedChain, ChainData<SupportedChain>>;
export declare const CHAIN_INFO: ChainInfo;
export {};
//# sourceMappingURL=factory.d.ts.map