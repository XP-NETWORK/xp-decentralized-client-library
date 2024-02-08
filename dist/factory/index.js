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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFjdG9yeS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrREFBNkU7QUFDN0UsOENBQWdEO0FBQ2hELGtDQUFxQztBQUNyQyxtQ0FBaUQ7QUFDakQsdUNBQStDO0FBa0IvQyxJQUFpQixtQkFBbUIsQ0EwRG5DO0FBMURELFdBQWlCLG1CQUFtQjtJQUNsQyxTQUFnQixPQUFPO1FBQ3JCLE9BQU87WUFDTCxTQUFTLEVBQUU7Z0JBQ1QsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLFFBQVEsRUFBRSxJQUFJLHdCQUFlLENBQUMsb0NBQW9DLENBQUM7Z0JBQ25FLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxDQUFDO2FBQ3BCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFVBQVUsRUFBRSxLQUFLO2dCQUNqQixRQUFRLEVBQUUsSUFBSSx3QkFBZSxDQUFDLHVDQUF1QyxDQUFDO2dCQUN0RSxNQUFNLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQztnQkFDdkUsZ0JBQWdCLEVBQUUsQ0FBQzthQUNwQjtZQUNELGFBQWEsRUFBRTtnQkFDYixVQUFVLEVBQUUsT0FBTztnQkFDbkIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FDM0IsMkNBQTJDLENBQzVDO2dCQUNELE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxDQUFDO2FBQ3BCO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxVQUFVLEVBQUUsUUFBUTtnQkFDcEIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQywrQkFBK0IsQ0FBQztnQkFDOUQsZ0JBQWdCLEVBQUUsQ0FBQzthQUNwQjtZQUNELFdBQVcsRUFBRTtnQkFDWCxNQUFNLEVBQUUsc0NBQXNDO2dCQUM5QyxLQUFLLEVBQUUsSUFBSSxzQkFBWSxDQUFDLGdDQUFnQyxDQUFDO2FBQzFEO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLE1BQU0sRUFBRSwrQ0FBK0M7Z0JBQ3ZELGNBQWMsRUFBRSxFQUFFO2dCQUNsQixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsUUFBUSxFQUFFLElBQUksOEJBQW1CLENBQUM7b0JBQ2hDLE9BQU8sRUFBRSxVQUFVO29CQUNuQixHQUFHLEVBQUUsdUNBQXVDO2lCQUM3QyxDQUFDO2FBQ0g7WUFDRCxnQkFBZ0IsRUFBRTtnQkFDaEIsTUFBTSxFQUNKLGdFQUFnRTtnQkFDbEUsVUFBVSxFQUFFLHVDQUF1QztnQkFDbkQsUUFBUSxFQUFFLElBQUksMEJBQW9CLENBQ2hDLHVDQUF1QyxDQUN4QzthQUNGO1lBQ0QsU0FBUyxFQUFFO2dCQUNULGFBQWEsRUFBRSxrREFBa0Q7Z0JBQ2pFLE1BQU0sRUFBRSxJQUFJLGVBQVMsQ0FBQztvQkFDcEIsUUFBUSxFQUFFLDhDQUE4QztpQkFDekQsQ0FBQzthQUNIO1NBQzZCLENBQUM7SUFDbkMsQ0FBQztJQXhEZSwyQkFBTyxVQXdEdEIsQ0FBQTtBQUNILENBQUMsRUExRGdCLG1CQUFtQixtQ0FBbkIsbUJBQW1CLFFBMERuQyJ9