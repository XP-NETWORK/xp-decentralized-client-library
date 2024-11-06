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
                bridge: "secret1pauswg8l0dzfzaq0gcjy2zunzjyc4sv7n2q57d",
                bridgeCodeHash: "",
                chainId: "secret-4",
                identifier: "SECRET",
                nftCodeId: 1983,
                provider: new secretjs_1.SecretNetworkClient({
                    chainId: "secret-4",
                    url: "https://rpc.ankr.com/http/scrt_cosmos",
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
                bridge: "68c508b1b20701c8ddecbbc8e603e788be96c1dcb6ccdcf43ac8594f6f49077a",
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
            fantomParams: {
                identifier: factory_1.Chain.FANTOM,
                provider: new ethers_1.JsonRpcProvider("https://rpc.fantom.network"),
                bridge: ethers_1.ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
                royaltySalePrice: 10000,
                storage,
            },
        };
    }
    ChainFactoryConfigs.MainNet = MainNet;
})(ChainFactoryConfigs || (exports.ChainFactoryConfigs = ChainFactoryConfigs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUE2QztBQUM3QywwQ0FBMkM7QUFDM0Msa0RBQStDO0FBQy9DLCtEQUE2RTtBQUM3RSw4Q0FBZ0Q7QUFDaEQsa0NBQXFDO0FBQ3JDLG1DQUFpRDtBQUNqRCx1Q0FBK0M7QUFDL0MsK0NBQStEO0FBVy9ELHVDQUFrQztBQXFCbEMsSUFBaUIsbUJBQW1CLENBc01uQztBQXRNRCxXQUFpQixtQkFBbUI7SUFDbEMsU0FBZ0IsT0FBTztRQUNyQixNQUFNLEtBQUssR0FBRyxJQUFJLHdCQUFlLENBQy9CLDJEQUEyRCxDQUM1RCxDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsNEJBQXNCLENBQUMsT0FBTyxDQUM1Qyw0Q0FBNEMsRUFDNUMsS0FBSyxDQUNOLENBQUM7UUFDRixPQUFPO1lBQ0wsU0FBUyxFQUFFO2dCQUNULFVBQVUsRUFBRSxlQUFLLENBQUMsR0FBRztnQkFDckIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQyxvQ0FBb0MsQ0FBQztnQkFDbkUsTUFBTSxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsNENBQTRDLENBQUM7Z0JBQ3ZFLGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLE9BQU87YUFDUjtZQUNELFlBQVksRUFBRTtnQkFDWixVQUFVLEVBQUUsZUFBSyxDQUFDLE1BQU07Z0JBQ3hCLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxhQUFhO2dCQUMvQixRQUFRLEVBQUUsSUFBSSx3QkFBZSxDQUFDLCtCQUErQixDQUFDO2dCQUM5RCxnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixPQUFPO2dCQUNQLFlBQVksRUFBRSw0Q0FBNEM7Z0JBQzFELGFBQWEsRUFBRSwyQ0FBMkM7YUFDM0Q7WUFDRCxTQUFTLEVBQUU7Z0JBQ1Qs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