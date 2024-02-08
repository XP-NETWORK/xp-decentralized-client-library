"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bridgeStorageABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'bootstrapValidator',
                type: 'address',
            },
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'chain',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'fee',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct ChainFee[]',
                name: 'bootstrapChainFee',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'tokenId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'string',
                        name: 'sourceChain',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'destinationChain',
                        type: 'string',
                    },
                    {
                        internalType: 'address',
                        name: 'destinationUserAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'sourceNftContractAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'symbol',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'royalty',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'royaltyReceiver',
                        type: 'address',
                    },
                    {
                        internalType: 'string',
                        name: 'metadata',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'transactionHash',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'string',
                        name: 'nftType',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'fee',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct NftTransferDetails',
                name: 'nftTransferDetails',
                type: 'tuple',
            },
            {
                internalType: 'string',
                name: 'signature',
                type: 'string',
            },
        ],
        name: 'approveLockNft',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'stakerAddress',
                type: 'address',
            },
            {
                internalType: 'string',
                name: 'signature',
                type: 'string',
            },
        ],
        name: 'approveStake',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'chainEpoch',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'chainFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'chainFeeVoted',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'chainFeeVotes',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'chain',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'fee',
                type: 'uint256',
            },
        ],
        name: 'changeChainFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_validatorAddress',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: '_status',
                type: 'bool',
            },
        ],
        name: 'changeValidatorStatus',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'a',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'b',
                type: 'string',
            },
        ],
        name: 'concatenate',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'chain',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'txHash',
                type: 'string',
            },
        ],
        name: 'getLockNftSignatures',
        outputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: 'uint256',
                                name: 'tokenId',
                                type: 'uint256',
                            },
                            {
                                internalType: 'string',
                                name: 'sourceChain',
                                type: 'string',
                            },
                            {
                                internalType: 'string',
                                name: 'destinationChain',
                                type: 'string',
                            },
                            {
                                internalType: 'address',
                                name: 'destinationUserAddress',
                                type: 'address',
                            },
                            {
                                internalType: 'address',
                                name: 'sourceNftContractAddress',
                                type: 'address',
                            },
                            {
                                internalType: 'string',
                                name: 'name',
                                type: 'string',
                            },
                            {
                                internalType: 'string',
                                name: 'symbol',
                                type: 'string',
                            },
                            {
                                internalType: 'uint256',
                                name: 'royalty',
                                type: 'uint256',
                            },
                            {
                                internalType: 'address',
                                name: 'royaltyReceiver',
                                type: 'address',
                            },
                            {
                                internalType: 'string',
                                name: 'metadata',
                                type: 'string',
                            },
                            {
                                internalType: 'string',
                                name: 'transactionHash',
                                type: 'string',
                            },
                            {
                                internalType: 'uint256',
                                name: 'tokenAmount',
                                type: 'uint256',
                            },
                            {
                                internalType: 'string',
                                name: 'nftType',
                                type: 'string',
                            },
                            {
                                internalType: 'uint256',
                                name: 'fee',
                                type: 'uint256',
                            },
                        ],
                        internalType: 'struct NftTransferDetails',
                        name: 'transferDetails',
                        type: 'tuple',
                    },
                    {
                        internalType: 'string[]',
                        name: 'signatures',
                        type: 'string[]',
                    },
                ],
                internalType: 'struct NftTransferWithSignatures',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'chain',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'txHash',
                type: 'string',
            },
        ],
        name: 'getLockNftSignaturesCount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'stakerAddress',
                type: 'address',
            },
        ],
        name: 'getStakingSignatures',
        outputs: [
            {
                internalType: 'string[]',
                name: '',
                type: 'string[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'stakerAddress',
                type: 'address',
            },
        ],
        name: 'getStakingSignaturesCount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'lockSignatures',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'tokenId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'string',
                        name: 'sourceChain',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'destinationChain',
                        type: 'string',
                    },
                    {
                        internalType: 'address',
                        name: 'destinationUserAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'sourceNftContractAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'symbol',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'royalty',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'royaltyReceiver',
                        type: 'address',
                    },
                    {
                        internalType: 'string',
                        name: 'metadata',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'transactionHash',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'string',
                        name: 'nftType',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'fee',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct NftTransferDetails',
                name: 'transferDetails',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'stakingSignatures',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'usedSignatures',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'validatorCount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'validatorEpoch',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'validatorStatusChangeVotes',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'validatorVoted',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'validators',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
exports.default = bridgeStorageABI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZGdlU3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cmFjdHNUeXBlcy9hYmkvYnJpZGdlU3RvcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sZ0JBQWdCLEdBQUc7SUFDckI7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLG9CQUFvQjtnQkFDMUIsSUFBSSxFQUFFLFNBQVM7YUFDbEI7WUFDRDtnQkFDSSxVQUFVLEVBQUU7b0JBQ1I7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxPQUFPO3dCQUNiLElBQUksRUFBRSxRQUFRO3FCQUNqQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsSUFBSSxFQUFFLEtBQUs7d0JBQ1gsSUFBSSxFQUFFLFNBQVM7cUJBQ2xCO2lCQUNKO2dCQUNELFlBQVksRUFBRSxtQkFBbUI7Z0JBQ2pDLElBQUksRUFBRSxtQkFBbUI7Z0JBQ3pCLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsWUFBWTtRQUM3QixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUNEO1FBQ0ksTUFBTSxFQUFFO1lBQ0o7Z0JBQ0ksVUFBVSxFQUFFO29CQUNSO3dCQUNJLFlBQVksRUFBRSxTQUFTO3dCQUN2QixJQUFJLEVBQUUsU0FBUzt3QkFDZixJQUFJLEVBQUUsU0FBUztxQkFDbEI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxhQUFhO3dCQUNuQixJQUFJLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxrQkFBa0I7d0JBQ3hCLElBQUksRUFBRSxRQUFRO3FCQUNqQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsSUFBSSxFQUFFLHdCQUF3Qjt3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