import type {
  Account,
  Aptos,
  CommittedTransactionResponse,
  Network,
} from "@aptos-labs/ts-sdk";
import type { EntryPayload } from "@thalalabs/surf";
import type { BridgeStorage } from "../../contractsTypes/evm";
import type {
  DeployNFTCollection,
  MintNft,
  TNFTList,
  TNftChain,
} from "../types";

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

export type ExtensionSigner = {
  isConnected: () => Promise<boolean>;
  account: () => Promise<{ address: string; publicKey: string }>;
  signAndSubmitTransaction: (arg: {
    payload: EntryPayload;
  }) => Promise<CommittedTransactionResponse>;
};

export type TAptosHandler = TNftChain<
  Account | ExtensionSigner,
  TClaimData,
  never,
  CommittedTransactionResponse,
  Aptos
> &
  MintNft<Account | ExtensionSigner, TAptosMintArgs, never, string> &
  DeployNFTCollection<
    Account | ExtensionSigner,
    { name: string; symbol: string },
    never,
    string
  > &
  TNFTList<{ tokenId: string }, never>;

export type TAptosParams = {
  bridge: string;
  network: Network;
  storage: BridgeStorage;
  identifier: string;
};

export function isWindowSigner(
  signer: Account | ExtensionSigner,
): signer is ExtensionSigner {
  return "isConnected" in signer;
}
export function isAccount(
  signer: Account | ExtensionSigner,
): signer is Account {
  return "publicKey" in signer;
}
