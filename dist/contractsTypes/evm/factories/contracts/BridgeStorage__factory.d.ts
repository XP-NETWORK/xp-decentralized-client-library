import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { BridgeStorage, BridgeStorageInterface, ChainFeeStruct } from "../../contracts/BridgeStorage";
type BridgeStorageConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class BridgeStorage__factory extends ContractFactory {
    constructor(...args: BridgeStorageConstructorParams);
    getDeployTransaction(_bootstrapValidator: AddressLike, _bootstrapChainFee: ChainFeeStruct[], overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(_bootstrapValidator: AddressLike, _bootstrapChainFee: ChainFeeStruct[], overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<BridgeStorage & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): BridgeStorage__factory;
    static readonly bytecode = "0x60406080815234620003655762002239803803806200001e8162000395565b9283398101908281830312620003655780516001600160a01b0381169290839003620003655760208281015190926001600160401b039190828211620003655701601f9083828201121562000365578051908382116200037f5760059482861b9087806200008e81850162000395565b80968152019284010192818411620003655788819b9a9b01925b848410620002d857505050505060009687526004968786528681209560019889978860ff19825416179055620000e0600b5462000437565b600b5582995b620000fb575b8851611db09081620004898239f35b83518a1015620002d25781620001128b866200045d565b5101516200013b83620001268d886200045d565b5151818d5193828580945193849201620003bb565b8101600e8152030190205588620001538b866200045d565b5101516200016783620001268d886200045d565b8101600f81520301902090805190888211620002bf5782548b81811c91168015620002b4575b86821014620002a1578881116200025b575b508490888311600114620001ee579180620001da94928d9e9f948992620001e2575b5050600019600383901b1c1916908c1b17905562000437565b9998620000e6565b015190503880620001c1565b8387528587209190601f198416885b818110620002455750928d9e9f9491928e9383620001da9896106200022b575b505050811b01905562000437565b015160001960f88460031b161c191690553880806200021d565b828401518555938e0193928801928801620001fd565b838752858720898085018d1c82019288861062000297575b018c1c01908c905b8281106200028b5750506200019f565b888155018c906200027b565b9250819262000273565b634e487b7160e01b875260228552602487fd5b90607f16906200018d565b634e487b7160e01b865260418452602486fd5b620000ec565b839b9a9b518881116200036557820160609182601f19838703011262000365578d51928084018481108c8211176200036a578f528c8301518b811162000365578f90878f6200032a92870101620003e0565b85528301518d850152820151928a841162000365578e62000352878f809781970101620003e0565b908201528152019301929a999a620000a8565b600080fd5b60246000634e487b7160e01b81526041600452fd5b634e487b7160e01b600052604160045260246000fd5b6040519190601f01601f191682016001600160401b038111838210176200037f57604052565b60005b838110620003cf5750506000910152565b8181015183820152602001620003be565b81601f82011215620003655780516001600160401b0381116200037f5762000412601f8201601f191660200162000395565b92818452602082840101116200036557620004349160208085019101620003bb565b90565b6000198114620004475760010190565b634e487b7160e01b600052601160045260246000fd5b8051821015620004725760209160051b010190565b634e487b7160e01b600052603260045260246000fdfe6080604052600436101561001257600080fd5b60003560e01c8063045cda8d146117d75780630a12e645146117085780630f43a677146116ea57806316f48724146116825780631bd1b2f114611624578063383bf693146115d35780634d01fc2d1461158a5780635cb85312146112e2578063631494d61461127757806368012b6d1461122e57806372ff685714610f195780638b57e25214610e695780639027f6cd14610dbf57806394e9e97e14610d50578063a1b3f4a914610b3e578063bf7dac4f14610af5578063c4a9bd75146105b7578063c7baba0314610588578063e3417c051461054b578063e419d425146104b1578063e4c205c5146102b4578063e949580e14610242578063e97b4167146101ad578063ee7de838146101735763fa52c7d81461012f57600080fd5b3461016e57602036600319011261016e576001600160a01b036101506119ce565b166000526004602052602060ff604060002054166040519015158152f35b600080fd5b3461016e57602036600319011261016e576001600160a01b036101946119ce565b1660005260026020526020604060002054604051908152f35b3461016e57608036600319011261016e576004356001600160401b03811161016e576101dd9036906004016118bf565b6101e56119e4565b60405182818094516101fd81602097888096016118dd565b81016008815203019020602435600052825260406000209060018060a01b031660005281526040600020606435600052815260ff604060002054166040519015158152f35b3461016e57602036600319011261016e576004356001600160401b03811161016e573660238201121561016e5760ff61029e602061028b81943690602481600401359101611879565b81604051938285809451938492016118dd565b8101600d81520301902054166040519015158152f35b3461016e57604036600319011261016e576004356001600160401b03811161016e576102e4903690600401611a09565b9060243590336000526020916004835261030560ff60406000205416611bf0565b604051848382378381868101600881520301902081600052835260406000203360005283526040600020604051858482378481878101600081520301902054600052835261035b60ff6040600020541615611c7d565b60405184838237838186810160088152030190208160005283526040600020336000528352604060002060405185848237848187810160008152030190205460005283526040600020600160ff1982541617905560405184838237838186810160078152030190208160005283526040600020604051858482378481878101600081520301902054600052835260406000206103f78154611cb9565b9055600b546001600160ff1b038116810361049b5760039060011b046040518584823784818781016007815203019020826000528452604060002060405186858237858188810160008152030190205460005284526040600020546001820180921161049b57101561046557005b604051848382378381868101600e81520301902055826040519384928337810160008152030190206104978154611cb9565b9055005b634e487b7160e01b600052601160045260246000fd5b3461016e576104df6104ef60206104c736611ba6565b949183604094929451938285809451938492016118dd565b8101600c81520301902090611900565b805482101561016e5760019161050491611a36565b50610538604051916105218361051a8184611aa2565b0384611858565b6105316040518095819301611aa2565b0383611858565b61054760405192839283611b37565b0390f35b3461016e5761056161057160206104c736611ba6565b8101600a81520301902090611900565b906000526020526020604060002054604051908152f35b3461016e5760206105ae6105a861059e36611b5c565b9293919093611c4b565b91611c64565b54604051908152f35b3461016e57604036600319011261016e576105d06119ce565b6024356001600160401b03811161016e573660238201121561016e576001600160401b0381600401351161016e57366024826004013560051b8301011161016e579033600052600460205261062c60ff60406000205416611bf0565b6000915b806004013583106107ec575033600052600460205261065660ff60406000205416611bf0565b60018060a01b0316806000526002602052604060002054600660205260406000203360005260205260406000208160005260205260ff604060002054166107a85781600052600660205260406000203360005260205260406000208160005260205260406000209160019160ff1993838582541617905581600052600560205260406000208360005260205260406000208160005260205260406000206106fd8154611cb9565b9055600b54906001600160ff1b038216820361049b57600382851b049083600052600560205260406000208560005260205260406000209060005260205260406000205484820180921161049b57101561075357005b81600052600460205260ff60406000205416156000146107a25761077690611cb9565b600b555b6000526004602052604060002091825416179055600260205260406000206104978154611cb9565b5061077a565b606460405162461bcd60e51b815260206004820152602060248201527f416c726561647920766f74656420666f7220746869732076616c696461746f726044820152fd5b60ff61081a61081061080686856004013560248701611d31565b6020810190611d1c565b6020810190611d48565b604051929181908437820191602081600d94858152030190205416610ae957602061086561085c61085387866004013560248801611d31565b83810190611d1c565b82810190611d48565b92836040519485938437820190815203019020805460ff1916600117905560206108a061089a85600485013560248601611d31565b80611d48565b919082604051938492833781016003815203019020926108cb61080682846004013560248601611d31565b938054600160401b811015610a4f576108e991600182018155611a36565b949094610ad3576108fa8180611d48565b906001600160401b038211610a4f5761091d826109178954611a68565b89611cc8565b600090601f8311600114610a655791806109539261095f95946000926109d0575b50508160011b916000199060031b1c19161790565b86556020810190611d48565b94906001600160401b038611610a4f57610989866109806001850154611a68565b60018501611cc8565b600090601f87116001146109db57866109c99596976001936109c1936000926109d05750508160011b916000199060031b1c19161790565b910155611cb9565b9190610630565b01359050898061093e565b6001830160005260206000209160005b601f1989168110610a3757509660019283926109c997989983601f19811610610a1d575b505050811b01910155611cb9565b0135600019600384901b60f8161c19169055888080610a0f565b909260206001819286860135815501940191016109eb565b634e487b7160e01b600052604160045260246000fd5b8760005260206000209160005b601f1985168110610abb575091839160019361095f9695601f19811610610aa1575b505050811b018655610810565b0135600019600384901b60f8161c19169055888080610a94565b90926020600181928686013581550194019101610a72565b634e487b7160e01b600052600060045260246000fd5b5090916109c990611cb9565b3461016e57602036600319011261016e576004356001600160401b03811161016e57610b2b602061028b819336906004016118bf565b8101600081520301902054604051908152f35b3461016e57604036600319011261016e57610b576119ce565b610b5f6119fa565b903360005260209060048252610b7c60ff60406000205416611bf0565b6001600160a01b0316600081815260028352604080822054600685528183203384528552818320818452855291205490939060ff16610d0d5781600052600683526040600020336000528352604060002084600052835260406000209160ff1992600184825416179055806000526005845260406000209180159081159384600052865260406000208760005286526040600020610c1a8154611cb9565b9055600b54966001600160ff1b038816880361049b5760038860011b04908460005260058852604060002086600052885260406000209060005287526040600020546001820180921161049b571015610c6f57005b80610cf5575b15610cb5575060029450610c8a600b54611cb9565b600b555b6000526004835260ff60406000209283541691161790555260406000206104978154611cb9565b80610cde575b610cc9575b60029450610c8e565b841561049b5760029460001901600b55610cc0565b50806000526004845260ff60406000205416610cbb565b50816000526004855260ff6040600020541615610c75565b6064836040519062461bcd60e51b825280600483015260248201527f416c726561647920766f74656420666f7220746869732076616c696461746f726044820152fd5b3461016e57602036600319011261016e576004356001600160401b03811161016e57610da4610dab610d8e602061028b6105479536906004016118bf565b8101600f81520301902060405192838092611aa2565b0382611858565b604051918291602083526020830190611926565b3461016e57610dd36105a861059e36611b5c565b80546001600160401b038111610a4f579060209160405191610dfa848360051b0184611858565b8183526000908152838120938084015b838310610e1f5760405180610547878261194b565b600282600192604051610e318161183d565b604051610e4281610da4818e611aa2565b8152604051610e5781610da4818e8a01611aa2565b83820152815201960192019194610e0a565b3461016e57608036600319011261016e576001600160401b0360043581811161016e57610e9a9036906004016118bf565b9060243590811161016e57610eb6610ee79136906004016118bf565b610ed76020610ec36119e4565b9481604051938285809451938492016118dd565b8101600981520301902090611900565b9060018060a01b03166000526020526040600020606435600052602052602060ff604060002054166040519015158152f35b3461016e57608036600319011261016e576001600160401b0360043581811161016e57610f4a903690600401611a09565b909160243581811161016e57610f64903690600401611a09565b60449491943583811161016e57610f7f903690600401611a09565b94909260643585811161016e57610f9a903690600401611a09565b9490963360005260209760048952610fb960ff60406000205416611bf0565b60ff604051838582378a81858101600d81520301902054166111f0579261102e899a959360609a936110256110499997604051838582378781858101600d815203019020600160ff198254161790556040519b6110158d61183d565b8e8d52878d019e8f523691611879565b8a523691611879565b89528260405193849283378101600c81520301902091611c64565b8054600160401b811015610a4f5761106691600182018155611a36565b919091610ad35751805190838211610a4f5761108c826110868554611a68565b85611cc8565b8590601f83116001146111865791806110bf926001959460009261117b5750508160011b916000199060031b1c19161790565b81555b019151928351918211610a4f576110dd826110868554611a68565b80601f831160011461111857508190610497939460009261110d5750508160011b916000199060031b1c19161790565b01519050848061093e565b90601f198316948460005282600020926000905b87821061116357505083600195961061114a575b505050811b019055005b015160001960f88460031b161c19169055838080611140565b8060018596829496860151815501950193019061112c565b01519050888061093e565b90601f1983169184600052876000209260005b898282106111da5750509160019594929183879593106111c1575b505050811b0181556110c2565b015160001960f88460031b161c191690558780806111b4565b6001859682939686015181550195019301611199565b60405162461bcd60e51b8152600481018a9052601660248201527514da59db985d1d5c9948185b1c9958591e481d5cd95960521b6044820152606490fd5b3461016e57602036600319011261016e576004356001600160401b03811161016e57611264602061028b819336906004016118bf565b8101600181520301902054604051908152f35b3461016e57604036600319011261016e576004356001600160401b03811161016e576112a79036906004016118bf565b6112c360206024359281604051938285809451938492016118dd565b81016003815203019020805482101561016e5760019161050491611a36565b3461016e57604036600319011261016e576001600160401b0360043581811161016e57611313903690600401611a09565b909160243581811161016e5761132d9036906004016118bf565b92336000526020916004835261134a60ff60406000205416611bf0565b611367604051858482378481878101600981520301902086611900565b3360005283526040600020906040519185848437858301928581600195868152030190205460005284526113a360ff6040600020541615611c7d565b6113c0604051868582378581888101600981520301902087611900565b33600052845260406000206040518685823785818881018681520301902054600052845260406000208260ff19825416179055611410604051868582378581888101600a81520301902087611900565b6040518685823785818881018681520301902054600052845260406000206114388154611cb9565b9055600b546001600160ff1b038116810361049b57600390831b04611470604051878682378681898101600a81520301902088611900565b6040518786823786818981018781520301902054600052855260406000205483820180921161049b5710156114a157005b604051858482378481878101600f815203019020908651908111610a4f576114d3816114cd8454611a68565b84611cc8565b84601f821160011461152557819061150693949596979860009261117b5750508160011b916000199060031b1c19161790565b90555b8360405194859384378201908152030190206104978154611cb9565b601f1982169083600052866000209160005b81811061157557509883869798999a9695961061155c575b505050811b019055611509565b015160001960f88460031b161c1916905587808061154f565b8a830151845592860192918801918801611537565b3461016e57602036600319011261016e576004356001600160401b03811161016e576115c0602061028b819336906004016118bf565b8101600e81520301902054604051908152f35b3461016e57602036600319011261016e576004356001600160401b03811161016e57602061160681923690600401611a09565b91908260405193849283378101600381520301902054604051908152f35b3461016e57606036600319011261016e5761163d6119ce565b6116456119fa565b9060018060a01b03166000526005602052604060002090151560005260205260406000206044356000526020526020604060002054604051908152f35b3461016e57606036600319011261016e5761169b6119ce565b6001600160a01b03602435818116929083900361016e571660005260066020526040600020906000526020526040600020604435600052602052602060ff604060002054166040519015158152f35b3461016e57600036600319011261016e576020600b54604051908152f35b3461016e5760208060031936011261016e576001600160401b039060043582811161016e578161028b61173f9236906004016118bf565b81016003815203019020918254908111610a4f57829060405191611768848360051b0184611858565b8183526000908152838120938084015b83831061178d5760405180610547878261194b565b60028260019260405161179f8161183d565b6040516117b081610da4818e611aa2565b81526040516117c581610da4818e8a01611aa2565b83820152815201960192019194611778565b3461016e57606036600319011261016e576004356001600160401b03811161016e57602061028b61180c9236906004016118bf565b8101600781520301902060243560005260205260406000206044356000526020526020604060002054604051908152f35b604081019081106001600160401b03821117610a4f57604052565b90601f801991011681019081106001600160401b03821117610a4f57604052565b9291926001600160401b038211610a4f57604051916118a2601f8201601f191660200184611858565b82948184528183011161016e578281602093846000960137010152565b9080601f8301121561016e578160206118da93359101611879565b90565b60005b8381106118f05750506000910152565b81810151838201526020016118e0565b60209061191a9282604051948386809551938492016118dd565b82019081520301902090565b9060209161193f815180928185528580860191016118dd565b601f01601f1916010190565b602080820190808352835180925260409283810182858560051b8401019601946000925b858410611980575050505050505090565b9091929394959685806119bd600193603f198682030188528b5190836119ad83518a84528a840190611926565b9201519084818403910152611926565b99019401940192959493919061196f565b600435906001600160a01b038216820361016e57565b604435906001600160a01b038216820361016e57565b60243590811515820361016e57565b9181601f8401121561016e578235916001600160401b03831161016e576020838186019501011161016e57565b8054821015611a525760005260206000209060011b0190600090565b634e487b7160e01b600052603260045260246000fd5b90600182811c92168015611a98575b6020831014611a8257565b634e487b7160e01b600052602260045260246000fd5b91607f1691611a77565b805460009392611ab182611a68565b918282526020936001918281169081600014611b185750600114611ad7575b5050505050565b90939495506000929192528360002092846000945b838610611b0457505050500101903880808080611ad0565b805485870183015294019385908201611aec565b60ff19168685015250505090151560051b010191503880808080611ad0565b9091611b4e6118da93604084526040840190611926565b916020818403910152611926565b604060031982011261016e576001600160401b039160043583811161016e5782611b8891600401611a09565b9390939260243591821161016e57611ba291600401611a09565b9091565b90606060031983011261016e576001600160401b0360043581811161016e5783611bd2916004016118bf565b9260243591821161016e57611be9916004016118bf565b9060443590565b15611bf757565b60405162461bcd60e51b815260206004820152602660248201527f4f6e6c792076616c696461746f72732063616e2063616c6c20746869732066756044820152653731ba34b7b760d11b6064820152608490fd5b6020908260405193849283378101600c81520301902090565b6020919283604051948593843782019081520301902090565b15611c8457565b60405162461bcd60e51b815260206004820152600d60248201526c105b1c9958591e481d9bdd1959609a1b6044820152606490fd5b600019811461049b5760010190565b90601f8111611cd657505050565b600091825260208220906020601f850160051c83019410611d12575b601f0160051c01915b828110611d0757505050565b818155600101611cfb565b9092508290611cf2565b903590603e198136030182121561016e570190565b90821015611a52576118da9160051b810190611d1c565b903590601e198136030182121561016e57018035906001600160401b03821161016e5760200191813603831361016e5756fea26469706673582212208d4540e56ec9996f70e852f4017f748909bf2699d6e136077c318555d0c725ee64736f6c63430008150033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_bootstrapValidator";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "chain";
                readonly type: "string";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "string";
                readonly name: "royaltyReceiver";
                readonly type: "string";
            }];
            readonly internalType: "struct ChainFee[]";
            readonly name: "_bootstrapChainFee";
            readonly type: "tuple[]";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "_transactionHash";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "_chain";
            readonly type: "string";
        }, {
            readonly internalType: "bytes";
            readonly name: "_signature";
            readonly type: "bytes";
        }, {
            readonly internalType: "string";
            readonly name: "_signerAddress";
            readonly type: "string";
        }];
        readonly name: "approveLockNft";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_stakerAddress";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "validatorAddress";
                readonly type: "string";
            }, {
                readonly components: readonly [{
                    readonly internalType: "string";
                    readonly name: "signerAddress";
                    readonly type: "string";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "signature";
                    readonly type: "bytes";
                }];
                readonly internalType: "struct SignerAndSignature";
                readonly name: "signerAndSignature";
                readonly type: "tuple";
            }];
            readonly internalType: "struct ValidatorAddressWithSignerAndSignature[]";
            readonly name: "_validatorAddressWithSignerAndSignature";
            readonly type: "tuple[]";
        }];
        readonly name: "approveStake";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly name: "chainEpoch";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly name: "chainFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "chainFeeVoted";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "chainFeeVotes";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly name: "chainRoyalty";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "chainRoyaltyVoted";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "chainRoyaltyVotes";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "_chain";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "_fee";
            readonly type: "uint256";
        }];
        readonly name: "changeChainFee";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "_chain";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "_royaltyReceiver";
            readonly type: "string";
        }];
        readonly name: "changeChainRoyaltyReceiver";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_validatorAddress";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "_status";
            readonly type: "bool";
        }];
        readonly name: "changeValidatorStatus";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "transactionHash";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "chain";
            readonly type: "string";
        }];
        readonly name: "getLockNftSignatures";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "signerAddress";
                readonly type: "string";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct SignerAndSignature[]";
            readonly name: "";
            readonly type: "tuple[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "transactionHash";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "chain";
            readonly type: "string";
        }];
        readonly name: "getLockNftSignaturesCount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "stakerAddress";
            readonly type: "string";
        }];
        readonly name: "getStakingSignatures";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "signerAddress";
                readonly type: "string";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct SignerAndSignature[]";
            readonly name: "";
            readonly type: "tuple[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "stakerAddress";
            readonly type: "string";
        }];
        readonly name: "getStakingSignaturesCount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "lockSignatures";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "signerAddress";
            readonly type: "string";
        }, {
            readonly internalType: "bytes";
            readonly name: "signature";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly name: "royaltyEpoch";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "stakingSignatures";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "signerAddress";
            readonly type: "string";
        }, {
            readonly internalType: "bytes";
            readonly name: "signature";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "usedSignatures";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "validatorCount";
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
        readonly name: "validatorEpoch";
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
        }, {
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "validatorStatusChangeVotes";
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
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "validatorVoted";
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
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "validators";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): BridgeStorageInterface;
    static connect(address: string, runner?: ContractRunner | null): BridgeStorage;
}
export {};
//# sourceMappingURL=BridgeStorage__factory.d.ts.map