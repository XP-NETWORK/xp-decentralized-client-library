import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { NFTStorageERC1155, NFTStorageERC1155Interface } from "../../contracts/NFTStorageERC1155";
type NFTStorageERC1155ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class NFTStorageERC1155__factory extends ContractFactory {
    constructor(...args: NFTStorageERC1155ConstructorParams);
    getDeployTransaction(_collectionAddress: AddressLike, _owner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(_collectionAddress: AddressLike, _owner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<NFTStorageERC1155 & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): NFTStorageERC1155__factory;
    static readonly bytecode = "0x60803461008b57601f6106aa38819003918201601f19168301916001600160401b0383118484101761009057808492604094855283398101031261008b576020610048826100a6565b916001600160a01b0391829161005e91016100a6565b169160018060a01b031992836000541617600055169060015416176001556040516105ef90816100bb8239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b038216820361008b5756fe608060409080825260048036101561001657600080fd5b600091823560e01c90816301ffc9a7146103d1575080636aa00371146103a85780638da5cb5b146103805780639d2d04d1146102db578063bc197c8114610253578063f23a6e61146101fc5763fead48171461007157600080fd5b346101f85760603660031901126101f857604435926024359180356001600160a01b0380871687036101f3576100ab81875416331461055f565b600154168351627eeac760e11b81523084820152826024820152602081604481855afa9081156101e95790869188916101b5575b5010610172578596813b1561016e578451637921219560e11b8152309481019485526001600160a01b0390911660208501526040840192909252606083019490945260a06080830181905260009083015292849184919082908490829060c00103925af190811561016557506101525750f35b61015b90610455565b6101625780f35b80fd5b513d84823e3d90fd5b8680fd5b835162461bcd60e51b8152602081850152601a60248201527f496e73756666696369656e7420746f6b656e2062616c616e63650000000000006044820152606490fd5b9150506020813d82116101e1575b816101d06020938361047f565b8101031261016e57859051386100df565b3d91506101c3565b85513d89823e3d90fd5b600080fd5b5080fd5b509190346101625760a036600319011261016257610218610429565b5061022161043f565b506084359067ffffffffffffffff8211610162575060209261024591369101610508565b505163f23a6e6160e01b8152f35b509190346101625760a03660031901126101625761026f610429565b5061027861043f565b5067ffffffffffffffff906044358281116101f85761029a90369086016104a1565b506064358281116101f8576102b290369086016104a1565b5060843591821161016257506020926102cd91369101610508565b505163bc197c8160e01b8152f35b509181923461037c578160031936011261037c5782546001600160a01b0390610307908216331461055f565b6001541690813b15610377578251637921219560e11b81523381830190815230602082015291356040830152602435606083015260a0608083018190526000908301529391849182908490829060c00103925af1908115610165575061036b575080f35b61037490610455565b80f35b505050fd5b5050fd5b8284346101f857816003193601126101f857905490516001600160a01b039091168152602090f35b8284346101f857816003193601126101f85760015490516001600160a01b039091168152602090f35b91905034610425576020366003190112610425573563ffffffff60e01b81168091036104255760209250630271189760e51b8114908115610414575b5015158152f35b6301ffc9a760e01b1490508361040d565b8280fd5b600435906001600160a01b03821682036101f357565b602435906001600160a01b03821682036101f357565b67ffffffffffffffff811161046957604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff82111761046957604052565b81601f820112156101f35780359160209167ffffffffffffffff8411610469578360051b90604051946104d68584018761047f565b855283808601928201019283116101f3578301905b8282106104f9575050505090565b813581529083019083016104eb565b81601f820112156101f35780359067ffffffffffffffff8211610469576040519261053d601f8401601f19166020018561047f565b828452602083830101116101f357816000926020809301838601378301015290565b1561056657565b60405162461bcd60e51b815260206004820152602560248201527f4f6e6c7920746865206f776e65722063616e2063616c6c20746869732066756e60448201526431ba34b7b760d91b6064820152608490fdfea2646970667358221220b732630e7c0fc7990564cc477fa2a360c7b5812de2c318071f28d2f87b20f47f64736f6c63430008150033";
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
            readonly internalType: "contract IERC1155";
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
            readonly internalType: "uint256";
            readonly name: "amount";
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
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "onERC1155BatchReceived";
        readonly outputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
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
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "onERC1155Received";
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
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
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
    static createInterface(): NFTStorageERC1155Interface;
    static connect(address: string, runner?: ContractRunner | null): NFTStorageERC1155;
}
export {};
//# sourceMappingURL=NFTStorageERC1155__factory.d.ts.map