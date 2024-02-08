import { ContractFactory, ContractTransactionResponse } from 'ethers';
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from 'ethers';
import type { NonPayableOverrides } from '../../common';
import type { ERC1155Royalty, ERC1155RoyaltyInterface } from '../../contracts/ERC1155Royalty';
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
    static readonly bytecode = "0x6080346200018d576001600160401b0390601f6200178a38819003918201601f19168301918483118484101762000177578084926020946040528339810103126200018d57516001600160a01b0391828216918290036200018d57604051906020820190811182821017620001775760405260008091526002546001908181811c911680156200016c575b60208210146200015857601f81116200010e575b5050806002558115620000f657600380546001600160a01b0319811684179091556040519316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a36115f79081620001938239f35b60249060405190631e4fbdf760e01b82526004820152fd5b60028352601f0160051c7f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace908101905b8181106200014d57506200009e565b83815582016200013e565b634e487b7160e01b83526022600452602483fd5b90607f16906200008a565b634e487b7160e01b600052604160045260246000fd5b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8062fdd58e146100f657806301ffc9a7146100f15780630e89341c146100ec578063162094c4146100e75780632a55205a146100e25780632eb2c2d6146100dd5780634e1273f4146100d8578063715018a6146100d35780638da5cb5b146100ce578063a22cb465146100c9578063a86c7b24146100c4578063e985e9c5146100bf578063f242432a146100ba5763f2fde38b146100b557600080fd5b610baa565b610ac8565b610a77565b61092e565b61087d565b610854565b6107e0565b610727565b6105b8565b610502565b6103eb565b610265565b6101a3565b610156565b600435906001600160a01b038216820361011157565b600080fd5b602435906001600160a01b038216820361011157565b608435906001600160a01b038216820361011157565b35906001600160a01b038216820361011157565b346101115760403660031901126101115760206101886101746100fb565b602435600052600083526040600020610c5e565b54604051908152f35b6001600160e01b031981160361011157565b346101115760203660031901126101115760206004356101c281610191565b63ffffffff60e01b16636cdb3d1360e11b8114908115610200575b81156101ef575b506040519015158152f35b6301ffc9a760e01b149050386101e4565b6303a24d0760e21b811491506101dd565b919082519283825260005b84811061023d575050826000602080949584010152601f8019910116010190565b60208183018101518483018201520161021c565b906020610262928181520190610211565b90565b346101115760208060031936011261011157600090600435825260068152604082209060405191838154906102998261146a565b8086529260019280841690811561030e57506001146102d3575b6102cf866102c3818a0382610368565b60405191829182610251565b0390f35b9080949650528483205b8284106102fb57505050816102cf936102c3928201019338806102b3565b80548585018701529285019281016102dd565b60ff19168787015250505050151560051b82010191506102c3816102cf38806102b3565b634e487b7160e01b600052604160045260246000fd5b602081019081106001600160401b0382111761036357604052565b610332565b90601f801991011681019081106001600160401b0382111761036357604052565b6001600160401b03811161036357601f01601f191660200190565b81601f82011215610111578035906103bb82610389565b926103c96040519485610368565b8284526020838301011161011157816000926020809301838601378301015290565b34610111576040366003190112610111576001600160401b036024358181116101115761041c9036906004016103a4565b90610425610c32565b600090600435825260209060068252604083209184519182116103635761045682610450855461146a565b856114a4565b80601f831160011461049757508190849561048794959261048c575b50508160011b916000199060031b1c19161790565b905580f35b015190503880610472565b90601f198316956104ad85600052602060002090565b9286905b8882106104ea575050836001959697106104d1575b505050811b01905580f35b015160001960f88460031b161c191690553880806104c6565b806001859682949686015181550195019301906104b1565b34610111576040366003190112610111576004356000526004602052604060018060a01b038160002054166005602052816000205482519182526020820152f35b6001600160401b0381116103635760051b60200190565b9080601f8301121561011157602090823561057481610543565b936105826040519586610368565b818552838086019260051b820101928311610111578301905b8282106105a9575050505090565b8135815290830190830161059b565b346101115760a0366003190112610111576105d16100fb565b6105d9610116565b90604435916001600160401b0390818411610111576105fd6004943690860161055a565b9060643583811161011157610615903690870161055a565b926084359081116101115761062d90369087016103a4565b936001600160a01b038082169033821415806106c0575b61068f5783161561067757156106605761065e9550610efb565b005b604051626a0d4560e21b8152600081880152602490fd5b604051632bfa23e760e11b8152600081890152602490fd5b6040805163711bec9160e11b815233818b019081526001600160a01b038616602082015290918291010390fd5b0390fd5b5081600052600160205260ff6106da336040600020610c5e565b541615610644565b90815180825260208080930193019160005b828110610702575050505090565b8351855293810193928101926001016106f4565b9060206102629281815201906106e2565b34610111576040366003190112610111576004356001600160401b03808211610111573660238301121561011157816004013561076381610543565b926107716040519485610368565b81845260209160248386019160051b8301019136831161011157602401905b8282106107c95785602435868111610111576102cf916107b76107bd92369060040161055a565b90610ce3565b60405191829182610716565b8380916107d584610142565b815201910190610790565b346101115760008060031936011261083e576107fa610c32565b600380546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b6001600160a01b03909116815260200190565b34610111576000366003190112610111576003546040516001600160a01b039091168152602090f35b34610111576040366003190112610111576108966100fb565b602435801515808203610111576001600160a01b038316928315610916576108cb903360005260016020526040600020610c5e565b9060ff801983541691161790557f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160405180610911339482919091602081019215159052565b0390a3005b60405162ced3e160e81b815260006004820152602490fd5b346101115760c0366003190112610111576109476100fb565b602435906064359061095761012c565b9260a4356001600160401b038111610111576109779036906004016103a4565b92610980610c32565b6127108111610a3f5760405161099581610348565b600081526001600160a01b03841615610a265761065e956109c96109fc92610a21966109c360443588611445565b91610d8d565b6109dd846000526004602052604060002090565b80546001600160a01b0319166001600160a01b03909216919091179055565b610a10826000526005602052604060002090565b556000526006602052604060002090565b6114f8565b604051632bfa23e760e11b815260006004820152602490fd5b60405162461bcd60e51b815260206004820152601060248201526f0a4def2c2d8e8f240e8dede40d0d2ced60831b6044820152606490fd5b3461011157604036600319011261011157602060ff610abc610a976100fb565b610a9f610116565b6001600160a01b0390911660009081526001855260409020610c5e565b54166040519015158152f35b346101115760a036600319011261011157610ae16100fb565b610ae9610116565b6084356001600160401b03811161011157610b089036906004016103a4565b906001600160a01b03838116903382141580610b88575b610b6157821615610a265715610b495761065e92610b41606435604435611445565b929091610efb565b604051626a0d4560e21b815260006004820152602490fd5b60405163711bec9160e11b81523360048201526001600160a01b0386166024820152604490fd5b5081600052600160205260ff610ba2336040600020610c5e565b541615610b1f565b3461011157602036600319011261011157610bc36100fb565b610bcb610c32565b6001600160a01b03908116908115610c1957600380546001600160a01b031981168417909155167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3005b604051631e4fbdf760e01b815260006004820152602490fd5b6003546001600160a01b03163303610c4657565b60405163118cdaa760e01b8152336004820152602490fd5b9060018060a01b0316600052602052604060002090565b610c8b9160005260006020526040600020610c5e565b5490565b634e487b7160e01b600052601160045260246000fd5b6000198114610cb45760010190565b610c8f565b8051821015610ccd5760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b91909180518351808203610d6b575050805190610d18610d0283610543565b92610d106040519485610368565b808452610543565b60209190601f1901368484013760005b8151811015610d635780610d4e610d5e9260051b85808287010151918a01015190610c75565b610d588287610cb9565b52610ca5565b610d28565b509193505050565b604051635b05999160e01b815260048101919091526024810191909152604490fd5b908051835190818103610d6b57505060005b8151811015610e1057600581901b8281016020908101519186010151610dd9929185906001600160a01b038216610dde575b505050610ca5565b610d9f565b610e0691610df9610dfe926000526000602052604060002090565b610c5e565b9182546110f9565b9055388481610dd1565b50805191939291600103610eb2576020818101518382015160408051928352928201526001600160a01b0386169160009133917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6291a45b6001600160a01b038416610e7c575b50505050565b8051600103610ea35790602080610e9a9593015191015191336111d4565b38808080610e76565b610ead93336113d9565b610e9a565b6040516001600160a01b0385169060009033907f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb9080610ef3888883611106565b0390a4610e67565b949190918151845190818103610d6b57505060005b825181101561100357600581901b83810160209081015191870101516001600160a01b03929186908a8516610f7c575b610f52948216610f5757505050610ca5565b610f10565b610f7291610df9610dfe926000526000602052604060002090565b9055388581610dd1565b9192939050610f998a610df9846000526000602052604060002090565b54838110610fcc5791879184610f5296959403610fc48d610df9856000526000602052604060002090565b559450610f40565b6040516303dee4c560e01b81526001600160a01b038c16600482015260248101919091526044810184905260648101839052608490fd5b5094919392909360018551146000146110ae576020858101518382015160408051928352928201526001600160a01b03838116929086169133917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6291a45b6001600160a01b038116611077575b5050505050565b845160010361109d5760208061109396015192015192336112c2565b3880808080611070565b6110a99491923361140e565b611093565b6040516001600160a01b03828116919085169033907f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb90806110f1888c83611106565b0390a4611061565b91908201809211610cb457565b909161111d610262936040845260408401906106e2565b9160208184039101526106e2565b90816020910312610111575161026281610191565b909260a0926102629594600180861b0316835260006020840152604083015260608201528160808201520190610211565b919261026295949160a094600180871b038092168552166020840152604083015260608201528160808201520190610211565b3d156111cf573d906111b582610389565b916111c36040519384610368565b82523d6000602084013e565b606090565b9293919093843b6111e6575050505050565b602091611209604051948593849363f23a6e6160e01b9889865260048601611140565b038160006001600160a01b0388165af160009181611292575b5061125b57826112306111a4565b805191908261125457604051632bfa23e760e11b8152806106bc8460048301610841565b9050602001fd5b6001600160e01b0319160361127557503880808080611070565b604051632bfa23e760e11b81529081906106bc9060048301610841565b6112b491925060203d81116112bb575b6112ac8183610368565b81019061112b565b9038611222565b503d6112a2565b939290949194853b6112d7575b505050505050565b6112fa602093604051958694859463f23a6e6160e01b998a875260048701611171565b038160006001600160a01b0388165af16000918161133c575b5061132157826112306111a4565b6001600160e01b0319160361127557503880808080806112cf565b61135591925060203d81116112bb576112ac8183610368565b9038611313565b9261138b61026295936113999360018060a01b031686526000602087015260a0604087015260a08601906106e2565b9084820360608601526106e2565b916080818403910152610211565b9390610262959361138b916113999460018060a01b03809216885216602087015260a0604087015260a08601906106e2565b9293919093843b6113eb575050505050565b602091611209604051948593849363bc197c8160e01b988986526004860161135c565b939290949194853b61142257505050505050565b6112fa602093604051958694859463bc197c8160e01b998a8752600487016113a7565b9160405192600184526020840152604083019160018352606084015260808301604052565b90600182811c9216801561149a575b602083101461148457565b634e487b7160e01b600052602260045260246000fd5b91607f1691611479565b90601f81116114b257505050565b600091825260208220906020601f850160051c830194106114ee575b601f0160051c01915b8281106114e357505050565b8181556001016114d7565b90925082906114ce565b91909182516001600160401b0381116103635761151f81611519845461146a565b846114a4565b602080601f83116001146115565750819061155293949560009261048c5750508160011b916000199060031b1c19161790565b9055565b90601f1983169561156c85600052602060002090565b926000905b8882106115a957505083600195969710611590575b505050811b019055565b015160001960f88460031b161c19169055388080611586565b8060018596829496860151815501950193019061157156fea2646970667358221220b2a59d66ee151aa06006a35cd502bbc0801d2ba4b2e0a37045ad13967c7205e664736f6c63430008150033";
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