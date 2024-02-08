import { type ContractRunner } from 'ethers';
import type { INFTStorageDeployer, INFTStorageDeployerInterface } from '../../../contracts/interfaces/INFTStorageDeployer';
export declare class INFTStorageDeployer__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "collectionAddress";
            readonly type: "address";
        }];
        readonly name: "deployNFT1155Storage";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "collectionAddress";
            readonly type: "address";
        }];
        readonly name: "deployNFT721Storage";
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
    static createInterface(): INFTStorageDeployerInterface;
    static connect(address: string, runner?: ContractRunner | null): INFTStorageDeployer;
}
//# sourceMappingURL=INFTStorageDeployer__factory.d.ts.map