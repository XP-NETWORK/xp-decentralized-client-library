"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multiversXBridgeABI = {
    buildInfo: {
        rustc: {
            version: "1.82.0-nightly",
            commitHash: "13a52890dde8cfeb95069d77c223ac37c0cf3a46",
            commitDate: "2024-08-14",
            channel: "Nightly",
            short: "rustc 1.82.0-nightly (13a52890d 2024-08-14)",
        },
        contractCrate: {
            name: "bridge",
            version: "0.0.0",
        },
        framework: {
            name: "multiversx-sc",
            version: "0.50.4",
        },
    },
    name: "BridgeContract",
    constructor: {
        inputs: [
            {
                name: "public_key",
                type: "Address",
            },
        ],
        outputs: [],
    },
    endpoints: [
        {
            name: "tokens",
            mutability: "readonly",
            inputs: [],
            outputs: [
                {
                    type: "variadic<multi<TokenInfo,TokenInfo>>",
                    multi_result: true,
                },
            ],
        },
        {
            name: "validators",
            mutability: "readonly",
            inputs: [
                {
                    name: "address",
                    type: "Address",
                },
            ],
            outputs: [
                {
                    type: "variadic<Validator>",
                    multi_result: true,
                },
            ],
        },
        {
            name: "blacklistedValidators",
            mutability: "readonly",
            inputs: [
                {
                    name: "address",
                    type: "Address",
                },
            ],
            outputs: [
                {
                    type: "bool",
                },
            ],
        },
        {
            name: "validatorsCount",
            mutability: "readonly",
            inputs: [],
            outputs: [
                {
                    type: "u64",
                },
            ],
        },
        {
            name: "uniqueIdentifier",
            mutability: "readonly",
            inputs: [],
            outputs: [
                {
                    type: "variadic<bytes>",
                    multi_result: true,
                },
            ],
        },
        {
            name: "originalToDuplicateMapping",
            mutability: "readonly",
            inputs: [],
            outputs: [
                {
                    type: "variadic<multi<tuple<bytes,bytes>,ContractInfo>>",
                    multi_result: true,
                },
            ],
        },
        {
            name: "duplicateToOriginalMapping",
            mutability: "readonly",
            inputs: [],
            outputs: [
                {
                    type: "variadic<multi<tuple<TokenIdentifier,bytes>,ContractInfo>>",
                    multi_result: true,
                },
            ],
        },
        {
            name: "addValidator",
            mutability: "mutable",
            inputs: [
                {
                    name: "new_validator_public_key",
                    type: "Address",
                },
                {
                    name: "signatures",
                    type: "List<SignatureInfo>",
                },
            ],
            outputs: [],
        },
        {
            name: "blacklistValidator",
            mutability: "mutable",
            inputs: [
                {
                    name: "address",
                    type: "Address",
                },
                {
                    name: "signatures",
                    type: "List<SignatureInfo>",
                },
            ],
            outputs: [],
        },
        {
            name: "claimValidatorRewards",
            mutability: "mutable",
            inputs: [
                {
                    name: "validator",
                    type: "Address",
                },
            ],
            outputs: [],
        },
        {
            name: "lock721",
            mutability: "mutable",
            payableInTokens: ["*"],
            inputs: [
                {
                    name: "_token_id",
                    type: "TokenIdentifier",
                },
                {
                    name: "destination_chain",
                    type: "bytes",
                },
                {
                    name: "destination_user_address",
                    type: "bytes",
                },
                {
                    name: "source_nft_contract_address",
                    type: "TokenIdentifier",
                },
                {
                    name: "nonce",
                    type: "u64",
                },
            ],
            outputs: [],
        },
        {
            name: "lock1155",
            mutability: "mutable",
            payableInTokens: ["*"],
            inputs: [
                {
                    name: "_token_id",
                    type: "TokenIdentifier",
                },
                {
                    name: "destination_chain",
                    type: "bytes",
                },
                {
                    name: "destination_user_address",
                    type: "bytes",
                },
                {
                    name: "source_nft_contract_address",
                    type: "TokenIdentifier",
                },
                {
                    name: "amount",
                    type: "BigUint",
                },
                {
                    name: "nonce",
                    type: "u64",
                },
            ],
            outputs: [],
        },
        {
            name: "claimNft721",
            mutability: "mutable",
            payableInTokens: ["EGLD"],
            inputs: [
                {
                    name: "data",
                    type: "ClaimData",
                },
                {
                    name: "signatures",
                    type: "List<SignatureInfo>",
                },
                {
                    name: "uris",
                    type: "multi<bytes,bytes>",
                    multi_arg: true,
                },
            ],
            outputs: [],
        },
        {
            name: "claimNft1155",
            mutability: "mutable",
            payableInTokens: ["EGLD"],
            inputs: [
                {
                    name: "data",
                    type: "ClaimData",
                },
                {
                    name: "signatures",
                    type: "List<SignatureInfo>",
                },
                {
                    name: "uris",
                    type: "multi<bytes,bytes>",
                    multi_arg: true,
                },
            ],
            outputs: [],
        },
        {
            name: "collections",
            mutability: "readonly",
            inputs: [
                {
                    name: "identifier",
                    type: "bytes",
                },
            ],
            outputs: [
                {
                    type: "TokenIdentifier",
                },
            ],
        },
    ],
    events: [
        {
            identifier: "AddNewValidator",
            inputs: [
                {
                    name: "validator",
                    type: "Address",
                    indexed: true,
                },
            ],
        },
        {
            identifier: "Locked",
            inputs: [
                {
                    name: "token_id",
                    type: "u64",
                    indexed: true,
                },
                {
                    name: "destination_chain",
                    type: "bytes",
                    indexed: true,
                },
                {
                    name: "destination_user_address",
                    type: "bytes",
                    indexed: true,
                },
                {
                    name: "source_nft_contract_address",
                    type: "TokenIdentifier",
                    indexed: true,
                },
                {
                    name: "token_amount",
                    type: "BigUint",
                    indexed: true,
                },
                {
                    name: "nft_type",
                    type: "bytes",
                    indexed: true,
                },
                {
                    name: "chain",
                    type: "bytes",
                    indexed: true,
                },
            ],
        },
        {
            identifier: "UnLock721",
            inputs: [
                {
                    name: "to",
                    type: "Address",
                    indexed: true,
                },
                {
                    name: "token_id",
                    type: "u64",
                    indexed: true,
                },
                {
                    name: "contract_address",
                    type: "TokenIdentifier",
                    indexed: true,
                },
            ],
        },
        {
            identifier: "UnLock1155",
            inputs: [
                {
                    name: "to",
                    type: "Address",
                    indexed: true,
                },
                {
                    name: "token_id",
                    type: "u64",
                    indexed: true,
                },
                {
                    name: "contract_address",
                    type: "TokenIdentifier",
                    indexed: true,
                },
                {
                    name: "amount",
                    type: "BigUint",
                    indexed: true,
                },
            ],
        },
        {
            identifier: "Claimed721",
            inputs: [
                {
                    name: "lock_tx_chain",
                    type: "bytes",
                    indexed: true,
                },
                {
                    name: "source_chain",
                    type: "bytes",
                    indexed: true,
                },
                {
                    name: "transaction_hash",
                    type: "bytes",
                    indexed: true,
                },
                {
                    name: "token_id",
                    type: "TokenIdentifier",
                    indexed: true,
                },
                {
                    name: "nonce",
                    type: "u64",
                    indexed: true,
                },
            ],
        },
        {
            identifier: "Claimed1155",
            inputs: [
                {
                    name: "lock_tx_chain",
                    type: "bytes",
                    indexed: true,
                },
                {
                    name: "source_chain",
                    type: "bytes",
                    indexed: true,
                },
                {
                    name: "transaction_hash",
                    type: "bytes",
                    indexed: true,
                },
                {
                    name: "token_id",
                    type: "TokenIdentifier",
                    indexed: true,
                },
                {
                    name: "nonce",
                    type: "u64",
                    indexed: true,
                },
                {
                    name: "amt",
                    type: "BigUint",
                    indexed: true,
                },
            ],
        },
        {
            identifier: "RewardValidator",
            inputs: [
                {
                    name: "validator",
                    type: "Address",
                    indexed: true,
                },
            ],
        },
    ],
    esdtAttributes: [],
    hasCallback: true,
    types: {
        ClaimData: {
            type: "struct",
            fields: [
                {
                    name: "token_id",
                    type: "bytes",
                },
                {
                    name: "source_chain",
                    type: "bytes",
                },
                {
                    name: "destination_chain",
                    type: "bytes",
                },
                {
                    name: "destination_user_address",
                    type: "Address",
                },
                {
                    name: "source_nft_contract_address",
                    type: "bytes",
                },
                {
                    name: "name",
                    type: "bytes",
                },
                {
                    name: "symbol",
                    type: "bytes",
                },
                {
                    name: "royalty",
                    type: "BigUint",
                },
                {
                    name: "royalty_receiver",
                    type: "Address",
                },
                {
                    name: "attrs",
                    type: "bytes",
                },
                {
                    name: "transaction_hash",
                    type: "bytes",
                },
                {
                    name: "token_amount",
                    type: "BigUint",
                },
                {
                    name: "nft_type",
                    type: "bytes",
                },
                {
                    name: "fee",
                    type: "BigUint",
                },
                {
                    name: "lock_tx_chain",
                    type: "bytes",
                },
            ],
        },
        ContractInfo: {
            type: "struct",
            fields: [
                {
                    name: "chain",
                    type: "bytes",
                },
                {
                    name: "address",
                    type: "bytes",
                },
            ],
        },
        SignatureInfo: {
            type: "struct",
            fields: [
                {
                    name: "public_key",
                    type: "Address",
                },
                {
                    name: "sig",
                    type: "bytes",
                },
            ],
        },
        TokenInfo: {
            type: "struct",
            fields: [
                {
                    name: "token_id",
                    type: "u64",
                },
                {
                    name: "chain",
                    type: "bytes",
                },
                {
                    name: "contract_address",
                    type: "bytes",
                },
            ],
        },
        Validator: {
            type: "struct",
            fields: [
                {
                    name: "added",
                    type: "bool",
                },
                {
                    name: "pending_reward",
                    type: "BigUint",
                },
            ],
        },
    },
};
exports.default = multiversXBridgeABI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGl2ZXJzWEJyaWRnZUFCSS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cmFjdHNUeXBlcy9tdWx0aXZlcnN4L211bHRpdmVyc1hCcmlkZ2VBQkkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLG1CQUFtQixHQUFHO0lBQzFCLFNBQVMsRUFBRTtRQUNULEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRSxnQkFBZ0I7WUFDekIsVUFBVSxFQUFFLDBDQUEwQztZQUN0RCxVQUFVLEVBQUUsWUFBWTtZQUN4QixPQUFPLEVBQUUsU0FBUztZQUNsQixLQUFLLEVBQUUsNkNBQTZDO1NBQ3JEO1FBQ0QsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsT0FBTztTQUNqQjtRQUNELFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxlQUFlO1lBQ3JCLE9BQU8sRUFBRSxRQUFRO1NBQ2xCO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLFdBQVcsRUFBRTtRQUNYLE1BQU0sRUFBRTtZQUNOO2dCQUNFLElBQUksRUFBRSxZQUFZO2dCQUNsQixJQUFJLEVBQUUsU0FBUzthQUNoQjtTQUNGO1FBQ0QsT0FBTyxFQUFFLEVBQUU7S0FDWjtJQUNELFNBQVMsRUFBRTtRQUNUO1lBQ0UsSUFBSSxFQUFFLFFBQVE7WUFDZCxVQUFVLEVBQUUsVUFBVTtZQUN0QixNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxJQUFJLEVBQUUsc0NBQXNDO29CQUM1QyxZQUFZLEVBQUUsSUFBSTtpQkFDbkI7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsWUFBWTtZQUNsQixVQUFVLEVBQUUsVUFBVTtZQUN0QixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JB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