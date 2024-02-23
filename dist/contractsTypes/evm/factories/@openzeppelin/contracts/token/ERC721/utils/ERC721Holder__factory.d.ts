import { type ContractRunner } from "ethers";
import type { ERC721Holder, ERC721HolderInterface } from "../../../../../../@openzeppelin/contracts/token/ERC721/utils/ERC721Holder";
export declare class ERC721Holder__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "onERC721Received";
        readonly outputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): ERC721HolderInterface;
    static connect(address: string, runner?: ContractRunner | null): ERC721Holder;
}
//# sourceMappingURL=ERC721Holder__factory.d.ts.map