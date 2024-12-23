"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainFactoryConfigs = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const agent_1 = require("@dfinity/agent");
const principal_1 = require("@dfinity/principal");
const out_1 = require("@multiversx/sdk-network-providers/out");
const taquito_1 = require("@taquito/taquito");
const ton_1 = require("@ton/ton");
const connex_driver_1 = require("@vechain/connex-driver");
const connex_framework_1 = require("@vechain/connex-framework");
const thor = __importStar(require("@vechain/web3-providers-connex"));
const ethers_1 = require("ethers");
const secretjs_1 = require("secretjs");
const evm_1 = require("../contractsTypes/evm");
const factory_1 = require("./factory");
var ChainFactoryConfigs;
(function (ChainFactoryConfigs) {
    async function TestNet() {
        const skale = new ethers_1.JsonRpcProvider("https://testnet.skalenodes.com/v1/juicy-low-small-testnet");
        const storage = evm_1.BridgeStorage__factory.connect("0x8184bCDC0a4C24D1cB8e054E389660B5b7160186", skale);
        const oldStorage = evm_1.BridgeStorage__factory.connect("0x8184bCDC0a4C24D1cB8e054E389660B5b7160186", skale);
        const net = new connex_driver_1.SimpleNet("https://sync-testnet.veblocks.net");
        const driver = await connex_driver_1.Driver.connect(net);
        const connexObj = new connex_framework_1.Framework(driver);
        return {
            bridgeChains: {
                bscParams: {
                    identifier: factory_1.Chain.BSC,
                    provider: new ethers_1.JsonRpcProvider("https://bsc-testnet.publicnode.com"),
                    bridge: ethers_1.ethers.getAddress("0xA86704500C991a5C1976756Ee3f458d59240A6cE"),
                    royaltySalePrice: 10000,
                    storage,
                },
                hederaParams: {
                    identifier: factory_1.Chain.HEDERA,
                    bridge: ethers_1.ethers.getAddress("0x0C687Dc235f8e461441d69Dc6aD123EAe7401744"),
                    bridgeContractId: "0.0.5273403",
                    provider: new ethers_1.JsonRpcProvider("https://testnet.hashio.io/api"),
                    royaltySalePrice: 10000,
                    storage,
                    royaltyProxy: "0xFdDEEbDf5F2e959A1637Cb130cE753d42083a2EA",
                    mirrorNodeApi: "https://testnet.mirrornode.hedera.com/api",
                },
                tonParams: {
                    identifier: factory_1.Chain.TON,
                    bridgeAddress: "kQCHrjSTU6W7XYUfJgwr_trmG3QL_llPJfPyXPmINYznrkh6",
                    client: new ton_1.TonClient({
                        endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC?api_key=f3f6ef64352ac53cdfca18a3ba5372983e4037182c2b510fc52de5a259ecf292",
                    }),
                    storage,
                },
                moonbeamParams: {
                    bridge: ethers_1.ethers.getAddress("0x4144b9255B45691E1Cc9BEdE04726b26ebd6C90A"),
                    identifier: "MOONBEAM",
                    provider: new ethers_1.JsonRpcProvider("https://rpc.api.moonbase.moonbeam.network"),
                    royaltySalePrice: 10000,
                    storage,
                },
                secretParams: {
                    bridge: "secret13kgatwt6cachvy2v9n7lkkwewq9qhvphynuns3",
                    bridgeCodeHash: "",
                    chainId: "secret-4",
                    identifier: "SECRET",
                    nftCodeId: 2075,
                    provider: new secretjs_1.SecretNetworkClient({
                        chainId: "secret-4",
                        url: "https://rpc.ankr.com/http/scrt_cosmos",
                    }),
                    storage,
                },
                tezosParams: {
                    bridge: "KT1CFXpeB7RPAvzgGAVBkKZ5fXsAB61h72rs",
                    identifier: "TEZOS",
                    storage,
                    Tezos: new taquito_1.TezosToolkit("https://ghostnet.ecadinfra.com"),
                    tzktApi: "https://api.ghostnet.tzkt.io/",
                },
                multiversxParams: {
                    bridge: "erd1qqqqqqqqqqqqqpgq4tfugv4aks67l6ggh2zs0xuxk7d00x4ttxsqud4vpp",
                    chainId: "D",
                    identifier: "MULTIVERSX",
                    gatewayURL: "https://devnet-gateway.multiversx.com",
                    provider: new out_1.ProxyNetworkProvider("https://devnet-gateway.multiversx.com"),
                    storage,
                },
                icpParams: {
                    agent: new agent_1.HttpAgent({
                        host: "https://tools.xp.network",
                    }),
                    bridge: principal_1.Principal.fromText("bw4dl-smaaa-aaaaa-qaacq-cai"),
                    identifier: "ICP",
                    storage,
                },
                nearParams: {
                    bridge: "xp-bridge-test.testnet",
                    networkId: "testnet",
                    nodeUrl: "https://archival-rpc.testnet.near.org",
                    identifier: "NEAR",
                    storage,
                },
                blastParams: {
                    identifier: factory_1.Chain.BLAST,
                    provider: new ethers_1.JsonRpcProvider("https://blast-sepolia.blockpi.network/v1/rpc/public"),
                    bridge: ethers_1.ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
                    royaltySalePrice: 10000,
                    storage,
                },
                aptosParams: {
                    bridge: "68c508b1b20701c8ddecbbc8e603e788be96c1dcb6ccdcf43ac8594f6f49077a",
                    identifier: "APTOS",
                    network: ts_sdk_1.Network.TESTNET,
                    storage,
                },
                casperParams: {
                    bridge: "hash-047ddacdb2d4c44b3d0d6c02341ff96e951409d30d4627d7b580db46743a6111",
                    identifier: factory_1.Chain.CASPER,
                    network: "casper-test",
                    rpc: "https://rpc.testnet.casperlabs.io/rpc",
                    storage,
                    proxy_url: "https://sheltered-crag-76748.herokuapp.com/",
                },
                vechainParams: {
                    identifier: factory_1.Chain.VECHAIN,
                    provider: new ethers_1.BrowserProvider(new thor.Provider({
                        connex: connexObj,
                        net,
                    })),
                    bridge: ethers_1.ethers.getAddress("0x7111eb5f8d9dA472e9608f2ab3De275C040D60B2"),
                    royaltySalePrice: 10000,
                    storage,
                },
            },
            oldStorage,
        };
    }
    ChainFactoryConfigs.TestNet = TestNet;
    async function MainNet() {
        const optimism = new ethers_1.JsonRpcProvider("https://optimism-mainnet.public.blastapi.io");
        const storage = evm_1.BridgeStorage__factory.connect("0x6fF8599f69B50Fbb906bD8b86Db512F431C34461", optimism);
        const oldStorage = evm_1.BridgeStorage__factory.connect("0xc6e84955ba7C354fb7ca60011883e5673Be3F629", optimism);
        const net = new connex_driver_1.SimpleNet("https://mainnet.veblocks.net");
        const driver = await connex_driver_1.Driver.connect(net);
        const connexObj = new connex_framework_1.Framework(driver);
        return {
            bridgeChains: {
                bscParams: {
                    identifier: factory_1.Chain.BSC,
                    provider: new ethers_1.JsonRpcProvider("https://rpc.ankr.com/bsc"),
                    bridge: ethers_1.ethers.getAddress("0x289FDdDce5119C41B82C969135212061D5E7Dce5"),
                    royaltySalePrice: 10000,
                    storage,
                },
                maticParams: {
                    identifier: factory_1.Chain.MATIC,
                    provider: new ethers_1.JsonRpcProvider("https://api.zan.top/polygon-mainnet"),
                    bridge: ethers_1.ethers.getAddress("0x2011DAD5caE280243d075D12a38CcCc0Fb4412dE"),
                    royaltySalePrice: 10000,
                    storage,
                },
                baseParams: {
                    identifier: factory_1.Chain.BASE,
                    provider: new ethers_1.JsonRpcProvider("https://base.meowrpc.com/"),
                    bridge: ethers_1.ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
                    royaltySalePrice: 10000,
                    storage,
                },
                hederaParams: {
                    identifier: factory_1.Chain.HEDERA,
                    bridge: ethers_1.ethers.getAddress("0x0000000000000000000000000000000000786484"),
                    bridgeContractId: "0.0.7890052",
                    provider: new ethers_1.JsonRpcProvider("https://mainnet.hashio.io/api"),
                    royaltySalePrice: 10000,
                    storage,
                    royaltyProxy: "0x97fec8ed7203ea3ce58e2a4f44056fd954a35be4",
                    mirrorNodeApi: "https://mainnet.mirrornode.hedera.com/api",
                },
                tonParams: {
                    identifier: factory_1.Chain.TON,
                    bridgeAddress: "EQDn9dWuVp18AMnFc7yrEx6TxDwrbFI8FZYElkY7Exe1QcQO",
                    client: new ton_1.TonClient({
                        endpoint: "https://toncenter.com/api/v2/jsonRPC?api_key=78b6f2e7cbe2900dd39ab51a3f8fe3090154973343929991ed9b4f63fbeb45a5",
                    }),
                    storage,
                },
                tezosParams: {
                    bridge: "KT1NDDHcQeSTEEU7euxpjLbQuKuZkMArp7W4",
                    identifier: factory_1.Chain.TEZOS,
                    storage,
                    Tezos: new taquito_1.TezosToolkit("https://mainnet.ecadinfra.com"),
                    tzktApi: "https://api.tzkt.io/",
                },
                icpParams: {
                    agent: new agent_1.HttpAgent({
                        host: "https://ic0.app",
                    }),
                    bridge: principal_1.Principal.fromText("6gfde-pqaaa-aaaal-al76q-cai"),
                    identifier: "ICP",
                    storage,
                },
                terraParams: {
                    bridge: "terra1sryye399v0wrq5aap0s9jlqn9s6wm34gmd27pnlmceghd9qsgyqsugalra",
                    chainId: "pisco-1",
                    denom: "uluna",
                    identifier: "TERRA",
                    nftCodeId: 14213,
                    rpc: "https://rpc.testcosmos.directory/terra2testnet",
                    storage,
                },
                multiversxParams: {
                    bridge: "erd1qqqqqqqqqqqqqpgqmads3ruz3ywdq47a2whdgwsxdvtgut84txsqnuwr6c",
                    chainId: "1",
                    identifier: "MULTIVERSX",
                    gatewayURL: "https://gateway.multiversx.com",
                    provider: new out_1.ProxyNetworkProvider("https://gateway.multiversx.com"),
                    storage,
                },
                blastParams: {
                    identifier: factory_1.Chain.BLAST,
                    provider: new ethers_1.JsonRpcProvider("https://blast.gateway.tenderly.co"),
                    bridge: ethers_1.ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
                    royaltySalePrice: 10000,
                    storage,
                },
                fantomParams: {
                    identifier: factory_1.Chain.FANTOM,
                    provider: new ethers_1.JsonRpcProvider("https://rpc.fantom.network"),
                    bridge: ethers_1.ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
                    royaltySalePrice: 10000,
                    storage,
                },
                avaxParams: {
                    identifier: factory_1.Chain.AVALANCHE,
                    provider: new ethers_1.JsonRpcProvider("https://avalanche.public-rpc.com"),
                    bridge: ethers_1.ethers.getAddress("0x92764FF21a1a8cC4e8eEec43ED04Bea3B76D8fD3"),
                    royaltySalePrice: 10000,
                    storage,
                },
                moonbeamParams: {
                    bridge: ethers_1.ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
                    identifier: "MOONBEAM",
                    provider: new ethers_1.JsonRpcProvider("https://1rpc.io/glmr"),
                    royaltySalePrice: 10000,
                    storage,
                },
                ethParams: {
                    bridge: ethers_1.ethers.getAddress("0x4B2A837613bA45C734439155CC7030c79095a2ed"),
                    identifier: "ETHEREUM",
                    provider: new ethers_1.JsonRpcProvider("https://gateway.tenderly.co/public/mainnet"),
                    royaltySalePrice: 10000,
                    storage,
                },
                casperParams: {
                    bridge: "hash-284d7eeee5d0ece8b0d56cc7162a3cf72e6fabc62946e3a9abae219c646d56c3",
                    identifier: factory_1.Chain.CASPER,
                    network: "casper",
                    rpc: "http://37.27.69.30:7777/rpc",
                    storage,
                    proxy_url: "https://sheltered-crag-76748.herokuapp.com/",
                },
                nearParams: {
                    bridge: "xp-bridge-main.near",
                    networkId: "mainnet",
                    nodeUrl: "https://rpc.mainnet.near.org",
                    identifier: factory_1.Chain.NEAR,
                    storage,
                },
                secretParams: {
                    bridge: "secret160da5pcn05xz2nhwudjvcg7rjzs9sc50pdlp0d",
                    bridgeCodeHash: "",
                    chainId: "secret-4",
                    identifier: "SECRET",
                    nftCodeId: 2075,
                    provider: new secretjs_1.SecretNetworkClient({
                        chainId: "secret-4",
                        url: "https://rpc.ankr.com/http/scrt_cosmos",
                    }),
                    storage,
                },
                vechainParams: {
                    identifier: factory_1.Chain.VECHAIN,
                    provider: new ethers_1.BrowserProvider(new thor.Provider({
                        connex: connexObj,
                        net,
                    })),
                    bridge: ethers_1.ethers.getAddress("0x4c14CF6Eb11978F0A90B369107Aa7F5A08994428"),
                    royaltySalePrice: 10000,
                    storage,
                },
            },
            oldStorage,
        };
    }
    ChainFactoryConfigs.MainNet = MainNet;
})(ChainFactoryConfigs || (exports.ChainFactoryConfigs = ChainFactoryConfigs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQTZDO0FBQzdDLDBDQUEyQztBQUMzQyxrREFBK0M7QUFDL0MsK0RBQTZFO0FBQzdFLDhDQUFnRDtBQUNoRCxrQ0FBcUM7QUFDckMsMERBQTJEO0FBQzNELGdFQUFzRDtBQUN0RCxxRUFBdUQ7QUFDdkQsbUNBQWtFO0FBQ2xFLHVDQUErQztBQUMvQywrQ0FHK0I7QUFZL0IsdUNBQWtDO0FBNkJsQyxJQUFpQixtQkFBbUIsQ0F5Vm5DO0FBelZELFdBQWlCLG1CQUFtQjtJQUMzQixLQUFLLFVBQVUsT0FBTztRQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLHdCQUFlLENBQy9CLDJEQUEyRCxDQUM1RCxDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsNEJBQXNCLENBQUMsT0FBTyxDQUM1Qyw0Q0FBNEMsRUFDNUMsS0FBSyxDQUNOLENBQUM7UUFDRixNQUFNLFVBQVUsR0FBRyw0QkFBc0IsQ0FBQyxPQUFPLENBQy9DLDRDQUE0QyxFQUM1QyxLQUFLLENBQ04sQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFHLElBQUkseUJBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sTUFBTSxHQUFHLE1BQU0sc0JBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsTUFBTSxTQUFTLEdBQUcsSUFBSSw0QkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhDLE9BQU87WUFDTCxZQUFZLEVBQUU7Z0JBQ1osU0FBUyxFQUFFO29CQUNULFVBQVUsRUFBRSxlQUFLLENBQUMsR0FBRztvQkFDckIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQyxvQ0FBb0MsQ0FBQztvQkFDbkUsTUFBTSxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQ3ZCLDRDQUE0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