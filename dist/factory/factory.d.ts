import type { TChainFactory, TChainInfo } from "../factory/types/utils";
import type { TChainParams } from "./config";
export declare namespace Chain {
    const MULTIVERSX = "MULTIVERSX";
    const SECRET = "SECRET";
    const TON = "TON";
    const ETHEREUM = "ETHEREUM";
    const BSC = "BSC";
    const TEZOS = "TEZOS";
    const TERRA = "TERRA";
    const MATIC = "MATIC";
    const HEDERA = "HEDERA";
    const APTOS = "APTOS";
    const ICP = "ICP";
    const BASE = "BASE";
    const NEAR = "NEAR";
    const MOONBEAM = "MOONBEAM";
    const BLAST = "BLAST";
    const FANTOM = "FANTOM";
    const AVALANCHE = "AVALANCHE";
    const CASPER = "CASPER";
    const VECHAIN = "VECHAIN";
}
export declare function ChainFactory(cp: Partial<TChainParams>): TChainFactory;
export declare const CHAIN_INFO: TChainInfo;
//# sourceMappingURL=factory.d.ts.map