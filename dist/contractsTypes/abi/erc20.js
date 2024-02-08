"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const erc20ABI = [
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
            {
                internalType: 'uint256',
                name: 'initialSupply',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
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
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
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
        name: 'ERC20InvalidApprover',
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
        name: 'ERC20InvalidReceiver',
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
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
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
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
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
                indexed: false,
                internalType: 'uint256',
                name: 'value',
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
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
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
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
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
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
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
        inputs: [],
        name: 'totalSupply',
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
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
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
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.default = erc20ABI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJjMjAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJhY3RzVHlwZXMvYWJpL2VyYzIwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxRQUFRLEdBQUc7SUFDYjtRQUNJLE1BQU0sRUFBRTtZQUNKO2dCQUNJLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNJLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsZUFBZTtnQkFDckIsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELGVBQWUsRUFBRSxZQUFZO1FBQzdCLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsSUFBSSxFQUFFLFNBQVM7YUFDbEI7WUFDRDtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLElBQUksRUFBRSxTQUFTO2FBQ2xCO1lBQ0Q7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxJQUFJLEVBQUUsNEJBQTRCO1FBQ2xDLElBQUksRUFBRSxPQUFPO0tBQ2hCO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsSUFBSSxFQUFFLFNBQVM7YUFDbEI7WUFDRDtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsSUFBSSxF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