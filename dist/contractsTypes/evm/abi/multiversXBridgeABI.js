"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multiversXBridgeABI = {
    buildInfo: {
        rustc: {
            version: '1.71.0-nightly',
            commitHash: 'a2b1646c597329d0a25efa3889b66650f65de1de',
            commitDate: '2023-05-25',
            channel: 'Nightly',
            short: 'rustc 1.71.0-nightly (a2b1646c5 2023-05-25)',
        },
        contractCrate: {
            name: 'bridge',
            version: '0.0.0',
        },
        framework: {
            name: 'multiversx-sc',
            version: '0.44.0',
        },
    },
    name: 'BridgeContract',
    constructor: {
        inputs: [
            {
                name: 'public_key',
                type: 'Address',
            },
        ],
        outputs: [],
    },
    endpoints: [
        {
            name: 'tokens',
            mutability: 'readonly',
            inputs: [],
            outputs: [
                {
                    type: 'variadic<multi<TokenInfo,TokenInfo>>',
                    multi_result: true,
                },
            ],
        },
        {
            name: 'validators',
            mutability: 'readonly',
            inputs: [
                {
                    name: 'address',
                    type: 'Address',
                },
            ],
            outputs: [
                {
                    type: 'variadic<Validator>',
                    multi_result: true,
                },
            ],
        },
        {
            name: 'validatorsCount',
            mutability: 'readonly',
            inputs: [],
            outputs: [
                {
                    type: 'u64',
                },
            ],
        },
        {
            name: 'uniqueIdentifier',
            mutability: 'readonly',
            inputs: [],
            outputs: [
                {
                    type: 'variadic<bytes>',
                    multi_result: true,
                },
            ],
        },
        {
            name: 'originalToDuplicateMapping',
            mutability: 'readonly',
            inputs: [],
            outputs: [
                {
                    type: 'variadic<multi<tuple<bytes,bytes>,ContractInfo>>',
                    multi_result: true,
                },
            ],
        },
        {
            name: 'duplicateToOriginalMapping',
            mutability: 'readonly',
            inputs: [],
            outputs: [
                {
                    type: 'variadic<multi<tuple<TokenIdentifier,bytes>,ContractInfo>>',
                    multi_result: true,
                },
            ],
        },
        {
            name: 'addValidator',
            mutability: 'mutable',
            inputs: [
                {
                    name: 'new_validator_public_key',
                    type: 'Address',
                },
                {
                    name: 'signatures',
                    type: 'List<SignatureInfo>',
                },
            ],
            outputs: [],
        },
        {
            name: 'claimValidatorRewards',
            mutability: 'mutable',
            inputs: [
                {
                    name: 'validator',
                    type: 'Address',
                },
                {
                    name: 'signatures',
                    type: 'List<SignatureInfo>',
                },
            ],
            outputs: [],
        },
        {
            name: 'lock721',
            mutability: 'mutable',
            payableInTokens: ['*'],
            inputs: [
                {
                    name: 'token_id',
                    type: 'TokenIdentifier',
                },
                {
                    name: 'destination_chain',
                    type: 'bytes',
                },
                {
                    name: 'destination_user_address',
                    type: 'bytes',
                },
                {
                    name: 'source_nft_contract_address',
                    type: 'TokenIdentifier',
                },
                {
                    name: 'nonce',
                    type: 'u64',
                },
            ],
            outputs: [],
        },
        {
            name: 'lock1155',
            mutability: 'mutable',
            payableInTokens: ['*'],
            inputs: [
                {
                    name: 'token_id',
                    type: 'TokenIdentifier',
                },
                {
                    name: 'destination_chain',
                    type: 'bytes',
                },
                {
                    name: 'destination_user_address',
                    type: 'bytes',
                },
                {
                    name: 'source_nft_contract_address',
                    type: 'TokenIdentifier',
                },
                {
                    name: 'amount',
                    type: 'BigUint',
                },
                {
                    name: 'nonce',
                    type: 'u64',
                },
            ],
            outputs: [],
        },
        {
            name: 'claimNft721',
            mutability: 'mutable',
            payableInTokens: ['EGLD'],
            inputs: [
                {
                    name: 'data',
                    type: 'ClaimData',
                },
                {
                    name: 'signatures',
                    type: 'List<SignatureInfo>',
                },
                {
                    name: 'uris',
                    type: 'multi<bytes,bytes>',
                    multi_arg: true,
                },
            ],
            outputs: [],
        },
        {
            name: 'claimNft1155',
            mutability: 'mutable',
            payableInTokens: ['EGLD'],
            inputs: [
                {
                    name: 'data',
                    type: 'ClaimData',
                },
                {
                    name: 'signatures',
                    type: 'List<SignatureInfo>',
                },
                {
                    name: 'uris',
                    type: 'multi<bytes,bytes>',
                    multi_arg: true,
                },
            ],
            outputs: [],
        },
        {
            name: 'collections',
            mutability: 'readonly',
            inputs: [
                {
                    name: 'identifier',
                    type: 'bytes',
                },
            ],
            outputs: [
                {
                    type: 'TokenIdentifier',
                },
            ],
        },
    ],
    events: [
        {
            identifier: 'AddNewValidator',
            inputs: [
                {
                    name: 'validator',
                    type: 'Address',
                    indexed: true,
                },
            ],
        },
        {
            identifier: 'Locked',
            inputs: [
                {
                    name: 'token_id',
                    type: 'u64',
                    indexed: true,
                },
                {
                    name: 'destination_chain',
                    type: 'bytes',
                    indexed: true,
                },
                {
                    name: 'destination_user_address',
                    type: 'bytes',
                    indexed: true,
                },
                {
                    name: 'source_nft_contract_address',
                    type: 'TokenIdentifier',
                    indexed: true,
                },
                {
                    name: 'token_amount',
                    type: 'BigUint',
                    indexed: true,
                },
                {
                    name: 'nft_type',
                    type: 'bytes',
                    indexed: true,
                },
                {
                    name: 'chain',
                    type: 'bytes',
                    indexed: true,
                },
            ],
        },
        {
            identifier: 'UnLock721',
            inputs: [
                {
                    name: 'to',
                    type: 'Address',
                    indexed: true,
                },
                {
                    name: 'token_id',
                    type: 'u64',
                    indexed: true,
                },
                {
                    name: 'contract_address',
                    type: 'TokenIdentifier',
                    indexed: true,
                },
            ],
        },
        {
            identifier: 'UnLock1155',
            inputs: [
                {
                    name: 'to',
                    type: 'Address',
                    indexed: true,
                },
                {
                    name: 'token_id',
                    type: 'u64',
                    indexed: true,
                },
                {
                    name: 'contract_address',
                    type: 'TokenIdentifier',
                    indexed: true,
                },
                {
                    name: 'amount',
                    type: 'BigUint',
                    indexed: true,
                },
            ],
        },
        {
            identifier: 'Claimed',
            inputs: [
                {
                    name: 'source_chain',
                    type: 'bytes',
                    indexed: true,
                },
                {
                    name: 'transaction_hash',
                    type: 'bytes',
                    indexed: true,
                },
            ],
        },
        {
            identifier: 'RewardValidator',
            inputs: [
                {
                    name: 'validator',
                    type: 'Address',
                    indexed: true,
                },
            ],
        },
    ],
    esdtAttributes: [],
    hasCallback: true,
    types: {
        ClaimData: {
            type: 'struct',
            fields: [
                {
                    name: 'token_id',
                    type: 'bytes',
                },
                {
                    name: 'source_chain',
                    type: 'bytes',
                },
                {
                    name: 'destination_chain',
                    type: 'bytes',
                },
                {
                    name: 'destination_user_address',
                    type: 'Address',
                },
                {
                    name: 'source_nft_contract_address',
                    type: 'bytes',
                },
                {
                    name: 'name',
                    type: 'bytes',
                },
                {
                    name: 'symbol',
                    type: 'bytes',
                },
                {
                    name: 'royalty',
                    type: 'BigUint',
                },
                {
                    name: 'royalty_receiver',
                    type: 'Address',
                },
                {
                    name: 'attrs',
                    type: 'bytes',
                },
                {
                    name: 'transaction_hash',
                    type: 'bytes',
                },
                {
                    name: 'token_amount',
                    type: 'BigUint',
                },
                {
                    name: 'nft_type',
                    type: 'bytes',
                },
                {
                    name: 'fee',
                    type: 'BigUint',
                },
            ],
        },
        ContractInfo: {
            type: 'struct',
            fields: [
                {
                    name: 'chain',
                    type: 'bytes',
                },
                {
                    name: 'address',
                    type: 'bytes',
                },
            ],
        },
        SignatureInfo: {
            type: 'struct',
            fields: [
                {
                    name: 'public_key',
                    type: 'Address',
                },
                {
                    name: 'sig',
                    type: 'bytes',
                },
            ],
        },
        TokenInfo: {
            type: 'struct',
            fields: [
                {
                    name: 'token_id',
                    type: 'u64',
                },
                {
                    name: 'chain',
                    type: 'bytes',
                },
                {
                    name: 'contract_address',
                    type: 'bytes',
                },
            ],
        },
        Validator: {
            type: 'struct',
            fields: [
                {
                    name: 'added',
                    type: 'bool',
                },
                {
                    name: 'pending_reward',
                    type: 'BigUint',
                },
            ],
        },
    },
};
exports.default = multiversXBridgeABI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGl2ZXJzWEJyaWRnZUFCSS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb250cmFjdHNUeXBlcy9ldm0vYWJpL211bHRpdmVyc1hCcmlkZ2VBQkkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLG1CQUFtQixHQUFHO0lBQ3hCLFNBQVMsRUFBRTtRQUNQLEtBQUssRUFBRTtZQUNILE9BQU8sRUFBRSxnQkFBZ0I7WUFDekIsVUFBVSxFQUFFLDBDQUEwQztZQUN0RCxVQUFVLEVBQUUsWUFBWTtZQUN4QixPQUFPLEVBQUUsU0FBUztZQUNsQixLQUFLLEVBQUUsNkNBQTZDO1NBQ3ZEO1FBQ0QsYUFBYSxFQUFFO1lBQ1gsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsT0FBTztTQUNuQjtRQUNELFNBQVMsRUFBRTtZQUNQLElBQUksRUFBRSxlQUFlO1lBQ3JCLE9BQU8sRUFBRSxRQUFRO1NBQ3BCO0tBQ0o7SUFDRCxJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLFdBQVcsRUFBRTtRQUNULE1BQU0sRUFBRTtZQUNKO2dCQUNJLElBQUksRUFBRSxZQUFZO2dCQUNsQixJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsT0FBTyxFQUFFLEVBQUU7S0FDZDtJQUNELFNBQVMsRUFBRTtRQUNQO1lBQ0ksSUFBSSxFQUFFLFFBQVE7WUFDZCxVQUFVLEVBQUUsVUFBVTtZQUN0QixNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRTtnQkFDTDtvQkFDSSxJQUFJLEVBQUUsc0NBQXNDO29CQUM1QyxZQUFZLEVBQUUsSUFBSTtpQkFDckI7YUFDSjtTQUNKO1FBQ0Q7WUFDSSxJQUFJLEVBQUUsWUFBWTtZQUNsQixVQUFVLEVBQUUsVUFBVTtZQUN0QixNQUFNLEVBQUU7Z0JBQ0o7b0JBQ0ksSUFBSSxFQUFFLFNBQVM7b0JBQ2YsSUFBSSxFQUFFLFNBQVM7aUJBQ2xCO2FBQ0o7WUFDRCxPQUFPLEVBQUU7Z0JB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