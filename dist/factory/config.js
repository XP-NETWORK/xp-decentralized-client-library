"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainFactoryConfigs = void 0;
const out_1 = require("@multiversx/sdk-network-providers/out");
const taquito_1 = require("@taquito/taquito");
const ton_1 = require("@ton/ton");
const ethers_1 = require("ethers");
const secretjs_1 = require("secretjs");
var ChainFactoryConfigs;
(function (ChainFactoryConfigs) {
    function TestNet() {
        return {
            bscParams: {
                identifier: "BSC",
                provider: new ethers_1.JsonRpcProvider("https://bsc-testnet.publicnode.com"),
                bridge: ethers_1.ethers.getAddress("0x3EC2839EcEAfa2Ce9e419718364B070563Db516e"),
                royaltySalePrice: 0,
            },
            ethParams: {
                identifier: "ETH",
                provider: new ethers_1.JsonRpcProvider("https://rpc.notadegen.com/eth/sepolia"),
                bridge: ethers_1.ethers.getAddress("0xA0C15702892491597D369A04d7366Af234cF5F73"),
                royaltySalePrice: 0,
            },
            polygonParams: {
                identifier: "MATIC",
                provider: new ethers_1.JsonRpcProvider("https://polygon-mumbai-bor.publicnode.com"),
                bridge: ethers_1.ethers.getAddress("0x1f89dce7eBFb78D6CA0A4d16F9B6a9F61B186ebc"),
                royaltySalePrice: 0,
            },
            hederaParams: {
                bridge: ethers_1.ethers.getAddress("0x742f68F53583Be22a62338e916eB8DE90D07daB1"),
                identifier: "HEDERA",
                provider: new ethers_1.JsonRpcProvider("https://testnet.hashio.io/api"),
                royaltySalePrice: 0,
            },
            tezosParams: {
                bridge: "KT1NHxTSXAFKH2y94PpfqDsg4bZ5SiF2V8a4",
                Tezos: new taquito_1.TezosToolkit("https://ghostnet.ecadinfra.com"),
            },
            secretParams: {
                bridge: "secret1uxthnjt74cny9wnwx8czmgrc8taz0r8yfas565",
                bridgeCodeHash: "",
                chainId: "pulsar-3",
                provider: new secretjs_1.SecretNetworkClient({
                    chainId: "pulsar-3",
                    url: "https://lcd.pulsar-3.secretsaturn.net",
                }),
            },
            multiversxParams: {
                bridge: "erd1qqqqqqqqqqqqqpgqtsw8s3evjjyqqa2j2tfn9yvufqskdv236n9s2a06h9",
                gatewayURL: "https://devnet-gateway.multiversx.com",
                provider: new out_1.ProxyNetworkProvider("https://devnet-gateway.multiversx.com"),
            },
            tonParams: {
                bridgeAddress: "EQDI6P9gheuWLh1euThjFE2muUpa9tp2y49TD6Zz5oOF5gWL",
                client: new ton_1.TonClient({
                    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
                }),
            },
        };
    }
    ChainFactoryConfigs.TestNet = TestNet;
})(ChainFactoryConfigs || (exports.ChainFactoryConfigs = ChainFactoryConfigs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtEQUE2RTtBQUM3RSw4Q0FBZ0Q7QUFDaEQsa0NBQXFDO0FBQ3JDLG1DQUFpRDtBQUNqRCx1Q0FBK0M7QUFrQi9DLElBQWlCLG1CQUFtQixDQTBEbkM7QUExREQsV0FBaUIsbUJBQW1CO0lBQ2xDLFNBQWdCLE9BQU87UUFDckIsT0FBTztZQUNMLFNBQVMsRUFBRTtnQkFDVCxVQUFVLEVBQUUsS0FBSztnQkFDakIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQyxvQ0FBb0MsQ0FBQztnQkFDbkUsTUFBTSxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsNENBQTRDLENBQUM7Z0JBQ3ZFLGdCQUFnQixFQUFFLENBQUM7YUFDcEI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLFFBQVEsRUFBRSxJQUFJLHdCQUFlLENBQUMsdUNBQXVDLENBQUM7Z0JBQ3RFLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxDQUFDO2FBQ3BCO1lBQ0QsYUFBYSxFQUFFO2dCQUNiLFVBQVUsRUFBRSxPQUFPO2dCQUNuQixRQUFRLEVBQUUsSUFBSSx3QkFBZSxDQUMzQiwyQ0FBMkMsQ0FDNUM7Z0JBQ0QsTUFBTSxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsNENBQTRDLENBQUM7Z0JBQ3ZFLGdCQUFnQixFQUFFLENBQUM7YUFDcEI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsNENBQTRDLENBQUM7Z0JBQ3ZFLFVBQVUsRUFBRSxRQUFRO2dCQUNwQixRQUFRLEVBQUUsSUFBSSx3QkFBZSxDQUFDLCtCQUErQixDQUFDO2dCQUM5RCxnQkFBZ0IsRUFBRSxDQUFDO2FBQ3BCO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLE1BQU0sRUFBRSxzQ0FBc0M7Z0JBQzlDLEtBQUssRUFBRSxJQUFJLHNCQUFZLENBQUMsZ0NBQWdDLENBQUM7YUFDMUQ7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLCtDQUErQztnQkFDdkQsY0FBYyxFQUFFLEVBQUU7Z0JBQ2xCLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixRQUFRLEVBQUUsSUFBSSw4QkFBbUIsQ0FBQztvQkFDaEMsT0FBTyxFQUFFLFVBQVU7b0JBQ25CLEdBQUcsRUFBRSx1Q0FBdUM7aUJBQzdDLENBQUM7YUFDSDtZQUNELGdCQUFnQixFQUFFO2dCQUNoQixNQUFNLEVBQ0osZ0VBQWdFO2dCQUNsRSxVQUFVLEVBQUUsdUNBQXVDO2dCQUNuRCxRQUFRLEVBQUUsSUFBSSwwQkFBb0IsQ0FDaEMsdUNBQXVDLENBQ3hDO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsYUFBYSxFQUFFLGtEQUFrRDtnQkFDakUsTUFBTSxFQUFFLElBQUksZUFBUyxDQUFDO29CQUNwQixRQUFRLEVBQUUsOENBQThDO2lCQUN6RCxDQUFDO2FBQ0g7U0FDNkIsQ0FBQztJQUNuQyxDQUFDO0lBeERlLDJCQUFPLFVBd0R0QixDQUFBO0FBQ0gsQ0FBQyxFQTFEZ0IsbUJBQW1CLG1DQUFuQixtQkFBbUIsUUEwRG5DIn0=