import type { BaseContract, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../common";
export interface NFTCollectionDeployerInterface extends Interface {
    getFunction(nameOrSignature: "bridge" | "deployNFT1155Collection" | "deployNFT721Collection" | "owner" | "setOwner"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "CreatedCollection"): EventFragment;
    encodeFunctionData(functionFragment: "bridge", values?: undefined): string;
    encodeFunctionData(functionFragment: "deployNFT1155Collection", values?: undefined): string;
    encodeFunctionData(functionFragment: "deployNFT721Collection", values: [string, string]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "setOwner", values: [AddressLike, AddressLike]): string;
    decodeFunctionResult(functionFragment: "bridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployNFT1155Collection", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployNFT721Collection", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
}
export declare namespace CreatedCollectionEvent {
    type InputTuple = [collectionAddress: AddressLike];
    type OutputTuple = [collectionAddress: string];
    interface OutputObject {
        collectionAddress: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface NFTCollectionDeployer extends BaseContract {
    connect(runner?: ContractRunner | null): NFTCollectionDeployer;
    waitForDeployment(): Promise<this>;
    interface: NFTCollectionDeployerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    bridge: TypedContractMethod<[], [string], "view">;
    deployNFT1155Collection: TypedContractMethod<[], [string], "nonpayable">;
    deployNFT721Collection: TypedContractMethod<[
        name: string,
        symbol: string
    ], [
        string
    ], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    setOwner: TypedContractMethod<[
        _owner: AddressLike,
        _bridge: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "bridge"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "deployNFT1155Collection"): TypedContractMethod<[], [string], "nonpayable">;
    getFunction(nameOrSignature: "deployNFT721Collection"): TypedContractMethod<[
        name: string,
        symbol: string
    ], [
        string
    ], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "setOwner"): TypedContractMethod<[
        _owner: AddressLike,
        _bridge: AddressLike
    ], [
        void
    ], "nonpayable">;
    getEvent(key: "CreatedCollection"): TypedContractEvent<CreatedCollectionEvent.InputTuple, CreatedCollectionEvent.OutputTuple, CreatedCollectionEvent.OutputObject>;
    filters: {
        "CreatedCollection(address)": TypedContractEvent<CreatedCollectionEvent.InputTuple, CreatedCollectionEvent.OutputTuple, CreatedCollectionEvent.OutputObject>;
        CreatedCollection: TypedContractEvent<CreatedCollectionEvent.InputTuple, CreatedCollectionEvent.OutputTuple, CreatedCollectionEvent.OutputObject>;
    };
}
//# sourceMappingURL=NFTCollectionDeployer.d.ts.map