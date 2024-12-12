import type { TAptosHandler, TAptosParams } from "../../handlers/aptos/types";
import type {
  TCasperHandler,
  TCasperParams,
} from "../../handlers/casper/types";
import type {
  TCosmWasmHandler,
  TCosmWasmParams,
} from "../../handlers/cosmwasm/types";
import type { TEvmHandler, TEvmParams } from "../../handlers/evm/types";
import type {
  THederaHandler,
  THederaParams,
} from "../../handlers/hedera/types";
import type { TICPHandler, TICPParams } from "../../handlers/icp/types";
import type {
  TMultiversXHandler,
  TMultiversXParams,
} from "../../handlers/multiversx/types";
import type { TNearHandler, TNearParams } from "../../handlers/near/types";
import type {
  TSecretHandler,
  TSecretParams,
} from "../../handlers/secret/types";
import type { TTezosHandler, TTezosParams } from "../../handlers/tezos/types";
import type { TTonHandler, TTonParams } from "../../handlers/ton/types";

export type TEvmMeta = [TEvmHandler, TEvmParams];
export type THederaMeta = [THederaHandler, THederaParams];
export type TMultiversXMeta = [TMultiversXHandler, TMultiversXParams];
export type TTezosMeta = [TTezosHandler, TTezosParams];
export type TSecretMeta = [TSecretHandler, TSecretParams];
export type TTonMeta = [TTonHandler, TTonParams];
export type TCosmWasmMeta = [TCosmWasmHandler, TCosmWasmParams];
export type TAptosMeta = [TAptosHandler, TAptosParams];
export type TICPMeta = [TICPHandler, TICPParams];
export type TNearMeta = [TNearHandler, TNearParams];
export type TCasperMeta = [TCasperHandler, TCasperParams];

export type MetaMap = {
  BSC: TEvmMeta;
  ETHEREUM: TEvmMeta;
  MATIC: TEvmMeta;
  MOONBEAM: TEvmMeta;
  BASE: TEvmMeta;
  HEDERA: THederaMeta;
  TEZOS: TTezosMeta;
  TON: TTonMeta;
  SECRET: TSecretMeta;
  MULTIVERSX: TMultiversXMeta;
  TERRA: TCosmWasmMeta;
  APTOS: TAptosMeta;
  ICP: TICPMeta;
  NEAR: TNearMeta;
  BLAST: TEvmMeta;
  FANTOM: TEvmMeta;
  AVALANCHE: TEvmMeta;
  CASPER: TCasperMeta;
  VECHAIN: TEvmMeta;
};
