import { TAptosHandler, TAptosParams } from "../../handlers/aptos/types";
import {
  TCosmWasmHandler,
  TCosmWasmParams,
} from "../../handlers/cosmwasm/types";
import { TEvmHandler, TEvmParams } from "../../handlers/evm/types";
import { THederaHandler, THederaParams } from "../../handlers/hedera/types";
import { TICPHandler, TICPParams } from "../../handlers/icp/types";
import {
  TMultiversXHandler,
  TMultiversXParams,
} from "../../handlers/multiversx/types";
import { TNearHandler, TNearParams } from "../../handlers/near/types";
import { TSecretHandler, TSecretParams } from "../../handlers/secret/types";
import { TTezosHandler, TTezosParams } from "../../handlers/tezos/types";
import { TTonHandler, TTonParams } from "../../handlers/ton/types";

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

export type MetaMap = {
  BSC: TEvmMeta;
  ETH: TEvmMeta;
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
};
