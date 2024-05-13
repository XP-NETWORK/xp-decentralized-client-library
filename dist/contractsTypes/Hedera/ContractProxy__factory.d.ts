import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../evm/common";
import type { ContractProxy, ContractProxyInterface } from "./ContractProxy";
type ContractProxyConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ContractProxy__factory extends ContractFactory {
    constructor(...args: ContractProxyConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractProxy & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): ContractProxy__factory;
    static readonly bytecode = "0x60806040818152346100605780600080805260016020526001828220556001815260028282205560028152600482822055600381526008828220556004815260108282205560058152602082822055600681522055611f4690816100668239f35b600080fdfe60e0806040526004908136101561001557600080fd5b60003560e01c908163098d3228146117e65750806315dacbea1461178b57806351761bcc1461176d578063618dc65e1461164b5780639b23d3d9146115ab578063d0def521146110f3578063e79342ce146103d35763f39901571461007957600080fd5b6040366003190112610396576001600160401b038135818111610396576100a390369084016119ce565b90602435908111610396576100bb90369084016119ce565b90604051906100c9826118a7565b6001825260005b6020808210156100f257906020916100e6611c8a565b908286010152016100d0565b85856000808688610101611c8a565b50858352602094600186526040842054610119611c5e565b30888201526040519161012b836118a7565b82528782015261013a83611ca6565b5261014482611ca6565b5061014d611b7e565b92835285830152306040830152604051610166816118f8565b83815260608301526001608083015263ffffffff60a08301528260c083015260e0820152610192611b5f565b30858201526040810190627864508252806101008401525160070b15806103c7575b6103bb575b506040516101f0816101e28782019463ea83f29360e01b865288602484015260448301906119ec565b03601f198101835282611913565b5190346101675af1610200611e61565b90156103ae57604081805181010312610396576040610220838301611e91565b9101516001600160a01b0381169190829003610396576102b19060030b5b60030b601661024c82611cf9565b916102ab604460405180957f4661696c656420746f2063726561746520746f6b656e2e204572726f7220436f8a83015263032329d160e51b604083015261029b815180928c8686019101611986565b8101036024810186520184611913565b14611cc9565b60405163053aa6f360e11b81526001600160a01b03919091169290828183816000885af19081156103a257600091610370575b5060168114908115610365575b501561032357507fb120d480bc501942d4f721c70535f5708a65b73f8cc7079d71ebbb2d2174dc5e91604051908152a1005b6064916040519162461bcd60e51b8352820152601960248201527f4661696c656420746f206173736f636961746520746f6b656e000000000000006044820152fd5b60c2915014846102f1565b90508281813d831161039b575b6103878183611913565b810103126103965751846102e4565b600080fd5b503d61037d565b6040513d6000823e3d90fd5b5060006102b1601561023e565b6276a7009052856101b9565b50805160070b156101b4565b5034610396576040366003190112610396576103ed611803565b602435918260070b80930361039657610404611bd0565b5061040d611bd0565b5060405163050fc3b560e31b602082019081526001600160a01b03909316602482015260448082019490945292835260808301906001600160401b038211848310176110de576000808486856040525190826101675af161046c611e61565b60a052610477611bd0565b90156110d7575060a0515160a0510160c052604060a05160c0510312610396576104a5602060a05101611e91565b604060a05101516080526001600160401b03608051116103965760c060805160a051018151031261039657604051906104dd8261185a565b602060805160a0510101516001600160401b038111610396576101208160805160a051010160c051031261039657604051906105188261188b565b60208160805160a051010101516001600160401b03811161039657610160818360805160a05101010160c051031261039657604051906105578261188b565b6020818460805160a05101010101516001600160401b038111610396576105929060208060c0510191848760805160a0510101010101611ead565b82526040818460805160a05101010101516001600160401b038111610396576105cf9060208060c0510191848760805160a0510101010101611ead565b60208301526105ea6060828560805160a05101010101611eef565b604083015260808184825160a05101010101516001600160401b038111610396576106299060208060c0510191848760805160a0510101010101611ead565b606083015261064360a08285608051835101010101611f03565b608083015261065e60c0828560805160a05101010101611e9f565b60a083015261067960e0828560805160a05101010101611f03565b60c0830152610100818460805160a05101010101516001600160401b03811161039657602060c05101603f82848760805160a0510101010101121561039657602081838660805160a051010101010151906106d382611c47565b916106e16040519384611913565b80835260208301602060c0510160408360051b85888b60805160a0510101010101011161039657604083868960805160a0510101010101905b60408360051b85888b60805160a0510101010101018210610f2a575050505060e0830152606060ff19828560805160a05101010160c051030112610396576107b06101606040519261076b846118dd565b610782610120828860805160a05101010101611e9f565b845261079b610140828860805160a05101010101611eef565b60208501528560805160a05101010101611e9f565b604082015261010082015282526107d160408260805160a051010101611e9f565b60208301526107ea60608260805160a051010101611f03565b6040830152610802608082815160a051010101611f03565b606083015261081a60a0826080518251010101611f03565b608083015260c08160805160a051010101516001600160401b03811161039657602060c05101603f828460805160a051010101011215610396576020818360805160a05101010101519061086d82611c47565b9161087b6040519384611913565b8083526020830191602060c05101604060a08402838860805160a05101010101011161039657916040838660805160a05101010101925b604060a08402828860805160a05101010101018410610eaf575050505060a083015260e08160805160a051010101516001600160401b03811161039657602060c05101603f828460805160a051010101011215610396576020818360805160a05101010101519061092282611c47565b916109306040519384611913565b8083526020830191602060c05101604060c08402838860805160a05101010101011161039657916040838660805160a05101010101925b604060c08402828860805160a05101010101018410610e24575050505060c08301526101008160805160a051010101516001600160401b03811161039657602060c05101603f828460805160a051010101011215610396576020818360805160a0510101010151906109d882611c47565b916109e66040519384611913565b8083526020830191602060c05101604060c08402838860805160a05101010101011161039657916040838660805160a05101010101925b604060c08402828860805160a05101010101018410610d99575050505060e08301526101208160805160a05101010151906001600160401b038211610396576020610a77928160c051019260805160a05101010101611ead565b6101008201528252610a91604060805160a0510101611e9f565b6020830152610aa8606060805160a0510101611eef565b6040830152610abe6080805160a0510101611e9f565b606083015260a060805181510101516001600160401b03811161039657610af59060208060c051019160805160a051010101611ead565b6080830152610b0c60c060805160a0510101611eef565b60a08301525b6040519060030b81526040602082015281519160c06040830152825192610b4861012094856101008601526102208501906119ec565b93602082015160070b9084015260408101511515610140840152606081015115156101608401526080810151151561018084015260a08101519360ff19848203016101a08501526020808651928381520195019060005b818110610d435750505060c08101519360ff19848203016101c08501526020808651928381520195019060005b818110610ce25750505060e08101519360ff19848203016101e08501526020808651928381520195019060005b818110610c7d57505050610c238394610100610c6593015160ff19868303016102008701526119a9565b602083015160070b606085015260018060a01b036040840151166080850152606083015160070b60a08501526080830151603f198583030160c08601526119a9565b60a0909101516001600160a01b031660e08301520390f35b909195602060c06001928951805160070b82528381015160070b84830152604081015160070b6040830152848060a01b03606082015116606083015260808101511515608083015260a08580821b039101511660a08201520197019101919091610bf9565b909195602060c06001928951805160070b82528381015160070b84830152604081015160070b6040830152606081015160070b606083015260808101511515608083015260a08580821b039101511660a08201520197019101919091610bcc565b8251805160070b88526020818101516001600160a01b03908116828b01526040808401511515908b01526060808401511515908b0152608092830151169189019190915260a09097019690920191600101610b9f565b60c060208582510301126103965760c08060206040948551610dba8161185a565b610dc389611e9f565b8152610dd0838a01611e9f565b83820152610ddf878a01611e9f565b87820152610def60608a01611eef565b6060820152610e0060808a01611f03565b6080820152610e1160a08a01611eef565b60a0820152815201950194925050610a1d565b60c060208582510301126103965760c08060206040948551610e458161185a565b610e4e89611e9f565b8152610e5b838a01611e9f565b83820152610e6a878a01611e9f565b87820152610e7a60608a01611e9f565b6060820152610e8b60808a01611f03565b6080820152610e9c60a08a01611eef565b60a0820152815201950194925050610967565b60a060208560c0510301126103965760a08060206040948551610ed1816118c2565b610eda89611e9f565b8152610ee7838a01611eef565b83820152610ef6878a01611f03565b87820152610f0660608a01611f03565b6060820152610f1760808a01611eef565b60808201528152019501949250506108b2565b8151906001600160401b038211610396576040601f1983878a8d60805160a051010101010160c0510301126103965760405190610f66826118a7565b604083878a8d60805160a051010101010101518252606083878a8d60805160a05101010101010151906001600160401b0382116103965760a08b83868a8d601f1994608051875101010101010160c051030112610396578a92608083868a8d60405198610fd28a6118c2565b610fed604086868686868c5160a05101010101010101611f03565b8a5261100a606086868686868c5160a05101010101010101611eef565b60208b0152855160a05101010101010101516001600160401b0381116103965783868a8f8e9061105660a0966040602060c051019188888888886080518f510101010101010101611ead565b60408b015260805186510101010101010151936001600160401b038511610396576110c160c0602096958f988c8f60409b6110aa8c9b8e8d89510191888888888860805160a0510101010101010101611ead565b606089015260805160a05101010101010101611eef565b608082015283820152815201920191905061071a565b6015610b12565b604190634e487b7160e01b6000525260246000fd5b50604036600319011261039657611108611803565b6001600160401b03906024358281116103965761112890369085016119ce565b60405163053aa6f360e11b81526020946001600160a01b039093169285908290816000875af180156103a25760009061157c575b6111dd915060168114908115611571575b61117690611cf9565b906111d8604760405180947f4661696c656420746f206173736f636961746520746f6b656e2e204572726f728b8301526601021b7b2329d160cd1b60408301526111c8815180928d8686019101611986565b8101036027810185520183611913565b611cc9565b6040516111e9816118a7565b6001918282528560005b818110611561575061122390604051836112168295518092858086019101611986565b8101038084520182611913565b61122c82611ca6565b5261123681611ca6565b50604051908582019263707a02cd60e11b845260848301908560248501526000604485015260606064850152825180925260a48401918860a48260051b8701019401926000905b8a838310611536578a8a8a6000808c61129f818e03601f198101835282611913565b516101679382855af16112b0611e61565b9015611511578051810193606082878701960312610396576112d3868301611e91565b916112e060408201611e9f565b50606081015191821161039657019380603f8601121561039657858501519461130886611c47565b956113166040519788611913565b80875260408888019160051b830101928311610396576040889201905b8382106114fa57505050506000916113b36113a3601685945b60030b6102ab60428b61135e84611cf9565b60405196827f4661696c656420746f206d696e7420746f6b656e2e204572726f7220436f646589948501526101d160f51b604085015282519283918686019101611986565b8101036022810186520184611913565b6113bc85611ca6565b518260405188810192635cfc901160e01b845287602483015230604483015233606483015260070b6084820152608481526113f68161185a565b51925af192611403611e61565b93156114c7578084805181010312610396576114af6060936114aa61144a847ff5e67f6c9b65e0ac28f93821e04b2a0256e87b830fdd38fb215cbf48a04504bf9801611e91565b60030b601661145882611cf9565b916102ab603a60405180957f4661696c656420746f207472616e7366657220746f6b656e2e200000000000008b83015261149a815180928d8686019101611986565b810103601a810186520184611913565b611ca6565b5160070b9060405192835233908301526040820152a1005b7ff5e67f6c9b65e0ac28f93821e04b2a0256e87b830fdd38fb215cbf48a04504bf93506114af6060936114aa601561144a565b82809161150684611e9f565b815201910190611333565b50915060008060405193611524856118f8565b8185526113b36113a36016601561134c565b8061155286979860a39794959697198b820301865289516119a9565b9701920192019093929161127d565b60608282860101520186906111f3565b60c28114915061116d565b508481813d83116115a4575b6115928183611913565b81010312610396576111dd905161115c565b503d611588565b34610396576000806116066101e26115c236611819565b604051639b23d3d960e01b602082019081526001600160a01b03958616602483015293851660448201529390911660648401526084830152929091829060a4820190565b5190826101675af1611616611e61565b901561164157602081805181010312610396576116366020809201611e91565b6040519060030b8152f35b5060206015611636565b503461039657604036600319011261039657611665611803565b90602435916001600160401b0383116103965736602384011215610396576101e26116d86116a060009594856024889736930135910161194f565b604080516330c6e32f60e11b602082019081526001600160a01b039096166024820152604481019190915292839160648301906119a9565b5190826101675af16116e8611e61565b907f4af4780e06fe8cb9df64b0794fa6f01399af979175bb988e35e0e57e594567bc6040518215158152604060208201528061172760408201866119a9565b0390a1156117555760165b61175160405192839260030b83526040602084015260408301906119a9565b0390f35b50604051611762816118f8565b600081526015611732565b34610396576000366003190112610396576020604051627864508152f35b34610396576000806116066101e26117a236611819565b604051630aed65f560e11b602082019081526001600160a01b03958616602483015293851660448201529390911660648401526084830152929091829060a4820190565b34610396576000366003190112610396578063ffffffff60209252f35b600435906001600160a01b038216820361039657565b6080906003190112610396576001600160a01b0360043581811681036103965791602435828116810361039657916044359081168103610396579060643590565b60c081019081106001600160401b0382111761187557604052565b634e487b7160e01b600052604160045260246000fd5b61012081019081106001600160401b0382111761187557604052565b604081019081106001600160401b0382111761187557604052565b60a081019081106001600160401b0382111761187557604052565b606081019081106001600160401b0382111761187557604052565b602081019081106001600160401b0382111761187557604052565b90601f801991011681019081106001600160401b0382111761187557604052565b6001600160401b03811161187557601f01601f191660200190565b92919261195b82611934565b916119696040519384611913565b829481845281830111610396578281602093846000960137010152565b60005b8381106119995750506000910152565b8181015183820152602001611989565b906020916119c281518092818552858086019101611986565b601f01601f1916010190565b9080601f83011215610396578160206119e99335910161194f565b90565b90611a3d611a19611a076101608551908086528501906119a9565b602085015184820360208601526119a9565b604084015160018060a01b03166040840152606084015183820360608501526119a9565b9160808101511515608083015260a081015160070b60a083015260c0810151151560c083015260e0808201519383810382850152845190818152602081016020808460051b8401019701936000925b848410611ace575050505050506040610140916101008091015190815160070b9085015260018060a01b03602082015116610120850152015160070b91015290565b909192939497602080600192601f19858203018752818c5180518352015190604083820152815115156040820152848060a01b038383015116606082015260c0611b3f611b29604085015160a060808601528a8501906119a9565b6060850151848203603f190160a08601526119a9565b926080878060a01b03910151169101529a01940194019294939190611a8c565b60405190611b6c826118dd565b60006040838281528260208201520152565b60405190611b8b8261188b565b8160608152606060208201526000604082015260608082015260006080820152600060a0820152600060c0820152606060e0820152610100611bcb611b5f565b910152565b60405190611bdd8261185a565b60405160a083611bec8361188b565b611bf4611b7e565b8352600092836020820152836040820152606090848282015284608082015281848201528160c08201528160e0820152816101008201528252836020830152836040830152838183015260808201520152565b6001600160401b0381116118755760051b60200190565b60405190611c6b826118c2565b6000608083828152826020820152606060408201526060808201520152565b60405190611c97826118a7565b81600081526020611bcb611c5e565b805115611cb35760200190565b634e487b7160e01b600052603260045260246000fd5b15611cd15750565b60405162461bcd60e51b815260206004820152908190611cf59060248301906119a9565b0390fd5b806000917a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000080821015611e53575b506d04ee2d6d415b85acef810000000080831015611e44575b50662386f26fc1000080831015611e35575b506305f5e10080831015611e26575b5061271080831015611e17575b506064821015611e07575b600a80921015611dfd575b60019081602181860195611d9287611934565b96611da06040519889611913565b808852611daf601f1991611934565b01366020890137860101905b611dc7575b5050505090565b600019019083906f181899199a1a9b1b9c1cb0b131b232b360811b8282061a835304918215611df857919082611dbb565b611dc0565b9160010191611d7f565b9190606460029104910191611d74565b60049193920491019138611d69565b60089193920491019138611d5c565b60109193920491019138611d4d565b60209193920491019138611d3b565b604093508104915038611d22565b3d15611e8c573d90611e7282611934565b91611e806040519384611913565b82523d6000602084013e565b606090565b51908160030b820361039657565b51908160070b820361039657565b81601f82011215610396578051611ec381611934565b92611ed16040519485611913565b81845260208284010111610396576119e99160208085019101611986565b51906001600160a01b038216820361039657565b519081151582036103965756fea2646970667358221220577e55177c5623797b37a00a4c869d12028f9ed29544afa0ac86bb63b4d55aab64736f6c63430008150033";
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "CallResponseEvent";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "int64";
            readonly name: "serialNumber";
            readonly type: "int64";
        }];
        readonly name: "Mint";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "NftCollectionCreated";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DEFAULT_EXPIRY";
        readonly outputs: readonly [{
            readonly internalType: "int64";
            readonly name: "";
            readonly type: "int64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "MAX_INT";
        readonly outputs: readonly [{
            readonly internalType: "int64";
            readonly name: "";
            readonly type: "int64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "symbol";
            readonly type: "string";
        }];
        readonly name: "deployNft";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "string";
            readonly name: "tokenURI";
            readonly type: "string";
        }];
        readonly name: "mint";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "encodedFunctionSelector";
            readonly type: "bytes";
        }];
        readonly name: "redirectForToken";
        readonly outputs: readonly [{
            readonly internalType: "int256";
            readonly name: "responseCode";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes";
            readonly name: "response";
            readonly type: "bytes";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "int64";
            readonly name: "serialNumber";
            readonly type: "int64";
        }];
        readonly name: "royaltyInfo";
        readonly outputs: readonly [{
            readonly internalType: "int256";
            readonly name: "";
            readonly type: "int256";
        }, {
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "string";
                        readonly name: "name";
                        readonly type: "string";
                    }, {
                        readonly internalType: "string";
                        readonly name: "symbol";
                        readonly type: "string";
                    }, {
                        readonly internalType: "address";
                        readonly name: "treasury";
                        readonly type: "address";
                    }, {
                        readonly internalType: "string";
                        readonly name: "memo";
                        readonly type: "string";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "tokenSupplyType";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "int64";
                        readonly name: "maxSupply";
                        readonly type: "int64";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "freezeDefault";
                        readonly type: "bool";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint256";
                            readonly name: "keyType";
                            readonly type: "uint256";
                        }, {
                            readonly components: readonly [{
                                readonly internalType: "bool";
                                readonly name: "inheritAccountKey";
                                readonly type: "bool";
                            }, {
                                readonly internalType: "address";
                                readonly name: "contractId";
                                readonly type: "address";
                            }, {
                                readonly internalType: "bytes";
                                readonly name: "ed25519";
                                readonly type: "bytes";
                            }, {
                                readonly internalType: "bytes";
                                readonly name: "ECDSA_secp256k1";
                                readonly type: "bytes";
                            }, {
                                readonly internalType: "address";
                                readonly name: "delegatableContractId";
                                readonly type: "address";
                            }];
                            readonly internalType: "struct IHederaTokenService.KeyValue";
                            readonly name: "key";
                            readonly type: "tuple";
                        }];
                        readonly internalType: "struct IHederaTokenService.TokenKey[]";
                        readonly name: "tokenKeys";
                        readonly type: "tuple[]";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "int64";
                            readonly name: "second";
                            readonly type: "int64";
                        }, {
                            readonly internalType: "address";
                            readonly name: "autoRenewAccount";
                            readonly type: "address";
                        }, {
                            readonly internalType: "int64";
                            readonly name: "autoRenewPeriod";
                            readonly type: "int64";
                        }];
                        readonly internalType: "struct IHederaTokenService.Expiry";
                        readonly name: "expiry";
                        readonly type: "tuple";
                    }];
                    readonly internalType: "struct IHederaTokenService.HederaToken";
                    readonly name: "token";
                    readonly type: "tuple";
                }, {
                    readonly internalType: "int64";
                    readonly name: "totalSupply";
                    readonly type: "int64";
                }, {
                    readonly internalType: "bool";
                    readonly name: "deleted";
                    readonly type: "bool";
                }, {
                    readonly internalType: "bool";
                    readonly name: "defaultKycStatus";
                    readonly type: "bool";
                }, {
                    readonly internalType: "bool";
                    readonly name: "pauseStatus";
                    readonly type: "bool";
                }, {
                    readonly components: readonly [{
                        readonly internalType: "int64";
                        readonly name: "amount";
                        readonly type: "int64";
                    }, {
                        readonly internalType: "address";
                        readonly name: "tokenId";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "useHbarsForPayment";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "useCurrentTokenForPayment";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "address";
                        readonly name: "feeCollector";
                        readonly type: "address";
                    }];
                    readonly internalType: "struct IHederaTokenService.FixedFee[]";
                    readonly name: "fixedFees";
                    readonly type: "tuple[]";
                }, {
                    readonly components: readonly [{
                        readonly internalType: "int64";
                        readonly name: "numerator";
                        readonly type: "int64";
                    }, {
                        readonly internalType: "int64";
                        readonly name: "denominator";
                        readonly type: "int64";
                    }, {
                        readonly internalType: "int64";
                        readonly name: "minimumAmount";
                        readonly type: "int64";
                    }, {
                        readonly internalType: "int64";
                        readonly name: "maximumAmount";
                        readonly type: "int64";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "netOfTransfers";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "address";
                        readonly name: "feeCollector";
                        readonly type: "address";
                    }];
                    readonly internalType: "struct IHederaTokenService.FractionalFee[]";
                    readonly name: "fractionalFees";
                    readonly type: "tuple[]";
                }, {
                    readonly components: readonly [{
                        readonly internalType: "int64";
                        readonly name: "numerator";
                        readonly type: "int64";
                    }, {
                        readonly internalType: "int64";
                        readonly name: "denominator";
                        readonly type: "int64";
                    }, {
                        readonly internalType: "int64";
                        readonly name: "amount";
                        readonly type: "int64";
                    }, {
                        readonly internalType: "address";
                        readonly name: "tokenId";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "useHbarsForPayment";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "address";
                        readonly name: "feeCollector";
                        readonly type: "address";
                    }];
                    readonly internalType: "struct IHederaTokenService.RoyaltyFee[]";
                    readonly name: "royaltyFees";
                    readonly type: "tuple[]";
                }, {
                    readonly internalType: "string";
                    readonly name: "ledgerId";
                    readonly type: "string";
                }];
                readonly internalType: "struct IHederaTokenService.TokenInfo";
                readonly name: "tokenInfo";
                readonly type: "tuple";
            }, {
                readonly internalType: "int64";
                readonly name: "serialNumber";
                readonly type: "int64";
            }, {
                readonly internalType: "address";
                readonly name: "ownerId";
                readonly type: "address";
            }, {
                readonly internalType: "int64";
                readonly name: "creationTime";
                readonly type: "int64";
            }, {
                readonly internalType: "bytes";
                readonly name: "metadata";
                readonly type: "bytes";
            }, {
                readonly internalType: "address";
                readonly name: "spenderId";
                readonly type: "address";
            }];
            readonly internalType: "struct IHederaTokenService.NonFungibleTokenInfo";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "int64";
            readonly name: "responseCode";
            readonly type: "int64";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "serialNumber";
            readonly type: "uint256";
        }];
        readonly name: "transferFromNFT";
        readonly outputs: readonly [{
            readonly internalType: "int64";
            readonly name: "responseCode";
            readonly type: "int64";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): ContractProxyInterface;
    static connect(address: string, runner?: ContractRunner | null): ContractProxy;
}
export {};
//# sourceMappingURL=ContractProxy__factory.d.ts.map