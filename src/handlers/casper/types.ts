import { CasperClient } from "casper-js-sdk";
import { CasperLabsHelper } from "casper-js-sdk/dist/@types/casperlabsSigner";
import { BridgeStorage } from "../../contractsTypes/evm";
import { DeployNFTCollection, MintNft, TSingularNftChain } from "../types";

export type TCasperMintArgs = {
  contract: `hash-${string}`;
  name: string;
  uri: string;
  owner: string;
  collectionName?: string;
};

export type CasperSigner = CasperLabsHelper;

export type TClaimData = {
  destinationUserAddress: string;
  name: string;
  uri: string;
  royaltyPercentage: bigint;
  royaltyReceiver: string;
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

export type TCasperHandler = TSingularNftChain<
  CasperSigner,
  TClaimData,
  never,
  string,
  CasperClient
> &
  MintNft<CasperSigner, TCasperMintArgs, never, string> &
  DeployNFTCollection<
    CasperSigner,
    { name: string; symbol: string },
    never,
    string
  >;

export type TCasperParams = {
  bridge: string;
  rpc: string;
  storage: BridgeStorage;
  identifier: string;
  network: string;
};
