import type {
  Account,
  Aptos,
  CommittedTransactionResponse,
  Network,
} from "@aptos-labs/ts-sdk";
import type { BridgeStorage } from "../../contractsTypes/evm";
import type { DeployNFTCollection, MintNft, TNftChain } from "../types";

export type TAptosMintArgs = {
  contract: string;
  name: string;
  uri: string;
};

export type TClaimData = {
  destinationUserAddress: `0x${string}`;
  name: string;
  uri: string;
  royaltyPercentage: bigint;
  royaltyReceiver: `0x${string}`;
  fee: bigint;
  destination_chain: string;
  source_chain: string;
  source_nft_contract_address: string;
  token_id: bigint;
  transaction_hash: string;
  nft_type: string;
  metadata: string;
  symbol: string;
  amount: bigint;
};

export type TAptosHandler = TNftChain<
  Account,
  TClaimData,
  never,
  CommittedTransactionResponse,
  Aptos
> &
  MintNft<Account, TAptosMintArgs, never, string> &
  DeployNFTCollection<Account, { name: string; symbol: string }, never, string>;

export type TAptosParams = {
  bridge: string;
  network: Network;
  storage: BridgeStorage;
  identifier: string;
};
