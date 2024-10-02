import { BigNumberish as EthersBigNumber } from "ethers";
export type TGas = {
    maxPriorityFeePerGas: EthersBigNumber;
    maxFeePerGas: EthersBigNumber;
    gasLimit: number;
};
type TArgs = [
    getGasStationGas: () => Promise<TGas>,
    getConstantGas: () => TGas
];
type TGetGas = (...args: TArgs) => Promise<TGas>;
export declare const GAS_LIMIT = 5000000;
export type TCreateGasConfig = {
    chainNonce: number;
    gasToAdd: number;
    constantGas: number;
    gasStationEndpoint: string;
};
export declare const convertToGwei: (value: string) => EthersBigNumber;
export declare const getConstantGas: (fee: number) => TGas;
export declare const getGas: TGetGas;
export declare function sleep(ms: number): Promise<unknown>;
export {};
//# sourceMappingURL=utils.d.ts.map