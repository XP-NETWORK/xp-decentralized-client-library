"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainFactoryConfigs = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const agent_1 = require("@dfinity/agent");
const principal_1 = require("@dfinity/principal");
const out_1 = require("@multiversx/sdk-network-providers/out");
const taquito_1 = require("@taquito/taquito");
const ton_1 = require("@ton/ton");
const ethers_1 = require("ethers");
const secretjs_1 = require("secretjs");
const evm_1 = require("../contractsTypes/evm");
const factory_1 = require("./factory");
var ChainFactoryConfigs;
(function (ChainFactoryConfigs) {
    function TestNet() {
        const skale = new ethers_1.JsonRpcProvider("https://testnet.skalenodes.com/v1/juicy-low-small-testnet");
        const storage = evm_1.BridgeStorage__factory.connect("0x8184bCDC0a4C24D1cB8e054E389660B5b7160186", skale);
        return {
            bscParams: {
                identifier: factory_1.Chain.BSC,
                provider: new ethers_1.JsonRpcProvider("https://bsc-testnet.publicnode.com"),
                bridge: ethers_1.ethers.getAddress("0xA86704500C991a5C1976756Ee3f458d59240A6cE"),
                royaltySalePrice: 10000,
                storage,
            },
            hederaParams: {
                identifier: factory_1.Chain.HEDERA,
                bridge: ethers_1.ethers.getAddress("0xf33e51DccC7727F1ac62782de7811712420841a0"),
                bridgeContractId: "0.0.4622994",
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
                bridge: "secret1grl2nduhjkvags56ewgcn80ymmmke8tfrm9zg9",
                bridgeCodeHash: "",
                chainId: "pulsar-3",
                identifier: "SECRET",
                nftCodeId: 10416,
                provider: new secretjs_1.SecretNetworkClient({
                    chainId: "pulsar-3",
                    url: "https://api.pulsar.scrttestnet.com",
                }),
                storage,
            },
            tezosParams: {
                bridge: "KT1Gm6qaUmfuVnGJmfY46K6hiUzgFP8DLcke",
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
                bridge: "13f8d626e383e8621a89caeb05c56a95fda38aa2dddfa8c2b1ed063f0edb23c9",
                identifier: "APTOS",
                network: ts_sdk_1.Network.TESTNET,
                storage,
            },
        };
    }
    ChainFactoryConfigs.TestNet = TestNet;
    function MainNet() {
        const optimism = new ethers_1.JsonRpcProvider("https://optimism-mainnet.public.blastapi.io");
        const storage = evm_1.BridgeStorage__factory.connect("0xc6e84955ba7C354fb7ca60011883e5673Be3F629", optimism);
        return {
            bscParams: {
                identifier: factory_1.Chain.BSC,
                provider: new ethers_1.JsonRpcProvider("https://binance.llamarpc.com"),
                bridge: ethers_1.ethers.getAddress("0x289FDdDce5119C41B82C969135212061D5E7Dce5"),
                royaltySalePrice: 10000,
                storage,
            },
            maticParams: {
                identifier: factory_1.Chain.MATIC,
                provider: new ethers_1.JsonRpcProvider("https://polygon-pokt.nodies.app"),
                bridge: ethers_1.ethers.getAddress("0x2011DAD5caE280243d075D12a38CcCc0Fb4412dE"),
                royaltySalePrice: 10000,
                storage,
            },
            baseParams: {
                identifier: factory_1.Chain.BASE,
                provider: new ethers_1.JsonRpcProvider("https://base.llamarpc.com"),
                bridge: ethers_1.ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
                royaltySalePrice: 10000,
                storage,
            },
            hederaParams: {
                identifier: factory_1.Chain.HEDERA,
                bridge: ethers_1.ethers.getAddress("0x00000000000000000000000000000000006bc585"),
                bridgeContractId: "0.0.7062917",
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
                bridge: "KT1UMVUP3XBpPrMUwuC6DXjEcLgZykV7p1PW",
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
        };
    }
    ChainFactoryConfigs.MainNet = MainNet;
})(ChainFactoryConfigs || (exports.ChainFactoryConfigs = ChainFactoryConfigs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUE2QztBQUM3QywwQ0FBMkM7QUFDM0Msa0RBQStDO0FBQy9DLCtEQUE2RTtBQUM3RSw4Q0FBZ0Q7QUFDaEQsa0NBQXFDO0FBQ3JDLG1DQUFpRDtBQUNqRCx1Q0FBK0M7QUFDL0MsK0NBQStEO0FBVy9ELHVDQUFrQztBQW9CbEMsSUFBaUIsbUJBQW1CLENBK0xuQztBQS9MRCxXQUFpQixtQkFBbUI7SUFDbEMsU0FBZ0IsT0FBTztRQUNyQixNQUFNLEtBQUssR0FBRyxJQUFJLHdCQUFlLENBQy9CLDJEQUEyRCxDQUM1RCxDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsNEJBQXNCLENBQUMsT0FBTyxDQUM1Qyw0Q0FBNEMsRUFDNUMsS0FBSyxDQUNOLENBQUM7UUFDRixPQUFPO1lBQ0wsU0FBUyxFQUFFO2dCQUNULFVBQVUsRUFBRSxlQUFLLENBQUMsR0FBRztnQkFDckIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQyxvQ0FBb0MsQ0FBQztnQkFDbkUsTUFBTSxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsNENBQTRDLENBQUM7Z0JBQ3ZFLGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLE9BQU87YUFDUjtZQUNELFlBQVksRUFBRTtnQkFDWixVQUFVLEVBQUUsZUFBSyxDQUFDLE1BQU07Z0JBQ3hCLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxhQUFhO2dCQUMvQixRQUFRLEVBQUUsSUFBSSx3QkFBZSxDQUFDLCtCQUErQixDQUFDO2dCQUM5RCxnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixPQUFPO2dCQUNQLFlBQVksRUFBRSw0Q0FBNEM7Z0JBQzFELGFBQWEsRUFBRSwyQ0FBMkM7YUFDM0Q7WUFDRCxTQUFTLEVBQUU7Z0JBQ1Qs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