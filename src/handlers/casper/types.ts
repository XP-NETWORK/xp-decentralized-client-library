import type { CasperClient } from "casper-js-sdk";
import type { CasperLabsHelper } from "casper-js-sdk/dist/@types/casperlabsSigner";
import type { BridgeStorage } from "../../contractsTypes/evm";
import type {
  DeployNFTCollection,
  MintNft,
  TSignerAndSignature,
  TSingularNftChain,
} from "../types";

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
  lockTxChain: string;
};

export type TCasperHandler = TSingularNftChain<
  CasperSigner,
  TClaimData,
  { amount: string },
  string,
  CasperClient
> &
  MintNft<CasperSigner, TCasperMintArgs, { amount: string }, string> &
  DeployNFTCollection<
    CasperSigner,
    { name: string; symbol: string },
    { amount: string },
    string
  > & {
    submitSignature(
      signer: CasperSigner,
      hash: string,
      sigs: TSignerAndSignature[],
    ): Promise<string>;
    hashClaimData: (data: TClaimData) => string;
  };

export type TCasperParams = {
  bridge: string;
  rpc: string;
  storage: BridgeStorage;
  identifier: string;
  network: string;
  proxy_url: string;
};
