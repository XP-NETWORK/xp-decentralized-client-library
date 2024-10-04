"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multiversXBridgeABI = {
    "buildInfo": {
        "rustc": {
            "version": "1.80.1",
            "commitHash": "3f5fd8dd41153bc5fdca9427e9e05be2c767ba23",
            "commitDate": "2024-08-06",
            "channel": "Stable",
            "short": "rustc 1.80.1 (3f5fd8dd4 2024-08-06)"
        },
        "contractCrate": {
            "name": "bridge",
            "version": "0.0.0"
        },
        "framework": {
            "name": "multiversx-sc",
            "version": "0.50.4"
        }
    },
    "name": "BridgeContract",
    "constructor": {
        "inputs": [
            {
                "name": "public_key",
                "type": "Address"
            }
        ],
        "outputs": []
    },
    "endpoints": [
        {
            "name": "tokens",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "variadic<multi<TokenInfo,TokenInfo>>",
                    "multi_result": true
                }
            ]
        },
        {
            "name": "validators",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "address",
                    "type": "Address"
                }
            ],
            "outputs": [
                {
                    "type": "variadic<Validator>",
                    "multi_result": true
                }
            ]
        },
        {
            "name": "blacklistedValidators",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "address",
                    "type": "Address"
                }
            ],
            "outputs": [
                {
                    "type": "bool"
                }
            ]
        },
        {
            "name": "validatorsCount",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "u64"
                }
            ]
        },
        {
            "name": "uniqueIdentifier",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "variadic<bytes>",
                    "multi_result": true
                }
            ]
        },
        {
            "name": "originalToDuplicateMapping",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "variadic<multi<tuple<bytes,bytes>,ContractInfo>>",
                    "multi_result": true
                }
            ]
        },
        {
            "name": "duplicateToOriginalMapping",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "variadic<multi<tuple<TokenIdentifier,bytes>,ContractInfo>>",
                    "multi_result": true
                }
            ]
        },
        {
            "name": "addValidator",
            "mutability": "mutable",
            "inputs": [
                {
                    "name": "new_validator_public_key",
                    "type": "Address"
                },
                {
                    "name": "signatures",
                    "type": "List<SignatureInfo>"
                }
            ],
            "outputs": []
        },
        {
            "name": "blacklistValidator",
            "mutability": "mutable",
            "inputs": [
                {
                    "name": "address",
                    "type": "Address"
                },
                {
                    "name": "signatures",
                    "type": "List<SignatureInfo>"
                }
            ],
            "outputs": []
        },
        {
            "name": "claimValidatorRewards",
            "mutability": "mutable",
            "inputs": [
                {
                    "name": "validator",
                    "type": "Address"
                }
            ],
            "outputs": []
        },
        {
            "name": "lock721",
            "mutability": "mutable",
            "payableInTokens": [
                "*"
            ],
            "inputs": [
                {
                    "name": "_token_id",
                    "type": "TokenIdentifier"
                },
                {
                    "name": "destination_chain",
                    "type": "bytes"
                },
                {
                    "name": "destination_user_address",
                    "type": "bytes"
                },
                {
                    "name": "source_nft_contract_address",
                    "type": "TokenIdentifier"
                },
                {
                    "name": "nonce",
                    "type": "u64"
                },
                {
                    "name": "metadata_uri",
                    "type": "bytes"
                }
            ],
            "outputs": []
        },
        {
            "name": "lock1155",
            "mutability": "mutable",
            "payableInTokens": [
                "*"
            ],
            "inputs": [
                {
                    "name": "_token_id",
                    "type": "TokenIdentifier"
                },
                {
                    "name": "destination_chain",
                    "type": "bytes"
                },
                {
                    "name": "destination_user_address",
                    "type": "bytes"
                },
                {
                    "name": "source_nft_contract_address",
                    "type": "TokenIdentifier"
                },
                {
                    "name": "amount",
                    "type": "BigUint"
                },
                {
                    "name": "nonce",
                    "type": "u64"
                },
                {
                    "name": "metadata_uri",
                    "type": "bytes"
                }
            ],
            "outputs": []
        },
        {
            "name": "claimNft721",
            "mutability": "mutable",
            "payableInTokens": [
                "EGLD"
            ],
            "inputs": [
                {
                    "name": "data",
                    "type": "ClaimData"
                },
                {
                    "name": "signatures",
                    "type": "List<SignatureInfo>"
                }
            ],
            "outputs": []
        },
        {
            "name": "claimNft1155",
            "mutability": "mutable",
            "payableInTokens": [
                "EGLD"
            ],
            "inputs": [
                {
                    "name": "data",
                    "type": "ClaimData"
                },
                {
                    "name": "signatures",
                    "type": "List<SignatureInfo>"
                }
            ],
            "outputs": []
        },
        {
            "name": "collections",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "identifier",
                    "type": "bytes"
                }
            ],
            "outputs": [
                {
                    "type": "TokenIdentifier"
                }
            ]
        }
    ],
    "events": [
        {
            "identifier": "AddNewValidator",
            "inputs": [
                {
                    "name": "validator",
                    "type": "Address",
                    "indexed": true
                }
            ]
        },
        {
            "identifier": "Locked",
            "inputs": [
                {
                    "name": "token_id",
                    "type": "u64",
                    "indexed": true
                },
                {
                    "name": "destination_chain",
                    "type": "bytes",
                    "indexed": true
                },
                {
                    "name": "destination_user_address",
                    "type": "bytes",
                    "indexed": true
                },
                {
                    "name": "source_nft_contract_address",
                    "type": "TokenIdentifier",
                    "indexed": true
                },
                {
                    "name": "token_amount",
                    "type": "BigUint",
                    "indexed": true
                },
                {
                    "name": "nft_type",
                    "type": "bytes",
                    "indexed": true
                },
                {
                    "name": "chain",
                    "type": "bytes",
                    "indexed": true
                },
                {
                    "name": "metadata_uri",
                    "type": "bytes",
                    "indexed": true
                }
            ]
        },
        {
            "identifier": "UnLock721",
            "inputs": [
                {
                    "name": "to",
                    "type": "Address",
                    "indexed": true
                },
                {
                    "name": "token_id",
                    "type": "u64",
                    "indexed": true
                },
                {
                    "name": "contract_address",
                    "type": "TokenIdentifier",
                    "indexed": true
                }
            ]
        },
        {
            "identifier": "UnLock1155",
            "inputs": [
                {
                    "name": "to",
                    "type": "Address",
                    "indexed": true
                },
                {
                    "name": "token_id",
                    "type": "u64",
                    "indexed": true
                },
                {
                    "name": "contract_address",
                    "type": "TokenIdentifier",
                    "indexed": true
                },
                {
                    "name": "amount",
                    "type": "BigUint",
                    "indexed": true
                }
            ]
        },
        {
            "identifier": "Claimed",
            "inputs": [
                {
                    "name": "lock_tx_chain",
                    "type": "bytes",
                    "indexed": true
                },
                {
                    "name": "source_chain",
                    "type": "bytes",
                    "indexed": true
                },
                {
                    "name": "transaction_hash",
                    "type": "bytes",
                    "indexed": true
                },
                {
                    "name": "token_id",
                    "type": "TokenIdentifier",
                    "indexed": true
                },
                {
                    "name": "nonce",
                    "type": "u64",
                    "indexed": true
                },
                {
                    "name": "amt",
                    "type": "BigUint",
                    "indexed": true
                },
                {
                    "name": "nft_type",
                    "type": "bytes",
                    "indexed": true
                }
            ]
        },
        {
            "identifier": "RewardValidator",
            "inputs": [
                {
                    "name": "validator",
                    "type": "Address",
                    "indexed": true
                }
            ]
        }
    ],
    "esdtAttributes": [],
    "hasCallback": true,
    "types": {
        "ClaimData": {
            "type": "struct",
            "fields": [
                {
                    "name": "token_id",
                    "type": "bytes"
                },
                {
                    "name": "source_chain",
                    "type": "bytes"
                },
                {
                    "name": "destination_chain",
                    "type": "bytes"
                },
                {
                    "name": "destination_user_address",
                    "type": "Address"
                },
                {
                    "name": "source_nft_contract_address",
                    "type": "bytes"
                },
                {
                    "name": "name",
                    "type": "bytes"
                },
                {
                    "name": "symbol",
                    "type": "bytes"
                },
                {
                    "name": "royalty",
                    "type": "BigUint"
                },
                {
                    "name": "royalty_receiver",
                    "type": "Address"
                },
                {
                    "name": "attrs",
                    "type": "bytes"
                },
                {
                    "name": "transaction_hash",
                    "type": "bytes"
                },
                {
                    "name": "token_amount",
                    "type": "BigUint"
                },
                {
                    "name": "nft_type",
                    "type": "bytes"
                },
                {
                    "name": "fee",
                    "type": "BigUint"
                },
                {
                    "name": "lock_tx_chain",
                    "type": "bytes"
                },
                {
                    "name": "img_uri",
                    "type": "bytes"
                }
            ]
        },
        "ContractInfo": {
            "type": "struct",
            "fields": [
                {
                    "name": "chain",
                    "type": "bytes"
                },
                {
                    "name": "address",
                    "type": "bytes"
                }
            ]
        },
        "SignatureInfo": {
            "type": "struct",
            "fields": [
                {
                    "name": "public_key",
                    "type": "Address"
                },
                {
                    "name": "sig",
                    "type": "bytes"
                }
            ]
        },
        "TokenInfo": {
            "type": "struct",
            "fields": [
                {
                    "name": "token_id",
                    "type": "u64"
                },
                {
                    "name": "chain",
                    "type": "bytes"
                },
                {
                    "name": "contract_address",
                    "type": "bytes"
                }
            ]
        },
        "Validator": {
            "type": "struct",
            "fields": [
                {
                    "name": "added",
                    "type": "bool"
                },
                {
                    "name": "pending_reward",
                    "type": "BigUint"
                }
            ]
        }
    }
};
exports.default = multiversXBridgeABI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGl2ZXJzWEJyaWRnZUFCSS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cmFjdHNUeXBlcy9tdWx0aXZlcnN4L211bHRpdmVyc1hCcmlkZ2VBQkkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLG1CQUFtQixHQUFHO0lBQ3hCLFdBQVcsRUFBRTtRQUNULE9BQU8sRUFBRTtZQUNMLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFlBQVksRUFBRSwwQ0FBMEM7WUFDeEQsWUFBWSxFQUFFLFlBQVk7WUFDMUIsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFLHFDQUFxQztTQUNqRDtRQUNELGVBQWUsRUFBRTtZQUNiLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLFNBQVMsRUFBRSxPQUFPO1NBQ3JCO1FBQ0QsV0FBVyxFQUFFO1lBQ1QsTUFBTSxFQUFFLGVBQWU7WUFDdkIsU0FBUyxFQUFFLFFBQVE7U0FDdEI7S0FDSjtJQUNELE1BQU0sRUFBRSxnQkFBZ0I7SUFDeEIsYUFBYSxFQUFFO1FBQ1gsUUFBUSxFQUFFO1lBQ047Z0JBQ0ksTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLE1BQU0sRUFBRSxTQUFTO2FBQ3BCO1NBQ0o7UUFDRCxTQUFTLEVBQUUsRUFBRTtLQUNoQjtJQUNELFdBQVcsRUFBRTtRQUNUO1lBQ0ksTUFBTSxFQUFFLFFBQVE7WUFDaEIsWUFBWSxFQUFFLFVBQVU7WUFDeEIsUUFBUSxFQUFFLEVBQUU7WUFDWixTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksTUFBTSxFQUFFLHNDQUFzQztvQkFDOUMsY0FBYyxFQUFFLElBQUk7aUJBQ3ZCO2FBQ0o7U0FDSjtRQUNEO1lBQ0ksTUFBTSxFQUFFLFlBQVk7WUFDcEIsWUFBWSxFQUFFLFVBQVU7WUFDeEIsUUFBUSxFQUFFO2dCQUNOO29CQUNJLE1BQU0sRUFBRSxTQUFTO29CQUNqQixNQUFNLEVBQUUsU0FBUztpQkFDcEI7YUFDSjtZQUNELFNBQVMsRUFBRTtn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