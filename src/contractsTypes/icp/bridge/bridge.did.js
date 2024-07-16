export const idlFactory = ({ IDL }) => {
  const SignerAndSignature = IDL.Record({
    'signature' : IDL.Text,
    'signer' : IDL.Text,
  });
  const ClaimData = IDL.Record({
    'fee' : IDL.Nat64,
    'source_chain' : IDL.Text,
    'transaction_hash' : IDL.Text,
    'token_amount' : IDL.Nat,
    'destination_chain' : IDL.Text,
    'token_id' : IDL.Nat,
    'source_nft_contract_address' : IDL.Text,
    'metadata' : IDL.Text,
    'name' : IDL.Text,
    'nft_type' : IDL.Text,
    'royalty' : IDL.Nat,
    'royalty_receiver' : IDL.Principal,
    'destination_user_address' : IDL.Principal,
    'symbol' : IDL.Text,
  });
  const ClaimedEvent = IDL.Record({
    'source_chain' : IDL.Text,
    'transaction_hash' : IDL.Text,
    'token_id' : IDL.Nat,
    'nft_contract' : IDL.Principal,
  });
  const LockedEvent = IDL.Record({
    'source_chain' : IDL.Text,
    'token_amount' : IDL.Nat,
    'destination_chain' : IDL.Text,
    'token_id' : IDL.Nat,
    'source_nft_contract_address' : IDL.Principal,
    'nft_type' : IDL.Text,
    'destination_user_address' : IDL.Text,
  });
  const XPBridge = IDL.Service({
    'add_validator' : IDL.Func(
        [IDL.Tuple(IDL.Text, IDL.Principal), IDL.Vec(SignerAndSignature)],
        [],
        [],
      ),
    'claim_nft' : IDL.Func(
        [ClaimData, IDL.Vec(SignerAndSignature)],
        [IDL.Text],
        [],
      ),
    'claim_validator_rewards' : IDL.Func(
        [IDL.Text, IDL.Vec(SignerAndSignature)],
        [],
        [],
      ),
    'get_claimed_data' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(ClaimedEvent)],
        ['query'],
      ),
    'get_locked_data' : IDL.Func([IDL.Text], [IDL.Opt(LockedEvent)], ['query']),
    'get_validator_count' : IDL.Func([], [IDL.Nat], ['query']),
    'init' : IDL.Func([], [], []),
    'lock_nft' : IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Text, IDL.Text],
        [IDL.Text],
        [],
      ),
  });
  return XPBridge;
};
export const init = ({ IDL }) => {
  return [
    IDL.Record({
      'storage_deployer' : IDL.Principal,
      'collection_deployer' : IDL.Principal,
      'chain_type' : IDL.Text,
      'validators' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal)),
    }),
  ];
};
