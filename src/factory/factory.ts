import {
  TChainFactory,
  TChainInfo,
  TInferChainH,
  TParamMap,
  TSupportedChain,
} from "../factory/types/utils";
import { aptosHandler } from "../handlers/aptos";
import { cosmWasmHandler } from "../handlers/cosmwasm";
import { evmHandler } from "../handlers/evm";
import { hederaHandler } from "../handlers/hedera";
import { multiversxHandler } from "../handlers/multiversx";
import { secretHandler } from "../handlers/secret";
import { tezosHandler } from "../handlers/tezos";
import { raise, tonHandler } from "../handlers/ton";
import { TChainParams } from "./config";

export namespace Chain {
  export const MULTIVERSX = "MULTIVERSX";
  export const SECRET = "SECRET";
  export const TON = "TON";
  export const ETH = "ETH";
  export const BSC = "BSC";
  export const TEZOS = "TEZOS";
  export const TERRA = "TERRA";
  export const MATIC = "MATIC";
  export const HEDERA = "HEDERA";
  export const APTOS = "APTOS";
  export const BASE = "BASE";
}

function mapNonceToParams(chainParams: Partial<TChainParams>): TParamMap {
  const cToP: TParamMap = new Map();
  cToP.set(Chain.MULTIVERSX, chainParams.multiversxParams);
  cToP.set(Chain.BSC, chainParams.bscParams);
  cToP.set(Chain.MATIC, chainParams.maticParams);
  cToP.set(Chain.BASE, chainParams.baseParams);
  cToP.set(Chain.HEDERA, chainParams.hederaParams);
  cToP.set(Chain.ETH, chainParams.ethParams);
  cToP.set(Chain.TEZOS, chainParams.tezosParams);
  cToP.set(Chain.SECRET, chainParams.secretParams);
  cToP.set(Chain.TON, chainParams.tonParams);
  cToP.set(Chain.TERRA, chainParams.terraParams);
  cToP.set(Chain.APTOS, chainParams.aptosParams);
  return cToP;
}

export function ChainFactory(cp: Partial<TChainParams>): TChainFactory {
  const map = mapNonceToParams(cp);
  const helpers = new Map<TSupportedChain, TInferChainH<TSupportedChain>>();
  return {
    async inner(chain) {
      const helper = helpers.get(chain);
      if (helper) {
        return helper;
      }
      const params = map.get(chain) ?? raise("No Such Chain Found in cToP");
      const cf = CHAIN_INFO.get(chain) ?? raise("No such chain in CHAIN_INFO");
      const handler = await cf.constructor(params);
      helpers.set(chain, handler);
      return handler;
    },
    async getClaimData(chain, txHash) {
      const data = await chain.getClaimData(txHash);
      const sc = await this.inner(
        data.sourceChain as unknown as TSupportedChain,
      );
      const ogNftData = await sc.nftData(
        data.tokenId,
        data.sourceNftContractAddress,
        undefined,
      );

      return {
        ...data,
        ...ogNftData,
        royalty: ogNftData.royalty.toString(),
      };
    },
  };
}

export const CHAIN_INFO: TChainInfo = new Map();

CHAIN_INFO.set(Chain.BSC, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.ETH, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.MATIC, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.BASE, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.HEDERA, {
  constructor: hederaHandler,
});
CHAIN_INFO.set(Chain.MULTIVERSX, {
  constructor: multiversxHandler,
});
CHAIN_INFO.set(Chain.SECRET, {
  constructor: secretHandler,
});
CHAIN_INFO.set(Chain.TON, {
  constructor: tonHandler,
});
CHAIN_INFO.set(Chain.TEZOS, {
  constructor: tezosHandler,
});
CHAIN_INFO.set(Chain.TERRA, {
  constructor: cosmWasmHandler,
});
CHAIN_INFO.set(Chain.APTOS, {
  constructor: aptosHandler,
});
