import { type ContractRunner } from 'ethers';
import type { INFTCollectionDeployer, INFTCollectionDeployerInterface } from '../../../contracts/interfaces/INFTCollectionDeployer';
export declare class INFTCollectionDeployer__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "deployNFT1155Collection";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "symbol";
            readonly type: "string";
        }];
        readonly name: "deployNFT721Collection";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }];
        readonly name: "setOwner";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): INFTCollectionDeployerInterface;
    static connect(address: string, runner?: ContractRunner | null): INFTCollectionDeployer;
}
//# sourceMappingURL=INFTCollectionDeployer__factory.d.ts.map