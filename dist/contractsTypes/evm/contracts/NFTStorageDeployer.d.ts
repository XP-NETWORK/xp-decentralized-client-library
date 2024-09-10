import type { BaseContract, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../common";
export interface NFTStorageDeployerInterface extends Interface {
    getFunction(nameOrSignature: "deployNFT1155Storage" | "deployNFT721Storage" | "owner" | "setOwner"): FunctionFragment;
    encodeFunctionData(functionFragment: "deployNFT1155Storage", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "deployNFT721Storage", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "setOwner", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "deployNFT1155Storage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployNFT721Storage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
}
export interface NFTStorageDeployer extends BaseContract {
    connect(runner?: ContractRunner | null): NFTStorageDeployer;
    waitForDeployment(): Promise<this>;
    interface: NFTStorageDeployerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    deployNFT1155Storage: TypedContractMethod<[
        collectionAddress: AddressLike
    ], [
        string
    ], "nonpayable">;
    deployNFT721Storage: TypedContractMethod<[
        collectionAddress: AddressLike
    ], [
        string
    ], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    setOwner: TypedContractMethod<[_owner: AddressLike], [void], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "deployNFT1155Storage"): TypedContractMethod<[
        collectionAddress: AddressLike
    ], [
        string
    ], "nonpayable">;
    getFunction(nameOrSignature: "deployNFT721Storage"): TypedContractMethod<[
        collectionAddress: AddressLike
    ], [
        string
    ], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "setOwner"): TypedContractMethod<[_owner: AddressLike], [void], "nonpayable">;
    filters: {};
}
//# sourceMappingURL=NFTStorageDeployer.d.ts.map