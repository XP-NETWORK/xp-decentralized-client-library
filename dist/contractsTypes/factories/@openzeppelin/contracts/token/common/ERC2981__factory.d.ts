import { type ContractRunner } from 'ethers';
import type { ERC2981, ERC2981Interface } from '../../../../../@openzeppelin/contracts/token/common/ERC2981';
export declare class ERC2981__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "numerator";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "denominator";
            readonly type: "uint256";
        }];
        readonly name: "ERC2981InvalidDefaultRoyalty";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "receiver";
            readonly type: "address";
        }];
        readonly name: "ERC2981InvalidDefaultRoyaltyReceiver";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "numerator";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "denominator";
            readonly type: "uint256";
        }];
        readonly name: "ERC2981InvalidTokenRoyalty";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "receiver";
            readonly type: "address";
        }];
        readonly name: "ERC2981InvalidTokenRoyaltyReceiver";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "salePrice";
            readonly type: "uint256";
        }];
        readonly name: "royaltyInfo";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "interfaceId";
            readonly type: "bytes4";
        }];
        readonly name: "supportsInterface";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): ERC2981Interface;
    static connect(address: string, runner?: ContractRunner | null): ERC2981;
}
//# sourceMappingURL=ERC2981__factory.d.ts.map