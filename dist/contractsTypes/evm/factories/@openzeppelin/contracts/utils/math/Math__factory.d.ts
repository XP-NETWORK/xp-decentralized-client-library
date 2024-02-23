import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type { Math, MathInterface } from "../../../../../@openzeppelin/contracts/utils/math/Math";
type MathConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Math__factory extends ContractFactory {
    constructor(...args: MathConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Math & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Math__factory;
    static readonly bytecode = "0x60808060405234601757603a9081601d823930815050f35b600080fdfe600080fdfea264697066735822122047aa2cc6204c3d1cfcab94664806ca09318c45bc568dd3986c5387020d2bcf9064736f6c63430008150033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "MathOverflowedMulDiv";
        readonly type: "error";
    }];
    static createInterface(): MathInterface;
    static connect(address: string, runner?: ContractRunner | null): Math;
}
export {};
//# sourceMappingURL=Math__factory.d.ts.map