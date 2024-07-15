"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainFactoryConfigs = void 0;
const out_1 = require("@multiversx/sdk-network-providers/out");
const taquito_1 = require("@taquito/taquito");
const ton_1 = require("@ton/ton");
const aptos_1 = require("aptos");
const ethers_1 = require("ethers");
const secretjs_1 = require("secretjs");
const evm_1 = require("../contractsTypes/evm");
var ChainFactoryConfigs;
(function (ChainFactoryConfigs) {
    function TestNet() {
        const optimism = new ethers_1.JsonRpcProvider("https://sepolia.optimism.io");
        const storage = evm_1.BridgeStorage__factory.connect("0x8411EeadD374bDE549F61a166FFBeFca592bC60a", optimism);
        return {
            bscParams: {
                identifier: "BSC",
                provider: new ethers_1.JsonRpcProvider("https://bsc-testnet.publicnode.com"),
                bridge: ethers_1.ethers.getAddress("0xCa5c7090Fa1F3C0939E226ec827Ae140494d81F4"),
                royaltySalePrice: 10000,
                storage,
            },
            ethParams: {
                identifier: "ETH",
                provider: new ethers_1.JsonRpcProvider("https://ethereum-sepolia.publicnode.com"),
                bridge: ethers_1.ethers.getAddress("0xCa3563d84f0D62344B8467382623d780Bb58871f"),
                royaltySalePrice: 10000,
                storage,
            },
            maticParams: {
                identifier: "MATIC",
                provider: new ethers_1.JsonRpcProvider("https://polygon-amoy-bor-rpc.publicnode.com"),
                bridge: ethers_1.ethers.getAddress("0x820c0b504fe85b43E3c43D2EA24cb764ad78d52e"),
                royaltySalePrice: 10000,
                storage,
            },
            hederaParams: {
                bridge: ethers_1.ethers.getAddress("0x473D25d2f26d8288c15EBB608A11cb067a74A692"),
                bridgeContractId: "0.0.4392930",
                identifier: "HEDERA",
                provider: new ethers_1.JsonRpcProvider("https://testnet.hashio.io/api"),
                royaltySalePrice: 10000,
                storage,
                royaltyProxy: "0xFdDEEbDf5F2e959A1637Cb130cE753d42083a2EA",
            },
            tezosParams: {
                bridge: "KT18pSSB3f9H3xtHzBfMCjTdPja82nqpAm66",
                Tezos: new taquito_1.TezosToolkit("https://ghostnet.smartpy.io"),
                storage,
                tzktApi: "https://api.ghostnet.tzkt.io/",
            },
            secretParams: {
                bridge: "secret1elt03d87zqvuwv8567fmnpjpyh4rt9tgyutqx3",
                bridgeCodeHash: "",
                chainId: "pulsar-3",
                provider: new secretjs_1.SecretNetworkClient({
                    chainId: "pulsar-3",
                    url: "https://api.pulsar.scrttestnet.com",
                }),
                storage,
                nftCodeId: 7104,
            },
            multiversxParams: {
                bridge: "erd1qqqqqqqqqqqqqpgqju4xpyzqhlpth298zyd23sx9ge628qhssjrspl5sye",
                gatewayURL: "https://devnet-gateway.multiversx.com",
                provider: new out_1.ProxyNetworkProvider("https://devnet-gateway.multiversx.com"),
                storage,
                chainId: "D",
            },
            tonParams: {
                bridgeAddress: "kQA44UbG1OwwD3E-oScnetLJwWasDFuTSJb6hOHq8KvrudxM",
                client: new ton_1.TonClient({
                    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC?api_key=f3f6ef64352ac53cdfca18a3ba5372983e4037182c2b510fc52de5a259ecf292",
                }),
                storage,
            },
            aptosParams: {
                bridge: "0xcd863684221790d5b8b9d37b1a7173590494cc888286f384d716cc35ac98f4f8",
                network: aptos_1.Network.DEVNET,
                storage,
            },
            terraParams: {
                bridge: "terra1jdek24uwru97s8c48smzx035tmw55yqxzrc2sy7flepr980rx7hsrnyl03",
                chainId: "pisco-1",
                rpc: "https://pisco-rpc.terra.dev/",
                storage,
                denom: "uluna",
                nftCodeId: 13488,
            },
        };
    }
    ChainFactoryConfigs.TestNet = TestNet;
})(ChainFactoryConfigs || (exports.ChainFactoryConfigs = ChainFactoryConfigs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtEQUE2RTtBQUM3RSw4Q0FBZ0Q7QUFDaEQsa0NBQXFDO0FBQ3JDLGlDQUFnQztBQUNoQyxtQ0FBaUQ7QUFDakQsdUNBQStDO0FBQy9DLCtDQUErRDtBQXVCL0QsSUFBaUIsbUJBQW1CLENBOEZuQztBQTlGRCxXQUFpQixtQkFBbUI7SUFDbEMsU0FBZ0IsT0FBTztRQUNyQixNQUFNLFFBQVEsR0FBRyxJQUFJLHdCQUFlLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUNwRSxNQUFNLE9BQU8sR0FBRyw0QkFBc0IsQ0FBQyxPQUFPLENBQzVDLDRDQUE0QyxFQUM1QyxRQUFRLENBQ1QsQ0FBQztRQUNGLE9BQU87WUFDTCxTQUFTLEVBQUU7Z0JBQ1QsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLFFBQVEsRUFBRSxJQUFJLHdCQUFlLENBQUMsb0NBQW9DLENBQUM7Z0JBQ25FLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixPQUFPO2FBQ1I7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLFFBQVEsRUFBRSxJQUFJLHdCQUFlLENBQzNCLHlDQUF5QyxDQUMxQztnQkFDRCxNQUFNLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQztnQkFDdkUsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsT0FBTzthQUNSO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxPQUFPO2dCQUNuQixRQUFRLEVBQUUsSUFBSSx3QkFBZSxDQUMzQiw2Q0FBNkMsQ0FDOUM7Z0JBQ0QsTUFBTSxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsNENBQTRDLENBQUM7Z0JBQ3ZFLGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLE9BQU87YUFDUjtZQUNELFlBQVksRUFBRTtnQkFDWixNQUFNLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQztnQkFDdkUsZ0JBQWdCLEVBQUUsYUFBYTtnQkFDL0IsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLFFBQVEsRUFBRSxJQUFJLHdCQUFlLENBQUMsK0JBQStCLENBQUM7Z0JBQzlELGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLE9BQU87Z0JBQ1AsWUFBWSxFQUFFLDRDQUE0QzthQUMzRDtZQUNELFdBQVcsRUFBRTtnQkFDWCxNQUFNLEVBQUUsc0NBQXNDO2dCQUM5QyxLQUFLLEVBQUUsSUFBSSxzQkFBWSxDQUFDLDZCQUE2QixDQUFDO2dCQUN0RCxPQUFPO2dCQUNQLE9BQU8sRUFBRSwrQkFBK0I7YUFDekM7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLCtDQUErQztnQkFDdkQsY0FBYyxFQUFFLEVBQUU7Z0JBQ2xCLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixRQUFRLEVBQUUsSUFBSSw4QkFBbUIsQ0FBQztvQkFDaEMsT0FBTyxFQUFFLFVBQVU7b0JBQ25CLEdBQUcsRUFBRSxvQ0FBb0M7aUJBQzFDLENBQUM7Z0JBQ0YsT0FBTztnQkFDUCxTQUFTLEVBQUUsSUFBSTthQUNoQjtZQUNELGdCQUFnQixFQUFFO2dCQUNoQixNQUFNLEVBQ0osZ0VBQWdFO2dCQUNsRSxVQUFVLEVBQUUsdUNBQXVDO2dCQUNuRCxRQUFRLEVBQUUsSUFBSSwwQkFBb0IsQ0FDaEMsdUNBQXVDLENBQ3hDO2dCQUNELE9BQU87Z0JBQ1AsT0FBTyxFQUFFLEdBQUc7YUFDYjtZQUNELFNBQVMsRUFBRTtnQkFDVCxhQUFhLEVBQUUsa0RBQWtEO2dCQUNqRSxNQUFNLEVBQUUsSUFBSSxlQUFTLENBQUM7b0JBQ3BCLFFBQVEsRUFDTix1SEFBdUg7aUJBQzFILENBQUM7Z0JBQ0YsT0FBTzthQUNSO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLE1BQU0sRUFDSixvRUFBb0U7Z0JBQ3RFLE9BQU8sRUFBRSxlQUFPLENBQUMsTUFBTTtnQkFDdkIsT0FBTzthQUNSO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLE1BQU0sRUFDSixrRUFBa0U7Z0JBQ3BFLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixHQUFHLEVBQUUsOEJBQThCO2dCQUNuQyxPQUFPO2dCQUNQLEtBQUssRUFBRSxPQUFPO2dCQUNkLFNBQVMsRUFBRSxLQUFLO2FBQ2pCO1NBQzhCLENBQUM7SUFDcEMsQ0FBQztJQTVGZSwyQkFBTyxVQTRGdEIsQ0FBQTtBQUNILENBQUMsRUE5RmdCLG1CQUFtQixtQ0FBbkIsbUJBQW1CLFFBOEZuQyJ9