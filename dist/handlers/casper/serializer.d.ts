/// <reference types="node" />
export declare function Serializer(): {
    claimNft(args: TCasperClaimArgs): Buffer;
    storageKey(args: TStorageKeyArgs): Buffer;
    collectionKey(args: TCollectionKeyArgs): Buffer;
};
export interface TCasperClaimArgs {
    readonly token_id_arg: string;
    readonly source_chain_arg: string;
    readonly destination_chain_arg: string;
    readonly destination_user_address_arg: string;
    readonly source_nft_contract_address_arg: string;
    readonly name_arg: string;
    readonly symbol_arg: string;
    readonly royalty_arg: bigint;
    readonly royalty_receiver_arg: string;
    readonly metadata_arg: string;
    readonly transaction_hash_arg: string;
    readonly token_amount_arg: bigint;
    readonly nft_type_arg: string;
    readonly fee_arg: bigint;
    readonly lock_tx_chain_arg: string;
    readonly amount: string;
}
export interface TStorageKeyArgs {
    readonly source_nft_contract_address: string;
}
export interface TCollectionKeyArgs {
    readonly source_nft_contract_address: string;
    readonly source_chain: string;
}
//# sourceMappingURL=serializer.d.ts.map