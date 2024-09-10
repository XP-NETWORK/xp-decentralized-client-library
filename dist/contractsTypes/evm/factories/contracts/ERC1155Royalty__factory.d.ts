import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { ERC1155Royalty, ERC1155RoyaltyInterface } from "../../contracts/ERC1155Royalty";
type ERC1155RoyaltyConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ERC1155Royalty__factory extends ContractFactory {
    constructor(...args: ERC1155RoyaltyConstructorParams);
    getDeployTransaction(owner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(owner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ERC1155Royalty & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): ERC1155Royalty__factory;
    static readonly bytecode = "0x6080346200018d576001600160401b0390601f620017d338819003918201601f19168301918483118484101762000177578084926020946040528339810103126200018d57516001600160a01b0391828216918290036200018d57604051906020820190811182821017620001775760405260008091526002546001908181811c911680156200016c575b60208210146200015857601f81116200010e575b5050806002558115620000f657600380546001600160a01b0319811684179091556040519316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a36116409081620001938239f35b60249060405190631e4fbdf760e01b82526004820152fd5b60028352601f0160051c7f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace908101905b8181106200014d57506200009e565b83815582016200013e565b634e487b7160e01b83526022600452602483fd5b90607f16906200008a565b634e487b7160e01b600052604160045260246000fd5b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8062fdd58e146100f657806301ffc9a7146100f15780630e89341c146100ec578063162094c4146100e75780632a55205a146100e25780632eb2c2d6146100dd5780634e1273f4146100d8578063715018a6146100d35780638da5cb5b146100ce578063a22cb465146100c9578063a86c7b24146100c4578063e985e9c5146100bf578063f242432a146100ba5763f2fde38b146100b557600080fd5b610c0a565b610b05565b610aa8565b61093e565b610881565b610858565b6107f7565b61073d565b6105cf565b610518565b610400565b610277565b6101b5565b610156565b600435906001600160a01b038216820361011157565b600080fd5b602435906001600160a01b038216820361011157565b608435906001600160a01b038216820361011157565b35906001600160a01b038216820361011157565b3461011157604036600319011261011157602061019a6101746100fb565b6024356000526000835260406000209060018060a01b0316600052602052604060002090565b54604051908152f35b6001600160e01b031981160361011157565b346101115760203660031901126101115760206004356101d4816101a3565b63ffffffff60e01b16636cdb3d1360e11b8114908115610212575b8115610201575b506040519015158152f35b6301ffc9a760e01b149050386101f6565b6303a24d0760e21b811491506101ef565b919082519283825260005b84811061024f575050826000602080949584010152601f8019910116010190565b60208183018101518483018201520161022e565b906020610274928181520190610223565b90565b346101115760208060031936011261011157600090600435825260068152604082209060405191838154906102ab826114b2565b8086529260019280841690811561032057506001146102e5575b6102e1866102d5818a038261037b565b60405191829182610263565b0390f35b9080949650528483205b82841061030d57505050816102e1936102d5928201019338806102c5565b80548585018701529285019281016102ef565b60ff19168787015250505050151560051b82010191506102d5816102e138806102c5565b634e487b7160e01b600052604160045260246000fd5b6020810190811067ffffffffffffffff82111761037657604052565b610344565b90601f8019910116810190811067ffffffffffffffff82111761037657604052565b67ffffffffffffffff811161037657601f01601f191660200190565b81601f82011215610111578035906103d08261039d565b926103de604051948561037b565b8284526020838301011161011157816000926020809301838601378301015290565b346101115760403660031901126101115767ffffffffffffffff602435818111610111576104329036906004016103b9565b9061043b610c98565b600090600435825260209060068252604083209184519182116103765761046c8261046685546114b2565b856114ec565b80601f83116001146104ad57508190849561049d9495926104a2575b50508160011b916000199060031b1c19161790565b905580f35b015190503880610488565b90601f198316956104c385600052602060002090565b9286905b888210610500575050836001959697106104e7575b505050811b01905580f35b015160001960f88460031b161c191690553880806104dc565b806001859682949686015181550195019301906104c7565b34610111576040366003190112610111576004356000526004602052604060018060a01b038160002054166005602052816000205482519182526020820152f35b67ffffffffffffffff81116103765760051b60200190565b9080601f8301121561011157602090823561058b81610559565b93610599604051958661037b565b818552838086019260051b820101928311610111578301905b8282106105c0575050505090565b813581529083019083016105b2565b346101115760a0366003190112610111576105e86100fb565b6105f0610116565b906044359167ffffffffffffffff908184116101115761061560049436908601610571565b906064358381116101115761062d9036908701610571565b926084359081116101115761064590369087016103b9565b936001600160a01b038082169033821415806106d4575b6106a75783161561068f5715610678576106769550610f5c565b005b604051626a0d4560e21b8152600081880152602490fd5b604051632bfa23e760e11b8152600081890152602490fd5b6040805163711bec9160e11b815233818b019081526001600160a01b038616602082015290918291010390fd5b50600082815260016020908152604080832033845290915290205460ff161561065c565b90815180825260208080930193019160005b828110610718575050505090565b83518552938101939281019260010161070a565b9060206102749281815201906106f8565b346101115760403660031901126101115760043567ffffffffffffffff808211610111573660238301121561011157816004013561077a81610559565b92610788604051948561037b565b81845260209160248386019160051b8301019136831161011157602401905b8282106107e05785602435868111610111576102e1916107ce6107d4923690600401610571565b90610d18565b6040519182918261072c565b8380916107ec84610142565b8152019101906107a7565b346101115760008060031936011261085557610811610c98565b600380546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b34610111576000366003190112610111576003546040516001600160a01b039091168152602090f35b346101115760403660031901126101115761089a6100fb565b602435801515808203610111576001600160a01b038316928315610926573360009081526001602090815260408083206001600160a01b039094168352929052209060ff801983541691161790557f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160405180610921339482919091602081019215159052565b0390a3005b60405162ced3e160e81b815260006004820152602490fd5b346101115760c0366003190112610111576109576100fb565b602435906064359061096761012c565b9260a43567ffffffffffffffff8111610111576109889036906004016103b9565b92610991610c98565b6127108111610a70576040516109a68161035a565b600081526001600160a01b03841615610a5757610676956109fa610a2d92610a52966109f4604435889160405192600184526020840152604083019160018352606084015260808301604052565b91610ddc565b610a0e846000526004602052604060002090565b80546001600160a01b0319166001600160a01b03909216919091179055565b610a41826000526005602052604060002090565b556000526006602052604060002090565b611540565b604051632bfa23e760e11b815260006004820152602490fd5b60405162461bcd60e51b815260206004820152601060248201526f0a4def2c2d8e8f240e8dede40d0d2ced60831b6044820152606490fd5b3461011157604036600319011261011157602060ff610af9610ac86100fb565b610ad0610116565b6001600160a01b0391821660009081526001865260408082209290931681526020919091522090565b54166040519015158152f35b346101115760a036600319011261011157610b1e6100fb565b610b26610116565b60843567ffffffffffffffff811161011157610b469036906004016103b9565b906001600160a01b03838116903382141580610be6575b610bbf57821615610a575715610ba75761067692610b9f6064356044359160405192600184526020840152604083019160018352606084015260808301604052565b929091610f5c565b604051626a0d4560e21b815260006004820152602490fd5b60405163711bec9160e11b81523360048201526001600160a01b0386166024820152604490fd5b50600082815260016020908152604080832033845290915290205460ff1615610b5d565b3461011157602036600319011261011157610c236100fb565b610c2b610c98565b6001600160a01b03908116908115610c7f57600354826bffffffffffffffffffffffff60a01b821617600355167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3005b604051631e4fbdf760e01b815260006004820152602490fd5b6003546001600160a01b03163303610cac57565b60405163118cdaa760e01b8152336004820152602490fd5b634e487b7160e01b600052601160045260246000fd5b6000198114610ce95760010190565b610cc4565b8051821015610d025760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b91909180518351808203610dba575050805190610d4d610d3783610559565b92610d45604051948561037b565b808452610559565b60209190601f1901368484013760005b8151811015610db257600581901b8281018401519087018401516000908152602081815260408083206001600160a01b0390941683529290522054610dad9190610da78287610cee565b52610cda565b610d5d565b509193505050565b604051635b05999160e01b815260048101919091526024810191909152604490fd5b908051835190818103610dba57505060005b8151811015610e7157600581901b8281016020908101519186010151610e28929185906001600160a01b038216610e2d575b505050610cda565b610dee565b610e6791610e48610e5f926000526000602052604060002090565b9060018060a01b0316600052602052604060002090565b91825461115a565b9055388481610e20565b50805191939291600103610f13576020818101518382015160408051928352928201526001600160a01b0386169160009133917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6291a45b6001600160a01b038416610edd575b50505050565b8051600103610f045790602080610efb959301519101519133611235565b38808080610ed7565b610f0e9333611446565b610efb565b6040516001600160a01b0385169060009033907f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb9080610f54888883611167565b0390a4610ec8565b949190918151845190818103610dba57505060005b825181101561106457600581901b83810160209081015191870101516001600160a01b03929186908a8516610fdd575b610fb3948216610fb857505050610cda565b610f71565b610fd391610e48610e5f926000526000602052604060002090565b9055388581610e20565b9192939050610ffa8a610e48846000526000602052604060002090565b5483811061102d5791879184610fb3969594036110258d610e48856000526000602052604060002090565b559450610fa1565b6040516303dee4c560e01b81526001600160a01b038c16600482015260248101919091526044810184905260648101839052608490fd5b50949193929093600185511460001461110f576020858101518382015160408051928352928201526001600160a01b03838116929086169133917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6291a45b6001600160a01b0381166110d8575b5050505050565b84516001036110fe576020806110f4960151920151923361132f565b38808080806110d1565b61110a9491923361147b565b6110f4565b6040516001600160a01b03828116919085169033907f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb9080611152888c83611167565b0390a46110c2565b91908201809211610ce957565b909161117e610274936040845260408401906106f8565b9160208184039101526106f8565b908160209103126101115751610274816101a3565b909260a0926102749594600180861b0316835260006020840152604083015260608201528160808201520190610223565b919261027495949160a094600180871b038092168552166020840152604083015260608201528160808201520190610223565b3d15611230573d906112168261039d565b91611224604051938461037b565b82523d6000602084013e565b606090565b9293919093843b611247575050505050565b60209161126a604051948593849363f23a6e6160e01b98898652600486016111a1565b038160006001600160a01b0388165af1600091816112ff575b506112c25782611291611205565b80519190826112bb57604051632bfa23e760e11b81526001600160a01b0383166004820152602490fd5b9050602001fd5b6001600160e01b031916036112dc575038808080806110d1565b604051632bfa23e760e11b81526001600160a01b03919091166004820152602490fd5b61132191925060203d8111611328575b611319818361037b565b81019061118c565b9038611283565b503d61130f565b939290949194853b611344575b505050505050565b611367602093604051958694859463f23a6e6160e01b998a8752600487016111d2565b038160006001600160a01b0388165af1600091816113a9575b5061138e5782611291611205565b6001600160e01b031916036112dc575038808080808061133c565b6113c291925060203d811161132857611319818361037b565b9038611380565b926113f861027495936114069360018060a01b031686526000602087015260a0604087015260a08601906106f8565b9084820360608601526106f8565b916080818403910152610223565b939061027495936113f8916114069460018060a01b03809216885216602087015260a0604087015260a08601906106f8565b9293919093843b611458575050505050565b60209161126a604051948593849363bc197c8160e01b98898652600486016113c9565b939290949194853b61148f57505050505050565b611367602093604051958694859463bc197c8160e01b998a875260048701611414565b90600182811c921680156114e2575b60208310146114cc57565b634e487b7160e01b600052602260045260246000fd5b91607f16916114c1565b90601f81116114fa57505050565b600091825260208220906020601f850160051c83019410611536575b601f0160051c01915b82811061152b57505050565b81815560010161151f565b9092508290611516565b919091825167ffffffffffffffff8111610376576115688161156284546114b2565b846114ec565b602080601f831160011461159f5750819061159b9394956000926104a25750508160011b916000199060031b1c19161790565b9055565b90601f198316956115b585600052602060002090565b926000905b8882106115f2575050836001959697106115d9575b505050811b019055565b015160001960f88460031b161c191690553880806115cf565b806001859682949686015181550195019301906115ba56fea264697066735822122093a0877de0a835add3923a94a85fccb6b18c8fa07793dddcbe3bc066c89fdbfb64736f6c63430008150033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
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
            readonly name: "balance";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "needed";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "ERC1155InsufficientBalance";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "approver";
            readonly type: "address";
        }];
        readonly name: "ERC1155InvalidApprover";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "idsLength";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "valuesLength";
            readonly type: "uint256";
        }];
        readonly name: "ERC1155InvalidArrayLength";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }];
        readonly name: "ERC1155InvalidOperator";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "receiver";
            readonly type: "address";
        }];
        readonly name: "ERC1155InvalidReceiver";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "ERC1155InvalidSender";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "ERC1155MissingApprovalForAll";
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
            readonly name: "account";
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
            readonly name: "operator";
            readonly type: "address";
        }, {
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
            readonly internalType: "uint256[]";
            readonly name: "ids";
            readonly type: "uint256[]";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256[]";
            readonly name: "values";
            readonly type: "uint256[]";
        }];
        readonly name: "TransferBatch";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
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
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly name: "TransferSingle";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "string";
            readonly name: "value";
            readonly type: "string";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }];
        readonly name: "URI";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
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
            readonly internalType: "address[]";
            readonly name: "accounts";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "ids";
            readonly type: "uint256[]";
        }];
        readonly name: "balanceOfBatch";
        readonly outputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
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
            readonly name: "account";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "royalty";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "royaltyReceiver";
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
        readonly name: "owner";
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
            readonly internalType: "uint256[]";
            readonly name: "ids";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "values";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "safeBatchTransferFrom";
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
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
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
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "newTokenURI";
            readonly type: "string";
        }];
        readonly name: "setTokenURI";
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
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "uri";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): ERC1155RoyaltyInterface;
    static connect(address: string, runner?: ContractRunner | null): ERC1155Royalty;
}
export {};
//# sourceMappingURL=ERC1155Royalty__factory.d.ts.map