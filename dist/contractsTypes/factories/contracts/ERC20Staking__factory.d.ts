import { ContractFactory, ContractTransactionResponse } from 'ethers';
import type { Signer, BigNumberish, AddressLike, ContractDeployTransaction, ContractRunner } from 'ethers';
import type { NonPayableOverrides } from '../../common';
import type { ERC20Staking, ERC20StakingInterface } from '../../contracts/ERC20Staking';
type ERC20StakingConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ERC20Staking__factory extends ContractFactory {
    constructor(...args: ERC20StakingConstructorParams);
    getDeployTransaction(_stakingAmount: BigNumberish, _ERC20Token: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(_stakingAmount: BigNumberish, _ERC20Token: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ERC20Staking & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): ERC20Staking__factory;
    static readonly bytecode = "0x60803461007e57601f61054538819003918201601f19168301916001600160401b0383118484101761008357808492604094855283398101031261007e5780516020909101516001600160a01b038116919082900361007e57600055600180546001600160a01b0319169190911790556040516104ab908161009a8239f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe6080604081815260048036101561001557600080fd5b600092833560e01c90816361b8b5dc1461036957508063739a3e021461034c5780637a80760e1461031f57637ca41e371461004f57600080fd5b3461031b57602090816003193601126103175780359267ffffffffffffffff928385116103135736602386011215610313578483013594602490858711610301578660051b958451976100a48589018a6103a1565b885283880190838298840101923684116102fd57848101925b84841061026e575050505050338752600282528287205461023457600193878360018060a01b0387541660648354885194859384926323b872dd60e01b84523389850152308a85015260448401525af1801561022a576101ef575b50875491338952600284528489209182549384018094116101de57505093929355855490835195848701928752848288015251809252606086019360608360051b880101959488915b84831061019257897ff6f745aefa7fce6b76ac5309c1cf0d4c5c42a9107f80667e6cc03d1f5a854bed8a8a038ba180f35b909192939484806101cd83999a605f198d82030187528b5190836101bd835189845289840190610435565b9201519084818403910152610435565b990193019301919594939290610161565b634e487b7160e01b8a526011905288fd5b8381813d8311610223575b61020481836103a1565b8101031261021f57518015150361021b5738610118565b8780fd5b8880fd5b503d6101fa565b85513d8b823e3d90fd5b915162461bcd60e51b81529283015260179082015276596f752063616e206f6e6c79207374616b65206f6e636560481b6044820152606490fd5b83358381116102f95782018860231982360301126102f957885191898301838110868211176102e7578a52878201358581116102e3576102b3908936918501016103d9565b83526044820135928584116102e3576102d48a94938a8695369201016103d9565b838201528152019301926100bd565b8e80fd5b634e487b7160e01b8f5260418c52888ffd5b8c80fd5b8a80fd5b50634e487b7160e01b87526041845286fd5b8580fd5b8380fd5b8280fd5b50503461034857816003193601126103485760015490516001600160a01b039091168152602090f35b5080fd5b505034610348578160031936011261034857602091549051908152f35b929190503461031757602036600319011261031757356001600160a01b03811690819003610317579260209381526002845220548152f35b90601f8019910116810190811067ffffffffffffffff8211176103c357604052565b634e487b7160e01b600052604160045260246000fd5b81601f820112156104305780359067ffffffffffffffff82116103c3576040519261040e601f8401601f1916602001856103a1565b8284526020838301011161043057816000926020809301838601378301015290565b600080fd5b919082519283825260005b848110610461575050826000602080949584010152601f8019910116010190565b60208183018101518483018201520161044056fea2646970667358221220f10466242afa3c5c91c18c742b1ec9138bd56f955d5f935992488d00df848c7d64736f6c63430008150033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_stakingAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_ERC20Token";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "validatorAddress";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "chainType";
                readonly type: "string";
            }];
            readonly indexed: false;
            readonly internalType: "struct ValidatorAddressAndChainType[]";
            readonly name: "validatorAddressAndChainType";
            readonly type: "tuple[]";
        }];
        readonly name: "Staked";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "ERC20Token";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "validatorAddress";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "chainType";
                readonly type: "string";
            }];
            readonly internalType: "struct ValidatorAddressAndChainType[]";
            readonly name: "_validatorAddressAndChainType";
            readonly type: "tuple[]";
        }];
        readonly name: "stakeERC20";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stakingAmount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "stakingBalances";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): ERC20StakingInterface;
    static connect(address: string, runner?: ContractRunner | null): ERC20Staking;
}
export {};
//# sourceMappingURL=ERC20Staking__factory.d.ts.map