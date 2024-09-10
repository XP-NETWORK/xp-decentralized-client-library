import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../common";
export interface NFTStorageERC721Interface extends Interface {
    getFunction(nameOrSignature: "collectionAddress" | "depositToken" | "onERC721Received" | "owner" | "unlockToken"): FunctionFragment;
    encodeFunctionData(functionFragment: "collectionAddress", values?: undefined): string;
    encodeFunctionData(functionFragment: "depositToken", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "onERC721Received", values: [AddressLike, AddressLike, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "unlockToken", values: [BigNumberish, AddressLike]): string;
    decodeFunctionResult(functionFragment: "collectionAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC721Received", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unlockToken", data: BytesLike): Result;
}
export interface NFTStorageERC721 extends BaseContract {
    connect(runner?: ContractRunner | null): NFTStorageERC721;
    waitForDeployment(): Promise<this>;
    interface: NFTStorageERC721Interface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    collectionAddress: TypedContractMethod<[], [string], "view">;
    depositToken: TypedContractMethod<[
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    onERC721Received: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BytesLike
    ], [
        string
    ], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    unlockToken: TypedContractMethod<[
        tokenId: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "collectionAddress"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "depositToken"): TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "onERC721Received"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BytesLike
    ], [
        string
    ], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "unlockToken"): TypedContractMethod<[
        tokenId: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    filters: {};
}
//# sourceMappingURL=NFTStorageERC721.d.ts.map