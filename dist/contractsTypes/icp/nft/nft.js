"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icrc7_args = exports.icrc37_args = exports.icrc3_args = exports.init = exports.idlFactory = void 0;
//@ts-nocheck generated code cope
const candid_1 = require("@dfinity/candid");
const idlFactory = ({ IDL }) => {
    const ArchivedTransactionResponse = IDL.Rec();
    const Value__1 = IDL.Rec();
    const Value__2 = IDL.Rec();
    const IndexType = IDL.Variant({
        Stable: IDL.Null,
        StableTyped: IDL.Null,
        Managed: IDL.Null,
    });
    const BlockType = IDL.Record({ url: IDL.Text, block_type: IDL.Text });
    const InitArgs__2 = IDL.Record({
        maxRecordsToArchive: IDL.Nat,
        archiveIndexType: IndexType,
        maxArchivePages: IDL.Nat,
        settleToRecords: IDL.Nat,
        archiveCycles: IDL.Nat,
        maxActiveRecords: IDL.Nat,
        maxRecordsInArchiveInstance: IDL.Nat,
        archiveControllers: IDL.Opt(IDL.Opt(IDL.Vec(IDL.Principal))),
        supportedBlocks: IDL.Vec(BlockType),
    });
    const InitArgs__1 = IDL.Opt(InitArgs__2);
    const InitArgs = IDL.Opt(IDL.Record({
        deployer: IDL.Principal,
        max_approvals: IDL.Opt(IDL.Nat),
        max_approvals_per_token_or_collection: IDL.Opt(IDL.Nat),
        settle_to_approvals: IDL.Opt(IDL.Nat),
        max_revoke_approvals: IDL.Opt(IDL.Nat),
        collection_approval_requires_token: IDL.Opt(IDL.Bool),
    }));
    const Subaccount = IDL.Vec(IDL.Nat8);
    const Account = IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(Subaccount),
    });
    const SupportedStandards = IDL.Vec(IDL.Record({ url: IDL.Text, name: IDL.Text }));
    const InitArgs__3 = IDL.Opt(IDL.Record({
        deployer: IDL.Principal,
        allow_transfers: IDL.Opt(IDL.Bool),
        supply_cap: IDL.Opt(IDL.Nat),
        tx_window: IDL.Opt(IDL.Nat),
        burn_account: IDL.Opt(Account),
        default_take_value: IDL.Opt(IDL.Nat),
        logo: IDL.Opt(IDL.Text),
        permitted_drift: IDL.Opt(IDL.Nat),
        name: IDL.Opt(IDL.Text),
        description: IDL.Opt(IDL.Text),
        max_take_value: IDL.Opt(IDL.Nat),
        max_update_batch_size: IDL.Opt(IDL.Nat),
        max_query_batch_size: IDL.Opt(IDL.Nat),
        max_memo_size: IDL.Opt(IDL.Nat),
        supported_standards: IDL.Opt(SupportedStandards),
        symbol: IDL.Opt(IDL.Text),
    }));
    const Tip = IDL.Record({
        last_block_index: IDL.Vec(IDL.Nat8),
        hash_tree: IDL.Vec(IDL.Nat8),
        last_block_hash: IDL.Vec(IDL.Nat8),
    });
    const SupportedStandards__1 = IDL.Vec(IDL.Record({ url: IDL.Text, name: IDL.Text }));
    const Subaccount__1 = IDL.Vec(IDL.Nat8);
    const Account__4 = IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(Subaccount__1),
    });
    const ApprovalInfo = IDL.Record({
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
        expires_at: IDL.Opt(IDL.Nat64),
        spender: Account__4,
    });
    const ApproveCollectionArg = IDL.Record({ approval_info: ApprovalInfo });
    const ApproveCollectionError = IDL.Variant({
        GenericError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
        InvalidSpender: IDL.Null,
        CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
        GenericBatchError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        TooOld: IDL.Null,
    });
    const ApproveCollectionResult = IDL.Variant({
        Ok: IDL.Nat,
        Err: ApproveCollectionError,
    });
    const ApproveTokenArg = IDL.Record({
        token_id: IDL.Nat,
        approval_info: ApprovalInfo,
    });
    const ApproveTokenError = IDL.Variant({
        GenericError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
        InvalidSpender: IDL.Null,
        NonExistingTokenId: IDL.Null,
        Unauthorized: IDL.Null,
        CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
        GenericBatchError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        TooOld: IDL.Null,
    });
    const ApproveTokenResult = IDL.Variant({
        Ok: IDL.Nat,
        Err: ApproveTokenError,
    });
    const Account__3 = IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(Subaccount),
    });
    const CollectionApproval = IDL.Record({
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
        expires_at: IDL.Opt(IDL.Nat64),
        spender: Account__4,
    });
    const TokenApproval = IDL.Record({
        token_id: IDL.Nat,
        approval_info: ApprovalInfo,
    });
    const IsApprovedArg = IDL.Record({
        token_id: IDL.Nat,
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        spender: Account__4,
    });
    const RevokeCollectionApprovalArg = IDL.Record({
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
        spender: IDL.Opt(Account__4),
    });
    const RevokeCollectionApprovalError = IDL.Variant({
        GenericError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
        Unauthorized: IDL.Null,
        CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
        ApprovalDoesNotExist: IDL.Null,
        GenericBatchError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        TooOld: IDL.Null,
    });
    const RevokeCollectionApprovalResult = IDL.Variant({
        Ok: IDL.Nat,
        Err: RevokeCollectionApprovalError,
    });
    const RevokeTokenApprovalArg = IDL.Record({
        token_id: IDL.Nat,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
        spender: IDL.Opt(Account__4),
    });
    const RevokeTokenApprovalError = IDL.Variant({
        GenericError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
        NonExistingTokenId: IDL.Null,
        Unauthorized: IDL.Null,
        CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
        ApprovalDoesNotExist: IDL.Null,
        GenericBatchError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        TooOld: IDL.Null,
    });
    const RevokeTokenApprovalResult = IDL.Variant({
        Ok: IDL.Nat,
        Err: RevokeTokenApprovalError,
    });
    const TransferFromArg = IDL.Record({
        to: Account__4,
        spender_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        token_id: IDL.Nat,
        from: Account__4,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
    });
    const TransferFromError = IDL.Variant({
        GenericError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
        NonExistingTokenId: IDL.Null,
        Unauthorized: IDL.Null,
        CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
        InvalidRecipient: IDL.Null,
        GenericBatchError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        TooOld: IDL.Null,
    });
    const TransferFromResult = IDL.Variant({
        Ok: IDL.Nat,
        Err: TransferFromError,
    });
    const GetArchivesArgs = IDL.Record({ from: IDL.Opt(IDL.Principal) });
    const GetArchivesResultItem = IDL.Record({
        end: IDL.Nat,
        canister_id: IDL.Principal,
        start: IDL.Nat,
    });
    const GetArchivesResult = IDL.Vec(GetArchivesResultItem);
    const TransactionRange = IDL.Record({
        start: IDL.Nat,
        length: IDL.Nat,
    });
    Value__2.fill(IDL.Variant({
        Int: IDL.Int,
        Map: IDL.Vec(IDL.Tuple(IDL.Text, Value__2)),
        Nat: IDL.Nat,
        Blob: IDL.Vec(IDL.Nat8),
        Text: IDL.Text,
        Array: IDL.Vec(Value__2),
    }));
    const TransactionRange__1 = IDL.Record({
        start: IDL.Nat,
        length: IDL.Nat,
    });
    const GetTransactionsResult__1 = IDL.Record({
        log_length: IDL.Nat,
        blocks: IDL.Vec(IDL.Record({ id: IDL.Nat, block: Value__2 })),
        archived_blocks: IDL.Vec(ArchivedTransactionResponse),
    });
    const GetTransactionsFn = IDL.Func([IDL.Vec(TransactionRange__1)], [GetTransactionsResult__1], ["query"]);
    ArchivedTransactionResponse.fill(IDL.Record({
        args: IDL.Vec(TransactionRange__1),
        callback: GetTransactionsFn,
    }));
    const GetTransactionsResult = IDL.Record({
        log_length: IDL.Nat,
        blocks: IDL.Vec(IDL.Record({ id: IDL.Nat, block: Value__2 })),
        archived_blocks: IDL.Vec(ArchivedTransactionResponse),
    });
    const DataCertificate = IDL.Record({
        certificate: IDL.Vec(IDL.Nat8),
        hash_tree: IDL.Vec(IDL.Nat8),
    });
    const BlockType__1 = IDL.Record({
        url: IDL.Text,
        block_type: IDL.Text,
    });
    const Account__2 = IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    });
    const BalanceOfRequest = IDL.Vec(Account__2);
    const BalanceOfResponse = IDL.Vec(IDL.Nat);
    Value__1.fill(IDL.Variant({
        Int: IDL.Int,
        Map: IDL.Vec(IDL.Tuple(IDL.Text, Value__1)),
        Nat: IDL.Nat,
        Blob: IDL.Vec(IDL.Nat8),
        Text: IDL.Text,
        Array: IDL.Vec(Value__1),
    }));
    const Value = IDL.Variant({
        Int: IDL.Int,
        Map: IDL.Vec(IDL.Tuple(IDL.Text, Value__1)),
        Nat: IDL.Nat,
        Blob: IDL.Vec(IDL.Nat8),
        Text: IDL.Text,
        Array: IDL.Vec(Value__1),
    });
    const OwnerOfRequest = IDL.Vec(IDL.Nat);
    const OwnerOfResponse = IDL.Vec(IDL.Opt(Account__2));
    const TransferArgs = IDL.Record({
        to: Account__2,
        token_id: IDL.Nat,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64),
    });
    const TransferError = IDL.Variant({
        GenericError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
        NonExistingTokenId: IDL.Null,
        Unauthorized: IDL.Null,
        CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
        InvalidRecipient: IDL.Null,
        GenericBatchError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        TooOld: IDL.Null,
    });
    const TransferResult = IDL.Variant({ Ok: IDL.Nat, Err: TransferError });
    const Account__1 = IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(Subaccount),
    });
    const SetNFTError = IDL.Variant({
        GenericError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        TokenExists: IDL.Null,
        NonExistingTokenId: IDL.Null,
        CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
        TooOld: IDL.Null,
    });
    const SetNFTResult = IDL.Variant({
        Ok: IDL.Opt(IDL.Nat),
        Err: SetNFTError,
        GenericError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
    });
    const NFT = IDL.Service({
        get_tip: IDL.Func([], [Tip], ["query"]),
        icrc10_supported_standards: IDL.Func([], [SupportedStandards__1], ["query"]),
        icrc37_approve_collection: IDL.Func([IDL.Vec(ApproveCollectionArg)], [IDL.Vec(IDL.Opt(ApproveCollectionResult))], []),
        icrc37_approve_tokens: IDL.Func([IDL.Vec(ApproveTokenArg)], [IDL.Vec(IDL.Opt(ApproveTokenResult))], []),
        icrc37_get_collection_approvals: IDL.Func([Account__3, IDL.Opt(CollectionApproval), IDL.Opt(IDL.Nat)], [IDL.Vec(CollectionApproval)], ["query"]),
        icrc37_get_token_approvals: IDL.Func([IDL.Vec(IDL.Nat), IDL.Opt(TokenApproval), IDL.Opt(IDL.Nat)], [IDL.Vec(TokenApproval)], ["query"]),
        icrc37_is_approved: IDL.Func([IDL.Vec(IsApprovedArg)], [IDL.Vec(IDL.Bool)], ["query"]),
        icrc37_max_approvals_per_token_or_collection: IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
        icrc37_max_revoke_approvals: IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
        icrc37_revoke_collection_approvals: IDL.Func([IDL.Vec(RevokeCollectionApprovalArg)], [IDL.Vec(IDL.Opt(RevokeCollectionApprovalResult))], []),
        icrc37_revoke_token_approvals: IDL.Func([IDL.Vec(RevokeTokenApprovalArg)], [IDL.Vec(IDL.Opt(RevokeTokenApprovalResult))], []),
        icrc37_transfer_from: IDL.Func([IDL.Vec(TransferFromArg)], [IDL.Vec(IDL.Opt(TransferFromResult))], []),
        icrc3_get_archives: IDL.Func([GetArchivesArgs], [GetArchivesResult], ["query"]),
        icrc3_get_blocks: IDL.Func([IDL.Vec(TransactionRange)], [GetTransactionsResult], ["query"]),
        icrc3_get_tip_certificate: IDL.Func([], [IDL.Opt(DataCertificate)], ["query"]),
        icrc3_supported_block_types: IDL.Func([], [IDL.Vec(BlockType__1)], ["query"]),
        icrc7_atomic_batch_transfers: IDL.Func([], [IDL.Opt(IDL.Bool)], ["query"]),
        icrc7_balance_of: IDL.Func([BalanceOfRequest], [BalanceOfResponse], ["query"]),
        icrc7_collection_metadata: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, Value))], ["query"]),
        icrc7_default_take_value: IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
        icrc7_description: IDL.Func([], [IDL.Opt(IDL.Text)], ["query"]),
        icrc7_logo: IDL.Func([], [IDL.Opt(IDL.Text)], ["query"]),
        icrc7_max_memo_size: IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
        icrc7_max_query_batch_size: IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
        icrc7_max_take_value: IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
        icrc7_max_update_batch_size: IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
        icrc7_name: IDL.Func([], [IDL.Text], ["query"]),
        icrc7_owner_of: IDL.Func([OwnerOfRequest], [OwnerOfResponse], ["query"]),
        icrc7_permitted_drift: IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
        icrc7_supply_cap: IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
        icrc7_symbol: IDL.Func([], [IDL.Text], ["query"]),
        icrc7_token_metadata: IDL.Func([IDL.Vec(IDL.Nat)], [IDL.Vec(IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, Value))))], ["query"]),
        icrc7_tokens: IDL.Func([IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)], [IDL.Vec(IDL.Nat)], ["query"]),
        icrc7_tokens_of: IDL.Func([Account__3, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)], [IDL.Vec(IDL.Nat)], ["query"]),
        icrc7_total_supply: IDL.Func([], [IDL.Nat], ["query"]),
        icrc7_transfer: IDL.Func([IDL.Vec(TransferArgs)], [IDL.Vec(IDL.Opt(TransferResult))], []),
        icrc7_tx_window: IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
        icrcX_mint: IDL.Func([IDL.Nat, Account__1, IDL.Text], [IDL.Vec(SetNFTResult)], []),
        init: IDL.Func([], [], []),
    });
    return NFT;
};
exports.idlFactory = idlFactory;
const init = ({ IDL }) => {
    const IndexType = IDL.Variant({
        Stable: IDL.Null,
        StableTyped: IDL.Null,
        Managed: IDL.Null,
    });
    const BlockType = IDL.Record({ url: IDL.Text, block_type: IDL.Text });
    const InitArgs__2 = IDL.Record({
        maxRecordsToArchive: IDL.Nat,
        archiveIndexType: IndexType,
        maxArchivePages: IDL.Nat,
        settleToRecords: IDL.Nat,
        archiveCycles: IDL.Nat,
        maxActiveRecords: IDL.Nat,
        maxRecordsInArchiveInstance: IDL.Nat,
        archiveControllers: IDL.Opt(IDL.Opt(IDL.Vec(IDL.Principal))),
        supportedBlocks: IDL.Vec(BlockType),
    });
    const InitArgs__1 = IDL.Opt(InitArgs__2);
    const InitArgs = IDL.Opt(IDL.Record({
        deployer: IDL.Principal,
        max_approvals: IDL.Opt(IDL.Nat),
        max_approvals_per_token_or_collection: IDL.Opt(IDL.Nat),
        settle_to_approvals: IDL.Opt(IDL.Nat),
        max_revoke_approvals: IDL.Opt(IDL.Nat),
        collection_approval_requires_token: IDL.Opt(IDL.Bool),
    }));
    const Subaccount = IDL.Vec(IDL.Nat8);
    const Account = IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(Subaccount),
    });
    const SupportedStandards = IDL.Vec(IDL.Record({ url: IDL.Text, name: IDL.Text }));
    const InitArgs__3 = IDL.Opt(IDL.Record({
        deployer: IDL.Principal,
        allow_transfers: IDL.Opt(IDL.Bool),
        supply_cap: IDL.Opt(IDL.Nat),
        tx_window: IDL.Opt(IDL.Nat),
        burn_account: IDL.Opt(Account),
        default_take_value: IDL.Opt(IDL.Nat),
        logo: IDL.Opt(IDL.Text),
        permitted_drift: IDL.Opt(IDL.Nat),
        name: IDL.Opt(IDL.Text),
        description: IDL.Opt(IDL.Text),
        max_take_value: IDL.Opt(IDL.Nat),
        max_update_batch_size: IDL.Opt(IDL.Nat),
        max_query_batch_size: IDL.Opt(IDL.Nat),
        max_memo_size: IDL.Opt(IDL.Nat),
        supported_standards: IDL.Opt(SupportedStandards),
        symbol: IDL.Opt(IDL.Text),
    }));
    return [
        IDL.Record({
            icrc3_args: InitArgs__1,
            icrc37_args: IDL.Opt(InitArgs),
            icrc7_args: IDL.Opt(InitArgs__3),
        }),
    ];
};
exports.init = init;
const IndexType = candid_1.IDL.Variant({
    Stable: candid_1.IDL.Null,
    StableTyped: candid_1.IDL.Null,
    Managed: candid_1.IDL.Null,
});
const BlockType = candid_1.IDL.Record({ url: candid_1.IDL.Text, block_type: candid_1.IDL.Text });
const InitArgs__2 = candid_1.IDL.Record({
    maxRecordsToArchive: candid_1.IDL.Nat,
    archiveIndexType: IndexType,
    maxArchivePages: candid_1.IDL.Nat,
    settleToRecords: candid_1.IDL.Nat,
    archiveCycles: candid_1.IDL.Nat,
    maxActiveRecords: candid_1.IDL.Nat,
    maxRecordsInArchiveInstance: candid_1.IDL.Nat,
    archiveControllers: candid_1.IDL.Opt(candid_1.IDL.Opt(candid_1.IDL.Vec(candid_1.IDL.Principal))),
    supportedBlocks: candid_1.IDL.Vec(BlockType),
});
const InitArgs__1 = candid_1.IDL.Opt(InitArgs__2);
const InitArgs = candid_1.IDL.Opt(candid_1.IDL.Record({
    deployer: candid_1.IDL.Principal,
    max_approvals: candid_1.IDL.Opt(candid_1.IDL.Nat),
    max_approvals_per_token_or_collection: candid_1.IDL.Opt(candid_1.IDL.Nat),
    settle_to_approvals: candid_1.IDL.Opt(candid_1.IDL.Nat),
    max_revoke_approvals: candid_1.IDL.Opt(candid_1.IDL.Nat),
    collection_approval_requires_token: candid_1.IDL.Opt(candid_1.IDL.Bool),
}));
const Subaccount = candid_1.IDL.Vec(candid_1.IDL.Nat8);
const Account = candid_1.IDL.Record({
    owner: candid_1.IDL.Principal,
    subaccount: candid_1.IDL.Opt(Subaccount),
});
const SupportedStandards = candid_1.IDL.Vec(candid_1.IDL.Record({ url: candid_1.IDL.Text, name: candid_1.IDL.Text }));
const InitArgs__3 = candid_1.IDL.Opt(candid_1.IDL.Record({
    deployer: candid_1.IDL.Principal,
    allow_transfers: candid_1.IDL.Opt(candid_1.IDL.Bool),
    supply_cap: candid_1.IDL.Opt(candid_1.IDL.Nat),
    tx_window: candid_1.IDL.Opt(candid_1.IDL.Nat),
    burn_account: candid_1.IDL.Opt(Account),
    default_take_value: candid_1.IDL.Opt(candid_1.IDL.Nat),
    logo: candid_1.IDL.Opt(candid_1.IDL.Text),
    permitted_drift: candid_1.IDL.Opt(candid_1.IDL.Nat),
    name: candid_1.IDL.Opt(candid_1.IDL.Text),
    description: candid_1.IDL.Opt(candid_1.IDL.Text),
    max_take_value: candid_1.IDL.Opt(candid_1.IDL.Nat),
    max_update_batch_size: candid_1.IDL.Opt(candid_1.IDL.Nat),
    max_query_batch_size: candid_1.IDL.Opt(candid_1.IDL.Nat),
    max_memo_size: candid_1.IDL.Opt(candid_1.IDL.Nat),
    supported_standards: candid_1.IDL.Opt(SupportedStandards),
    symbol: candid_1.IDL.Opt(candid_1.IDL.Text),
}));
function icrc3_args({ IDL }) {
    return InitArgs__1;
}
exports.icrc3_args = icrc3_args;
function icrc37_args({ IDL }) {
    return IDL.Opt(InitArgs);
}
exports.icrc37_args = icrc37_args;
function icrc7_args({ IDL }) {
    return IDL.Opt(InitArgs__3);
}
exports.icrc7_args = icrc7_args;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmZ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL2ljcC9uZnQvbmZ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFpQztBQUNqQyw0Q0FBc0M7QUFHL0IsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7SUFDcEMsTUFBTSwyQkFBMkIsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDOUMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNCLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMzQixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQzVCLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSTtRQUNoQixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUk7UUFDckIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJO0tBQ2xCLENBQUMsQ0FBQztJQUNILE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdEUsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUM3QixtQkFBbUIsRUFBRSxHQUFHLENBQUMsR0FBRztRQUM1QixnQkFBZ0IsRUFBRSxTQUFTO1FBQzNCLGVBQWUsRUFBRSxHQUFHLENBQUMsR0FBRztRQUN4QixlQUFlLEVBQUUsR0FBRyxDQUFDLEdBQUc7UUFDeEIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxHQUFHO1FBQ3RCLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxHQUFHO1FBQ3pCLDJCQUEyQixFQUFFLEdBQUcsQ0FBQyxHQUFHO1FBQ3BDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxHQUFH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