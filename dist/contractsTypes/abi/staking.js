"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stakingABI = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_stakingAmount',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_ERC20Token',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'validatorAddress',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'chainType',
                        type: 'string',
                    },
                ],
                indexed: false,
                internalType: 'struct ValidatorAddressAndChainType[]',
                name: 'validatorAddressAndChainType',
                type: 'tuple[]',
            },
        ],
        name: 'Staked',
        type: 'event',
    },
    {
        inputs: [],
        name: 'ERC20Token',
        outputs: [
            {
                internalType: 'contract IERC20',
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
                components: [
                    {
                        internalType: 'string',
                        name: 'validatorAddress',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'chainType',
                        type: 'string',
                    },
                ],
                internalType: 'struct ValidatorAddressAndChainType[]',
                name: '_validatorAddressAndChainType',
                type: 'tuple[]',
            },
        ],
        name: 'stakeERC20',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'stakingAmount',
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
        name: 'stakingBalances',
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
];
exports.default = stakingABI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Rha2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cmFjdHNUeXBlcy9hYmkvc3Rha2luZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sVUFBVSxHQUFHO0lBQ2Y7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsSUFBSSxFQUFFLFNBQVM7YUFDbEI7WUFDRDtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsWUFBWTtRQUM3QixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUNEO1FBQ0ksU0FBUyxFQUFFLEtBQUs7UUFDaEIsTUFBTSxFQUFFO1lBQ0o7Z0JBQ0ksT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSxTQUFTO2FBQ2xCO1lBQ0Q7Z0JBQ0ksVUFBVSxFQUFFO29CQUNSO3dCQUNJLFlBQVksRUFBRSxRQUFRO3dCQUN0QixJQUFJLEVBQUUsa0JBQWtCO3dCQUN4QixJQUFJLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxXQUFXO3dCQUNqQixJQUFJLEVBQUUsUUFBUTtxQkFDakI7aUJBQ0o7Z0JBQ0QsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsWUFBWSxFQUFFLHVDQUF1QztnQkFDckQsSUFBSSxFQUFFLDhCQUE4QjtnQkFDcEMsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELElBQUksRUFBRSxRQUFRO1FBQ2QsSUFBSSxFQUFFLE9BQU87S0FDaEI7SUFDRDtRQUNJLE1BQU0sRUFBRSxFQUFFO1FBQ1YsSUFBSSxFQUFFLFlBQVk7UUFDbEIsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksWUFBWSxFQUFFLGlCQUFpQjtnQkFDL0IsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxVQUFVLEVBQUU7b0JBQ1I7d0JBQ0ksWUFBWSxFQUFFLFFBQVE7d0JBQ3RCLElBQUksRUFBRSxrQkFBa0I7d0JBQ3hCLElBQUksRUFBRSxRQUFRO3FCQUNqQjtvQkFDRDt3QkFDSSxZQUFZLEVBQUUsUUFBUTt3QkFDdEIsSUFBSSxFQUFFLFdBQVc7d0JBQ2pCLElBQUksRUFBRSxRQUFRO3FCQUNqQjtpQkFDSjtnQkFDRCxZQUFZLEVBQUUsdUNBQXVDO2dCQUNyRCxJQUFJLEVBQUUsK0JBQStCO2dCQUNyQyxJQUFJLEVBQUUsU0FBUzthQUNsQjtTQUNKO1FBQ0QsSUFBSSxFQUFFLFlBQVk7UUFDbEIsT0FBTyxFQUFFLEVBQUU7UUFDWCxlQUFlLEVBQUUsWUFBWTtRQUM3QixJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUNEO1FBQ0ksTUFBTSxFQUFFLEVBQUU7UUFDVixJQUFJLEVBQUUsZUFBZTtRQUNyQixPQUFPLEVBQUU7WUFDTDtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBQ0Q7UUFDSSxNQUFNLEVBQUU7WUFDSjtnQkFDSSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDbEI7U0FDSjtRQUNELElBQUksRUFBRSxpQkFBaUI7UUFDdkIsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2xCO1NBQ0o7UUFDRCxlQUFlLEVBQUUsTUFBTTtRQUN2QixJQUFJLEVBQUUsVUFBVTtLQUNuQjtDQUNKLENBQUM7QUFFRixrQkFBZSxVQUFVLENBQUMifQ==