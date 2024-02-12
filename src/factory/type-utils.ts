import type {
  TClaimSFT,
  TGetClaimData,
  TNftTransferDetailsObject,
} from "../handlers";
import type { TEvmHandler, TEvmParams } from "../handlers/evm";
import type {
  TMultiversXHandler,
  TMultiversXParams,
} from "../handlers/multiversx";
import type { TSecretHandler, TSecretParams } from "../handlers/secret";
import type { TTezosHandler, TTezosParams } from "../handlers/tezos";
import type { TTonHandler, TTonParams } from "../handlers/ton";

export type TEvmMeta = [TEvmHandler, TEvmParams];
export type TMultiversXMeta = [TMultiversXHandler, TMultiversXParams];
export type TTezosMeta = [TTezosHandler, TTezosParams];
export type TSecretMeta = [TSecretHandler, TSecretParams];
export type TTonMeta = [TTonHandler, TTonParams];

export type MetaMap = {
  BSC: TEvmMeta;
  ETH: TEvmMeta;
  TEZOS: TTezosMeta;
  TON: TTonMeta;
  SECRET: TSecretMeta;
  MULTIVERSX: TMultiversXMeta;
};

export type TSupportedChain = keyof MetaMap;
export type TSupportedSftChain = keyof {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [k in TSupportedChain as MetaMap[k][0] extends TClaimSFT<any, any, any, any>
    ? k
    : never]: k;
};

export type TInferChainParam<K extends TSupportedChain> = MetaMap[K][1];
export type TInferChainH<K extends TSupportedChain> = MetaMap[K][0];

export type TChainFactory = {
  inner: <T extends TSupportedChain>(chain: T) => Promise<TInferChainH<T>>;
  getClaimData: (
    chain: TGetClaimData,
    txHash: string,
  ) => Promise<TNftTransferDetailsObject>;
};

export type TParamMap = {
  set<T extends TSupportedChain>(
    k: T,
    v: TInferChainParam<T> | undefined,
  ): void;
  get<T extends TSupportedChain>(k: T): TInferChainParam<T> | undefined;
};

type TChainData<T extends TSupportedChain> = {
  constructor: (p: TInferChainParam<T>) => TInferChainH<T>;
};

export type TChainInfo = {
  set<T extends TSupportedChain>(k: T, v: TChainData<T> | undefined): void;
  get<T extends TSupportedChain>(k: T): TChainData<T> | undefined;
} & Map<TSupportedChain, TChainData<TSupportedChain>>;
