import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../evm/common";
export type SignerAndSignatureStruct = {
    signerAddress: string;
    signature: BytesLike;
};
export type SignerAndSignatureStructOutput = [
    signerAddress: string,
    signature: string
] & {
    signerAddress: string;
    signature: string;
};
export declare namespace HederaBridge {
    type ClaimDataStruct = {
        tokenId: BigNumberish;
        sourceChain: string;
        destinationChain: string;
        destinationUserAddress: AddressLike;
        sourceNftContractAddress: string;
        name: string;
        symbol: string;
        royalty: BigNumberish;
        royaltyReceiver: AddressLike;
        metadata: string;
        transactionHash: string;
        tokenAmount: BigNumberish;
        nftType: string;
        fee: BigNumberish;
        lockTxChain: string;
    };
    type ClaimDataStructOutput = [
        tokenId: bigint,
        sourceChain: string,
        destinationChain: string,
        destinationUserAddress: string,
        sourceNftContractAddress: string,
        name: string,
        symbol: string,
        royalty: bigint,
        royaltyReceiver: string,
        metadata: string,
        transactionHash: string,
        tokenAmount: bigint,
        nftType: string,
        fee: bigint,
        lockTxChain: string
    ] & {
        tokenId: bigint;
        sourceChain: string;
        destinationChain: string;
        destinationUserAddress: string;
        sourceNftContractAddress: string;
        name: string;
        symbol: string;
        royalty: bigint;
        royaltyReceiver: string;
        metadata: string;
        transactionHash: string;
        tokenAmount: bigint;
        nftType: string;
        fee: bigint;
        lockTxChain: string;
    };
}
export interface HederaBridgeInterface extends Interface {
    getFunction(nameOrSignature: "DEFAULT_EXPIRY" | "MAX_INT" | "addValidator" | "claimNFT721" | "claimValidatorRewards" | "duplicateStorageMapping721" | "duplicateToOriginalMapping" | "keyToValue" | "lock721" | "originalStorageMapping721" | "originalToDuplicateMapping" | "redirectForToken" | "selfChain" | "storageDeployer" | "transferFrom" | "transferFromNFT" | "uniqueIdentifier" | "validators" | "validatorsCount" | "valueToKey"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "AddNewValidator" | "CallResponseEvent" | "Claimed" | "Locked" | "LogHash" | "RewardValidator" | "UnLock721"): EventFragment;
    encodeFunctionData(functionFragment: "DEFAULT_EXPIRY", values?: undefined): string;
    encodeFunctionData(functionFragment: "MAX_INT", values?: undefined): string;
    encodeFunctionData(functionFragment: "addValidator", values: [AddressLike, SignerAndSignatureStruct[]]): string;
    encodeFunctionData(functionFragment: "claimNFT721", values: [HederaBridge.ClaimDataStruct, BytesLike[]]): string;
    encodeFunctionData(functionFragment: "claimValidatorRewards", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "duplicateStorageMapping721", values: [string, string]): string;
    encodeFunctionData(functionFragment: "duplicateToOriginalMapping", values: [AddressLike, string]): string;
    encodeFunctionData(functionFragment: "keyToValue", values: [string, string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "lock721", values: [BigNumberish, string, string, AddressLike, string]): string;
    encodeFunctionData(functionFragment: "originalStorageMapping721", values: [string, string]): string;
    encodeFunctionData(functionFragment: "originalToDuplicateMapping", values: [string, string]): string;
    encodeFunctionData(functionFragment: "redirectForToken", values: [AddressLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "selfChain", values?: undefined): string;
    encodeFunctionData(functionFragment: "storageDeployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferFrom", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "transferFromNFT", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "uniqueIdentifier", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "validators", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "validatorsCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "valueToKey", values: [string, string, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "DEFAULT_EXPIRY", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MAX_INT", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addValidator", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimNFT721", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimValidatorRewards", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "duplicateStorageMapping721", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "duplicateToOriginalMapping", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "keyToValue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lock721", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "originalStorageMapping721", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "originalToDuplicateMapping", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redirectForToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "selfChain", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "storageDeployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferFromNFT", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "uniqueIdentifier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validators", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validatorsCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "valueToKey", data: BytesLike): Result;
}
export declare namespace AddNewValidatorEvent {
    type InputTuple = [_validator: AddressLike];
    type OutputTuple = [_validator: string];
    interface OutputObject {
        _validator: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace CallResponseEventEvent {
    type InputTuple = [arg0: boolean, arg1: BytesLike];
    type OutputTuple = [arg0: boolean, arg1: string];
    interface OutputObject {
        arg0: boolean;
        arg1: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace ClaimedEvent {
    type InputTuple = [
        lockTxChain: string,
        sourceChain: string,
        transactionHash: string,
        nftContract: AddressLike,
        emittedTokenId: BigNumberish
    ];
    type OutputTuple = [
        lockTxChain: string,
        sourceChain: string,
        transactionHash: string,
        nftContract: string,
        emittedTokenId: bigint
    ];
    interface OutputObject {
        lockTxChain: string;
        sourceChain: string;
        transactionHash: string;
        nftContract: string;
        emittedTokenId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace LockedEvent {
    type InputTuple = [
        tokenId: BigNumberish,
        destinationChain: string,
        destinationUserAddress: string,
        sourceNftContractAddress: string,
        tokenAmount: BigNumberish,
        nftType: string,
        sourceChain: string,
        metaDataUri: string
    ];
    type OutputTuple = [
        tokenId: bigint,
        destinationChain: string,
        destinationUserAddress: string,
        sourceNftContractAddress: string,
        tokenAmount: bigint,
        nftType: string,
        sourceChain: string,
        metaDataUri: string
    ];
    interface OutputObject {
        tokenId: bigint;
        destinationChain: string;
        destinationUserAddress: string;
        sourceNftContractAddress: string;
        tokenAmount: bigint;
        nftType: string;
        sourceChain: string;
        metaDataUri: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace LogHashEvent {
    type InputTuple = [hashValue: BytesLike, arg1: BytesLike[]];
    type OutputTuple = [hashValue: string, arg1: string[]];
    interface OutputObject {
        hashValue: string;
        arg1: string[];
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace RewardValidatorEvent {
    type InputTuple = [_validator: AddressLike];
    type OutputTuple = [_validator: string];
    interface OutputObject {
        _validator: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace UnLock721Event {
    type InputTuple = [
        to: AddressLike,
        tokenId: BigNumberish,
        contractAddr: AddressLike
    ];
    type OutputTuple = [to: string, tokenId: bigint, contractAddr: string];
    interface OutputObject {
        to: string;
        tokenId: bigint;
        contractAddr: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface HederaBridge extends BaseContract {
    connect(runner?: ContractRunner | null): HederaBridge;
    waitForDeployment(): Promise<this>;
    interface: HederaBridgeInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    DEFAULT_EXPIRY: TypedContractMethod<[], [bigint], "view">;
    MAX_INT: TypedContractMethod<[], [bigint], "view">;
    addValidator: TypedContractMethod<[
        _validator: AddressLike,
        signatures: SignerAndSignatureStruct[]
    ], [
        void
    ], "nonpayable">;
    claimNFT721: TypedContractMethod<[
        data: HederaBridge.ClaimDataStruct,
        signatures: BytesLike[]
    ], [
        void
    ], "payable">;
    claimValidatorRewards: TypedContractMethod<[
        _validator: AddressLike
    ], [
        void
    ], "nonpayable">;
    duplicateStorageMapping721: TypedContractMethod<[
        arg0: string,
        arg1: string
    ], [
        string
    ], "view">;
    duplicateToOriginalMapping: TypedContractMethod<[
        arg0: AddressLike,
        arg1: string
    ], [
        [string, string] & {
            chain: string;
            contractAddress: string;
        }
    ], "view">;
    keyToValue: TypedContractMethod<[
        arg0: string,
        arg1: string,
        arg2: BigNumberish
    ], [
        [
            bigint,
            string,
            string,
            boolean
        ] & {
            tokenId: bigint;
            chain: string;
            contract_: string;
            exists: boolean;
        }
    ], "view">;
    lock721: TypedContractMethod<[
        tokenId: BigNumberish,
        destinationChain: string,
        destinationUserAddress: string,
        sourceNftContractAddress: AddressLike,
        metaDataUri: string
    ], [
        void
    ], "nonpayable">;
    originalStorageMapping721: TypedContractMethod<[
        arg0: string,
        arg1: string
    ], [
        string
    ], "view">;
    originalToDuplicateMapping: TypedContractMethod<[
        arg0: string,
        arg1: string
    ], [
        [string, string] & {
            chain: string;
            contractAddress: string;
        }
    ], "view">;
    redirectForToken: TypedContractMethod<[
        token: AddressLike,
        encodedFunctionSelector: BytesLike
    ], [
        [bigint, string] & {
            responseCode: bigint;
            response: string;
        }
    ], "nonpayable">;
    selfChain: TypedContractMethod<[], [string], "view">;
    storageDeployer: TypedContractMethod<[], [string], "view">;
    transferFrom: TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    transferFromNFT: TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        serialNumber: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    uniqueIdentifier: TypedContractMethod<[arg0: BytesLike], [boolean], "view">;
    validators: TypedContractMethod<[
        arg0: AddressLike
    ], [
        [boolean, bigint] & {
            added: boolean;
            pendingReward: bigint;
        }
    ], "view">;
    validatorsCount: TypedContractMethod<[], [bigint], "view">;
    valueToKey: TypedContractMethod<[
        arg0: string,
        arg1: string,
        arg2: BigNumberish
    ], [
        [
            bigint,
            string,
            string,
            boolean
        ] & {
            tokenId: bigint;
            chain: string;
            contract_: string;
            exists: boolean;
        }
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "DEFAULT_EXPIRY"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "MAX_INT"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "addValidator"): TypedContractMethod<[
        _validator: AddressLike,
        signatures: SignerAndSignatureStruct[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "claimNFT721"): TypedContractMethod<[
        data: HederaBridge.ClaimDataStruct,
        signatures: BytesLike[]
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "claimValidatorRewards"): TypedContractMethod<[_validator: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "duplicateStorageMapping721"): TypedContractMethod<[arg0: string, arg1: string], [string], "view">;
    getFunction(nameOrSignature: "duplicateToOriginalMapping"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: string
    ], [
        [string, string] & {
            chain: string;
            contractAddress: string;
        }
    ], "view">;
    getFunction(nameOrSignature: "keyToValue"): TypedContractMethod<[
        arg0: string,
        arg1: string,
        arg2: BigNumberish
    ], [
        [
            bigint,
            string,
            string,
            boolean
        ] & {
            tokenId: bigint;
            chain: string;
            contract_: string;
            exists: boolean;
        }
    ], "view">;
    getFunction(nameOrSignature: "lock721"): TypedContractMethod<[
        tokenId: BigNumberish,
        destinationChain: string,
        destinationUserAddress: string,
        sourceNftContractAddress: AddressLike,
        metaDataUri: string
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "originalStorageMapping721"): TypedContractMethod<[arg0: string, arg1: string], [string], "view">;
    getFunction(nameOrSignature: "originalToDuplicateMapping"): TypedContractMethod<[
        arg0: string,
        arg1: string
    ], [
        [string, string] & {
            chain: string;
            contractAddress: string;
        }
    ], "view">;
    getFunction(nameOrSignature: "redirectForToken"): TypedContractMethod<[
        token: AddressLike,
        encodedFunctionSelector: BytesLike
    ], [
        [bigint, string] & {
            responseCode: bigint;
            response: string;
        }
    ], "nonpayable">;
    getFunction(nameOrSignature: "selfChain"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "storageDeployer"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "transferFromNFT"): TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        serialNumber: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "uniqueIdentifier"): TypedContractMethod<[arg0: BytesLike], [boolean], "view">;
    getFunction(nameOrSignature: "validators"): TypedContractMethod<[
        arg0: AddressLike
    ], [
        [boolean, bigint] & {
            added: boolean;
            pendingReward: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "validatorsCount"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "valueToKey"): TypedContractMethod<[
        arg0: string,
        arg1: string,
        arg2: BigNumberish
    ], [
        [
            bigint,
            string,
            string,
            boolean
        ] & {
            tokenId: bigint;
            chain: string;
            contract_: string;
            exists: boolean;
        }
    ], "view">;
    getEvent(key: "AddNewValidator"): TypedContractEvent<AddNewValidatorEvent.InputTuple, AddNewValidatorEvent.OutputTuple, AddNewValidatorEvent.OutputObject>;
    getEvent(key: "CallResponseEvent"): TypedContractEvent<CallResponseEventEvent.InputTuple, CallResponseEventEvent.OutputTuple, CallResponseEventEvent.OutputObject>;
    getEvent(key: "Claimed"): TypedContractEvent<ClaimedEvent.InputTuple, ClaimedEvent.OutputTuple, ClaimedEvent.OutputObject>;
    getEvent(key: "Locked"): TypedContractEvent<LockedEvent.InputTuple, LockedEvent.OutputTuple, LockedEvent.OutputObject>;
    getEvent(key: "LogHash"): TypedContractEvent<LogHashEvent.InputTuple, LogHashEvent.OutputTuple, LogHashEvent.OutputObject>;
    getEvent(key: "RewardValidator"): TypedContractEvent<RewardValidatorEvent.InputTuple, RewardValidatorEvent.OutputTuple, RewardValidatorEvent.OutputObject>;
    getEvent(key: "UnLock721"): TypedContractEvent<UnLock721Event.InputTuple, UnLock721Event.OutputTuple, UnLock721Event.OutputObject>;
    filters: {
        "AddNewValidator(address)": TypedContractEvent<AddNewValidatorEvent.InputTuple, AddNewValidatorEvent.OutputTuple, AddNewValidatorEvent.OutputObject>;
        AddNewValidator: TypedContractEvent<AddNewValidatorEvent.InputTuple, AddNewValidatorEvent.OutputTuple, AddNewValidatorEvent.OutputObject>;
        "CallResponseEvent(bool,bytes)": TypedContractEvent<CallResponseEventEvent.InputTuple, CallResponseEventEvent.OutputTuple, CallResponseEventEvent.OutputObject>;
        CallResponseEvent: TypedContractEvent<CallResponseEventEvent.InputTuple, CallResponseEventEvent.OutputTuple, CallResponseEventEvent.OutputObject>;
        "Claimed(string,string,string,address,uint256)": TypedContractEvent<ClaimedEvent.InputTuple, ClaimedEvent.OutputTuple, ClaimedEvent.OutputObject>;
        Claimed: TypedContractEvent<ClaimedEvent.InputTuple, ClaimedEvent.OutputTuple, ClaimedEvent.OutputObject>;
        "Locked(uint256,string,string,string,uint256,string,string,string)": TypedContractEvent<LockedEvent.InputTuple, LockedEvent.OutputTuple, LockedEvent.OutputObject>;
        Locked: TypedContractEvent<LockedEvent.InputTuple, LockedEvent.OutputTuple, LockedEvent.OutputObject>;
        "LogHash(bytes32,bytes[])": TypedContractEvent<LogHashEvent.InputTuple, LogHashEvent.OutputTuple, LogHashEvent.OutputObject>;
        LogHash: TypedContractEvent<LogHashEvent.InputTuple, LogHashEvent.OutputTuple, LogHashEvent.OutputObject>;
        "RewardValidator(address)": TypedContractEvent<RewardValidatorEvent.InputTuple, RewardValidatorEvent.OutputTuple, RewardValidatorEvent.OutputObject>;
        RewardValidator: TypedContractEvent<RewardValidatorEvent.InputTuple, RewardValidatorEvent.OutputTuple, RewardValidatorEvent.OutputObject>;
        "UnLock721(address,uint256,address)": TypedContractEvent<UnLock721Event.InputTuple, UnLock721Event.OutputTuple, UnLock721Event.OutputObject>;
        UnLock721: TypedContractEvent<UnLock721Event.InputTuple, UnLock721Event.OutputTuple, UnLock721Event.OutputObject>;
    };
}
//# sourceMappingURL=HederaBridge.d.ts.map