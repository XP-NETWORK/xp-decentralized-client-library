import {
  SendParams,
  Signer,
  TezosToolkit,
  TransactionOperation,
  TransactionWalletOperation,
} from "@taquito/taquito";

import { WalletProvider } from "@taquito/taquito";
import BigNumber from "bignumber.js";
import { BridgeStorage } from "../../contractsTypes/evm";
import { address, mutez, nat } from "../../contractsTypes/tezos/type-aliases";
import {
  DeployNFTCollection,
  MintNft,
  ReadClaimed721Event,
  TSingularNftChain,
} from "../types";

export type TezosSigner = Signer | WalletProvider;

export function isTezosSigner(ts: TezosSigner): ts is Signer {
  return "secretKey" in ts;
}

export type Operation = TransactionOperation | TransactionWalletOperation;

export type TTezosClaimArgs = {
  token_id: nat;
  source_chain: string;
  dest_chain: string;
  dest_address: address;
  source_nft_contract_address: string;
  name: string;
  symbol: string;
  royalty: nat;
  royalty_receiver: address;
  metadata: string;
  transaction_hash: string;
  token_amount: nat;
  nft_type: string;
  fee: mutez;
  lock_tx_chain: string;
};

export type TezosMintArgs = {
  contract: string;
  tokenId: BigNumber.Value;
  uri: string;
};

export type TTezosHandler = TSingularNftChain<
  TezosSigner,
  TTezosClaimArgs,
  Partial<SendParams>,
  string,
  TezosToolkit
> &
  MintNft<TezosSigner, TezosMintArgs, Partial<SendParams>, string> &
  DeployNFTCollection<
    TezosSigner,
    {
      name: string;
      description: string;
    },
    Partial<SendParams>,
    string
  > &
  ReadClaimed721Event;

export type TTezosParams = {
  Tezos: TezosToolkit;
  bridge: string;
  storage: BridgeStorage;
  tzktApi: string;
  identifier: string;
};
