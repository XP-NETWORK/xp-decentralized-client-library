import { ContractFactory, ContractTransactionResponse } from 'ethers';
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from 'ethers';
import type { NonPayableOverrides } from '../../common';
import type { NFTStorageERC721, NFTStorageERC721Interface } from '../../contracts/NFTStorageERC721';
type NFTStorageERC721ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class NFTStorageERC721__factory extends ContractFactory {
    constructor(...args: NFTStorageERC721ConstructorParams);
    getDeployTransaction(_collectionAddress: AddressLike, _owner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(_collectionAddress: AddressLike, _owner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<NFTStorageERC721 & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): NFTStorageERC721__factory;
    static readonly bytecode = "0x60803461008b57601f61051738819003918201601f19168301916001600160401b0383118484101761009057808492604094855283398101031261008b576020610048826100a6565b916001600160a01b0391829161005e91016100a6565b169160018060a01b0319928360005416176000551690600154161760015560405161045c90816100bb8239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b038216820361008b5756fe608060408181526004918236101561001657600080fd5b600092833560e01c918263150b7a02146102e857508382636215be7714610271575081636aa00371146102485781637326afe0146100885750638da5cb5b1461005e57600080fd5b34610084578160031936011261008457905490516001600160a01b039091168152602090f35b5080fd5b839150346100845782600319360112610084578035926100a661039d565b83546001600160a01b039591939190861633036101f75760015483516331a9108f60e11b8152838101839052908716966020826024818b5afa9182156101ed5787926101ad575b5030911603610155578585963b156101515761012294868094865197889586948593632142170760e11b855230908501610404565b03925af190811561014857506101355750f35b61013e906103b8565b6101455780f35b80fd5b513d84823e3d90fd5b8580fd5b506020608492519162461bcd60e51b8352820152602c60248201527f5468697320636f6e7472616374206973206e6f7420746865206f776e6572206f60448201526b33103a3434b9903a37b5b2b760a11b6064820152fd5b9091506020813d82116101e5575b816101c8602093836103e2565b810103126101e1575181811681036101e15790886100ed565b8680fd5b3d91506101bb565b85513d89823e3d90fd5b506020608492519162461bcd60e51b8352820152602560248201527f4f6e6c7920746865206f776e65722063616e2063616c6c20746869732066756e60448201526431ba34b7b760d91b6064820152fd5b50503461008457816003193601126100845760015490516001600160a01b039091168152602090f35b929150346102e45760203660031901126102e4576001546001600160a01b031690813b156102df5783916102bf918451958680948193632142170760e11b8352803590309033908501610404565b03925af190811561014857506102d3575080f35b6102dc906103b8565b80f35b505050fd5b5050fd5b939150346100845760803660031901126100845780356001600160a01b038116036100845761031561039d565b5060643567ffffffffffffffff91828211610399573660238301121561039957818101359283116103865750610355601f8301601f1916602001866103e2565b818552366024838301011161038257906020948160248794018483013701015251630a85bd0160e11b8152f35b8280fd5b634e487b7160e01b845260419052602483fd5b8380fd5b602435906001600160a01b03821682036103b357565b600080fd5b67ffffffffffffffff81116103cc57604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff8211176103cc57604052565b6001600160a01b0391821681529116602082015260408101919091526060019056fea26469706673582212207cd8c5566a27a881787903cf3384fb6b0f264ad8040e382add34e2f23823b00c64736f6c63430008150033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_collectionAddress";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "collectionAddress";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC721";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "depositToken";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
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
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }];
        readonly name: "unlockToken";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): NFTStorageERC721Interface;
    static connect(address: string, runner?: ContractRunner | null): NFTStorageERC721;
}
export {};
//# sourceMappingURL=NFTStorageERC721__factory.d.ts.map