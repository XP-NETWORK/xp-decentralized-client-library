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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZGdlU3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cmFjdHNUeXBlcy9tdWx0aXZlcnN4L2JyaWRnZVN0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLGdCQUFnQixHQUFHO0lBQ3JCO1FBQ0ksTUFBTSxFQUFFO1lBQ0o7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLElBQUksRUFBRSxTQUFTO2FBQ2xCO1lBQ0Q7Z0JBQ0ksVUFBVSxFQUFFO29CQUNSO3dCQUNJLFlBQVksRUFBRSxRQUFRO3dCQUN0QixJQUFJLEVBQUUsT0FBTzt3QkFDYixJQUFJLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFNBQVM7d0JBQ3ZCLElBQUksRUFBRSxLQUFLO3dCQUNYLElBQUksRUFBRSxTQUFTO3FCQUNsQjtpQkFDSjtnQkFDRCxZQUFZLEVBQUUsbUJBQW1CO2dCQUNqQyxJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsZUFBZSxFQUFFLFlBQVk7UUFDN0IsSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFVBQVUsRUFBRTtvQkFDUjt3QkFDSSxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsSUFBSSxFQUFFLFNBQVM7cUJBQ2xCO29CQUNEO3dCQUNJLFlBQVksRUFBRSxRQUFRO3dCQUN0QixJQUFJLEVBQUUsYUFBYTt3QkFDbkIsSUFBSSxFQUFFLFFBQVE7cUJBQ2pCO29CQUNEO3dCQUNJLFlBQVksRUFBRSxRQUFRO3dCQUN0QixJQUFJLEVBQUUsa0JBQWtCO3dCQUN4QixJQUFJLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFNBQVM7d0JBQ3ZCLElBQUksRUFBRSx3QkFBd0I7d0JBQzlCLElBQUksRUFBRSxTQUFTO3FCQUNsQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsSUFBSSxFQUFFLDBCQUEwQjt3QkFDaEMsSUFBSSxFQUFFLFNBQVM7cUJBQ2xCO29CQUNEO3dCQUNJLFlBQVksRUFBRSxRQUFRO3dCQUN0QixJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxRQUFRO3FCQUNqQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsSUFBSSxFQUFFLFNBQVM7cUJBQ2xCO29CQUNEO3dCQUNJLFlBQVksRUFBRSxTQUFTO3dCQUN2QixJQUFJLEVBQUUsaUJBQWlCO3dCQUN2QixJQUFJLEVBQUUsU0FBUztxQkFDbEI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxVQUFVO3dCQUNoQixJQUFJLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxpQkFBaUI7d0JBQ3ZCLElBQUksRUFBRSxRQUFRO3FCQUNqQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsSUFBSSxFQUFFLGFBQWE7d0JBQ25CLElBQUksRUFBRSxTQUFTO3FCQUNsQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsUUFBUTt3QkFDdEIsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsSUFBSSxFQUFFLFFBQVE7cUJBQ2pCO29CQUNEO3dCQUNJLFlBQVksRUFBRSxTQUFTO3dCQUN2QixJQUFJLEVBQUUsS0FBSzt3QkFDWCxJQUFJLEVBQUUsU0FBUztxQkFDbEI7aUJBQ0o7Z0JBQ0QsWUFBWSxFQUFFLDJCQUEyQjtnQkFDekMsSUFBSSxFQUFFLG9CQUFvQjtnQkFDMUIsSUFBSSxFQUFFLE9BQU87YUFDaEI7WUFDRDtnQkFDSSxZQUFZLEVBQUUsUUFBUTtnQkFDdEIsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLElBQUksRUFBRSxRQUFRO2FBQ2pCO1NBQ0o7UUFDRCxJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLE9BQU8sRUFBRSxFQUFFO1FBQ1gsZUFBZSxFQUFFLFlBQVk7UUFDN0IsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsZUFBZTtnQkFDckIsSUFBSSxFQUFFLFNBQVM7YUFDbEI7WUFDRDtnQkFDSSxZQUFZLEVBQUUsUUFBUTtnQkFDdEIsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLElBQUksRUFBRSxRQUFRO2FBQ2pCO1NBQ0o7UUFDRCxJQUFJLEVBQUUsY0FBYztRQUNwQixPQUFPLEVBQUUsRUFBRTtRQUNYLGVBQWUsRUFBRSxZQUFZO1FBQzdCLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsUUFBUTtnQkFDdEIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFFBQVE7YUFDakI7U0FDSjtRQUNELElBQUksRUFBRSxZQUFZO1FBQ2xCLE9BQU8sRUFBRTtZQUNMO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsZUFBZSxFQUFFLE1BQU07UUFDdkIsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsUUFBUTthQUNqQjtTQUNKO1FBQ0QsSUFBSSxFQUFFLFVBQVU7UUFDaEIsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsTUFBTTtRQUN2QixJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUNEO1FBQ0ksTUFBTSxFQUFFO1lBQ0o7Z0JBQ0ksWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2xCO1lBQ0Q7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2xCO1lBQ0Q7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxJQUFJLEVBQUUsZUFBZTtRQUNyQixPQUFPLEVBQUU7WUFDTDtnQkFDSSxZQUFZLEVBQUUsTUFBTTtnQkFDcEIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLE1BQU07YUFDZjtTQUNKO1FBQ0QsZUFBZSxFQUFFLE1BQU07UUFDdkIsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsU0FBUzthQUNsQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsSUFBSSxFQUFFLGVBQWU7UUFDckIsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsTUFBTTtRQUN2QixJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUNEO1FBQ0ksTUFBTSxFQUFFO1lBQ0o7Z0JBQ0ksWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLElBQUksRUFBRSxPQUFPO2dCQUNiLElBQUksRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLE9BQU8sRUFBRSxFQUFFO1FBQ1gsZUFBZSxFQUFFLFlBQVk7UUFDN0IsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixJQUFJLEVBQUUsU0FBUzthQUNsQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxNQUFNO2dCQUNwQixJQUFJLEVBQUUsU0FBUztnQkFDZixJQUFJLEVBQUUsTUFBTTthQUNmO1NBQ0o7UUFDRCxJQUFJLEVBQUUsdUJBQXVCO1FBQzdCLE9BQU8sRUFBRSxFQUFFO1FBQ1gsZUFBZSxFQUFFLFlBQVk7UUFDN0IsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsR0FBRztnQkFDVCxJQUFJLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsR0FBRztnQkFDVCxJQUFJLEVBQUUsUUFBUTthQUNqQjtTQUNKO1FBQ0QsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxRQUFRO2FBQ2pCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsTUFBTTtRQUN2QixJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUNEO1FBQ0ksTUFBTSxFQUFFO1lBQ0o7Z0JBQ0ksWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLElBQUksRUFBRSxPQUFPO2dCQUNiLElBQUksRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0ksWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSxRQUFRO2FBQ2pCO1NBQ0o7UUFDRCxJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLE9BQU8sRUFBRTtZQUNMO2dCQUNJLFVBQVUsRUFBRTtvQkFDUjt3QkFDSSxVQUFVLEVBQUU7NEJBQ1I7Z0NBQ0ksWUFBWSxFQUFFLFNBQVM7Z0NBQ3ZCLElBQUksRUFBRSxTQUFTO2dDQUNmLElBQUksRUFBRSxTQUFTOzZCQUNsQjs0QkFDRDtnQ0FDSSxZQUFZLEVBQUUsUUFBUTtnQ0FDdEIsSUFBSSxFQUFFLGFBQWE7Z0NBQ25CLElBQUksRUFBRSxRQUFROzZCQUNqQjs0QkFDRDtnQ0FDSSxZQUFZLEVBQUUsUUFBUTtnQ0FDdEIsSUFBSSxFQUFFLGtCQUFrQjtnQ0FDeEIsSUFBSSxFQUFFLFFBQVE7NkJBQ2pCOzRCQUNEO2dDQUNJLFlBQVksRUFBRSxTQUFTO2dDQUN2QixJQUFJLEVBQUUsd0JBQXdCO2dDQUM5QixJQUFJLEVBQUUsU0FBUzs2QkFDbEI7NEJBQ0Q7Z0NBQ0ksWUFBWSxFQUFFLFNBQVM7Z0NBQ3ZCLElBQUksRUFBRSwwQkFBMEI7Z0NBQ2hDLElBQUksRUFBRSxTQUFTOzZCQUNsQjs0QkFDRDtnQ0FDSSxZQUFZLEVBQUUsUUFBUTtnQ0FDdEIsSUFBSSxFQUFFLE1BQU07Z0NBQ1osSUFBSSxFQUFFLFFBQVE7NkJBQ2pCOzRCQUNEO2dDQUNJLFlBQVksRUFBRSxRQUFRO2dDQUN0QixJQUFJLEVBQUUsUUFBUTtnQ0FDZCxJQUFJLEVBQUUsUUFBUTs2QkFDakI7NEJBQ0Q7Z0NBQ0ksWUFBWSxFQUFFLFNBQVM7Z0NBQ3ZCLElBQUksRUFBRSxTQUFTO2dDQUNmLElBQUksRUFBRSxTQUFTOzZCQUNsQjs0QkFDRDtnQ0FDSSxZQUFZLEVBQUUsU0FBUztnQ0FDdkIsSUFBSSxFQUFFLGlCQUFpQjtnQ0FDdkIsSUFBSSxFQUFFLFNBQVM7NkJBQ2xCOzRCQUNEO2dDQUNJLFlBQVksRUFBRSxRQUFRO2dDQUN0QixJQUFJLEVBQUUsVUFBVTtnQ0FDaEIsSUFBSSxFQUFFLFFBQVE7NkJBQ2pCOzRCQUNEO2dDQUNJLFlBQVksRUFBRSxRQUFRO2dDQUN0QixJQUFJLEVBQUUsaUJBQWlCO2dDQUN2QixJQUFJLEVBQUUsUUFBUTs2QkFDakI7NEJBQ0Q7Z0NBQ0ksWUFBWSxFQUFFLFNBQVM7Z0NBQ3ZCLElBQUksRUFBRSxhQUFhO2dDQUNuQixJQUFJLEVBQUUsU0FBUzs2QkFDbEI7NEJBQ0Q7Z0NBQ0ksWUFBWSxFQUFFLFFBQVE7Z0NBQ3RCLElBQUksRUFBRSxTQUFTO2dDQUNmLElBQUksRUFBRSxRQUFROzZCQUNqQjs0QkFDRDtnQ0FDSSxZQUFZLEVBQUUsU0FBUztnQ0FDdkIsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsSUFBSSxFQUFFLFNBQVM7NkJBQ2xCO3lCQUNKO3dCQUNELFlBQVksRUFBRSwyQkFBMkI7d0JBQ3pDLElBQUksRUFBRSxpQkFBaUI7d0JBQ3ZCLElBQUksRUFBRSxPQUFPO3FCQUNoQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsVUFBVTt3QkFDeEIsSUFBSSxFQUFFLFlBQVk7d0JBQ2xCLElBQUksRUFBRSxVQUFVO3FCQUNuQjtpQkFDSjtnQkFDRCxZQUFZLEVBQUUsa0NBQWtDO2dCQUNoRCxJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsT0FBTzthQUNoQjtTQUNKO1FBQ0QsZUFBZSxFQUFFLE1BQU07UUFDdkIsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsT0FBTztnQkFDYixJQUFJLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsUUFBUTthQUNqQjtTQUNKO1FBQ0QsSUFBSSxFQUFFLDJCQUEyQjtRQUNqQyxPQUFPLEVBQUU7WUFDTDtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLE9BQU8sRUFBRTtZQUNMO2dCQUNJLFlBQVksRUFBRSxVQUFVO2dCQUN4QixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsVUFBVTthQUNuQjtTQUNKO1FBQ0QsZUFBZSxFQUFFLE1BQU07UUFDdkIsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsZUFBZTtnQkFDckIsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELElBQUksRUFBRSwyQkFBMkI7UUFDakMsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsTUFBTTtRQUN2QixJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUNEO1FBQ0ksTUFBTSxFQUFFO1lBQ0o7Z0JBQ0ksWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxRQUFRO2FBQ2pCO1NBQ0o7UUFDRCxJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLE9BQU8sRUFBRTtZQUNMO2dCQUNJLFVBQVUsRUFBRTtvQkFDUjt3QkFDSSxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsSUFBSSxFQUFFLFNBQVM7cUJBQ2xCO29CQUNEO3dCQUNJLFlBQVksRUFBRSxRQUFRO3dCQUN0QixJQUFJLEVBQUUsYUFBYTt3QkFDbkIsSUFBSSxFQUFFLFFBQVE7cUJBQ2pCO29CQUNEO3dCQUNJLFlBQVksRUFBRSxRQUFRO3dCQUN0QixJQUFJLEVBQUUsa0JBQWtCO3dCQUN4QixJQUFJLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFNBQVM7d0JBQ3ZCLElBQUksRUFBRSx3QkFBd0I7d0JBQzlCLElBQUksRUFBRSxTQUFTO3FCQUNsQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsSUFBSSxFQUFFLDBCQUEwQjt3QkFDaEMsSUFBSSxFQUFFLFNBQVM7cUJBQ2xCO29CQUNEO3dCQUNJLFlBQVksRUFBRSxRQUFRO3dCQUN0QixJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxRQUFRO3FCQUNqQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsSUFBSSxFQUFFLFNBQVM7cUJBQ2xCO29CQUNEO3dCQUNJLFlBQVksRUFBRSxTQUFTO3dCQUN2QixJQUFJLEVBQUUsaUJBQWlCO3dCQUN2QixJQUFJLEVBQUUsU0FBUztxQkFDbEI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxVQUFVO3dCQUNoQixJQUFJLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxpQkFBaUI7d0JBQ3ZCLElBQUksRUFBRSxRQUFRO3FCQUNqQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsU0FBUzt3QkFDdkIsSUFBSSxFQUFFLGFBQWE7d0JBQ25CLElBQUksRUFBRSxTQUFTO3FCQUNsQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsUUFBUTt3QkFDdEIsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsSUFBSSxFQUFFLFFBQVE7cUJBQ2pCO29CQUNEO3dCQUNJLFlBQVksRUFBRSxTQUFTO3dCQUN2QixJQUFJLEVBQUUsS0FBSzt3QkFDWCxJQUFJLEVBQUUsU0FBUztxQkFDbEI7aUJBQ0o7Z0JBQ0QsWUFBWSxFQUFFLDJCQUEyQjtnQkFDekMsSUFBSSxFQUFFLGlCQUFpQjtnQkFDdkIsSUFBSSxFQUFFLE9BQU87YUFDaEI7U0FDSjtRQUNELGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7WUFDRDtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELElBQUksRUFBRSxtQkFBbUI7UUFDekIsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxRQUFRO2FBQ2pCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsTUFBTTtRQUN2QixJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUNEO1FBQ0ksTUFBTSxFQUFFO1lBQ0o7Z0JBQ0ksWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxRQUFRO2FBQ2pCO1NBQ0o7UUFDRCxJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLE9BQU8sRUFBRTtZQUNMO2dCQUNJLFlBQVksRUFBRSxNQUFNO2dCQUNwQixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsTUFBTTthQUNmO1NBQ0o7UUFDRCxlQUFlLEVBQUUsTUFBTTtRQUN2QixJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUNEO1FBQ0ksTUFBTSxFQUFFLEVBQUU7UUFDVixJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCLE9BQU8sRUFBRTtZQUNMO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsZUFBZSxFQUFFLE1BQU07UUFDdkIsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsSUFBSSxFQUFFLGdCQUFnQjtRQUN0QixPQUFPLEVBQUU7WUFDTDtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7WUFDRDtnQkFDSSxZQUFZLEVBQUUsTUFBTTtnQkFDcEIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLE1BQU07YUFDZjtZQUNEO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsSUFBSSxFQUFFLDRCQUE0QjtRQUNsQyxPQUFPLEVBQUU7WUFDTDtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7WUFDRDtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7WUFDRDtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxNQUFNO2FBQ2Y7U0FDSjtRQUNELGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELElBQUksRUFBRSxZQUFZO1FBQ2xCLE9BQU8sRUFBRTtZQUNMO2dCQUNJLFlBQVksRUFBRSxNQUFNO2dCQUNwQixJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsTUFBTTthQUNmO1NBQ0o7UUFDRCxlQUFlLEVBQUUsTUFBTTtRQUN2QixJQUFJLEVBQUUsVUFBVTtLQUNuQjtDQUNKLENBQUM7QUFFRixrQkFBZSxnQkFBZ0IsQ0FBQyJ9