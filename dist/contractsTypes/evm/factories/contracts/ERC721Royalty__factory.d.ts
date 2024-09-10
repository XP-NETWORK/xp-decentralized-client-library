import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { ERC721Royalty, ERC721RoyaltyInterface } from "../../contracts/ERC721Royalty";
type ERC721RoyaltyConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ERC721Royalty__factory extends ContractFactory {
    constructor(...args: ERC721RoyaltyConstructorParams);
    getDeployTransaction(name: string, symbol: string, owner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(name: string, symbol: string, owner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ERC721Royalty & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): ERC721Royalty__factory;
    static readonly bytecode = "0x608060405234620003a557620014eb803803806200001d81620003aa565b9283398101606082820312620003a55781516001600160401b039190828111620003a557816200004f918501620003d0565b60209182850151848111620003a5576040916200006e918701620003d0565b9401516001600160a01b03948582169491859003620003a5578251908282116200038f576000948554926001958685811c9516801562000384575b8386101462000370578190601f958681116200031d575b508390868311600114620002b9578992620002ad575b5050600019600383901b1c191690861b1786555b8151938411620002995784548581811c911680156200028e575b828210146200027a57908184869594931162000223575b5080928411600114620001bb57508592620001af575b5050600019600383901b1c191690821b1790555b81156200019757600780546001600160a01b0319811684179091556040519316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a36110a89081620004438239f35b60249060405190631e4fbdf760e01b82526004820152fd5b01519050388062000131565b9190859450601f1984168588528388209388905b828210620002095750508411620001ef575b505050811b01905562000145565b015160001960f88460031b161c19169055388080620001e1565b8484015186558897909501949384019390810190620001cf565b90919293508587528187208480870160051c82019284881062000270575b9187968992969594930160051c01915b828110620002615750506200011b565b89815587965088910162000251565b9250819262000241565b634e487b7160e01b87526022600452602487fd5b90607f169062000104565b634e487b7160e01b86526041600452602486fd5b015190503880620000d6565b898052848a208994509190601f1984168b5b87828210620003065750508411620002ec575b505050811b018655620000ea565b015160001960f88460031b161c19169055388080620002de565b8385015186558c97909501949384019301620002cb565b9091508880528389208680850160051c82019286861062000366575b918a91869594930160051c01915b82811062000357575050620000c0565b8b81558594508a910162000347565b9250819262000339565b634e487b7160e01b88526022600452602488fd5b94607f1694620000a9565b634e487b7160e01b600052604160045260246000fd5b600080fd5b6040519190601f01601f191682016001600160401b038111838210176200038f57604052565b919080601f84011215620003a55782516001600160401b0381116200038f5760209062000406601f8201601f19168301620003aa565b92818452828287010111620003a55760005b8181106200042e57508260009394955001015290565b85810183015184820184015282016200041856fe6080604081815260048036101561001557600080fd5b600092833560e01c90816301ffc9a714610b0d5750806306fdde0314610a5d578063081812fc14610a22578063095ea7b31461094657806323b872dd1461092e5780632a55205a146108ea57806342842e0e146108c15780634bd297fd146105be5780636352211e1461058d57806370a0823114610538578063715018a6146104db5780638da5cb5b146104b257806395d89b41146103c7578063a22cb4651461032a578063b88d4fde146102c2578063c87b56dd146101cd578063e985e9c51461017b5763f2fde38b146100e957600080fd5b3461017757602036600319011261017757610102610bd3565b9061010b610ce0565b6001600160a01b03918216928315610161575050600754826bffffffffffffffffffffffff60a01b821617600755167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b51631e4fbdf760e01b8152908101849052602490fd5b8280fd5b5050346101c957806003193601126101c95760ff8160209361019b610bd3565b6101a3610bee565b6001600160a01b0391821683526005875283832091168252855220549151911615158152f35b5080fd5b50903461017757602091826003193601126102be57356101ec81611037565b5083526006825280832092815180948290805461020881610d0c565b91828552600191888382169182600014610297575050600114610259575b50505061025593929161023a910386610c6b565b815161024581610c39565b5251928284938452830190610b93565b0390f35b8552868520879350859291905b82841061027f575050508201018161023a610255610226565b8054848b018601528995508894909301928101610266565b60ff19168782015293151560051b8601909301935084925061023a91506102559050610226565b8380fd5b8382346101c95760803660031901126101c9576102dd610bd3565b6102e5610bee565b9060643567ffffffffffffffff81116103265736602382011215610326576103239381602461031993369301359101610ca9565b9160443591610ee8565b80f35b8480fd5b509034610177578060031936011261017757610344610bd3565b9060243591821515809303610326576001600160a01b03169283156103b25750338452600560205280842083855260205280842060ff1981541660ff8416179055519081527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160203392a380f35b836024925191630b61174360e31b8352820152fd5b8284346104af57806003193601126104af5781519182826001938454946103ed86610d0c565b9182855260209687838216918260001461048857505060011461042d575b505050610255929161041e910385610c6b565b51928284938452830190610b93565b91908693508083527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf65b828410610470575050508201018161041e61025561040b565b8054848a018601528895508794909301928101610457565b60ff19168782015293151560051b8601909301935084925061041e9150610255905061040b565b80fd5b5050346101c957816003193601126101c95760075490516001600160a01b039091168152602090f35b83346104af57806003193601126104af576104f4610ce0565b600780546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b5091346104af5760203660031901126104af576001600160a01b0361055b610bd3565b169283156105785750806020938392526003845220549051908152f35b91516322718ad960e21b815291820152602490fd5b5091346104af5760203660031901126104af57506105ad60209235611037565b90516001600160a01b039091168152f35b5082346104af5760a03660031901126104af576105d9610bd3565b602493909260443591906001600160a01b0390606435828116918835918390036108bd5767ffffffffffffffff6084358181116108b957366023820112156108b95761062d9036908c818601359101610ca9565b98610636610ce0565b612710881161088457851694851561086e5788999a847fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef98999a528885888d60209b8c9660028852858320541691821515958661083b575b8482526003895260028183209960019a8b81540190558784525281206bffffffffffffffffffffffff60a01b9d8e82541617905580a461082757848b5260068852888b20938c519384116108165750506106e88354610d0c565b601f81116107d0575b50869a601f831160011461076c5782918b9c839260099b9c9d94610761575b50501b916000199060031b1c19161790555b7ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7848751838152a1875260088352848720918254161790555282205580f35b015192508d80610710565b838b52878b20601f1984169c92939290918c8e5b81106107ba57508360099b9c9d9e106107a1575b505050811b019055610722565b015160001960f88460031b161c191690558b8080610794565b81830151845592850192918a01918a018e610780565b838b52878b20601f840160051c81019189851061080c575b601f0160051c019082905b8281106108015750506106f1565b8c81550182906107f3565b90915081906107e8565b634e487b7160e01b8c52604190528afd5b88516339e3563760e11b81528085018c9052fd5b600086815260046020526040902080546001600160a01b031916905583825260038952808220805460001901905561068e565b8651633250574960e11b81528084018a90528b90fd5b865162461bcd60e51b81526020818501526010818d01526f0a4def2c2d8e8f240e8dede40d0d2ced60831b6044820152606490fd5b8880fd5b8680fd5b5050346101c957610323906108d536610c04565b919251926108e284610c39565b858452610ee8565b508290346101c957826003193601126101c957358152600860209081528282205460098252918390205492516001600160a01b039092168252810191909152604090f35b83346104af5761032361094036610c04565b91610d46565b509034610177578060031936011261017757610960610bd3565b9160243561096d81611037565b33151580610a0f575b806109e6575b6109d0576001600160a01b039485169482918691167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258880a48452602052822080546001600160a01b031916909117905580f35b835163a9fbf51f60e01b81523381850152602490fd5b506001600160a01b03811686526005602090815284872033885290528386205460ff161561097c565b506001600160a01b038116331415610976565b503461017757602036600319011261017757918260209335610a4381611037565b50825283528190205490516001600160a01b039091168152f35b8284346104af57806003193601126104af5781519182828354610a7f81610d0c565b90818452602095600191878382169182600014610488575050600114610ab257505050610255929161041e910385610c6b565b91908693508280527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5635b828410610af5575050508201018161041e61025561040b565b8054848a018601528895508794909301928101610adc565b92505034610177576020366003190112610177573563ffffffff60e01b81168091036101775760209250632483248360e11b8114908115610b50575b5015158152f35b6380ac58cd60e01b811491508115610b82575b8115610b71575b5038610b49565b6301ffc9a760e01b14905038610b6a565b635b5e139f60e01b81149150610b63565b919082519283825260005b848110610bbf575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201610b9e565b600435906001600160a01b0382168203610be957565b600080fd5b602435906001600160a01b0382168203610be957565b6060906003190112610be9576001600160a01b03906004358281168103610be957916024359081168103610be9579060443590565b6020810190811067ffffffffffffffff821117610c5557604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff821117610c5557604052565b67ffffffffffffffff8111610c5557601f01601f191660200190565b929192610cb582610c8d565b91610cc36040519384610c6b565b829481845281830111610be9578281602093846000960137010152565b6007546001600160a01b03163303610cf457565b60405163118cdaa760e01b8152336004820152602490fd5b90600182811c92168015610d3c575b6020831014610d2657565b634e487b7160e01b600052602260045260246000fd5b91607f1691610d1b565b6001600160a01b039182169290918315610ecf57600092828452826020956002875260409684888820541696879133151580610e36575b509060027fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9284610e03575b858352600381528b8320805460010190558683525289812080546001600160a01b0319168517905580a41692838303610de25750505050565b6064945051926364283d7b60e01b8452600484015260248301526044820152fd5b600087815260046020526040902080546001600160a01b0319169055848352600381528b83208054600019019055610da9565b91939450915080610e8e575b15610e5257859291879138610d7d565b878688610e6f576024915190637e27328960e01b82526004820152fd5b905163177e802f60e01b81523360048201526024810191909152604490fd5b503387148015610eb3575b80610e425750858252600481523385898420541614610e42565b5086825260058152878220338352815260ff8883205416610e99565b604051633250574960e11b815260006004820152602490fd5b610ef3838383610d46565b813b610f00575b50505050565b604051630a85bd0160e11b8082523360048301526001600160a01b03928316602483015260448201949094526080606482015260209592909116939092908390610f4e906084830190610b93565b039285816000958187895af1849181610ff7575b50610fc2575050503d600014610fba573d610f7c81610c8d565b90610f8a6040519283610c6b565b81528091843d92013e5b80519283610fb557604051633250574960e11b815260048101849052602490fd5b019050fd5b506060610f94565b919450915063ffffffff60e01b1603610fdf575038808080610efa565b60249060405190633250574960e11b82526004820152fd5b9091508681813d8311611030575b61100f8183610c6b565b8101031261032657516001600160e01b031981168103610326579038610f62565b503d611005565b6000818152600260205260409020546001600160a01b031690811561105a575090565b60249060405190637e27328960e01b82526004820152fdfea26469706673582212209cc2faed17f5295d71987614a0873a0c110439e67ec07bfab495ac8067f7d8a464736f6c63430008150033";
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
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "ERC721IncorrectOwner";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "ERC721InsufficientApproval";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "approver";
            readonly type: "address";
        }];
        readonly name: "ERC721InvalidApprover";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }];
        readonly name: "ERC721InvalidOperator";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "ERC721InvalidOwner";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "receiver";
            readonly type: "address";
        }];
        readonly name: "ERC721InvalidReceiver";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "ERC721InvalidSender";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "ERC721NonexistentToken";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "OwnableInvalidOwner";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "OwnableUnauthorizedAccount";
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
            readonly name: "approved";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
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
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "approved";
            readonly type: "bool";
        }];
        readonly name: "ApprovalForAll";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_fromTokenId";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_toTokenId";
            readonly type: "uint256";
        }];
        readonly name: "BatchMetadataUpdate";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "MetadataUpdate";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
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
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
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
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "getApproved";
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
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }];
        readonly name: "isApprovedForAll";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
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
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "royalty";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "royalityReciever";
            readonly type: "address";
        }, {
            readonly internalType: "string";
            readonly name: "tokenURI";
            readonly type: "string";
        }];
        readonly name: "mint";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
        }];
        readonly name: "ownerOf";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
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
            readonly name: "receiver";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "royaltyAmount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
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
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "safeTransferFrom";
        readonly outputs: readonly [];
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
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "safeTransferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "approved";
            readonly type: "bool";
        }];
        readonly name: "setApprovalForAll";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "tokenURI";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
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
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): ERC721RoyaltyInterface;
    static connect(address: string, runner?: ContractRunner | null): ERC721Royalty;
}
export {};
//# sourceMappingURL=ERC721Royalty__factory.d.ts.map