"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainFactoryConfigs = void 0;
const agent_1 = require("@dfinity/agent");
const principal_1 = require("@dfinity/principal");
const out_1 = require("@multiversx/sdk-network-providers/out");
const taquito_1 = require("@taquito/taquito");
const ton_1 = require("@ton/ton");
const ethers_1 = require("ethers");
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
            tezosParams: {
                bridge: "KT1Fh6VH8BxA9xgJCn8hGZRxoo2vY3hrbqeV",
                identifier: "TEZOS",
                storage,
                Tezos: new taquito_1.TezosToolkit("https://rpc.ghostnet.teztnets.com"),
                tzktApi: "https://api.ghostnet.tzkt.io/",
            },
            multiversxParams: {
                bridge: "erd1qqqqqqqqqqqqqpgqhrd7fhw946fsq2kpl753xxthvy4jawvnd9yq03u2hq",
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
        };
    }
    ChainFactoryConfigs.TestNet = TestNet;
    function MainNet() {
        const optimism = new ethers_1.JsonRpcProvider("https://optimism-mainnet.public.blastapi.io");
        const storage = evm_1.BridgeStorage__factory.connect("0xc6e84955ba7C354fb7ca60011883e5673Be3F629", optimism);
        return {
            bscParams: {
                identifier: factory_1.Chain.BSC,
                provider: new ethers_1.JsonRpcProvider("https://bsc-pokt.nodies.app"),
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
                bridge: "KT1N3qtcfxzNMhdRMphvtDCKLEDwVLhZ8Cpq",
                identifier: factory_1.Chain.TEZOS,
                storage,
                Tezos: new taquito_1.TezosToolkit("https://mainnet.ecadinfra.com"),
                tzktApi: "https://api.tzkt.io/",
            },
        };
    }
    ChainFactoryConfigs.MainNet = MainNet;
})(ChainFactoryConfigs || (exports.ChainFactoryConfigs = ChainFactoryConfigs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUEyQztBQUMzQyxrREFBK0M7QUFDL0MsK0RBQTZFO0FBQzdFLDhDQUFnRDtBQUNoRCxrQ0FBcUM7QUFDckMsbUNBQWlEO0FBQ2pELCtDQUErRDtBQVcvRCx1Q0FBa0M7QUFtQmxDLElBQWlCLG1CQUFtQixDQTJJbkM7QUEzSUQsV0FBaUIsbUJBQW1CO0lBQ2xDLFNBQWdCLE9BQU87UUFDckIsTUFBTSxLQUFLLEdBQUcsSUFBSSx3QkFBZSxDQUMvQiwyREFBMkQsQ0FDNUQsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLDRCQUFzQixDQUFDLE9BQU8sQ0FDNUMsNENBQTRDLEVBQzVDLEtBQUssQ0FDTixDQUFDO1FBQ0YsT0FBTztZQUNMLFNBQVMsRUFBRTtnQkFDVCxVQUFVLEVBQUUsZUFBSyxDQUFDLEdBQUc7Z0JBQ3JCLFFBQVEsRUFBRSxJQUFJLHdCQUFlLENBQUMsb0NBQW9DLENBQUM7Z0JBQ25FLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixPQUFPO2FBQ1I7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osVUFBVSxFQUFFLGVBQUssQ0FBQyxNQUFNO2dCQUN4QixNQUFNLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQztnQkFDdkUsZ0JBQWdCLEVBQUUsYUFBYTtnQkFDL0IsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQywrQkFBK0IsQ0FBQztnQkFDOUQsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsT0FBTztnQkFDUCxZQUFZLEVBQUUsNENBQTRDO2dCQUMxRCxhQUFhLEVBQUUsMkNBQTJDO2FBQzNEO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFVBQVUsRUFBRSxlQUFLLENBQUMsR0FBRztn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