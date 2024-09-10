"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTCollectionDeployer__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "collectionAddress",
                type: "address",
            },
        ],
        name: "CreatedCollection",
        type: "event",
    },
    {
        inputs: [],
        name: "deployNFT1155Collection",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                internalType: "string",
                name: "symbol",
                type: "string",
            },
        ],
        name: "deployNFT721Collection",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_owner",
                type: "address",
            },
        ],
        name: "setOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x60808060405234610016576130a5908161001c8239f35b600080fdfe6080604081815260048036101561001557600080fd5b600092833560e01c90816313af403514610234575080638da5cb5b1461020c578063bcf11fd8146101065763f3b341ee1461004f57600080fd5b3461010257826003193601126101025782546001600160a01b03919082169061007933831461032f565b8351916117d38084019284841067ffffffffffffffff8511176100ef57509183916020936103b28439815203019084f080156100e3576020935016907f498b885ccb6cfb6192d597146a6881b03ad70ef20f3ec5d6e770df9eb894d9ab838251848152a151908152f35b505051903d90823e3d90fd5b634e487b7160e01b885260419052602487fd5b8280fd5b5091903461020857806003193601126102085767ffffffffffffffff83358181116102045761013890369086016102b1565b6024358281116102005761014f90369087016102b1565b84546001600160a01b0393919084169061016a33831461032f565b8551936114eb808601948511868610176101ed578594939261019e89936101ac93611b858939606087526060870190610371565b908582036020870152610371565b920152039084f080156100e3576020935016907f498b885ccb6cfb6192d597146a6881b03ad70ef20f3ec5d6e770df9eb894d9ab838251848152a151908152f35b634e487b7160e01b895260418a52602489fd5b8480fd5b8380fd5b5080fd5b505034610208578160031936011261020857905490516001600160a01b039091168152602090f35b92505034610102576020366003190112610102576001600160a01b0381358181169391929084900361020057845492831661027b5750506001600160a01b03191617815580f35b62461bcd60e51b825260209082015260126024820152714f776e657220616c7265616479207365742160701b6044820152606490fd5b81601f820112156103145780359067ffffffffffffffff928383116103195760405193601f8401601f19908116603f0116850190811185821017610319576040528284526020838301011161031457816000926020809301838601378301015290565b600080fd5b634e487b7160e01b600052604160045260246000fd5b1561033657565b60405162461bcd60e51b815260206004820152601360248201527213db9b1e481bdddb995c8818d85b8818d85b1b606a1b6044820152606490fd5b919082519283825260005b84811061039d575050826000602080949584010152601f8019910116010190565b60208183018101518483018201520161037c56fe6080346200018d576001600160401b0390601f620017d338819003918201601f19168301918483118484101762000177578084926020946040528339810103126200018d57516001600160a01b0391828216918290036200018d57604051906020820190811182821017620001775760405260008091526002546001908181811c911680156200016c575b60208210146200015857601f81116200010e575b5050806002558115620000f657600380546001600160a01b0319811684179091556040519316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a36116409081620001938239f35b60249060405190631e4fbdf760e01b82526004820152fd5b60028352601f0160051c7f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace908101905b8181106200014d57506200009e565b83815582016200013e565b634e487b7160e01b83526022600452602483fd5b90607f16906200008a565b634e487b7160e01b600052604160045260246000fd5b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8062fdd58e146100f657806301ffc9a7146100f15780630e89341c146100ec578063162094c4146100e75780632a55205a146100e25780632eb2c2d6146100dd5780634e1273f4146100d8578063715018a6146100d35780638da5cb5b146100ce578063a22cb465146100c9578063a86c7b24146100c4578063e985e9c5146100bf578063f242432a146100ba5763f2fde38b146100b557600080fd5b610c0a565b610b05565b610aa8565b61093e565b610881565b610858565b6107f7565b61073d565b6105cf565b610518565b610400565b610277565b6101b5565b610156565b600435906001600160a01b038216820361011157565b600080fd5b602435906001600160a01b038216820361011157565b608435906001600160a01b038216820361011157565b35906001600160a01b038216820361011157565b3461011157604036600319011261011157602061019a6101746100fb565b6024356000526000835260406000209060018060a01b0316600052602052604060002090565b54604051908152f35b6001600160e01b031981160361011157565b346101115760203660031901126101115760206004356101d4816101a3565b63ffffffff60e01b16636cdb3d1360e11b8114908115610212575b8115610201575b506040519015158152f35b6301ffc9a760e01b149050386101f6565b6303a24d0760e21b811491506101ef565b919082519283825260005b84811061024f575050826000602080949584010152601f8019910116010190565b60208183018101518483018201520161022e565b906020610274928181520190610223565b90565b346101115760208060031936011261011157600090600435825260068152604082209060405191838154906102ab826114b2565b8086529260019280841690811561032057506001146102e5575b6102e1866102d5818a038261037b565b60405191829182610263565b0390f35b9080949650528483205b82841061030d57505050816102e1936102d5928201019338806102c5565b80548585018701529285019281016102ef565b60ff19168787015250505050151560051b82010191506102d5816102e138806102c5565b634e487b7160e01b600052604160045260246000fd5b6020810190811067ffffffffffffffff82111761037657604052565b610344565b90601f8019910116810190811067ffffffffffffffff82111761037657604052565b67ffffffffffffffff811161037657601f01601f191660200190565b81601f82011215610111578035906103d08261039d565b926103de604051948561037b565b8284526020838301011161011157816000926020809301838601378301015290565b346101115760403660031901126101115767ffffffffffffffff602435818111610111576104329036906004016103b9565b9061043b610c98565b600090600435825260209060068252604083209184519182116103765761046c8261046685546114b2565b856114ec565b80601f83116001146104ad57508190849561049d9495926104a2575b50508160011b916000199060031b1c19161790565b905580f35b015190503880610488565b90601f198316956104c385600052602060002090565b9286905b888210610500575050836001959697106104e7575b505050811b01905580f35b015160001960f88460031b161c191690553880806104dc565b806001859682949686015181550195019301906104c7565b34610111576040366003190112610111576004356000526004602052604060018060a01b038160002054166005602052816000205482519182526020820152f35b67ffffffffffffffff81116103765760051b60200190565b9080601f8301121561011157602090823561058b81610559565b93610599604051958661037b565b818552838086019260051b820101928311610111578301905b8282106105c0575050505090565b813581529083019083016105b2565b346101115760a0366003190112610111576105e86100fb565b6105f0610116565b906044359167ffffffffffffffff908184116101115761061560049436908601610571565b906064358381116101115761062d9036908701610571565b926084359081116101115761064590369087016103b9565b936001600160a01b038082169033821415806106d4575b6106a75783161561068f5715610678576106769550610f5c565b005b604051626a0d4560e21b8152600081880152602490fd5b604051632bfa23e760e11b8152600081890152602490fd5b6040805163711bec9160e11b815233818b019081526001600160a01b038616602082015290918291010390fd5b50600082815260016020908152604080832033845290915290205460ff161561065c565b90815180825260208080930193019160005b828110610718575050505090565b83518552938101939281019260010161070a565b9060206102749281815201906106f8565b346101115760403660031901126101115760043567ffffffffffffffff808211610111573660238301121561011157816004013561077a81610559565b92610788604051948561037b565b81845260209160248386019160051b8301019136831161011157602401905b8282106107e05785602435868111610111576102e1916107ce6107d4923690600401610571565b90610d18565b6040519182918261072c565b8380916107ec84610142565b8152019101906107a7565b346101115760008060031936011261085557610811610c98565b600380546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b34610111576000366003190112610111576003546040516001600160a01b039091168152602090f35b346101115760403660031901126101115761089a6100fb565b602435801515808203610111576001600160a01b038316928315610926573360009081526001602090815260408083206001600160a01b039094168352929052209060ff801983541691161790557f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160405180610921339482919091602081019215159052565b0390a3005b60405162ced3e160e81b815260006004820152602490fd5b346101115760c0366003190112610111576109576100fb565b602435906064359061096761012c565b9260a43567ffffffffffffffff8111610111576109889036906004016103b9565b92610991610c98565b6127108111610a70576040516109a68161035a565b600081526001600160a01b03841615610a5757610676956109fa610a2d92610a52966109f4604435889160405192600184526020840152604083019160018352606084015260808301604052565b91610ddc565b610a0e846000526004602052604060002090565b80546001600160a01b0319166001600160a01b03909216919091179055565b610a41826000526005602052604060002090565b556000526006602052604060002090565b611540565b604051632bfa23e760e11b815260006004820152602490fd5b60405162461bcd60e51b815260206004820152601060248201526f0a4def2c2d8e8f240e8dede40d0d2ced60831b6044820152606490fd5b3461011157604036600319011261011157602060ff610af9610ac86100fb565b610ad0610116565b6001600160a01b0391821660009081526001865260408082209290931681526020919091522090565b54166040519015158152f35b346101115760a036600319011261011157610b1e6100fb565b610b26610116565b60843567ffffffffffffffff811161011157610b469036906004016103b9565b906001600160a01b03838116903382141580610be6575b610bbf57821615610a575715610ba75761067692610b9f6064356044359160405192600184526020840152604083019160018352606084015260808301604052565b929091610f5c565b604051626a0d4560e21b815260006004820152602490fd5b60405163711bec9160e11b81523360048201526001600160a01b0386166024820152604490fd5b50600082815260016020908152604080832033845290915290205460ff1615610b5d565b3461011157602036600319011261011157610c236100fb565b610c2b610c98565b6001600160a01b03908116908115610c7f57600354826bffffffffffffffffffffffff60a01b821617600355167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3005b604051631e4fbdf760e01b815260006004820152602490fd5b6003546001600160a01b03163303610cac57565b60405163118cdaa760e01b8152336004820152602490fd5b634e487b7160e01b600052601160045260246000fd5b6000198114610ce95760010190565b610cc4565b8051821015610d025760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b91909180518351808203610dba575050805190610d4d610d3783610559565b92610d45604051948561037b565b808452610559565b60209190601f1901368484013760005b8151811015610db257600581901b8281018401519087018401516000908152602081815260408083206001600160a01b0390941683529290522054610dad9190610da78287610cee565b52610cda565b610d5d565b509193505050565b604051635b05999160e01b815260048101919091526024810191909152604490fd5b908051835190818103610dba57505060005b8151811015610e7157600581901b8281016020908101519186010151610e28929185906001600160a01b038216610e2d575b505050610cda565b610dee565b610e6791610e48610e5f926000526000602052604060002090565b9060018060a01b0316600052602052604060002090565b91825461115a565b9055388481610e20565b50805191939291600103610f13576020818101518382015160408051928352928201526001600160a01b0386169160009133917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6291a45b6001600160a01b038416610edd575b50505050565b8051600103610f045790602080610efb959301519101519133611235565b38808080610ed7565b610f0e9333611446565b610efb565b6040516001600160a01b0385169060009033907f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb9080610f54888883611167565b0390a4610ec8565b949190918151845190818103610dba57505060005b825181101561106457600581901b83810160209081015191870101516001600160a01b03929186908a8516610fdd575b610fb3948216610fb857505050610cda565b610f71565b610fd391610e48610e5f926000526000602052604060002090565b9055388581610e20565b9192939050610ffa8a610e48846000526000602052604060002090565b5483811061102d5791879184610fb3969594036110258d610e48856000526000602052604060002090565b559450610fa1565b6040516303dee4c560e01b81526001600160a01b038c16600482015260248101919091526044810184905260648101839052608490fd5b50949193929093600185511460001461110f576020858101518382015160408051928352928201526001600160a01b03838116929086169133917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6291a45b6001600160a01b0381166110d8575b5050505050565b84516001036110fe576020806110f4960151920151923361132f565b38808080806110d1565b61110a9491923361147b565b6110f4565b6040516001600160a01b03828116919085169033907f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb9080611152888c83611167565b0390a46110c2565b91908201809211610ce957565b909161117e610274936040845260408401906106f8565b9160208184039101526106f8565b908160209103126101115751610274816101a3565b909260a0926102749594600180861b0316835260006020840152604083015260608201528160808201520190610223565b919261027495949160a094600180871b038092168552166020840152604083015260608201528160808201520190610223565b3d15611230573d906112168261039d565b91611224604051938461037b565b82523d6000602084013e565b606090565b9293919093843b611247575050505050565b60209161126a604051948593849363f23a6e6160e01b98898652600486016111a1565b038160006001600160a01b0388165af1600091816112ff575b506112c25782611291611205565b80519190826112bb57604051632bfa23e760e11b81526001600160a01b0383166004820152602490fd5b9050602001fd5b6001600160e01b031916036112dc575038808080806110d1565b604051632bfa23e760e11b81526001600160a01b03919091166004820152602490fd5b61132191925060203d8111611328575b611319818361037b565b81019061118c565b9038611283565b503d61130f565b939290949194853b611344575b505050505050565b611367602093604051958694859463f23a6e6160e01b998a8752600487016111d2565b038160006001600160a01b0388165af1600091816113a9575b5061138e5782611291611205565b6001600160e01b031916036112dc575038808080808061133c565b6113c291925060203d811161132857611319818361037b565b9038611380565b926113f861027495936114069360018060a01b031686526000602087015260a0604087015260a08601906106f8565b9084820360608601526106f8565b916080818403910152610223565b939061027495936113f8916114069460018060a01b03809216885216602087015260a0604087015260a08601906106f8565b9293919093843b611458575050505050565b60209161126a604051948593849363bc197c8160e01b98898652600486016113c9565b939290949194853b61148f57505050505050565b611367602093604051958694859463bc197c8160e01b998a875260048701611414565b90600182811c921680156114e2575b60208310146114cc57565b634e487b7160e01b600052602260045260246000fd5b91607f16916114c1565b90601f81116114fa57505050565b600091825260208220906020601f850160051c83019410611536575b601f0160051c01915b82811061152b57505050565b81815560010161151f565b9092508290611516565b919091825167ffffffffffffffff8111610376576115688161156284546114b2565b846114ec565b602080601f831160011461159f5750819061159b9394956000926104a25750508160011b916000199060031b1c19161790565b9055565b90601f198316956115b585600052602060002090565b926000905b8882106115f2575050836001959697106115d9575b505050811b019055565b015160001960f88460031b161c191690553880806115cf565b806001859682949686015181550195019301906115ba56fea264697066735822122093a0877de0a835add3923a94a85fccb6b18c8fa07793dddcbe3bc066c89fdbfb64736f6c63430008150033608060405234620003a557620014eb803803806200001d81620003aa565b9283398101606082820312620003a55781516001600160401b039190828111620003a557816200004f918501620003d0565b60209182850151848111620003a5576040916200006e918701620003d0565b9401516001600160a01b03948582169491859003620003a5578251908282116200038f576000948554926001958685811c9516801562000384575b8386101462000370578190601f958681116200031d575b508390868311600114620002b9578992620002ad575b5050600019600383901b1c191690861b1786555b8151938411620002995784548581811c911680156200028e575b828210146200027a57908184869594931162000223575b5080928411600114620001bb57508592620001af575b5050600019600383901b1c191690821b1790555b81156200019757600780546001600160a01b0319811684179091556040519316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a36110a89081620004438239f35b60249060405190631e4fbdf760e01b82526004820152fd5b01519050388062000131565b9190859450601f1984168588528388209388905b828210620002095750508411620001ef575b505050811b01905562000145565b015160001960f88460031b161c19169055388080620001e1565b8484015186558897909501949384019390810190620001cf565b90919293508587528187208480870160051c82019284881062000270575b9187968992969594930160051c01915b828110620002615750506200011b565b89815587965088910162000251565b9250819262000241565b634e487b7160e01b87526022600452602487fd5b90607f169062000104565b634e487b7160e01b86526041600452602486fd5b015190503880620000d6565b898052848a208994509190601f1984168b5b87828210620003065750508411620002ec575b505050811b018655620000ea565b015160001960f88460031b161c19169055388080620002de565b8385015186558c97909501949384019301620002cb565b9091508880528389208680850160051c82019286861062000366575b918a91869594930160051c01915b82811062000357575050620000c0565b8b81558594508a910162000347565b9250819262000339565b634e487b7160e01b88526022600452602488fd5b94607f1694620000a9565b634e487b7160e01b600052604160045260246000fd5b600080fd5b6040519190601f01601f191682016001600160401b038111838210176200038f57604052565b919080601f84011215620003a55782516001600160401b0381116200038f5760209062000406601f8201601f19168301620003aa565b92818452828287010111620003a55760005b8181106200042e57508260009394955001015290565b85810183015184820184015282016200041856fe6080604081815260048036101561001557600080fd5b600092833560e01c90816301ffc9a714610b0d5750806306fdde0314610a5d578063081812fc14610a22578063095ea7b31461094657806323b872dd1461092e5780632a55205a146108ea57806342842e0e146108c15780634bd297fd146105be5780636352211e1461058d57806370a0823114610538578063715018a6146104db5780638da5cb5b146104b257806395d89b41146103c7578063a22cb4651461032a578063b88d4fde146102c2578063c87b56dd146101cd578063e985e9c51461017b5763f2fde38b146100e957600080fd5b3461017757602036600319011261017757610102610bd3565b9061010b610ce0565b6001600160a01b03918216928315610161575050600754826bffffffffffffffffffffffff60a01b821617600755167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b51631e4fbdf760e01b8152908101849052602490fd5b8280fd5b5050346101c957806003193601126101c95760ff8160209361019b610bd3565b6101a3610bee565b6001600160a01b0391821683526005875283832091168252855220549151911615158152f35b5080fd5b50903461017757602091826003193601126102be57356101ec81611037565b5083526006825280832092815180948290805461020881610d0c565b91828552600191888382169182600014610297575050600114610259575b50505061025593929161023a910386610c6b565b815161024581610c39565b5251928284938452830190610b93565b0390f35b8552868520879350859291905b82841061027f575050508201018161023a610255610226565b8054848b018601528995508894909301928101610266565b60ff19168782015293151560051b8601909301935084925061023a91506102559050610226565b8380fd5b8382346101c95760803660031901126101c9576102dd610bd3565b6102e5610bee565b9060643567ffffffffffffffff81116103265736602382011215610326576103239381602461031993369301359101610ca9565b9160443591610ee8565b80f35b8480fd5b509034610177578060031936011261017757610344610bd3565b9060243591821515809303610326576001600160a01b03169283156103b25750338452600560205280842083855260205280842060ff1981541660ff8416179055519081527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160203392a380f35b836024925191630b61174360e31b8352820152fd5b8284346104af57806003193601126104af5781519182826001938454946103ed86610d0c565b9182855260209687838216918260001461048857505060011461042d575b505050610255929161041e910385610c6b565b51928284938452830190610b93565b91908693508083527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf65b828410610470575050508201018161041e61025561040b565b8054848a018601528895508794909301928101610457565b60ff19168782015293151560051b8601909301935084925061041e9150610255905061040b565b80fd5b5050346101c957816003193601126101c95760075490516001600160a01b039091168152602090f35b83346104af57806003193601126104af576104f4610ce0565b600780546001600160a01b0319811690915581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b5091346104af5760203660031901126104af576001600160a01b0361055b610bd3565b169283156105785750806020938392526003845220549051908152f35b91516322718ad960e21b815291820152602490fd5b5091346104af5760203660031901126104af57506105ad60209235611037565b90516001600160a01b039091168152f35b5082346104af5760a03660031901126104af576105d9610bd3565b602493909260443591906001600160a01b0390606435828116918835918390036108bd5767ffffffffffffffff6084358181116108b957366023820112156108b95761062d9036908c818601359101610ca9565b98610636610ce0565b612710881161088457851694851561086e5788999a847fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef98999a528885888d60209b8c9660028852858320541691821515958661083b575b8482526003895260028183209960019a8b81540190558784525281206bffffffffffffffffffffffff60a01b9d8e82541617905580a461082757848b5260068852888b20938c519384116108165750506106e88354610d0c565b601f81116107d0575b50869a601f831160011461076c5782918b9c839260099b9c9d94610761575b50501b916000199060031b1c19161790555b7ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7848751838152a1875260088352848720918254161790555282205580f35b015192508d80610710565b838b52878b20601f1984169c92939290918c8e5b81106107ba57508360099b9c9d9e106107a1575b505050811b019055610722565b015160001960f88460031b161c191690558b8080610794565b81830151845592850192918a01918a018e610780565b838b52878b20601f840160051c81019189851061080c575b601f0160051c019082905b8281106108015750506106f1565b8c81550182906107f3565b90915081906107e8565b634e487b7160e01b8c52604190528afd5b88516339e3563760e11b81528085018c9052fd5b600086815260046020526040902080546001600160a01b031916905583825260038952808220805460001901905561068e565b8651633250574960e11b81528084018a90528b90fd5b865162461bcd60e51b81526020818501526010818d01526f0a4def2c2d8e8f240e8dede40d0d2ced60831b6044820152606490fd5b8880fd5b8680fd5b5050346101c957610323906108d536610c04565b919251926108e284610c39565b858452610ee8565b508290346101c957826003193601126101c957358152600860209081528282205460098252918390205492516001600160a01b039092168252810191909152604090f35b83346104af5761032361094036610c04565b91610d46565b509034610177578060031936011261017757610960610bd3565b9160243561096d81611037565b33151580610a0f575b806109e6575b6109d0576001600160a01b039485169482918691167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258880a48452602052822080546001600160a01b031916909117905580f35b835163a9fbf51f60e01b81523381850152602490fd5b506001600160a01b03811686526005602090815284872033885290528386205460ff161561097c565b506001600160a01b038116331415610976565b503461017757602036600319011261017757918260209335610a4381611037565b50825283528190205490516001600160a01b039091168152f35b8284346104af57806003193601126104af5781519182828354610a7f81610d0c565b90818452602095600191878382169182600014610488575050600114610ab257505050610255929161041e910385610c6b565b91908693508280527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5635b828410610af5575050508201018161041e61025561040b565b8054848a018601528895508794909301928101610adc565b92505034610177576020366003190112610177573563ffffffff60e01b81168091036101775760209250632483248360e11b8114908115610b50575b5015158152f35b6380ac58cd60e01b811491508115610b82575b8115610b71575b5038610b49565b6301ffc9a760e01b14905038610b6a565b635b5e139f60e01b81149150610b63565b919082519283825260005b848110610bbf575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201610b9e565b600435906001600160a01b0382168203610be957565b600080fd5b602435906001600160a01b0382168203610be957565b6060906003190112610be9576001600160a01b03906004358281168103610be957916024359081168103610be9579060443590565b6020810190811067ffffffffffffffff821117610c5557604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff821117610c5557604052565b67ffffffffffffffff8111610c5557601f01601f191660200190565b929192610cb582610c8d565b91610cc36040519384610c6b565b829481845281830111610be9578281602093846000960137010152565b6007546001600160a01b03163303610cf457565b60405163118cdaa760e01b8152336004820152602490fd5b90600182811c92168015610d3c575b6020831014610d2657565b634e487b7160e01b600052602260045260246000fd5b91607f1691610d1b565b6001600160a01b039182169290918315610ecf57600092828452826020956002875260409684888820541696879133151580610e36575b509060027fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9284610e03575b858352600381528b8320805460010190558683525289812080546001600160a01b0319168517905580a41692838303610de25750505050565b6064945051926364283d7b60e01b8452600484015260248301526044820152fd5b600087815260046020526040902080546001600160a01b0319169055848352600381528b83208054600019019055610da9565b91939450915080610e8e575b15610e5257859291879138610d7d565b878688610e6f576024915190637e27328960e01b82526004820152fd5b905163177e802f60e01b81523360048201526024810191909152604490fd5b503387148015610eb3575b80610e425750858252600481523385898420541614610e42565b5086825260058152878220338352815260ff8883205416610e99565b604051633250574960e11b815260006004820152602490fd5b610ef3838383610d46565b813b610f00575b50505050565b604051630a85bd0160e11b8082523360048301526001600160a01b03928316602483015260448201949094526080606482015260209592909116939092908390610f4e906084830190610b93565b039285816000958187895af1849181610ff7575b50610fc2575050503d600014610fba573d610f7c81610c8d565b90610f8a6040519283610c6b565b81528091843d92013e5b80519283610fb557604051633250574960e11b815260048101849052602490fd5b019050fd5b506060610f94565b919450915063ffffffff60e01b1603610fdf575038808080610efa565b60249060405190633250574960e11b82526004820152fd5b9091508681813d8311611030575b61100f8183610c6b565b8101031261032657516001600160e01b031981168103610326579038610f62565b503d611005565b6000818152600260205260409020546001600160a01b031690811561105a575090565b60249060405190637e27328960e01b82526004820152fdfea26469706673582212209cc2faed17f5295d71987614a0873a0c110439e67ec07bfab495ac8067f7d8a464736f6c63430008150033a2646970667358221220fbc6f0e1092a9fb66065f6d6903b8e36925415b5acc7eb925fe86c9a6da8148064736f6c63430008150033";
const isSuperArgs = (xs) => xs.length > 1;
class NFTCollectionDeployer__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static createInterface() {
        return new ethers_1.Interface(_abi);
    }
    static connect(address, runner) {
        return new ethers_1.Contract(address, _abi, runner);
    }
}
exports.NFTCollectionDeployer__factory = NFTCollectionDeployer__factory;
NFTCollectionDeployer__factory.bytecode = _bytecode;
NFTCollectionDeployer__factory.abi = _abi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTkZUQ29sbGVjdGlvbkRlcGxveWVyX19mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL2V2bS9mYWN0b3JpZXMvY29udHJhY3RzL05GVENvbGxlY3Rpb25EZXBsb3llcl9fZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQ0FBK0M7QUFDL0Msb0JBQW9CO0FBQ3BCLG9CQUFvQjtBQUNwQixtQ0FLZ0I7QUFRaEIsTUFBTSxJQUFJLEdBQUc7SUFDWDtRQUNFLE1BQU0sRUFBRSxFQUFFO1FBQ1YsZUFBZSxFQUFFLFlBQVk7UUFDN0IsSUFBSSxFQUFFLGFBQWE7S0FDcEI7SUFDRDtRQUNFLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLE1BQU0sRUFBRTtZQUNOO2dCQUNFLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixJQUFJLEVBQUUsU0FBUzthQUNoQjtTQUNGO1FBQ0QsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixJQUFJLEVBQUUsT0FBTztLQUNkO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsRUFBRTtRQUNWLElBQUksRUFBRSx5QkFBeUI7UUFDL0IsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2hCO1NBQ0Y7UUFDRCxlQUFlLEVBQUUsWUFBWTtRQUM3QixJQUFJLEVBQUUsVUFBVTtLQUNqQjtJQUNEO1FBQ0UsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxRQUFRO2FBQ2Y7WUFDRDtnQkFDRSxZQUFZLEVBQUUsUUFBUTtnQkFDdEIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsSUFBSSxFQUFFLFFBQVE7YUFDZjtTQUNGO1FBQ0QsSUFBSSxFQUFFLHdCQUF3QjtRQUM5QixPQUFPLEVBQUU7WUFDUDtnQkFDRSxZQUFZLEVBQUUsU0FBUztnQkFDdkIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFNBQVM7YUFDaEI7U0FDRjtRQUNELGVBQWUsRUFBRSxZQUFZO1FBQzdCLElBQUksRUFBRSxVQUFVO0tBQ2pCO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsRUFBRTtRQUNWLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2hCO1NBQ0Y7UUFDRCxlQUFlLEVBQUUsTUFBTTtRQUN2QixJQUFJLEVBQUUsVUFBVTtLQUNqQjtJQUNEO1FBQ0UsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSxTQUFTO2FBQ2hCO1NBQ0Y7UUFDRCxJQUFJLEVBQUUsVUFBVTtRQUNoQixPQUFPLEVBQUUsRUFBRTtRQUNYLGVBQWUsRUFBRSxZQUFZO1FBQzdCLElBQUksRUFBRSxVQUFVO0tBQ2pCO0NBQ08sQ0FBQztBQUVYLE1BQU0sU0FBUyxHQUNiLHM0d0JBQXM0d0IsQ0FBQztBQU16NHdCLE1BQU0sV0FBVyxHQUFHLENBQ2xCLEVBQTBDLEVBQ1csRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBRXhFLE1BQWEsOEJBQStCLFNBQVEsd0JBQWU7SUFDakUsWUFBWSxHQUFHLElBQTRDO1FBQ3pELElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDdEIsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDakIsQ0FBQzthQUFNLENBQUM7WUFDTixLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxDQUFDO0lBQ0gsQ0FBQztJQUVRLG9CQUFvQixDQUMzQixTQUFtRDtRQUVuRCxPQUFPLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNRLE1BQU0sQ0FBQyxTQUFtRDtRQUNqRSxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FJbEMsQ0FBQztJQUNKLENBQUM7SUFDUSxPQUFPLENBQ2QsTUFBNkI7UUFFN0IsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBbUMsQ0FBQztJQUNqRSxDQUFDO0lBSUQsTUFBTSxDQUFDLGVBQWU7UUFDcEIsT0FBTyxJQUFJLGtCQUFTLENBQUMsSUFBSSxDQUFtQyxDQUFDO0lBQy9ELENBQUM7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUNaLE9BQWUsRUFDZixNQUE4QjtRQUU5QixPQUFPLElBQUksaUJBQVEsQ0FDakIsT0FBTyxFQUNQLElBQUksRUFDSixNQUFNLENBQzZCLENBQUM7SUFDeEMsQ0FBQzs7QUF6Q0gsd0VBMENDO0FBZmlCLHVDQUFRLEdBQUcsU0FBUyxDQUFDO0FBQ3JCLGtDQUFHLEdBQUcsSUFBSSxDQUFDIn0=