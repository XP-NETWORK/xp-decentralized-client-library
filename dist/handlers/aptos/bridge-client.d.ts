/// <reference types="node" />
import { Account, Aptos, Ed25519Account, PendingTransactionResponse } from "@aptos-labs/ts-sdk";
import { HexString } from "aptos";
type TCollectionCounterObj = {
    key: string;
    value: string;
};
type TValidatorsObj = {
    key: string;
    value: {
        pending_reward: string;
    };
};
export type TClaimData = {
    collection: string;
    description: string;
    symbol: string;
    amount: number;
    uri: string;
    iconUri: string;
    projectUri: string;
    royaltyPointsNumerator: number;
    royaltyPointsDenominator: number;
    royaltyPayeeAddress: HexString;
    fee: number;
    sourceChain: Uint8Array;
    sourceNftContractAddress: Uint8Array;
    destinationChain: Uint8Array;
    transactionHash: Uint8Array;
    tokenId: string;
    nftType: Uint8Array;
    metadata: string;
};
type TBridgeData = {
    collection_objects: {
        handle: string;
    };
    duplicate_to_original_mapping: {
        handle: string;
    };
    nft_collection_tokens: {
        handle: string;
    };
    nft_collections_counter: {
        data: TCollectionCounterObj[];
    };
    nfts_counter: string;
    original_to_duplicate_mapping: {
        handle: string;
    };
    self_chain: string;
    validators: {
        data: TValidatorsObj[];
    };
    signer_cap: {
        account: string;
    };
};
export declare class BridgeClient {
    private aptosClient;
    private address;
    constructor(client: Aptos, address: string);
    fundAccounts(accounts: Ed25519Account[]): Promise<void>;
    initialize(adminAccount: Ed25519Account, validators: Uint8Array[], seed: Uint8Array, selfChain: Uint8Array): Promise<PendingTransactionResponse>;
    addValidator(adminAccount: Ed25519Account, validator: Uint8Array, signatures: Uint8Array[], public_keys: Uint8Array[]): Promise<PendingTransactionResponse>;
    lock721(owner: Account, collection: string, name: string, destination_chain: Uint8Array, token_id: number, source_nft_contract_address: Uint8Array): Promise<PendingTransactionResponse>;
    lock1155(owner: Account, collection: string, name: string, amount: number, destination_chain: Uint8Array, token_id: number, source_nft_contract_address: Uint8Array): Promise<PendingTransactionResponse>;
    claim721(sender: Account, { collection, description, symbol, uri, royaltyPointsNumerator, royaltyPointsDenominator, royaltyPayeeAddress, fee, sourceChain, sourceNftContractAddress, destinationChain, transactionHash, tokenId, nftType, metadata, }: TClaimData, signatures: Uint8Array[], publicKeys: Uint8Array[]): Promise<PendingTransactionResponse>;
    claim1155(sender: Account, { collection, description, symbol, amount, uri, iconUri, projectUri, royaltyPointsNumerator, royaltyPointsDenominator, royaltyPayeeAddress, fee, sourceChain, sourceNftContractAddress, destinationChain, transactionHash, tokenId, nftType, metadata, }: TClaimData, signatures: Uint8Array[], publicKeys: Uint8Array[]): Promise<PendingTransactionResponse>;
    claimValidatorRewards(adminAccount: Ed25519Account, to: HexString, validator: Uint8Array, signatures: Uint8Array[], public_keys: Uint8Array[]): Promise<PendingTransactionResponse>;
    mintNft721(owner: Ed25519Account, collection_name: string, collection_description: string, collection_uri: string, nft_name: string, nft_description: string, nft_uri: string): Promise<PendingTransactionResponse>;
    mintNft1155(owner: Ed25519Account, collection_name: string, collection_description: string, collection_uri: string, nft_name: string, nft_description: string, nft_uri: string, token_symbol: string, amount: number, icon_uri: string, project_uri: string): Promise<PendingTransactionResponse>;
    userOwnsNft(owner: HexString, collection: string, name: string): Promise<[boolean]>;
    getBridgeData(): Promise<TBridgeData | undefined>;
    generateRandomSeed(length: number): string;
    convertToHexString(str: Uint8Array | string): string;
    generateClaimDataHash(claimData: TClaimData, user: Ed25519Account): Buffer;
}
export {};
//# sourceMappingURL=bridge-client.d.ts.map