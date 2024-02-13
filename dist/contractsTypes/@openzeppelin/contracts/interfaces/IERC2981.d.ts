import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from 'ethers';
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from '../../../common';
export interface IERC2981Interface extends Interface {
    getFunction(nameOrSignature: 'royaltyInfo' | 'supportsInterface'): FunctionFragment;
    encodeFunctionData(functionFragment: 'royaltyInfo', values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'supportsInterface', values: [BytesLike]): string;
    decodeFunctionResult(functionFragment: 'royaltyInfo', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'supportsInterface', data: BytesLike): Result;
}
export interface IERC2981 extends BaseContract {
    connect(runner?: ContractRunner | null): IERC2981;
    waitForDeployment(): Promise<this>;
    interface: IERC2981Interface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    royaltyInfo: TypedContractMethod<[
        tokenId: BigNumberish,
        salePrice: BigNumberish
    ], [
        [string, bigint] & {
            receiver: string;
            royaltyAmount: bigint;
        }
    ], 'view'>;
    supportsInterface: TypedContractMethod<[
        interfaceId: BytesLike
    ], [
        boolean
    ], 'view'>;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: 'royaltyInfo'): TypedContractMethod<[
        tokenId: BigNumberish,
        salePrice: BigNumberish
    ], [
        [string, bigint] & {
            receiver: string;
            royaltyAmount: bigint;
        }
    ], 'view'>;
    getFunction(nameOrSignature: 'supportsInterface'): TypedContractMethod<[interfaceId: BytesLike], [boolean], 'view'>;
    filters: {};
}
//# sourceMappingURL=IERC2981.d.ts.map