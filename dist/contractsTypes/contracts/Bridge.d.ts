import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from 'ethers';
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from '../common';
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
export declare namespace Bridge {
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
        fee: bigint
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
    };
}
export interface BridgeInterface extends Interface {
    getFunction(nameOrSignature: 'addValidator' | 'claimNFT1155' | 'claimNFT721' | 'claimValidatorRewards' | 'collectionDeployer' | 'duplicateStorageMapping1155' | 'duplicateStorageMapping721' | 'duplicateToOriginalMapping' | 'lock1155' | 'lock721' | 'originalStorageMapping1155' | 'originalStorageMapping721' | 'originalToDuplicateMapping' | 'selfChain' | 'storageDeployer' | 'uniqueIdentifier' | 'validators' | 'validatorsCount'): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: 'AddNewValidator' | 'Claimed' | 'Locked' | 'LogHash' | 'RewardValidator' | 'UnLock1155' | 'UnLock721'): EventFragment;
    encodeFunctionData(functionFragment: 'addValidator', values: [AddressLike, SignerAndSignatureStruct[]]): string;
    encodeFunctionData(functionFragment: 'claimNFT1155', values: [Bridge.ClaimDataStruct, BytesLike[]]): string;
    encodeFunctionData(functionFragment: 'claimNFT721', values: [Bridge.ClaimDataStruct, BytesLike[]]): string;
    encodeFunctionData(functionFragment: 'claimValidatorRewards', values: [AddressLike, BytesLike[]]): string;
    encodeFunctionData(functionFragment: 'collectionDeployer', values?: undefined): string;
    encodeFunctionData(functionFragment: 'duplicateStorageMapping1155', values: [string, string]): string;
    encodeFunctionData(functionFragment: 'duplicateStorageMapping721', values: [string, string]): string;
    encodeFunctionData(functionFragment: 'duplicateToOriginalMapping', values: [AddressLike, string]): string;
    encodeFunctionData(functionFragment: 'lock1155', values: [BigNumberish, string, string, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'lock721', values: [BigNumberish, string, string, AddressLike]): string;
    encodeFunctionData(functionFragment: 'originalStorageMapping1155', values: [string, string]): string;
    encodeFunctionData(functionFragment: 'originalStorageMapping721', values: [string, string]): string;
    encodeFunctionData(functionFragment: 'originalToDuplicateMapping', values: [string, string]): string;
    encodeFunctionData(functionFragment: 'selfChain', values?: undefined): string;
    encodeFunctionData(functionFragment: 'storageDeployer', values?: undefined): string;
    encodeFunctionData(functionFragment: 'uniqueIdentifier', values: [BytesLike]): string;
    encodeFunctionData(functionFragment: 'validators', values: [AddressLike]): string;
    encodeFunctionData(functionFragment: 'validatorsCount', values?: undefined): string;
    decodeFunctionResult(functionFragment: 'addValidator', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'claimNFT1155', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'claimNFT721', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'claimValidatorRewards', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'collectionDeployer', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'duplicateStorageMapping1155', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'duplicateStorageMapping721', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'duplicateToOriginalMapping', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'lock1155', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'lock721', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'originalStorageMapping1155', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'originalStorageMapping721', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'originalToDuplicateMapping', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'selfChain', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'storageDeployer', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'uniqueIdentifier', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'validators', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'validatorsCount', data: BytesLike): Result;
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
export declare namespace ClaimedEvent {
    type InputTuple = [sourceChain: string, transactionHash: string];
    type OutputTuple = [sourceChain: string, transactionHash: string];
    interface OutputObject {
        sourceChain: string;
        transactionHash: string;
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
        sourceChain: string
    ];
    type OutputTuple = [
        tokenId: bigint,
        destinationChain: string,
        destinationUserAddress: string,
        sourceNftContractAddress: string,
        tokenAmount: bigint,
        nftType: string,
        sourceChain: string
    ];
    interface OutputObject {
        tokenId: bigint;
        destinationChain: string;
        destinationUserAddress: string;
        sourceNftContractAddress: string;
        tokenAmount: bigint;
        nftType: string;
        sourceChain: string;
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
export declare namespace UnLock1155Event {
    type InputTuple = [
        to: AddressLike,
        tokenId: BigNumberish,
        contractAddr: AddressLike,
        amount: BigNumberish
    ];
    type OutputTuple = [
        to: string,
        tokenId: bigint,
        contractAddr: string,
        amount: bigint
    ];
    interface OutputObject {
        to: string;
        tokenId: bigint;
        contractAddr: string;
        amount: bigint;
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
    type OutputTuple = [
        to: string,
        tokenId: bigint,
        contractAddr: string
    ];
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
export interface Bridge extends BaseContract {
    connect(runner?: ContractRunner | null): Bridge;
    waitForDeployment(): Promise<this>;
    interface: BridgeInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    addValidator: TypedContractMethod<[
        _validator: AddressLike,
        signatures: SignerAndSignatureStruct[]
    ], [
        void
    ], 'nonpayable'>;
    claimNFT1155: TypedContractMethod<[
        data: Bridge.ClaimDataStruct,
        signatures: BytesLike[]
    ], [
        void
    ], 'payable'>;
    claimNFT721: TypedContractMethod<[
        data: Bridge.ClaimDataStruct,
        signatures: BytesLike[]
    ], [
        void
    ], 'payable'>;
    claimValidatorRewards: TypedContractMethod<[
        _validator: AddressLike,
        signatures: BytesLike[]
    ], [
        void
    ], 'nonpayable'>;
    collectionDeployer: TypedContractMethod<[], [string], 'view'>;
    duplicateStorageMapping1155: TypedContractMethod<[
        arg0: string,
        arg1: string
    ], [
        string
    ], 'view'>;
    duplicateStorageMapping721: TypedContractMethod<[
        arg0: string,
        arg1: string
    ], [
        string
    ], 'view'>;
    duplicateToOriginalMapping: TypedContractMethod<[
        arg0: AddressLike,
        arg1: string
    ], [
        [string, string] & {
            chain: string;
            contractAddress: string;
        }
    ], 'view'>;
    lock1155: TypedContractMethod<[
        tokenId: BigNumberish,
        destinationChain: string,
        destinationUserAddress: string,
        sourceNftContractAddress: AddressLike,
        tokenAmount: BigNumberish
    ], [
        void
    ], 'nonpayable'>;
    lock721: TypedContractMethod<[
        tokenId: BigNumberish,
        destinationChain: string,
        destinationUserAddress: string,
        sourceNftContractAddress: AddressLike
    ], [
        void
    ], 'nonpayable'>;
    originalStorageMapping1155: TypedContractMethod<[
        arg0: string,
        arg1: string
    ], [
        string
    ], 'view'>;
    originalStorageMapping721: TypedContractMethod<[
        arg0: string,
        arg1: string
    ], [
        string
    ], 'view'>;
    originalToDuplicateMapping: TypedContractMethod<[
        arg0: string,
        arg1: string
    ], [
        [string, string] & {
            chain: string;
            contractAddress: string;
        }
    ], 'view'>;
    selfChain: TypedContractMethod<[], [string], 'view'>;
    storageDeployer: TypedContractMethod<[], [string], 'view'>;
    uniqueIdentifier: TypedContractMethod<[arg0: BytesLike], [boolean], 'view'>;
    validators: TypedContractMethod<[
        arg0: AddressLike
    ], [
        [boolean, bigint] & {
            added: boolean;
            pendingReward: bigint;
        }
    ], 'view'>;
    validatorsCount: TypedContractMethod<[], [bigint], 'view'>;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: 'addValidator'): TypedContractMethod<[
        _validator: AddressLike,
        signatures: SignerAndSignatureStruct[]
    ], [
        void
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'claimNFT1155'): TypedContractMethod<[
        data: Bridge.ClaimDataStruct,
        signatures: BytesLike[]
    ], [
        void
    ], 'payable'>;
    getFunction(nameOrSignature: 'claimNFT721'): TypedContractMethod<[
        data: Bridge.ClaimDataStruct,
        signatures: BytesLike[]
    ], [
        void
    ], 'payable'>;
    getFunction(nameOrSignature: 'claimValidatorRewards'): TypedContractMethod<[
        _validator: AddressLike,
        signatures: BytesLike[]
    ], [
        void
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'collectionDeployer'): TypedContractMethod<[], [string], 'view'>;
    getFunction(nameOrSignature: 'duplicateStorageMapping1155'): TypedContractMethod<[arg0: string, arg1: string], [string], 'view'>;
    getFunction(nameOrSignature: 'duplicateStorageMapping721'): TypedContractMethod<[arg0: string, arg1: string], [string], 'view'>;
    getFunction(nameOrSignature: 'duplicateToOriginalMapping'): TypedContractMethod<[
        arg0: AddressLike,
        arg1: string
    ], [
        [string, string] & {
            chain: string;
            contractAddress: string;
        }
    ], 'view'>;
    getFunction(nameOrSignature: 'lock1155'): TypedContractMethod<[
        tokenId: BigNumberish,
        destinationChain: string,
        destinationUserAddress: string,
        sourceNftContractAddress: AddressLike,
        tokenAmount: BigNumberish
    ], [
        void
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'lock721'): TypedContractMethod<[
        tokenId: BigNumberish,
        destinationChain: string,
        destinationUserAddress: string,
        sourceNftContractAddress: AddressLike
    ], [
        void
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'originalStorageMapping1155'): TypedContractMethod<[arg0: string, arg1: string], [string], 'view'>;
    getFunction(nameOrSignature: 'originalStorageMapping721'): TypedContractMethod<[arg0: string, arg1: string], [string], 'view'>;
    getFunction(nameOrSignature: 'originalToDuplicateMapping'): TypedContractMethod<[
        arg0: string,
        arg1: string
    ], [
        [string, string] & {
            chain: string;
            contractAddress: string;
        }
    ], 'view'>;
    getFunction(nameOrSignature: 'selfChain'): TypedContractMethod<[], [string], 'view'>;
    getFunction(nameOrSignature: 'storageDeployer'): TypedContractMethod<[], [string], 'view'>;
    getFunction(nameOrSignature: 'uniqueIdentifier'): TypedContractMethod<[arg0: BytesLike], [boolean], 'view'>;
    getFunction(nameOrSignature: 'validators'): TypedContractMethod<[
        arg0: AddressLike
    ], [
        [boolean, bigint] & {
            added: boolean;
            pendingReward: bigint;
        }
    ], 'view'>;
    getFunction(nameOrSignature: 'validatorsCount'): TypedContractMethod<[], [bigint], 'view'>;
    getEvent(key: 'AddNewValidator'): TypedContractEvent<AddNewValidatorEvent.InputTuple, AddNewValidatorEvent.OutputTuple, AddNewValidatorEvent.OutputObject>;
    getEvent(key: 'Claimed'): TypedContractEvent<ClaimedEvent.InputTuple, ClaimedEvent.OutputTuple, ClaimedEvent.OutputObject>;
    getEvent(key: 'Locked'): TypedContractEvent<LockedEvent.InputTuple, LockedEvent.OutputTuple, LockedEvent.OutputObject>;
    getEvent(key: 'LogHash'): TypedContractEvent<LogHashEvent.InputTuple, LogHashEvent.OutputTuple, LogHashEvent.OutputObject>;
    getEvent(key: 'RewardValidator'): TypedContractEvent<RewardValidatorEvent.InputTuple, RewardValidatorEvent.OutputTuple, RewardValidatorEvent.OutputObject>;
    getEvent(key: 'UnLock1155'): TypedContractEvent<UnLock1155Event.InputTuple, UnLock1155Event.OutputTuple, UnLock1155Event.OutputObject>;
    getEvent(key: 'UnLock721'): TypedContractEvent<UnLock721Event.InputTuple, UnLock721Event.OutputTuple, UnLock721Event.OutputObject>;
    filters: {
        'AddNewValidator(address)': TypedContractEvent<AddNewValidatorEvent.InputTuple, AddNewValidatorEvent.OutputTuple, AddNewValidatorEvent.OutputObject>;
        AddNewValidator: TypedContractEvent<AddNewValidatorEvent.InputTuple, AddNewValidatorEvent.OutputTuple, AddNewValidatorEvent.OutputObject>;
        'Claimed(string,string)': TypedContractEvent<ClaimedEvent.InputTuple, ClaimedEvent.OutputTuple, ClaimedEvent.OutputObject>;
        Claimed: TypedContractEvent<ClaimedEvent.InputTuple, ClaimedEvent.OutputTuple, ClaimedEvent.OutputObject>;
        'Locked(uint256,string,string,string,uint256,string,string)': TypedContractEvent<LockedEvent.InputTuple, LockedEvent.OutputTuple, LockedEvent.OutputObject>;
        Locked: TypedContractEvent<LockedEvent.InputTuple, LockedEvent.OutputTuple, LockedEvent.OutputObject>;
        'LogHash(bytes32,bytes[])': TypedContractEvent<LogHashEvent.InputTuple, LogHashEvent.OutputTuple, LogHashEvent.OutputObject>;
        LogHash: TypedContractEvent<LogHashEvent.InputTuple, LogHashEvent.OutputTuple, LogHashEvent.OutputObject>;
        'RewardValidator(address)': TypedContractEvent<RewardValidatorEvent.InputTuple, RewardValidatorEvent.OutputTuple, RewardValidatorEvent.OutputObject>;
        RewardValidator: TypedContractEvent<RewardValidatorEvent.InputTuple, RewardValidatorEvent.OutputTuple, RewardValidatorEvent.OutputObject>;
        'UnLock1155(address,uint256,address,uint256)': TypedContractEvent<UnLock1155Event.InputTuple, UnLock1155Event.OutputTuple, UnLock1155Event.OutputObject>;
        UnLock1155: TypedContractEvent<UnLock1155Event.InputTuple, UnLock1155Event.OutputTuple, UnLock1155Event.OutputObject>;
        'UnLock721(address,uint256,address)': TypedContractEvent<UnLock721Event.InputTuple, UnLock721Event.OutputTuple, UnLock721Event.OutputObject>;
        UnLock721: TypedContractEvent<UnLock721Event.InputTuple, UnLock721Event.OutputTuple, UnLock721Event.OutputObject>;
    };
}
//# sourceMappingURL=Bridge.d.ts.map