import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface IERC721RoyaltyInterface extends Interface {
    getFunction(nameOrSignature: "mint" | "ownerOf" | "royaltyInfo"): FunctionFragment;
    encodeFunctionData(functionFragment: "mint", values: [AddressLike, BigNumberish, BigNumberish, AddressLike, string]): string;
    encodeFunctionData(functionFragment: "ownerOf", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "royaltyInfo", values: [BigNumberish, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "royaltyInfo", data: BytesLike): Result;
}
export interface IERC721Royalty extends BaseContract {
    connect(runner?: ContractRunner | null): IERC721Royalty;
    waitForDeployment(): Promise<this>;
    interface: IERC721RoyaltyInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    mint: TypedContractMethod<[
        to: AddressLike,
        tokenId: BigNumberish,
        royalty: BigNumberish,
        royaltyReceiver: AddressLike,
        tokenURI: string
    ], [
        void
    ], "nonpayable">;
    ownerOf: TypedContractMethod<[tokenId: BigNumberish], [string], "nonpayable">;
    royaltyInfo: TypedContractMethod<[
        tokenId: BigNumberish,
        salePrice: BigNumberish
    ], [
        [string, bigint] & {
            receiver: string;
            royaltyAmount: bigint;
        }
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "mint"): TypedContractMethod<[
        to: AddressLike,
        tokenId: BigNumberish,
        royalty: BigNumberish,
        royaltyReceiver: AddressLike,
        tokenURI: string
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "ownerOf"): TypedContractMethod<[tokenId: BigNumberish], [string], "nonpayable">;
    getFunction(nameOrSignature: "royaltyInfo"): TypedContractMethod<[
        tokenId: BigNumberish,
        salePrice: BigNumberish
    ], [
        [string, bigint] & {
            receiver: string;
            royaltyAmount: bigint;
        }
    ], "nonpayable">;
    filters: {};
}
//# sourceMappingURL=IERC721Royalty.d.ts.map