import { ContractFactory, ContractTransactionResponse } from 'ethers';
import type { Signer, BigNumberish, ContractDeployTransaction, ContractRunner } from 'ethers';
import type { NonPayableOverrides } from '../../common';
import type { ERC20Token, ERC20TokenInterface } from '../../contracts/ERC20Token';
type ERC20TokenConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ERC20Token__factory extends ContractFactory {
    constructor(...args: ERC20TokenConstructorParams);
    getDeployTransaction(name: string, symbol: string, initialSupply: BigNumberish, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(name: string, symbol: string, initialSupply: BigNumberish, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ERC20Token & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): ERC20Token__factory;
    static readonly bytecode = "0x60406080815234620003a05762000aa3803803806200001e81620003a5565b9283398101606082820312620003a05781516001600160401b039290838111620003a0578262000050918301620003cb565b60209283830151858111620003a05786916200006e918501620003cb565b920151938151818111620002a0576003908154906001948583811c9316801562000395575b888410146200037f578190601f9384811162000329575b508890848311600114620002c257600092620002b6575b505060001982851b1c191690851b1782555b8451928311620002a05760049485548581811c9116801562000295575b88821014620002805782811162000235575b5086918411600114620001ca57938394918492600095620001be575b50501b92600019911b1c19161781555b3315620001a757600254908382018092116200019257506000917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9160025533835282815284832084815401905584519384523393a35161066590816200043e8239f35b601190634e487b7160e01b6000525260246000fd5b602490600085519163ec442f0560e01b8352820152fd5b0151935038806200011e565b9190601f198416928660005284886000209460005b8a898383106200021d575050501062000202575b50505050811b0181556200012e565b01519060f884600019921b161c1916905538808080620001f3565b868601518955909701969485019488935001620001df565b86600052876000208380870160051c8201928a881062000276575b0160051c019086905b8281106200026957505062000102565b6000815501869062000259565b9250819262000250565b602287634e487b7160e01b6000525260246000fd5b90607f1690620000f0565b634e487b7160e01b600052604160045260246000fd5b015190503880620000c1565b90879350601f19831691866000528a6000209260005b8c828210620003125750508411620002f9575b505050811b018255620000d3565b015160001983871b60f8161c19169055388080620002eb565b8385015186558b97909501949384019301620002d8565b90915084600052886000208480850160051c8201928b861062000375575b918991869594930160051c01915b82811062000365575050620000aa565b6000815585945089910162000355565b9250819262000347565b634e487b7160e01b600052602260045260246000fd5b92607f169262000093565b600080fd5b6040519190601f01601f191682016001600160401b03811183821017620002a057604052565b919080601f84011215620003a05782516001600160401b038111620002a05760209062000401601f8201601f19168301620003a5565b92818452828287010111620003a05760005b8181106200042957508260009394955001015290565b85810183015184820184015282016200041356fe608060408181526004918236101561001657600080fd5b600092833560e01c91826306fdde031461041c57508163095ea7b31461036e57816318160ddd1461034f57816323b872dd14610258578163313ce5671461023c57816370a082311461020557816395d89b411461010357508063a9059cbb146100d35763dd62ed3e1461008857600080fd5b346100cf57806003193601126100cf57806020926100a4610520565b6100ac61053b565b6001600160a01b0391821683526001865283832091168252845220549051908152f35b5080fd5b50346100cf57806003193601126100cf576020906100fc6100f2610520565b6024359033610551565b5160018152f35b8383346100cf57816003193601126100cf57805190828454600181811c908083169283156101fb575b60209384841081146101e8578388529081156101cc5750600114610194575b505050829003601f01601f191682019267ffffffffffffffff841183851017610181575082918261017d9252826104d7565b0390f35b634e487b7160e01b815260418552602490fd5b919250868652828620918387935b8385106101b8575050505083010185808061014b565b8054888601830152930192849082016101a2565b60ff1916878501525050151560051b840101905085808061014b565b634e487b7160e01b895260228a52602489fd5b91607f169161012c565b5050346100cf5760203660031901126100cf5760209181906001600160a01b0361022d610520565b16815280845220549051908152f35b5050346100cf57816003193601126100cf576020905160128152f35b9050823461034c57606036600319011261034c57610274610520565b61027c61053b565b916044359360018060a01b0383168083526001602052868320338452602052868320549160001983036102b8575b6020886100fc898989610551565b8683106103205781156103095733156102f2575082526001602090815286832033845281529186902090859003905582906100fc876102aa565b8751634a1406b160e11b8152908101849052602490fd5b875163e602df0560e01b8152908101849052602490fd5b8751637dc7a0d960e11b8152339181019182526020820193909352604081018790528291506060010390fd5b80fd5b5050346100cf57816003193601126100cf576020906002549051908152f35b905034610418578160031936011261041857610388610520565b602435903315610401576001600160a01b03169182156103ea57508083602095338152600187528181208582528752205582519081527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925843392a35160018152f35b8351634a1406b160e11b8152908101859052602490fd5b835163e602df0560e01b8152808401869052602490fd5b8280fd5b8490843461041857826003193601126104185782600354600181811c908083169283156104cd575b60209384841081146101e8578388529081156101cc575060011461049457505050829003601f01601f191682019267ffffffffffffffff841183851017610181575082918261017d9252826104d7565b91925060038652828620918387935b8385106104b9575050505083010185808061014b565b8054888601830152930192849082016104a3565b91607f1691610444565b6020808252825181830181905290939260005b82811061050c57505060409293506000838284010152601f8019910116010190565b8181018601518482016040015285016104ea565b600435906001600160a01b038216820361053657565b600080fd5b602435906001600160a01b038216820361053657565b916001600160a01b0380841692831561061657169283156105fd57600090838252816020526040822054908382106105cb575091604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef958760209652828652038282205586815220818154019055604051908152a3565b60405163391434e360e21b81526001600160a01b03919091166004820152602481019190915260448101839052606490fd5b60405163ec442f0560e01b815260006004820152602490fd5b604051634b637e8f60e11b815260006004820152602490fdfea2646970667358221220549f3735fefeb7286061d67bca2949082af3b7d9e981110fd978bfa6ec343e5d64736f6c63430008150033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "symbol";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "initialSupply";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "allowance";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "needed";
            readonly type: "uint256";
        }];
        readonly name: "ERC20InsufficientAllowance";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "balance";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "needed";
            readonly type: "uint256";
        }];
        readonly name: "ERC20InsufficientBalance";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "approver";
            readonly type: "address";
        }];
        readonly name: "ERC20InvalidApprover";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "receiver";
            readonly type: "address";
        }];
        readonly name: "ERC20InvalidReceiver";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "ERC20InvalidSender";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }];
        readonly name: "ERC20InvalidSpender";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }];
        readonly name: "allowance";
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
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "decimals";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
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
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): ERC20TokenInterface;
    static connect(address: string, runner?: ContractRunner | null): ERC20Token;
}
export {};
//# sourceMappingURL=ERC20Token__factory.d.ts.map