import { Near, WalletConnection } from "near-api-js";
import { FinalExecutionOutcome } from "near-api-js/lib/providers";
import { BridgeStorage } from "../../contractsTypes/evm";
import { DeployNFTCollection, MintNft, ReadClaimed721Event, TNFTList, TSingularNftChain } from "../types";
export type TNearClaimArgs = {
    token_id: string;
    source_chain: string;
    destination_chain: string;
    destination_user_address: string;
    source_nft_contract_address: string;
    name: string;
    symbol: string;
    royalty: number;
    royalty_receiver: string;
    metadata: string;
    transaction_hash: string;
    token_amount: number;
    nft_type: string;
    fee: string;
    lock_tx_chain: string;
};
/**
 * arguments required to issue an NFT
 */
export type NftIssueArgs = {
    readonly contract: string;
    readonly owner: string;
    readonly token_id: string;
    readonly title?: string;
    readonly description?: string;
    readonly uri: string;
};
export type TNearHandler = TSingularNftChain<WalletConnection, TNearClaimArgs, unknown, FinalExecutionOutcome, Near> & MintNft<WalletConnection, NftIssueArgs, {
    gasLimit: number;
    value: number;
}, string> & DeployNFTCollection<WalletConnection, {
    name: string;
    ticker: string;
}, {
    gasLimit: number;
}, string> & ReadClaimed721Event & TNFTList<Record<string, unknown>, undefined>;
export type TNearParams = {
    nodeUrl: string;
    bridge: string;
    storage: BridgeStorage;
    networkId: string;
    identifier: string;
};
//# sourceMappingURL=types.d.ts.map