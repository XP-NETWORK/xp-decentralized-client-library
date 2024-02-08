import { EvmHandler, EvmParams } from "../handlers/evm";
import { MultiversXHandler, MultiversXParams } from "../handlers/multiversx";
import { SecretHandler, SecretParams } from "../handlers/secret";
import { TezosHandler, TezosParams } from "../handlers/tezos";
import { TonHandler, TonParams } from "../handlers/ton";

export type EvmMeta = [EvmHandler, EvmParams];
export type MultiversXMeta = [MultiversXHandler, MultiversXParams];
export type TezosMeta = [TezosHandler, TezosParams];
export type SecretMeta = [SecretHandler, SecretParams];
export type TonMeta = [TonHandler, TonParams];

export type MetaMap = {
  BSC: EvmMeta;
  ETH: EvmMeta;
  TEZOS: TezosMeta;
  TON: TonMeta;
  SECRET: SecretMeta;
  MULTIVERSX: MultiversXMeta;
};

export type SupportedChain = keyof MetaMap;

export type InferChainParam<K extends SupportedChain> = MetaMap[K][1];
export type InferChainH<K extends SupportedChain> = MetaMap[K][0];

export type TChainFactory = {
  inner: <T extends SupportedChain>(chain: T) => Promise<InferChainParam<T>>;
};

export type ParamMap = {
  set<T extends SupportedChain>(k: T, v: InferChainParam<T> | undefined): void;
  get<T extends SupportedChain>(k: T): InferChainParam<T> | undefined;
};
