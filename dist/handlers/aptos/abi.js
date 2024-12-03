"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABI = void 0;
const ABI = (address) => {
    return {
        address: address,
        name: "aptos_nft_bridge",
        friends: [],
        exposed_functions: [
            {
                name: "add_validator",
                visibility: "public",
                is_entry: true,
                is_view: false,
                generic_type_params: [],
                params: ["vector<u8>", "vector<vector<u8>>", "vector<vector<u8>>"],
                return: [],
            },
            {
                name: "blacklist_validator",
                visibility: "public",
                is_entry: true,
                is_view: false,
                generic_type_params: [],
                params: ["vector<u8>", "vector<vector<u8>>", "vector<vector<u8>>"],
                return: [],
            },
            {
                name: "claim_1155",
                visibility: "public",
                is_entry: true,
                is_view: false,
                generic_type_params: [],
                params: [
                    "&signer",
                    "address",
                    "0x1::string::String",
                    "0x1::string::String",
                    "u64",
                    "address",
                    "u64",
                    "vector<vector<u8>>",
                    "vector<vector<u8>>",
                    "vector<u8>",
                    "vector<u8>",
                    "vector<u8>",
                    "u256",
                    "vector<u8>",
                    "vector<u8>",
                    "0x1::string::String",
                    "0x1::string::String",
                    "u64",
                ],
                return: [],
            },
            {
                name: "claim_721",
                visibility: "public",
                is_entry: true,
                is_view: false,
                generic_type_params: [],
                params: [
                    "&signer",
                    "address",
                    "0x1::string::String",
                    "0x1::string::String",
                    "u64",
                    "address",
                    "u64",
                    "vector<vector<u8>>",
                    "vector<vector<u8>>",
                    "vector<u8>",
                    "vector<u8>",
                    "vector<u8>",
                    "u256",
                    "vector<u8>",
                    "vector<u8>",
                    "0x1::string::String",
                    "0x1::string::String",
                ],
                return: [],
            },
            {
                name: "claim_validator_rewards",
                visibility: "public",
                is_entry: true,
                is_view: false,
                generic_type_params: [],
                params: ["signer", "address", "vector<u8>"],
                return: [],
            },
            {
                name: "has_validator",
                visibility: "public",
                is_entry: false,
                is_view: true,
                generic_type_params: [],
                params: ["vector<u8>"],
                return: ["bool"],
            },
            {
                name: "initialize",
                visibility: "public",
                is_entry: true,
                is_view: false,
                generic_type_params: [],
                params: ["&signer", "vector<vector<u8>>", "vector<u8>", "vector<u8>"],
                return: [],
            },
            {
                name: "lock_1155",
                visibility: "public",
                is_entry: true,
                is_view: false,
                generic_type_params: [],
                params: [
                    "&signer",
                    "address",
                    "vector<u8>",
                    "0x1::string::String",
                    "address",
                    "u64",
                    "0x1::string::String",
                ],
                return: [],
            },
            {
                name: "lock_721",
                visibility: "public",
                is_entry: true,
                is_view: false,
                generic_type_params: [],
                params: [
                    "&signer",
                    "address",
                    "vector<u8>",
                    "0x1::string::String",
                    "address",
                    "0x1::string::String",
                ],
                return: [],
            },
            {
                name: "owns_nft",
                visibility: "public",
                is_entry: false,
                is_view: true,
                generic_type_params: [],
                params: ["address", "0x1::string::String", "0x1::string::String"],
                return: ["bool"],
            },
            {
                name: "token_id_from_nonce_and_collection",
                visibility: "public",
                is_entry: false,
                is_view: true,
                generic_type_params: [],
                params: ["u256", "vector<u8>"],
                return: ["address"],
            },
            {
                name: "validator_count",
                visibility: "public",
                is_entry: false,
                is_view: true,
                generic_type_params: [],
                params: [],
                return: ["u64"],
            },
        ],
        structs: [
            {
                name: "AddNewValidatorEvent",
                is_native: false,
                is_event: true,
                abilities: ["drop", "store"],
                generic_type_params: [],
                fields: [{ name: "validator", type: "vector<u8>" }],
            },
            {
                name: "BlacklistValidatorEvent",
                is_native: false,
                is_event: true,
                abilities: ["drop", "store"],
                generic_type_params: [],
                fields: [{ name: "validator", type: "vector<u8>" }],
            },
            {
                name: "Bridge",
                is_native: false,
                is_event: false,
                abilities: ["key"],
                generic_type_params: [],
                fields: [
                    {
                        name: "validators",
                        type: "0x1::simple_map::SimpleMap<vector<u8>, 0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::Validator>",
                    },
                    { name: "signer_cap", type: "0x1::account::SignerCapability" },
                    {
                        name: "collection_objects",
                        type: "0x1::table::Table<0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::CollectionObject, u256>",
                    },
                    { name: "nfts_counter", type: "u64" },
                    {
                        name: "original_to_duplicate_mapping",
                        type: "0x1::table::Table<0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::OriginalToDuplicateKey, 0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::OriginalToDuplicateInfo>",
                    },
                    {
                        name: "duplicate_to_original_mapping",
                        type: "0x1::table::Table<0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::DuplicateToOriginalKey, 0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::DuplicateToOriginalInfo>",
                    },
                    {
                        name: "nft_collection_tokens",
                        type: "0x1::simple_map::SimpleMap<0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::CollectionNftObject, address>",
                    },
                    {
                        name: "nft_collections_counter",
                        type: "0x1::simple_map::SimpleMap<address, u256>",
                    },
                    { name: "self_chain", type: "vector<u8>" },
                    {
                        name: "blacklisted_validators",
                        type: "0x1::simple_map::SimpleMap<vector<u8>, bool>",
                    },
                ],
            },
            {
                name: "Claim1155Event",
                is_native: false,
                is_event: true,
                abilities: ["drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "source_chain", type: "vector<u8>" },
                    { name: "token_id", type: "u256" },
                    { name: "amount", type: "u64" },
                    { name: "transaction_hash", type: "vector<u8>" },
                    { name: "nft_contract", type: "vector<u8>" },
                ],
            },
            {
                name: "Claim721Event",
                is_native: false,
                is_event: true,
                abilities: ["drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "source_chain", type: "vector<u8>" },
                    { name: "token_id", type: "u256" },
                    { name: "transaction_hash", type: "vector<u8>" },
                    { name: "nft_contract", type: "vector<u8>" },
                ],
            },
            {
                name: "ClaimData",
                is_native: false,
                is_event: false,
                abilities: ["copy", "drop"],
                generic_type_params: [],
                fields: [
                    { name: "token_id", type: "u256" },
                    { name: "source_chain", type: "vector<u8>" },
                    { name: "destination_chain", type: "vector<u8>" },
                    { name: "user", type: "address" },
                    { name: "source_nft_contract_address", type: "vector<u8>" },
                    { name: "name", type: "0x1::string::String" },
                    { name: "royalty_percentage", type: "u64" },
                    { name: "royalty_payee_address", type: "address" },
                    { name: "metadata", type: "0x1::string::String" },
                    { name: "transaction_hash", type: "vector<u8>" },
                    { name: "token_amount", type: "u256" },
                    { name: "nft_type", type: "vector<u8>" },
                    { name: "fee", type: "u64" },
                    { name: "symbol", type: "0x1::string::String" },
                ],
            },
            {
                name: "CollectionNftObject",
                is_native: false,
                is_event: false,
                abilities: ["copy", "drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "collection_address", type: "vector<u8>" },
                    { name: "token_id", type: "u256" },
                ],
            },
            {
                name: "CollectionObject",
                is_native: false,
                is_event: false,
                abilities: ["copy", "drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "collection", type: "address" },
                    { name: "object", type: "address" },
                ],
            },
            {
                name: "DuplicateToOriginalInfo",
                is_native: false,
                is_event: false,
                abilities: ["copy", "drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "source_chain", type: "vector<u8>" },
                    { name: "source_contract", type: "vector<u8>" },
                ],
            },
            {
                name: "DuplicateToOriginalKey",
                is_native: false,
                is_event: false,
                abilities: ["copy", "drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "self_chain", type: "vector<u8>" },
                    { name: "collection_address", type: "vector<u8>" },
                ],
            },
            {
                name: "LockedEvent",
                is_native: false,
                is_event: true,
                abilities: ["drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "token_id", type: "u256" },
                    { name: "destination_user_address", type: "0x1::string::String" },
                    { name: "token_amount", type: "u64" },
                    { name: "nft_type", type: "vector<u8>" },
                    { name: "destination_chain", type: "vector<u8>" },
                    { name: "source_chain", type: "vector<u8>" },
                    { name: "collection_address", type: "vector<u8>" },
                    { name: "token_address", type: "address" },
                    { name: "metadata_uri", type: "0x1::string::String" },
                ],
            },
            {
                name: "OriginalToDuplicateInfo",
                is_native: false,
                is_event: false,
                abilities: ["copy", "drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "self_chain", type: "vector<u8>" },
                    { name: "collection_address", type: "vector<u8>" },
                ],
            },
            {
                name: "OriginalToDuplicateKey",
                is_native: false,
                is_event: false,
                abilities: ["copy", "drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "source_chain", type: "vector<u8>" },
                    { name: "source_contract", type: "vector<u8>" },
                ],
            },
            {
                name: "ProcessedClaims",
                is_native: false,
                is_event: false,
                abilities: ["key"],
                generic_type_params: [],
                fields: [{ name: "claims", type: "vector<vector<u8>>" }],
            },
            {
                name: "RewardValidatorEvent",
                is_native: false,
                is_event: true,
                abilities: ["drop", "store"],
                generic_type_params: [],
                fields: [{ name: "validator", type: "vector<u8>" }],
            },
            {
                name: "SignatureInfo",
                is_native: false,
                is_event: false,
                abilities: ["drop"],
                generic_type_params: [],
                fields: [
                    { name: "public_key", type: "vector<u8>" },
                    { name: "signature", type: "vector<u8>" },
                ],
            },
            {
                name: "UnLock1155Event",
                is_native: false,
                is_event: true,
                abilities: ["drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "to", type: "address" },
                    { name: "token_id", type: "u256" },
                    { name: "amount", type: "u64" },
                ],
            },
            {
                name: "UnLock721Event",
                is_native: false,
                is_event: true,
                abilities: ["drop", "store"],
                generic_type_params: [],
                fields: [
                    { name: "to", type: "address" },
                    { name: "token_id", type: "u256" },
                ],
            },
            {
                name: "Validator",
                is_native: false,
                is_event: false,
                abilities: ["copy", "drop", "store"],
                generic_type_params: [],
                fields: [{ name: "pending_reward", type: "u64" }],
            },
        ],
    };
};
exports.ABI = ABI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hhbmRsZXJzL2FwdG9zL2FiaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBTyxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQWUsRUFBRSxFQUFFO0lBQ3JDLE9BQU87UUFDTCxPQUFPLEVBQUUsT0FBTztRQUNoQixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE9BQU8sRUFBRSxFQUFFO1FBQ1gsaUJBQWlCLEVBQUU7WUFDakI7Z0JBQ0UsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLFVBQVUsRUFBRSxRQUFRO2dCQUNwQixRQUFRLEVBQUUsSUFBSTtnQkFDZCxPQUFPLEVBQUUsS0FBSztnQkFDZCxtQkFBbUIsRUFBRSxFQUFFO2dCQUN2QixNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsb0JBQW9CLENBQUM7Z0JBQ2xFLE1BQU0sRUFBRSxFQUFFO2FBQ1g7WUFDRDtnQkFDRSxJQUFJLEVBQUUscUJBQXFCO2dCQUMzQixVQUFVLEVBQUUsUUFBUTtnQkFDcEIsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsbUJBQW1CLEVBQUUsRUFBRTtnQkFDdkIsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFLG9CQUFvQixFQUFFLG9CQUFvQixDQUFDO2dCQUNsRSxNQUFNLEVBQUUsRUFBRTthQUNYO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFVBQVUsRUFBRSxRQUFRO2dCQUNwQixRQUFRLEVBQUUsSUFBSTtnQkFDZCxPQUFPLEVBQUUsS0FBSztnQkFDZCxtQkFBbUIsRUFBRSxFQUFFO2dCQUN2QixNQUFNLEVBQUU7b0JBQ04sU0FBUztvQkFDVCxTQUFTO29CQUNULHFCQUFxQjtvQkFDckIscUJBQXFCO29CQUNyQixLQUFLO29CQUNMLFNBQVM7b0JBQ1QsS0FBSztvQkFDTCxvQkFBb0I7b0JBQ3BCLG9CQUFvQjtvQkFDcEIsWUFB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