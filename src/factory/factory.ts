import { raise } from "../handlers/ton";
import { ChainParams } from "./config";
import { ParamMap, TChainFactory } from "./type-utils";

export namespace Chain {
  export const MULTIVERSX = "MULTIVERSX";
  export const SECRET = "SECRET";
  export const TON = "TON";
  export const ETH = "ETH";
  export const BSC = "BSC";
  export const TEZOS = "TEZOS";
}

function mapNonceToParams(chainParams: Partial<ChainParams>): ParamMap {
  const cToP: ParamMap = new Map();
  cToP.set(Chain.MULTIVERSX, chainParams.multiversxParams);
  cToP.set(Chain.BSC, chainParams.bscParams);
  cToP.set(Chain.ETH, chainParams.ethParams);
  cToP.set(Chain.TEZOS, chainParams.tezosParams);
  cToP.set(Chain.SECRET, chainParams.secretParams);
  cToP.set(Chain.TON, chainParams.tonParams);
  return cToP;
}

export function ChainFactory(cp: Partial<ChainParams>): TChainFactory {
  const map = mapNonceToParams(cp);
  return {
    async inner(chain) {
      return map.get(chain) ?? raise("No Such Chain Found");
    },
  };
}
