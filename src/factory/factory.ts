import { evmHandler } from "../handlers/evm";
import { multiversxHandler } from "../handlers/multiversx";
import { secretHandler } from "../handlers/secret";
import { tezosHandler } from "../handlers/tezos";
import { raise, tonHandler } from "../handlers/ton";
import { ChainParams } from "./config";
import {
  InferChainH,
  InferChainParam,
  ParamMap,
  SupportedChain,
  TChainFactory,
} from "./type-utils";

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
  const helpers = new Map<SupportedChain, InferChainH<SupportedChain>>();
  return {
    async inner(chain) {
      const helper = helpers.get(chain);
      if (helper) {
        return helper;
      }
      const params = map.get(chain) ?? raise("No Such Chain Found in cToP");
      const cf = CHAIN_INFO.get(chain) ?? raise("No such chain in CHAIN_INFO");
      const handler = cf.constructor(params);
      helpers.set(chain, handler);
      return handler;
    },
    async getClaimData(chain, txHash) {
      const data = await chain.getClaimData(txHash);
      const sc = await this.inner(
        data.sourceChain as unknown as SupportedChain,
      );
      const ogNftData = await sc.nftData(
        data.tokenId,
        data.sourceNftContractAddress,
        {},
      );
      return {
        ...data,
        ...ogNftData,
        royalty: ogNftData.royalty.toString(),
      };
    },
  };
}

type ChainData<T extends SupportedChain> = {
  constructor: (p: InferChainParam<T>) => InferChainH<T>;
};

type ChainInfo = {
  set<T extends SupportedChain>(k: T, v: ChainData<T> | undefined): void;
  get<T extends SupportedChain>(k: T): ChainData<T> | undefined;
} & Map<SupportedChain, ChainData<SupportedChain>>;

export const CHAIN_INFO: ChainInfo = new Map();

CHAIN_INFO.set(Chain.BSC, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.ETH, {
  constructor: evmHandler,
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
