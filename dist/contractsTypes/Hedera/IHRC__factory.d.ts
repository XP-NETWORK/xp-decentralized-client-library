import { type ContractRunner } from "ethers";
import type { IHRC, IHRCInterface } from "./IHRC";
export declare class IHRC__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "associate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "responseCode";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "dissociate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "responseCode";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IHRCInterface;
    static connect(address: string, runner?: ContractRunner | null): IHRC;
}
//# sourceMappingURL=IHRC__factory.d.ts.map