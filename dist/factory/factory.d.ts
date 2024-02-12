import { TChainParams } from "./config";
import { TChainFactory, TChainInfo } from "./type-utils";
export declare namespace Chain {
    const MULTIVERSX = "MULTIVERSX";
    const SECRET = "SECRET";
    const TON = "TON";
    const ETH = "ETH";
    const BSC = "BSC";
    const TEZOS = "TEZOS";
}
export declare function ChainFactory(cp: Partial<TChainParams>): TChainFactory;
export declare const CHAIN_INFO: TChainInfo;
//# sourceMappingURL=factory.d.ts.map