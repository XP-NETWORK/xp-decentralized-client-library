"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const erc721RoyalityABI = [
    {
        inputs: [
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
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC721IncorrectOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ERC721InsufficientApproval',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidOperator',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ERC721NonexistentToken',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'approved',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'approved',
                type: 'bool',
            },
        ],
        name: 'ApprovalForAll',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: '_fromTokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_toTokenId',
                type: 'uint256',
            },
        ],
        name: 'BatchMetadataUpdate',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'MetadataUpdate',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'balanceOf',
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
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'getApproved',
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
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
        ],
        name: 'isApprovedForAll',
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
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'royalty',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'royalityReciever',
                type: 'address',
            },
            {
                internalType: 'string',
                name: 'tokenURI',
                type: 'string',
            },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
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
        name: 'owner',
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
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ownerOf',
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
        inputs: [],
        name: 'renounceOwnership',
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
                internalType: 'uint256',
                name: 'salePrice',
                type: 'uint256',
            },
        ],
        name: 'royaltyInfo',
        outputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'royaltyAmount',
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
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: 'approved',
                type: 'bool',
            },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
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
        name: 'symbol',
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
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'tokenURI',
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
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.default = erc721RoyalityABI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJjNzIxUm95YWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJhY3RzVHlwZXMvYWJpL2VyYzcyMVJveWFsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxpQkFBaUIsR0FBRztJQUN0QjtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsUUFBUTthQUNqQjtTQUNKO1FBQ0QsZUFBZSxFQUFFLFlBQVk7UUFDN0IsSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFDRDtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsU0FBUzthQUNsQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsU0FBUztnQkFDZixJQUFJLEVBQUUsU0FBUzthQUNsQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsT0FBTztnQkFDYixJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsSUFBSSxFQUFFLHNCQUFzQjtRQUM1QixJQUFJLEVBQUUsT0FBTztLQUNoQjtJQUNEO1FBQ0ksTUFBTSxFQUFFO1lBQ0o7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxVQUFVO2dCQUNoQixJQUFJLEVBQUUsU0FBUzthQUNsQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsU0FBUztnQkFDZixJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsSUFBSSxFQUFFLDRCQUE0QjtRQUNsQyxJQUFJLEVB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