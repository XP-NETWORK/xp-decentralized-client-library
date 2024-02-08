import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from 'ethers';
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from '../common';
export declare namespace IHederaTokenService {
    type KeyValueStruct = {
        inheritAccountKey: boolean;
        contractId: AddressLike;
        ed25519: BytesLike;
        ECDSA_secp256k1: BytesLike;
        delegatableContractId: AddressLike;
    };
    type KeyValueStructOutput = [
        inheritAccountKey: boolean,
        contractId: string,
        ed25519: string,
        ECDSA_secp256k1: string,
        delegatableContractId: string
    ] & {
        inheritAccountKey: boolean;
        contractId: string;
        ed25519: string;
        ECDSA_secp256k1: string;
        delegatableContractId: string;
    };
    type TokenKeyStruct = {
        keyType: BigNumberish;
        key: IHederaTokenService.KeyValueStruct;
    };
    type TokenKeyStructOutput = [
        keyType: bigint,
        key: IHederaTokenService.KeyValueStructOutput
    ] & {
        keyType: bigint;
        key: IHederaTokenService.KeyValueStructOutput;
    };
    type ExpiryStruct = {
        second: BigNumberish;
        autoRenewAccount: AddressLike;
        autoRenewPeriod: BigNumberish;
    };
    type ExpiryStructOutput = [
        second: bigint,
        autoRenewAccount: string,
        autoRenewPeriod: bigint
    ] & {
        second: bigint;
        autoRenewAccount: string;
        autoRenewPeriod: bigint;
    };
    type HederaTokenStruct = {
        name: string;
        symbol: string;
        treasury: AddressLike;
        memo: string;
        tokenSupplyType: boolean;
        maxSupply: BigNumberish;
        freezeDefault: boolean;
        tokenKeys: IHederaTokenService.TokenKeyStruct[];
        expiry: IHederaTokenService.ExpiryStruct;
    };
    type HederaTokenStructOutput = [
        name: string,
        symbol: string,
        treasury: string,
        memo: string,
        tokenSupplyType: boolean,
        maxSupply: bigint,
        freezeDefault: boolean,
        tokenKeys: IHederaTokenService.TokenKeyStructOutput[],
        expiry: IHederaTokenService.ExpiryStructOutput
    ] & {
        name: string;
        symbol: string;
        treasury: string;
        memo: string;
        tokenSupplyType: boolean;
        maxSupply: bigint;
        freezeDefault: boolean;
        tokenKeys: IHederaTokenService.TokenKeyStructOutput[];
        expiry: IHederaTokenService.ExpiryStructOutput;
    };
    type FixedFeeStruct = {
        amount: BigNumberish;
        tokenId: AddressLike;
        useHbarsForPayment: boolean;
        useCurrentTokenForPayment: boolean;
        feeCollector: AddressLike;
    };
    type FixedFeeStructOutput = [
        amount: bigint,
        tokenId: string,
        useHbarsForPayment: boolean,
        useCurrentTokenForPayment: boolean,
        feeCollector: string
    ] & {
        amount: bigint;
        tokenId: string;
        useHbarsForPayment: boolean;
        useCurrentTokenForPayment: boolean;
        feeCollector: string;
    };
    type FractionalFeeStruct = {
        numerator: BigNumberish;
        denominator: BigNumberish;
        minimumAmount: BigNumberish;
        maximumAmount: BigNumberish;
        netOfTransfers: boolean;
        feeCollector: AddressLike;
    };
    type FractionalFeeStructOutput = [
        numerator: bigint,
        denominator: bigint,
        minimumAmount: bigint,
        maximumAmount: bigint,
        netOfTransfers: boolean,
        feeCollector: string
    ] & {
        numerator: bigint;
        denominator: bigint;
        minimumAmount: bigint;
        maximumAmount: bigint;
        netOfTransfers: boolean;
        feeCollector: string;
    };
    type RoyaltyFeeStruct = {
        numerator: BigNumberish;
        denominator: BigNumberish;
        amount: BigNumberish;
        tokenId: AddressLike;
        useHbarsForPayment: boolean;
        feeCollector: AddressLike;
    };
    type RoyaltyFeeStructOutput = [
        numerator: bigint,
        denominator: bigint,
        amount: bigint,
        tokenId: string,
        useHbarsForPayment: boolean,
        feeCollector: string
    ] & {
        numerator: bigint;
        denominator: bigint;
        amount: bigint;
        tokenId: string;
        useHbarsForPayment: boolean;
        feeCollector: string;
    };
    type TokenInfoStruct = {
        token: IHederaTokenService.HederaTokenStruct;
        totalSupply: BigNumberish;
        deleted: boolean;
        defaultKycStatus: boolean;
        pauseStatus: boolean;
        fixedFees: IHederaTokenService.FixedFeeStruct[];
        fractionalFees: IHederaTokenService.FractionalFeeStruct[];
        royaltyFees: IHederaTokenService.RoyaltyFeeStruct[];
        ledgerId: string;
    };
    type TokenInfoStructOutput = [
        token: IHederaTokenService.HederaTokenStructOutput,
        totalSupply: bigint,
        deleted: boolean,
        defaultKycStatus: boolean,
        pauseStatus: boolean,
        fixedFees: IHederaTokenService.FixedFeeStructOutput[],
        fractionalFees: IHederaTokenService.FractionalFeeStructOutput[],
        royaltyFees: IHederaTokenService.RoyaltyFeeStructOutput[],
        ledgerId: string
    ] & {
        token: IHederaTokenService.HederaTokenStructOutput;
        totalSupply: bigint;
        deleted: boolean;
        defaultKycStatus: boolean;
        pauseStatus: boolean;
        fixedFees: IHederaTokenService.FixedFeeStructOutput[];
        fractionalFees: IHederaTokenService.FractionalFeeStructOutput[];
        royaltyFees: IHederaTokenService.RoyaltyFeeStructOutput[];
        ledgerId: string;
    };
    type NonFungibleTokenInfoStruct = {
        tokenInfo: IHederaTokenService.TokenInfoStruct;
        serialNumber: BigNumberish;
        ownerId: AddressLike;
        creationTime: BigNumberish;
        metadata: BytesLike;
        spenderId: AddressLike;
    };
    type NonFungibleTokenInfoStructOutput = [
        tokenInfo: IHederaTokenService.TokenInfoStructOutput,
        serialNumber: bigint,
        ownerId: string,
        creationTime: bigint,
        metadata: string,
        spenderId: string
    ] & {
        tokenInfo: IHederaTokenService.TokenInfoStructOutput;
        serialNumber: bigint;
        ownerId: string;
        creationTime: bigint;
        metadata: string;
        spenderId: string;
    };
}
export interface RoyaltyInfoProxyInterface extends Interface {
    getFunction(nameOrSignature: 'redirectForToken' | 'royaltyInfo' | 'transferFrom' | 'transferFromNFT'): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: 'CallResponseEvent'): EventFragment;
    encodeFunctionData(functionFragment: 'redirectForToken', values: [AddressLike, BytesLike]): string;
    encodeFunctionData(functionFragment: 'royaltyInfo', values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'transferFrom', values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: 'transferFromNFT', values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: 'redirectForToken', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'royaltyInfo', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transferFromNFT', data: BytesLike): Result;
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
export interface RoyaltyInfoProxy extends BaseContract {
    connect(runner?: ContractRunner | null): RoyaltyInfoProxy;
    waitForDeployment(): Promise<this>;
    interface: RoyaltyInfoProxyInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    redirectForToken: TypedContractMethod<[
        token: AddressLike,
        encodedFunctionSelector: BytesLike
    ], [
        [bigint, string] & {
            responseCode: bigint;
            response: string;
        }
    ], 'nonpayable'>;
    royaltyInfo: TypedContractMethod<[
        token: AddressLike,
        serialNumber: BigNumberish
    ], [
        [bigint, IHederaTokenService.NonFungibleTokenInfoStructOutput]
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
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: 'redirectForToken'): TypedContractMethod<[
        token: AddressLike,
        encodedFunctionSelector: BytesLike
    ], [
        [bigint, string] & {
            responseCode: bigint;
            response: string;
        }
    ], 'nonpayable'>;
    getFunction(nameOrSignature: 'royaltyInfo'): TypedContractMethod<[
        token: AddressLike,
        serialNumber: BigNumberish
    ], [
        [bigint, IHederaTokenService.NonFungibleTokenInfoStructOutput]
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
    getEvent(key: 'CallResponseEvent'): TypedContractEvent<CallResponseEventEvent.InputTuple, CallResponseEventEvent.OutputTuple, CallResponseEventEvent.OutputObject>;
    filters: {
        'CallResponseEvent(bool,bytes)': TypedContractEvent<CallResponseEventEvent.InputTuple, CallResponseEventEvent.OutputTuple, CallResponseEventEvent.OutputObject>;
        CallResponseEvent: TypedContractEvent<CallResponseEventEvent.InputTuple, CallResponseEventEvent.OutputTuple, CallResponseEventEvent.OutputObject>;
    };
}
//# sourceMappingURL=RoyaltyInfoProxy.d.ts.map