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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGl2ZXJzWEJyaWRnZUFCSS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cmFjdHNUeXBlcy9hYmkvbXVsdGl2ZXJzWEJyaWRnZUFCSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sbUJBQW1CLEdBQUc7SUFDeEIsU0FBUyxFQUFFO1FBQ1AsS0FBSyxFQUFFO1lBQ0gsT0FBTyxFQUFFLGdCQUFnQjtZQUN6QixVQUFVLEVBQUUsMENBQTBDO1lBQ3RELFVBQVUsRUFBRSxZQUFZO1lBQ3hCLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLEtBQUssRUFBRSw2Q0FBNkM7U0FDdkQ7UUFDRCxhQUFhLEVBQUU7WUFDWCxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxPQUFPO1NBQ25CO1FBQ0QsU0FBUyxFQUFFO1lBQ1AsSUFBSSxFQUFFLGVBQWU7WUFDckIsT0FBTyxFQUFFLFFBQVE7U0FDcEI7S0FDSjtJQUNELElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsV0FBVyxFQUFFO1FBQ1QsTUFBTSxFQUFFO1lBQ0o7Z0JBQ0ksSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxPQUFPLEVBQUUsRUFBRTtLQUNkO0lBQ0QsU0FBUyxFQUFFO1FBQ1A7WUFDSSxJQUFJLEVBQUUsUUFBUTtZQUNkLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLE1BQU0sRUFBRSxFQUFFO1lBQ1YsT0FBTyxFQUFFO2dCQUNMO29CQUNJLElBQUksRUFBRSxzQ0FBc0M7b0JBQzVDLFlBQVksRUFBRSxJQUFJO2lCQUNyQjthQUNKO1NBQ0o7UUFDRDtZQUNJLElBQUksRUFBRSxZQUFZO1lBQ2xCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLE1BQU0sRUFBRTtnQkFDSjtvQkFDSSxJQUFJLEVBQUUsU0FBUztvQkFDZixJQUFJLEVBQUUsU0FBUztpQkFDbEI7YUFDSjtZQUNELE9BQU8sRUFBRTtnQkFDTDtvQkFD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