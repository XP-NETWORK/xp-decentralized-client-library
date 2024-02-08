"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const evmBridgeABI = [
    {
        inputs: [
            {
                internalType: 'address[]',
                name: '_validators',
                type: 'address[]',
            },
            {
                internalType: 'string',
                name: '_chainType',
                type: 'string',
            },
            {
                internalType: 'address',
                name: '_collectionDeployer',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_storageDeployer',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [],
        name: 'ECDSAInvalidSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'length',
                type: 'uint256',
            },
        ],
        name: 'ECDSAInvalidSignatureLength',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'ECDSAInvalidSignatureS',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: '_validator',
                type: 'address',
            },
        ],
        name: 'AddNewValidator',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'sourceChain',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'transactionHash',
                type: 'string',
            },
        ],
        name: 'Claimed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'destinationChain',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'destinationUserAddress',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'sourceNftContractAddress',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenAmount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'nftType',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'sourceChain',
                type: 'string',
            },
        ],
        name: 'Locked',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'hashValue',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes[]',
                name: '',
                type: 'bytes[]',
            },
        ],
        name: 'LogHash',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: '_validator',
                type: 'address',
            },
        ],
        name: 'RewardValidator',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'contractAddr',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'UnLock1155',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'contractAddr',
                type: 'address',
            },
        ],
        name: 'UnLock721',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_validator',
                type: 'address',
            },
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'signerAddress',
                        type: 'string',
                    },
                    {
                        internalType: 'bytes',
                        name: 'signature',
                        type: 'bytes',
                    },
                ],
                internalType: 'struct SignerAndSignature[]',
                name: 'signatures',
                type: 'tuple[]',
            },
        ],
        name: 'addValidator',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
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
                        internalType: 'string',
                        name: 'sourceNftContractAddress',
                        type: 'string',
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
                internalType: 'struct Bridge.ClaimData',
                name: 'data',
                type: 'tuple',
            },
            {
                internalType: 'bytes[]',
                name: 'signatures',
                type: 'bytes[]',
            },
        ],
        name: 'claimNFT1155',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
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
                        internalType: 'string',
                        name: 'sourceNftContractAddress',
                        type: 'string',
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
                internalType: 'struct Bridge.ClaimData',
                name: 'data',
                type: 'tuple',
            },
            {
                internalType: 'bytes[]',
                name: 'signatures',
                type: 'bytes[]',
            },
        ],
        name: 'claimNFT721',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_validator',
                type: 'address',
            },
            {
                internalType: 'bytes[]',
                name: 'signatures',
                type: 'bytes[]',
            },
        ],
        name: 'claimValidatorRewards',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'collectionDeployer',
        outputs: [
            {
                internalType: 'contract INFTCollectionDeployer',
                name: '',
                type: 'address',
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
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'duplicateStorageMapping1155',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
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
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'duplicateStorageMapping721',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
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
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'duplicateToOriginalMapping',
        outputs: [
            {
                internalType: 'string',
                name: 'chain',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'contractAddress',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                internalType: 'string',
                name: 'destinationChain',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'destinationUserAddress',
                type: 'string',
            },
            {
                internalType: 'address',
                name: 'sourceNftContractAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenAmount',
                type: 'uint256',
            },
        ],
        name: 'lock1155',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                internalType: 'string',
                name: 'destinationChain',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'destinationUserAddress',
                type: 'string',
            },
            {
                internalType: 'address',
                name: 'sourceNftContractAddress',
                type: 'address',
            },
        ],
        name: 'lock721',
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
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'originalStorageMapping1155',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
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
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'originalStorageMapping721',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
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
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'originalToDuplicateMapping',
        outputs: [
            {
                internalType: 'string',
                name: 'chain',
                type: 'string',
            },
            {
                internalType: 'address',
                name: 'contractAddress',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'selfChain',
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
        inputs: [],
        name: 'storageDeployer',
        outputs: [
            {
                internalType: 'contract INFTStorageDeployer',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        name: 'uniqueIdentifier',
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
                name: 'added',
                type: 'bool',
            },
            {
                internalType: 'uint256',
                name: 'pendingReward',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'validatorsCount',
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
        stateMutability: 'payable',
        type: 'receive',
    },
];
exports.default = evmBridgeABI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZtQnJpZGdlQUJJLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL2FiaS9ldm1CcmlkZ2VBQkkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLFlBQVksR0FBRztJQUNqQjtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxXQUFXO2dCQUN6QixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsSUFBSSxFQUFFLFdBQVc7YUFDcEI7WUFDRDtnQkFDSSxZQUFZLEVBQUUsUUFBUTtnQkFDdEIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLElBQUksRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxxQkFBcUI7Z0JBQzNCLElBQUksRUFBRSxTQUFTO2FBQ2xCO1lBQ0Q7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxrQkFBa0I7Z0JBQ3hCLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsWUFBWTtRQUM3QixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUNEO1FBQ0ksTUFBTSxFQUFFLEVBQUU7UUFDVixJQUFJLEVBQUUsdUJBQXVCO1FBQzdCLElBQUksRUFBRSxPQUFPO0tBQ2hCO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELElBQUksRUFBRSw2QkFBNkI7UUFDbkMsSUFBSSxFQUFFLE9BQU87S0FDaEI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsR0FBRztnQkFDVCxJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsSUFBSSxFQUFFLHdCQUF3QjtRQUM5QixJQUFJLEVB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