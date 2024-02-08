import { ContractFactory, ContractTransactionResponse } from 'ethers';
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from 'ethers';
import type { NonPayableOverrides } from '../../common';
import type { ERC721Royalty, ERC721RoyaltyInterface } from '../../contracts/ERC721Royalty';
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
    static readonly bytecode = "0x608060405234620003a557620014a1803803806200001d81620003aa565b9283398101606082820312620003a55781516001600160401b039190828111620003a557816200004f918501620003d0565b60209182850151848111620003a5576040916200006e918701620003d0565b9401516001600160a01b03948582169491859003620003a5578251908282116200038f576000948554926001958685811c9516801562000384575b8386101462000370578190601f958681116200031d575b508390868311600114620002b9578992620002ad575b5050600019600383901b1c191690861b1786555b8151938411620002995784548581811c911680156200028e575b828210146200027a57908184869594931162000223575b5080928411600114620001bb57508592620001af575b5050600019600383901b1c191690821b1790555b81156200019757600780546001600160a01b0319811684179091556040519316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a361105e9081620004438239f35b60249060405190631e4fbdf760e01b82526004820152fd5b01519050388062000131565b9190859450601f1984168588528388209388905b828210620002095750508411620001ef575b505050811b01905562000145565b015160001960f88460031b161c19169055388080620001e1565b8484015186558897909501949384019390810190620001cf565b90919293508587528187208480870160051c82019284881062000270575b9187968992969594930160051c01915b828110620002615750506200011b565b89815587965088910162000251565b9250819262000241565b634e487b7160e01b87526022600452602487fd5b90607f169062000104565b634e487b7160e01b86526041600452602486fd5b015190503880620000d6565b898052848a208994509190601f1984168b5b87828210620003065750508411620002ec575b505050811b018655620000ea565b015160001960f88460031b161c19169055388080620002de565b8385015186558c97909501949384019301620002cb565b9091508880528389208680850160051c82019286861062000366575b918a91869594930160051c01915b82811062000357575050620000c0565b8b81558594508a910162000347565b9250819262000339565b634e487b7160e01b88526022600452602488fd5b94607f1694620000a9565b634e487b7160e01b600052604160045260246000fd5b600080fd5b6040519190601f01601f191682016001600160401b038111838210176200038f57604052565b919080601f84011215620003a55782516001600160401b0381116200038f5760209062000406601f8201601f19168301620003aa565b92818452828287010111620003a55760005b8181106200042e57508260009394955001015290565b85810183015184820184015282016200041856fe6080604081815260048036101561001557600080fd5b600092833560e01c90816301ffc9a714610ac65750806306fdde0314610a34578063081812fc146109f9578063095ea7b31461091d57806323b872dd146109055780632a55205a146108c157806342842e0e146108985780634bd297fd146105995780636352211e1461056857806370a0823114610513578063715018a6146104b65780638da5cb5b1461048d57806395d89b41146103c0578063a22cb46514610323578063b88d4fde146102bc578063c87b56dd146101c7578063e985e9c5146101755763f2fde38b146100e957600080fd5b3461017157602036600319011261017157610102610b8c565b9061010b610c96565b6001600160a01b0391821692831561015b575050600780546001600160a01b031981168417909155167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b51631e4fbdf760e01b8152908101849052602490fd5b8280fd5b5050346101c357806003193601126101c35760ff81602093610195610b8c565b61019d610ba7565b6001600160a01b0391821683526005875283832091168252855220549151911615158152f35b5080fd5b50903461017157602091826003193601126102b857356101e681610fed565b5083526006825280832092815180948290805461020281610cc2565b91828552600191888382169182600014610291575050600114610253575b50505061024f939291610234910386610c23565b815161023f81610bf2565b5251928284938452830190610b4c565b0390f35b8552868520879350859291905b828410610279575050508201018161023461024f610220565b8054848b018601528995508894909301928101610260565b60ff19168782015293151560051b86019093019350849250610234915061024f9050610220565b8380fd5b8382346101c35760803660031901126101c3576102d7610b8c565b6102df610ba7565b906064356001600160401b03811161031f573660238201121561031f5761031c9381602461031293369301359101610c5f565b9160443591610e9e565b80f35b8480fd5b50903461017157806003193601126101715761033d610b8c565b906024359182151580930361031f576001600160a01b03169283156103ab5750338452600560205280842083855260205280842060ff1981541660ff8416179055519081527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160203392a380f35b836024925191630b61174360e31b8352820152fd5b82843461048a578060031936011261048a5781519182826001938454946103e686610cc2565b91828552602096878382169182600014610463575050600114610426575b50505061024f9291610417910385610c23565b51928284938452830190610b4c565b91908693508083528383205b82841061044b575050508201018161041761024f610404565b8054848a018601528895508794909301928101610432565b60ff19168782015293151560051b86019093019350849250610417915061024f9050610404565b80fd5b5050346101c357816003193601126101c35760075490516001600160a01b039091168152602090f35b833461048a578060031936011261048a576104cf610c96565b600780546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b50913461048a57602036600319011261048a576001600160a01b03610536610b8c565b169283156105535750806020938392526003845220549051908152f35b91516322718ad960e21b815291820152602490fd5b50913461048a57602036600319011261048a575061058860209235610fed565b90516001600160a01b039091168152f35b50823461048a5760a036600319011261048a576105b4610b8c565b602493909260443591906001600160a01b039060643582811691883591839003610894576001600160401b036084358181116108905736602382011215610890576106079036908c818601359101610c5f565b98610610610c96565b612710881161085b5785169485156108455788999a847fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef98999a528885888d60209b8c96600288528583205416918215159586610812575b84825260038952808220805460019081019091558683526002909952812080546001600160a01b0319908116909e17905580a46107fe57848b5260068852888b20938c519384116107ed5750506106bf8354610cc2565b601f81116107a7575b50869a601f83116001146107435782918b9c839260099b9c9d94610738575b50501b916000199060031b1c19161790555b7ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7848751838152a1875260088352848720918254161790555282205580f35b015192508d806106e7565b838b52878b20601f1984169c92939290918c8e5b811061079157508360099b9c9d9e10610778575b505050811b0190556106f9565b015160001960f88460031b161c191690558b808061076b565b81830151845592850192918a01918a018e610757565b838b52878b20601f840160051c8101918985106107e3575b601f0160051c019082905b8281106107d85750506106c8565b8c81550182906107ca565b90915081906107bf565b634e487b7160e01b8c52604190528afd5b88516339e3563760e11b81528085018c9052fd5b600086815260046020526040902080546001600160a01b0319169055838252600389528082208054600019019055610668565b8651633250574960e11b81528084018a90528b90fd5b865162461bcd60e51b81526020818501526010818d01526f0a4def2c2d8e8f240e8dede40d0d2ced60831b6044820152606490fd5b8880fd5b8680fd5b5050346101c35761031c906108ac36610bbd565b919251926108b984610bf2565b858452610e9e565b508290346101c357826003193601126101c357358152600860209081528282205460098252918390205492516001600160a01b039092168252810191909152604090f35b833461048a5761031c61091736610bbd565b91610cfc565b509034610171578060031936011261017157610937610b8c565b9160243561094481610fed565b331515806109e6575b806109bd575b6109a7576001600160a01b039485169482918691167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258880a48452602052822080546001600160a01b031916909117905580f35b835163a9fbf51f60e01b81523381850152602490fd5b506001600160a01b03811686526005602090815284872033885290528386205460ff1615610953565b506001600160a01b03811633141561094d565b503461017157602036600319011261017157918260209335610a1a81610fed565b50825283528190205490516001600160a01b039091168152f35b82843461048a578060031936011261048a5781519182828354610a5681610cc2565b90818452602095600191878382169182600014610463575050600114610a895750505061024f9291610417910385610c23565b91908693508280528383205b828410610aae575050508201018161041761024f610404565b8054848a018601528895508794909301928101610a95565b92505034610171576020366003190112610171573563ffffffff60e01b81168091036101715760209250632483248360e11b8114908115610b09575b5015158152f35b6380ac58cd60e01b811491508115610b3b575b8115610b2a575b5038610b02565b6301ffc9a760e01b14905038610b23565b635b5e139f60e01b81149150610b1c565b919082519283825260005b848110610b78575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201610b57565b600435906001600160a01b0382168203610ba257565b600080fd5b602435906001600160a01b0382168203610ba257565b6060906003190112610ba2576001600160a01b03906004358281168103610ba257916024359081168103610ba2579060443590565b602081019081106001600160401b03821117610c0d57604052565b634e487b7160e01b600052604160045260246000fd5b90601f801991011681019081106001600160401b03821117610c0d57604052565b6001600160401b038111610c0d57601f01601f191660200190565b929192610c6b82610c44565b91610c796040519384610c23565b829481845281830111610ba2578281602093846000960137010152565b6007546001600160a01b03163303610caa57565b60405163118cdaa760e01b8152336004820152602490fd5b90600182811c92168015610cf2575b6020831014610cdc57565b634e487b7160e01b600052602260045260246000fd5b91607f1691610cd1565b6001600160a01b039182169290918315610e8557600092828452826020956002875260409684888820541696879133151580610dec575b509060027fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9284610db9575b858352600381528b8320805460010190558683525289812080546001600160a01b0319168517905580a41692838303610d985750505050565b6064945051926364283d7b60e01b8452600484015260248301526044820152fd5b600087815260046020526040902080546001600160a01b0319169055848352600381528b83208054600019019055610d5f565b91939450915080610e44575b15610e0857859291879138610d33565b878688610e25576024915190637e27328960e01b82526004820152fd5b905163177e802f60e01b81523360048201526024810191909152604490fd5b503387148015610e69575b80610df85750858252600481523385898420541614610df8565b5086825260058152878220338352815260ff8883205416610e4f565b604051633250574960e11b815260006004820152602490fd5b610ea9838383610cfc565b813b610eb6575b50505050565b604051630a85bd0160e11b8082523360048301526001600160a01b03928316602483015260448201949094526080606482015260209592909116939092908390610f04906084830190610b4c565b039285816000958187895af1849181610fad575b50610f78575050503d600014610f70573d610f3281610c44565b90610f406040519283610c23565b81528091843d92013e5b80519283610f6b57604051633250574960e11b815260048101849052602490fd5b019050fd5b506060610f4a565b919450915063ffffffff60e01b1603610f95575038808080610eb0565b60249060405190633250574960e11b82526004820152fd5b9091508681813d8311610fe6575b610fc58183610c23565b8101031261031f57516001600160e01b03198116810361031f579038610f18565b503d610fbb565b6000818152600260205260409020546001600160a01b0316908115611010575090565b60249060405190637e27328960e01b82526004820152fdfea264697066735822122052aa700fff43b364278a2c834a4ba6862af62edf306969729726334c23855cd664736f6c63430008150033";
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