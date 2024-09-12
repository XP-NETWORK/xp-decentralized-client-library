import { Account, Aptos, PendingTransactionResponse } from "@aptos-labs/ts-sdk";
import { Network } from "aptos";
import { BridgeStorage } from "../../contractsTypes/evm";
import { DeployNFTCollection, MintNft, TNftChain } from "../types";
import { TClaimData } from "./bridge-client";
export type TAptosMintArgs = {
    contract: string;
    name: string;
    uri: string;
};
export type TAptosHandler = TNftChain<Account, TClaimData, never, PendingTransactionResponse, Aptos> & MintNft<Account, TAptosMintArgs, never, string> & DeployNFTCollection<Account, {
    name: string;
    symbol: string;
}, never, string>;
export type TAptosParams = {
    bridge: string;
    network: Network;
    storage: BridgeStorage;
    identifier: string;
};
//# sourceMappingURL=types.d.ts.map