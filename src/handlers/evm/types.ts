import type {
  BrowserProvider,
  ContractTransactionResponse,
  JsonRpcProvider,
  Overrides,
  Provider,
  Signer,
  Wallet,
} from "ethers";
import type { Bridge, BridgeStorage } from "../../contractsTypes/evm";

import type { PayableOverrides } from "../../contractsTypes/evm/common";
import type {
  DeployCollection,
  Mint,
  ReadClaimed721Event,
  ReadClaimed1155Event,
  TApproveNFT,
  TNftChain,
} from "../types";

export type TEvmHandler = TNftChain<
  Signer,
  Bridge.ClaimDataStruct,
  Overrides,
  ContractTransactionResponse,
  Provider
> &
  Mint<
    Signer,
    {
      contract: string;
      uri: string;
      tokenId: bigint;
      royalty: bigint;
      royaltyReceiver: string;
    },
    PayableOverrides,
    ContractTransactionResponse
  > &
  TApproveNFT<Signer | Wallet, PayableOverrides, ContractTransactionResponse> &
  DeployCollection<
    Signer,
    {
      name: string;
      symbol: string;
      owner?: string;
    },
    Overrides,
    string
  > &
  ReadClaimed721Event &
  ReadClaimed1155Event;

export type TEvmParams = {
  identifier: string;
  provider: JsonRpcProvider | BrowserProvider;
  bridge: string;
  royaltySalePrice: number;
  storage: BridgeStorage;
};
