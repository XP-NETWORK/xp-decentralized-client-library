import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from 'ethers';
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from './../common';
export interface HederaNftInterface extends Interface {
    getFunction(nameOrSignature: 'DEFAULT_EXPIRY' | 'MAX_INT' | 'claimNft' | 'decodeHts' | 'htsToken' | 'mint' | 'nftClaim' | 'owner' | 'ownerOf' | 'redirectForToken' | 'renounceOwnership' | 'royaltyInfo' | 'safeTransferFrom' | 'transferFrom' | 'transferFromNFT' | 'transferOwnership'): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: 'CallResponseEvent' | 'Minted' | 'OwnershipTransferred' | 'Transfer'): EventFragment;
    encodeFunctionData(functionFragment: 'DEFAULT_EXPIRY', values?: undefined): string;
    encodeFunctionData(functionFragment: 'MAX_INT', values?: undefined): string;
    encodeFunctionData(functionFragment: 'claimNft', values: [BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: 'decodeHts', values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: 'htsToken', values?: undefined): string;
    encodeFunctionData(functionFragment: 'mint', values: [AddressLike, BigNumberish, BigNumberish, AddressLike, string]): string;
    encodeFunctionData(functionFragment: 'nftClaim', values?: undefined): string;
    encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
    encodeFunctionData(functionFragment: 'ownerOf', values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: 'redirectForToken', values: [AddressLike, BytesLike]): string;
    encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
    encodeFunctionData(functionFragment: 'royaltyInfo', values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'safeTransferFrom', values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'transferFrom', values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'transferFromNFT', values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'transferOwnership', values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: 'DEFAULT_EXPIRY', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'MAX_INT', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'claimNft', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'decodeHts', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'htsToken', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'mint', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'nftClaim', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'ownerOf', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'redirectForToken', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'royaltyInfo', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'safeTransferFrom', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transferFromNFT', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
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
export declare namespace MintedEvent {
    type InputTuple = [htsToken: AddressLike, tokenId: BigNumberish];
    type OutputTuple = [htsToken: string, tokenId: bigint];
    interface OutputObject {
        htsToken: string;
        tokenId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OwnershipTransferredEvent {
    type InputTuple = [
        previousOwner: AddressLike,
        newOwner: AddressLike
    ];
    type OutputTuple = [previousOwner: string, newOwner: string];
    interface OutputObject {
        previousOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace TransferEvent {
    type InputTuple = [
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ];
    type OutputTuple = [from: string, to: string, tokenId: bigint];
    interface OutputObject {
        from: string;
        to: string;
        tokenId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface HederaNft extends BaseContract {
    connect(runner?: ContractRunner | null): HederaNft;
    waitForDeployment(): Promise<this>;
    interface: HederaNftInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    DEFAULT_EXPIRY: TypedContractMethod<[], [bigint], 'view'>;
    MAX_INT: TypedContractMethod<[], [bigint], 'view'>;
    claimNft: TypedContractMethod<[
        serialNum: BigNumberish,
        token: AddressLike
    ], [
        void
    ], 'nonpayable'>;
    decodeHts: TypedContractMethod<[
        data: BigNumberish
    ], [
        [string, bigint]
    ], 'view'>;
    htsToken: TypedContractMethod<[], [string], 'view'>;
    mint: TypedContractMethod<[
        to: AddressLike,
        arg1: BigNumberish,
        arg2: BigNumberish,
        arg3: AddressLike,
        tokenURI: string
    ], [
        void
    ], 'nonpayable'>;
    nftClaim: TypedContractMethod<[], [string], 'view'>;
    owner: TypedContractMethod<[], [string], 'view'>;
    ownerOf: TypedContractMethod<[
        tokenId: BigNumberish
    ], [
        string
    ], 'nonpayable'>;
    redirectForToken: TypedContractMethod<[
        token: AddressLike,
        encodedFunctionSelector: BytesLike
    ], [
        [bigint, string] & {
            responseCode: bigint;
            response: string;
        }
    ], 'nonpayable'>;
    renounceOwnership: TypedContractMethod<[], [void], 'nonpayable'>;
    royaltyInfo: TypedContractMethod<[
        tokenId: BigNumberish,
        salePrice: BigNumberish
    ], [
        [string, bigint] & {
            receiver: string;
            royaltyAmount: bigint;
        }
    ], 'nonpayable'>;
    safeTransferFrom: TypedContractMethod<[
        _from: AddressLike,
        _to: AddressLike,
        _serialNum: BigNumberish
    ], [
        void
    ], 'nonpayable'>;
    transferFrom: TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], 'nonpayable'>;
    transferFromNFT: TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        serialNumber: BigNumberish
    ], [
        bigint
    ], 'nonpayable'>;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], 'nonpayable'>;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: 'DEFAULT_EXPIRY'): TypedContractMethod<[], [bigint], 'view'>;
    getFunction(nameOrSignature: 'MAX_INT'): TypedContractMethod<[], [bigint], 'view'>;
    getFunction(nameOrSignature: 'claimNft'): TypedContractMethod<[
        serialNum: BigNumberish,
        token: AddressLike
    ], [
        void
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'decodeHts'): TypedContractMethod<[data: BigNumberish], [[string, bigint]], 'view'>;
    getFunction(nameOrSignature: 'htsToken'): TypedContractMethod<[], [string], 'view'>;
    getFunction(nameOrSignature: 'mint'): TypedContractMethod<[
        to: AddressLike,
        arg1: BigNumberish,
        arg2: BigNumberish,
        arg3: AddressLike,
        tokenURI: string
    ], [
        void
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'nftClaim'): TypedContractMethod<[], [string], 'view'>;
    getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
    getFunction(nameOrSignature: 'ownerOf'): TypedContractMethod<[tokenId: BigNumberish], [string], 'nonpayable'>;
    getFunction(nameOrSignature: 'redirectForToken'): TypedContractMethod<[
        token: AddressLike,
        encodedFunctionSelector: BytesLike
    ], [
        [bigint, string] & {
            responseCode: bigint;
            response: string;
        }
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'renounceOwnership'): TypedContractMethod<[], [void], 'nonpayable'>;
    getFunction(nameOrSignature: 'royaltyInfo'): TypedContractMethod<[
        tokenId: BigNumberish,
        salePrice: BigNumberish
    ], [
        [string, bigint] & {
            receiver: string;
            royaltyAmount: bigint;
        }
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'safeTransferFrom'): TypedContractMethod<[
        _from: AddressLike,
        _to: AddressLike,
        _serialNum: BigNumberish
    ], [
        void
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'transferFrom'): TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'transferFromNFT'): TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        serialNumber: BigNumberish
    ], [
        bigint
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'transferOwnership'): TypedContractMethod<[newOwner: AddressLike], [void], 'nonpayable'>;
    getEvent(key: 'CallResponseEvent'): TypedContractEvent<CallResponseEventEvent.InputTuple, CallResponseEventEvent.OutputTuple, CallResponseEventEvent.OutputObject>;
    getEvent(key: 'Minted'): TypedContractEvent<MintedEvent.InputTuple, MintedEvent.OutputTuple, MintedEvent.OutputObject>;
    getEvent(key: 'OwnershipTransferred'): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    getEvent(key: 'Transfer'): TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
    filters: {
        'CallResponseEvent(bool,bytes)': TypedContractEvent<CallResponseEventEvent.InputTuple, CallResponseEventEvent.OutputTuple, CallResponseEventEvent.OutputObject>;
        CallResponseEvent: TypedContractEvent<CallResponseEventEvent.InputTuple, CallResponseEventEvent.OutputTuple, CallResponseEventEvent.OutputObject>;
        'Minted(address,int64)': TypedContractEvent<MintedEvent.InputTuple, MintedEvent.OutputTuple, MintedEvent.OutputObject>;
        Minted: TypedContractEvent<MintedEvent.InputTuple, MintedEvent.OutputTuple, MintedEvent.OutputObject>;
        'OwnershipTransferred(address,address)': TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        'Transfer(address,address,int64)': TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
        Transfer: TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
    };
}
//# sourceMappingURL=HederaNft.d.ts.map