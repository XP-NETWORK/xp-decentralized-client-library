import { TChainFactory, TChainInfo } from "../factory/types/utils";
import { TChainParams } from "./config";
export declare namespace Chain {
    const MULTIVERSX = "MULTIVERSX";
    const SECRET = "SECRET";
    const TON = "TON";
    const ETH = "ETH";
    const BSC = "BSC";
    const TEZOS = "TEZOS";
    const TERRA = "TERRA";
    const MATIC = "MATIC";
    const HEDERA = "HEDERA";
    const APTOS = "APTOS";
}
export declare function ChainFactory(cp: Partial<TChainParams>): TChainFactory;
export declare const CHAIN_INFO: TChainInfo;
//# sourceMappingURL=factory.d.ts.map