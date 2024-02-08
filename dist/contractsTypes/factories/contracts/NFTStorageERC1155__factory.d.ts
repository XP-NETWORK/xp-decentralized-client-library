import { ContractFactory, ContractTransactionResponse } from 'ethers';
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from 'ethers';
import type { NonPayableOverrides } from '../../common';
import type { NFTStorageERC1155, NFTStorageERC1155Interface } from '../../contracts/NFTStorageERC1155';
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
    static readonly bytecode = "0x60803461008b57601f61068c38819003918201601f19168301916001600160401b0383118484101761009057808492604094855283398101031261008b576020610048826100a6565b916001600160a01b0391829161005e91016100a6565b169160018060a01b031992836000541617600055169060015416176001556040516105d190816100bb8239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b038216820361008b5756fe608060409080825260048036101561001657600080fd5b600091823560e01c90816301ffc9a714610383575080636aa003711461035a5780638da5cb5b146103325780639d2d04d1146102a7578063bc197c8114610220578063f23a6e61146101ca5763fead48171461007157600080fd5b346101c65760603660031901126101c657604435926024359180356001600160a01b0380871687036101c1576100ab81875416331461050d565b600154168351627eeac760e11b81523084820152826024820152602081604481855afa9081156101b7579086918891610183575b5010610143578596813b1561013f57868094610110875198899687958694637921219560e11b865230908601610567565b03925af190811561013657506101235750f35b61012c90610407565b6101335780f35b80fd5b513d84823e3d90fd5b8680fd5b835162461bcd60e51b8152602081850152601a602482015279496e73756666696369656e7420746f6b656e2062616c616e636560301b6044820152606490fd5b9150506020813d82116101af575b8161019e60209383610430565b8101031261013f57859051386100df565b3d9150610191565b85513d89823e3d90fd5b600080fd5b5080fd5b509190346101335760a0366003190112610133576101e66103db565b506101ef6103f1565b50608435906001600160401b0382116101335750602092610212913691016104b7565b505163f23a6e6160e01b8152f35b509190346101335760a03660031901126101335761023c6103db565b506102456103f1565b506001600160401b03906044358281116101c6576102669036908601610451565b506064358281116101c65761027e9036908601610451565b506084359182116101335750602092610299913691016104b7565b505163bc197c8160e01b8152f35b509181923461032e578160031936011261032e5782546001600160a01b03906102d3908216331461050d565b6001541690813b15610329578391610309918451958680948193637921219560e11b835260243590803590309033908601610567565b03925af1908115610136575061031d575080f35b61032690610407565b80f35b505050fd5b5050fd5b8284346101c657816003193601126101c657905490516001600160a01b039091168152602090f35b8284346101c657816003193601126101c65760015490516001600160a01b039091168152602090f35b919050346103d75760203660031901126103d7573563ffffffff60e01b81168091036103d75760209250630271189760e51b81149081156103c6575b5015158152f35b6301ffc9a760e01b149050836103bf565b8280fd5b600435906001600160a01b03821682036101c157565b602435906001600160a01b03821682036101c157565b6001600160401b03811161041a57604052565b634e487b7160e01b600052604160045260246000fd5b90601f801991011681019081106001600160401b0382111761041a57604052565b81601f820112156101c1578035916020916001600160401b03841161041a578360051b906040519461048585840187610430565b855283808601928201019283116101c1578301905b8282106104a8575050505090565b8135815290830190830161049a565b81601f820112156101c1578035906001600160401b03821161041a57604051926104eb601f8401601f191660200185610430565b828452602083830101116101c157816000926020809301838601378301015290565b1561051457565b60405162461bcd60e51b815260206004820152602560248201527f4f6e6c7920746865206f776e65722063616e2063616c6c20746869732066756e60448201526431ba34b7b760d91b6064820152608490fd5b929060c0949260018060a01b0380921685521660208401526040830152606082015260a06080820152600060a0820152019056fea26469706673582212204363f44f8267d9d5016aae665da980d06ba7d814fba8dc3f8fb6410672541ebc64736f6c63430008150033";
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