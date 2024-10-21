export declare const ABI: (address: string) => {
    readonly address: string;
    readonly name: "aptos_nft_bridge";
    readonly friends: readonly [];
    readonly exposed_functions: readonly [{
        readonly name: "add_validator";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["vector<u8>", "vector<vector<u8>>", "vector<vector<u8>>"];
        readonly return: readonly [];
    }, {
        readonly name: "blacklist_validator";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["vector<u8>", "vector<vector<u8>>", "vector<vector<u8>>"];
        readonly return: readonly [];
    }, {
        readonly name: "claim_1155";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer", "address", "0x1::string::String", "0x1::string::String", "u64", "address", "u64", "vector<vector<u8>>", "vector<vector<u8>>", "vector<u8>", "vector<u8>", "vector<u8>", "u256", "vector<u8>", "vector<u8>", "0x1::string::String", "0x1::string::String", "u64"];
        readonly return: readonly [];
    }, {
        readonly name: "claim_721";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer", "address", "0x1::string::String", "0x1::string::String", "u64", "address", "u64", "vector<vector<u8>>", "vector<vector<u8>>", "vector<u8>", "vector<u8>", "vector<u8>", "u256", "vector<u8>", "vector<u8>", "0x1::string::String", "0x1::string::String"];
        readonly return: readonly [];
    }, {
        readonly name: "claim_validator_rewards";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["signer", "address", "vector<u8>"];
        readonly return: readonly [];
    }, {
        readonly name: "has_validator";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["vector<u8>"];
        readonly return: readonly ["bool"];
    }, {
        readonly name: "initialize";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer", "vector<vector<u8>>", "vector<u8>", "vector<u8>"];
        readonly return: readonly [];
    }, {
        readonly name: "lock_1155";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer", "address", "vector<u8>", "0x1::string::String", "address", "u64", "0x1::string::String"];
        readonly return: readonly [];
    }, {
        readonly name: "lock_721";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer", "address", "vector<u8>", "0x1::string::String", "address", "0x1::string::String"];
        readonly return: readonly [];
    }, {
        readonly name: "owns_nft";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["address", "0x1::string::String", "0x1::string::String"];
        readonly return: readonly ["bool"];
    }, {
        readonly name: "token_id_from_nonce_and_collection";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["u256", "vector<u8>"];
        readonly return: readonly ["address"];
    }, {
        readonly name: "validator_count";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [];
        readonly params: readonly [];
        readonly return: readonly ["u64"];
    }];
    readonly structs: readonly [{
        readonly name: "AddNewValidatorEvent";
        readonly is_native: false;
        readonly is_event: true;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "validator";
            readonly type: "vector<u8>";
        }];
    }, {
        readonly name: "BlacklistValidatorEvent";
        readonly is_native: false;
        readonly is_event: true;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "validator";
            readonly type: "vector<u8>";
        }];
    }, {
        readonly name: "Bridge";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["key"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "validators";
            readonly type: "0x1::simple_map::SimpleMap<vector<u8>, 0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::Validator>";
        }, {
            readonly name: "signer_cap";
            readonly type: "0x1::account::SignerCapability";
        }, {
            readonly name: "collection_objects";
            readonly type: "0x1::table::Table<0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::CollectionObject, u256>";
        }, {
            readonly name: "nfts_counter";
            readonly type: "u64";
        }, {
            readonly name: "original_to_duplicate_mapping";
            readonly type: "0x1::table::Table<0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::OriginalToDuplicateKey, 0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::OriginalToDuplicateInfo>";
        }, {
            readonly name: "duplicate_to_original_mapping";
            readonly type: "0x1::table::Table<0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::DuplicateToOriginalKey, 0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::DuplicateToOriginalInfo>";
        }, {
            readonly name: "nft_collection_tokens";
            readonly type: "0x1::simple_map::SimpleMap<0x13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9::aptos_nft_bridge::CollectionNftObject, address>";
        }, {
            readonly name: "nft_collections_counter";
            readonly type: "0x1::simple_map::SimpleMap<address, u256>";
        }, {
            readonly name: "self_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "blacklisted_validators";
            readonly type: "0x1::simple_map::SimpleMap<vector<u8>, bool>";
        }];
    }, {
        readonly name: "Claim1155Event";
        readonly is_native: false;
        readonly is_event: true;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "source_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "token_id";
            readonly type: "u256";
        }, {
            readonly name: "amount";
            readonly type: "u64";
        }, {
            readonly name: "transaction_hash";
            readonly type: "vector<u8>";
        }, {
            readonly name: "nft_contract";
            readonly type: "vector<u8>";
        }];
    }, {
        readonly name: "Claim721Event";
        readonly is_native: false;
        readonly is_event: true;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "source_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "token_id";
            readonly type: "u256";
        }, {
            readonly name: "transaction_hash";
            readonly type: "vector<u8>";
        }, {
            readonly name: "nft_contract";
            readonly type: "vector<u8>";
        }];
    }, {
        readonly name: "ClaimData";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["copy", "drop"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "token_id";
            readonly type: "u256";
        }, {
            readonly name: "source_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "destination_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "user";
            readonly type: "address";
        }, {
            readonly name: "source_nft_contract_address";
            readonly type: "vector<u8>";
        }, {
            readonly name: "name";
            readonly type: "0x1::string::String";
        }, {
            readonly name: "royalty_percentage";
            readonly type: "u64";
        }, {
            readonly name: "royalty_payee_address";
            readonly type: "address";
        }, {
            readonly name: "metadata";
            readonly type: "0x1::string::String";
        }, {
            readonly name: "transaction_hash";
            readonly type: "vector<u8>";
        }, {
            readonly name: "token_amount";
            readonly type: "u256";
        }, {
            readonly name: "nft_type";
            readonly type: "vector<u8>";
        }, {
            readonly name: "fee";
            readonly type: "u64";
        }, {
            readonly name: "symbol";
            readonly type: "0x1::string::String";
        }];
    }, {
        readonly name: "CollectionNftObject";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["copy", "drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "collection_address";
            readonly type: "vector<u8>";
        }, {
            readonly name: "token_id";
            readonly type: "u256";
        }];
    }, {
        readonly name: "CollectionObject";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["copy", "drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "collection";
            readonly type: "address";
        }, {
            readonly name: "object";
            readonly type: "address";
        }];
    }, {
        readonly name: "DuplicateToOriginalInfo";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["copy", "drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "source_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "source_contract";
            readonly type: "vector<u8>";
        }];
    }, {
        readonly name: "DuplicateToOriginalKey";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["copy", "drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "self_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "collection_address";
            readonly type: "vector<u8>";
        }];
    }, {
        readonly name: "LockedEvent";
        readonly is_native: false;
        readonly is_event: true;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "token_id";
            readonly type: "u256";
        }, {
            readonly name: "destination_user_address";
            readonly type: "0x1::string::String";
        }, {
            readonly name: "token_amount";
            readonly type: "u64";
        }, {
            readonly name: "nft_type";
            readonly type: "vector<u8>";
        }, {
            readonly name: "destination_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "source_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "collection_address";
            readonly type: "vector<u8>";
        }, {
            readonly name: "token_address";
            readonly type: "address";
        }, {
            readonly name: "metadata_uri";
            readonly type: "0x1::string::String";
        }];
    }, {
        readonly name: "OriginalToDuplicateInfo";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["copy", "drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "self_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "collection_address";
            readonly type: "vector<u8>";
        }];
    }, {
        readonly name: "OriginalToDuplicateKey";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["copy", "drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "source_chain";
            readonly type: "vector<u8>";
        }, {
            readonly name: "source_contract";
            readonly type: "vector<u8>";
        }];
    }, {
        readonly name: "ProcessedClaims";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["key"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "claims";
            readonly type: "vector<vector<u8>>";
        }];
    }, {
        readonly name: "RewardValidatorEvent";
        readonly is_native: false;
        readonly is_event: true;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "validator";
            readonly type: "vector<u8>";
        }];
    }, {
        readonly name: "SignatureInfo";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["drop"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "public_key";
            readonly type: "vector<u8>";
        }, {
            readonly name: "signature";
            readonly type: "vector<u8>";
        }];
    }, {
        readonly name: "UnLock1155Event";
        readonly is_native: false;
        readonly is_event: true;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly name: "token_id";
            readonly type: "u256";
        }, {
            readonly name: "amount";
            readonly type: "u64";
        }];
    }, {
        readonly name: "UnLock721Event";
        readonly is_native: false;
        readonly is_event: true;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly name: "token_id";
            readonly type: "u256";
        }];
    }, {
        readonly name: "Validator";
        readonly is_native: false;
        readonly is_event: false;
        readonly abilities: readonly ["copy", "drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "pending_reward";
            readonly type: "u64";
        }];
    }];
};
//# sourceMappingURL=abi.d.ts.map