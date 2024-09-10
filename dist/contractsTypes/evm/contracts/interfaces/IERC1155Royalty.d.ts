import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface IERC1155RoyaltyInterface extends Interface {
    getFunction(nameOrSignature: "balanceOf" | "mint" | "owner" | "royaltyInfo" | "setTokenURI" | "uri"): FunctionFragment;
    encodeFunctionData(functionFragment: "balanceOf", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "mint", values: [
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        AddressLike,
        string
    ]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "royaltyInfo", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "setTokenURI", values: [BigNumberish, string]): string;
    encodeFunctionData(functionFragment: "uri", values: [BigNumberish]): string;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "royaltyInfo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setTokenURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "uri", data: BytesLike): Result;
}
export interface IERC1155Royalty extends BaseContract {
    connect(runner?: ContractRunner | null): IERC1155Royalty;
    waitForDeployment(): Promise<this>;
    interface: IERC1155RoyaltyInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    balanceOf: TypedContractMethod<[
        account: AddressLike,
        id: BigNumberish
    ], [
        bigint
    ], "view">;
    mint: TypedContractMethod<[
        account: AddressLike,
        id: BigNumberish,
        amount: BigNumberish,
        royalty: BigNumberish,
        royaltyReceiver: AddressLike,
        tokenURI: string
    ], [
        void
    ], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    royaltyInfo: TypedContractMethod<[
        tokenId: BigNumberish,
        salePrice: BigNumberish
    ], [
        [string, bigint] & {
            receiver: string;
            royaltyAmount: bigint;
        }
    ], "view">;
    setTokenURI: TypedContractMethod<[
        tokenId: BigNumberish,
        newTokenURI: string
    ], [
        void
    ], "nonpayable">;
    uri: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[
        account: AddressLike,
        id: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "mint"): TypedContractMethod<[
        account: AddressLike,
        id: BigNumberish,
        amount: BigNumberish,
        royalty: BigNumberish,
        royaltyReceiver: AddressLike,
        tokenURI: string
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "royaltyInfo"): TypedContractMethod<[
        tokenId: BigNumberish,
        salePrice: BigNumberish
    ], [
        [string, bigint] & {
            receiver: string;
            royaltyAmount: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "setTokenURI"): TypedContractMethod<[
        tokenId: BigNumberish,
        newTokenURI: string
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "uri"): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
    filters: {};
}
//# sourceMappingURL=IERC1155Royalty.d.ts.map