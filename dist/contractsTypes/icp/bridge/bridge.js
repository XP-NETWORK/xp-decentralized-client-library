"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.idlFactory = void 0;
//@ts-nocheck generated code cope
const idlFactory = ({ IDL }) => {
    const AddValidator = IDL.Record({
        'principal': IDL.Principal,
        'public_key': IDL.Text,
    });
    const SignerAndSignature = IDL.Record({
        'signature': IDL.Text,
        'signer': IDL.Text,
    });
    const BlacklistValidator = IDL.Record({
        'principal': IDL.Principal,
        'public_key': IDL.Text,
    });
    const ClaimData = IDL.Record({
        'fee': IDL.Nat64,
        'source_chain': IDL.Text,
        'lock_tx_chain': IDL.Text,
        'transaction_hash': IDL.Text,
        'token_amount': IDL.Nat,
        'destination_chain': IDL.Text,
        'token_id': IDL.Nat,
        'source_nft_contract_address': IDL.Text,
        'metadata': IDL.Text,
        'name': IDL.Text,
        'nft_type': IDL.Text,
        'royalty': IDL.Nat,
        'royalty_receiver': IDL.Principal,
        'destination_user_address': IDL.Principal,
        'symbol': IDL.Text,
    });
    const ClaimedEvent = IDL.Record({
        'source_chain': IDL.Text,
        'lock_tx_chain': IDL.Text,
        'transaction_hash': IDL.Text,
        'token_id': IDL.Nat,
        'nft_contract': IDL.Principal,
    });
    const LockedEvent = IDL.Record({
        'source_chain': IDL.Text,
        'token_amount': IDL.Nat,
        'destination_chain': IDL.Text,
        'token_id': IDL.Nat,
        'source_nft_contract_address': IDL.Principal,
        'nft_type': IDL.Text,
        'destination_user_address': IDL.Text,
    });
    const Validator = IDL.Record({
        'address': IDL.Principal,
        'pending_rewards': IDL.Nat64,
    });
    const XPBridge = IDL.Service({
        'acceptCycles': IDL.Func([], [], []),
        'add_validator': IDL.Func([AddValidator, IDL.Vec(SignerAndSignature)], [], []),
        'availableCycles': IDL.Func([], [IDL.Nat], ['query']),
        'blacklist_validator': IDL.Func([BlacklistValidator, IDL.Vec(SignerAndSignature)], [], []),
        'claim_nft': IDL.Func([ClaimData, IDL.Vec(SignerAndSignature)], [IDL.Text], []),
        'claim_validator_rewards': IDL.Func([IDL.Text], [IDL.Nat64, IDL.Nat64], []),
        'encode_add_validator': IDL.Func([AddValidator], [IDL.Vec(IDL.Nat8)], ['query']),
        'encode_blacklist_validator': IDL.Func([BlacklistValidator], [IDL.Vec(IDL.Nat8)], ['query']),
        'encode_claim_data': IDL.Func([ClaimData], [IDL.Vec(IDL.Nat8)], ['query']),
        'get_blacklisted_validators': IDL.Func([IDL.Text], [IDL.Opt(IDL.Bool)], ['query']),
        'get_claimed_data': IDL.Func([IDL.Text], [IDL.Opt(ClaimedEvent)], ['query']),
        'get_locked_data': IDL.Func([IDL.Text], [IDL.Opt(LockedEvent)], ['query']),
        'get_validator': IDL.Func([IDL.Text], [IDL.Opt(Validator)], ['query']),
        'get_validator_count': IDL.Func([], [IDL.Nat], ['query']),
        'init': IDL.Func([], [], []),
        'lock_nft': IDL.Func([IDL.Principal, IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    });
    return XPBridge;
};
exports.idlFactory = idlFactory;
const init = ({ IDL }) => {
    return [
        IDL.Record({
            'storage_deployer': IDL.Principal,
            'collection_deployer': IDL.Principal,
            'chain_type': IDL.Text,
            'validators': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal)),
        }),
    ];
};
exports.init = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL2ljcC9icmlkZ2UvYnJpZGdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFpQztBQUMxQixNQUFNLFVBQVUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtJQUNwQyxNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQzlCLFdBQVcsRUFBRyxHQUFHLENBQUMsU0FBUztRQUMzQixZQUFZLEVBQUcsR0FBRyxDQUFDLElBQUk7S0FDeEIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3BDLFdBQVcsRUFBRyxHQUFHLENBQUMsSUFBSTtRQUN0QixRQUFRLEVBQUcsR0FBRyxDQUFDLElBQUk7S0FDcEIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3BDLFdBQVcsRUFBRyxHQUFHLENBQUMsU0FBUztRQUMzQixZQUFZLEVBQUcsR0FBRyxDQUFDLElBQUk7S0FDeEIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUMzQixLQUFLLEVBQUcsR0FBRyxDQUFDLEtBQUs7UUFDakIsY0FBYyxFQUFHLEdBQUcsQ0FBQyxJQUFJO1FBQ3pCLGVBQWUsRUFBRyxHQUFHLENBQUMsSUFBSTtRQUMxQixrQkFBa0IsRUFBRyxHQUFHLENBQUMsSUFBSTtRQUM3QixjQUFjLEVBQUcsR0FBRyxDQUFDLEdBQUc7UUFDeEIsbUJBQW1CLEVBQUcsR0FBRyxDQUFDLElBQUk7UUFDOUIsVUFBVSxFQUFHLEdBQUcsQ0FBQyxHQUFHO1FBQ3BCLDZCQUE2QixFQUFHLEdBQUcsQ0FBQyxJQUFJO1FBQ3hDLFVBQVUsRUFBRyxHQUFHLENBQUMsSUFBSTtRQUNyQixNQUFNLEVB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