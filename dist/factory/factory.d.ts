import { ChainParams } from "./config";
import { TChainFactory } from "./type-utils";
export declare namespace Chain {
    const MULTIVERSX = "MULTIVERSX";
    const SECRET = "SECRET";
    const TON = "TON";
    const ETH = "ETH";
    const BSC = "BSC";
    const TEZOS = "TEZOS";
}
export declare function ChainFactory(cp: Partial<ChainParams>): TChainFactory;
//# sourceMappingURL=factory.d.ts.map