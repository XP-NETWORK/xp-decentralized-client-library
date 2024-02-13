import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from 'ethers';
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from '../common';
export interface NFTStorageERC1155Interface extends Interface {
    getFunction(nameOrSignature: 'collectionAddress' | 'depositToken' | 'onERC1155BatchReceived' | 'onERC1155Received' | 'owner' | 'supportsInterface' | 'unlockToken'): FunctionFragment;
    encodeFunctionData(functionFragment: 'collectionAddress', values?: undefined): string;
    encodeFunctionData(functionFragment: 'depositToken', values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'onERC1155BatchReceived', values: [
        AddressLike,
        AddressLike,
        BigNumberish[],
        BigNumberish[],
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: 'onERC1155Received', values: [
        AddressLike,
        AddressLike,
        BigNumberish,
        BigNumberish,
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
    encodeFunctionData(functionFragment: 'supportsInterface', values: [BytesLike]): string;
    encodeFunctionData(functionFragment: 'unlockToken', values: [BigNumberish, BigNumberish, AddressLike]): string;
    decodeFunctionResult(functionFragment: 'collectionAddress', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'depositToken', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'onERC1155BatchReceived', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'onERC1155Received', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'supportsInterface', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'unlockToken', data: BytesLike): Result;
}
export interface NFTStorageERC1155 extends BaseContract {
    connect(runner?: ContractRunner | null): NFTStorageERC1155;
    waitForDeployment(): Promise<this>;
    interface: NFTStorageERC1155Interface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    collectionAddress: TypedContractMethod<[], [string], 'view'>;
    depositToken: TypedContractMethod<[
        tokenId: BigNumberish,
        amount: BigNumberish
    ], [
        void
    ], 'nonpayable'>;
    onERC1155BatchReceived: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish[],
        arg3: BigNumberish[],
        arg4: BytesLike
    ], [
        string
    ], 'nonpayable'>;
    onERC1155Received: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BigNumberish,
        arg4: BytesLike
    ], [
        string
    ], 'nonpayable'>;
    owner: TypedContractMethod<[], [string], 'view'>;
    supportsInterface: TypedContractMethod<[
        interfaceId: BytesLike
    ], [
        boolean
    ], 'view'>;
    unlockToken: TypedContractMethod<[
        tokenId: BigNumberish,
        amount: BigNumberish,
        to: AddressLike
    ], [
        void
    ], 'nonpayable'>;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: 'collectionAddress'): TypedContractMethod<[], [string], 'view'>;
    getFunction(nameOrSignature: 'depositToken'): TypedContractMethod<[
        tokenId: BigNumberish,
        amount: BigNumberish
    ], [
        void
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'onERC1155BatchReceived'): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish[],
        arg3: BigNumberish[],
        arg4: BytesLike
    ], [
        string
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'onERC1155Received'): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BigNumberish,
        arg4: BytesLike
    ], [
        string
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
    getFunction(nameOrSignature: 'supportsInterface'): TypedContractMethod<[interfaceId: BytesLike], [boolean], 'view'>;
    getFunction(nameOrSignature: 'unlockToken'): TypedContractMethod<[
        tokenId: BigNumberish,
        amount: BigNumberish,
        to: AddressLike
    ], [
        void
    ], 'nonpayable'>;
    filters: {};
}
//# sourceMappingURL=NFTStorageERC1155.d.ts.map