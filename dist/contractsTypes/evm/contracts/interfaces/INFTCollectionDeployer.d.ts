import type { BaseContract, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface INFTCollectionDeployerInterface extends Interface {
    getFunction(nameOrSignature: "deployNFT1155Collection" | "deployNFT721Collection" | "owner" | "setOwner"): FunctionFragment;
    encodeFunctionData(functionFragment: "deployNFT1155Collection", values?: undefined): string;
    encodeFunctionData(functionFragment: "deployNFT721Collection", values: [string, string]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "setOwner", values: [AddressLike, AddressLike]): string;
    decodeFunctionResult(functionFragment: "deployNFT1155Collection", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployNFT721Collection", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
}
export interface INFTCollectionDeployer extends BaseContract {
    connect(runner?: ContractRunner | null): INFTCollectionDeployer;
    waitForDeployment(): Promise<this>;
    interface: INFTCollectionDeployerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
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
    filters: {};
}
//# sourceMappingURL=INFTCollectionDeployer.d.ts.map