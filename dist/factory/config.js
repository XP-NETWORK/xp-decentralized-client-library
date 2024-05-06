"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainFactoryConfigs = void 0;
const out_1 = require("@multiversx/sdk-network-providers/out");
const taquito_1 = require("@taquito/taquito");
const ton_1 = require("@ton/ton");
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
                bridge: ethers_1.ethers.getAddress("0x9aa2F5D64FF55465B0724d2c445bcEbbb71b6354"),
                identifier: "HEDERA",
                provider: new ethers_1.JsonRpcProvider("https://testnet.hashio.io/api"),
                royaltySalePrice: 10000,
                storage,
            },
            tezosParams: {
                bridge: "KT18pSSB3f9H3xtHzBfMCjTdPja82nqpAm66",
                Tezos: new taquito_1.TezosToolkit("https://ghostnet.smartpy.io"),
                storage,
                tzktApi: "https://api.ghostnet.tzkt.io/",
            },
            secretParams: {
                bridge: "secret1c9k79ee6t0erdawjv8nflgeynt70ryke26vj7d",
                bridgeCodeHash: "",
                chainId: "pulsar-3",
                provider: new secretjs_1.SecretNetworkClient({
                    chainId: "pulsar-3",
                    url: "https://lcd.pulsar-3.secretsaturn.net",
                }),
                storage,
                nftCodeId: 7104,
            },
            multiversxParams: {
                bridge: "erd1qqqqqqqqqqqqqpgqtsw8s3evjjyqqa2j2tfn9yvufqskdv236n9s2a06h9",
                gatewayURL: "https://devnet-gateway.multiversx.com",
                provider: new out_1.ProxyNetworkProvider("https://devnet-gateway.multiversx.com"),
                storage,
                chainId: "D",
            },
            tonParams: {
                bridgeAddress: "EQDI6P9gheuWLh1euThjFE2muUpa9tp2y49TD6Zz5oOF5gWL",
                client: new ton_1.TonClient({
                    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
                }),
                storage,
            },
            terraParams: {
                bridge: "terra1jdek24uwru97s8c48smzx035tmw55yqxzrc2sy7flepr980rx7hsrnyl03",
                chainId: "pisco-1",
                rpc: "https://rpc.testcosmos.directory/terra2testnet",
                storage,
                denom: "uluna",
                nftCodeId: 13488,
            },
        };
    }
    ChainFactoryConfigs.TestNet = TestNet;
})(ChainFactoryConfigs || (exports.ChainFactoryConfigs = ChainFactoryConfigs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtEQUE2RTtBQUM3RSw4Q0FBZ0Q7QUFDaEQsa0NBQXFDO0FBQ3JDLG1DQUFpRDtBQUNqRCx1Q0FBK0M7QUFDL0MsK0NBQStEO0FBb0IvRCxJQUFpQixtQkFBbUIsQ0FxRm5DO0FBckZELFdBQWlCLG1CQUFtQjtJQUNsQyxTQUFnQixPQUFPO1FBQ3JCLE1BQU0sUUFBUSxHQUFHLElBQUksd0JBQWUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sT0FBTyxHQUFHLDRCQUFzQixDQUFDLE9BQU8sQ0FDNUMsNENBQTRDLEVBQzVDLFFBQVEsQ0FDVCxDQUFDO1FBQ0YsT0FBTztZQUNMLFNBQVMsRUFBRTtnQkFDVCxVQUFVLEVBQUUsS0FBSztnQkFDakIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQyxvQ0FBb0MsQ0FBQztnQkFDbkUsTUFBTSxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsNENBQTRDLENBQUM7Z0JBQ3ZFLGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLE9BQU87YUFDUjtZQUNELFNBQVMsRUFBRTtnQkFDVCxVQUFVLEVBQUUsS0FBSztnQkFDakIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FDM0IseUNBQXlDLENBQzFDO2dCQUNELE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixPQUFPO2FBQ1I7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLE9BQU87Z0JBQ25CLFFBQVEsRUFBRSxJQUFJLHdCQUFlLENBQzNCLDZDQUE2QyxDQUM5QztnQkFDRCxNQUFNLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQztnQkFDdkUsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsT0FBTzthQUNSO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxVQUFVLEVBQUUsUUFBUTtnQkFDcEIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQywrQkFBK0IsQ0FBQztnQkFDOUQsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsT0FBTzthQUNSO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLE1BQU0sRUFBRSxzQ0FBc0M7Z0JBQzlDLEtBQUssRUFBRSxJQUFJLHNCQUFZLENBQUMsNkJBQTZCLENBQUM7Z0JBQ3RELE9BQU87Z0JBQ1AsT0FBTyxFQUFFLCtCQUErQjthQUN6QztZQUNELFlBQVksRUFBRTtnQkFDWixNQUFNLEVBQUUsK0NBQStDO2dCQUN2RCxjQUFjLEVBQUUsRUFBRTtnQkFDbEIsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLFFBQVEsRUFBRSxJQUFJLDhCQUFtQixDQUFDO29CQUNoQyxPQUFPLEVBQUUsVUFBVTtvQkFDbkIsR0FBRyxFQUFFLHVDQUF1QztpQkFDN0MsQ0FBQztnQkFDRixPQUFPO2dCQUNQLFNBQVMsRUFBRSxJQUFJO2FBQ2hCO1lBQ0QsZ0JBQWdCLEVBQUU7Z0JBQ2hCLE1BQU0sRUFDSixnRUFBZ0U7Z0JBQ2xFLFVBQVUsRUFBRSx1Q0FBdUM7Z0JBQ25ELFFBQVEsRUFBRSxJQUFJLDBCQUFvQixDQUNoQyx1Q0FBdUMsQ0FDeEM7Z0JBQ0QsT0FBTztnQkFDUCxPQUFPLEVBQUUsR0FBRzthQUNiO1lBQ0QsU0FBUyxFQUFFO2dCQUNULGFBQWEsRUFBRSxrREFBa0Q7Z0JBQ2pFLE1BQU0sRUFBRSxJQUFJLGVBQVMsQ0FBQztvQkFDcEIsUUFBUSxFQUFFLDhDQUE4QztpQkFDekQsQ0FBQztnQkFDRixPQUFPO2FBQ1I7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsTUFBTSxFQUNKLGtFQUFrRTtnQkFDcEUsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLEdBQUcsRUFBRSxnREFBZ0Q7Z0JBQ3JELE9BQU87Z0JBQ1AsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsU0FBUyxFQUFFLEtBQUs7YUFDakI7U0FDOEIsQ0FBQztJQUNwQyxDQUFDO0lBbkZlLDJCQUFPLFVBbUZ0QixDQUFBO0FBQ0gsQ0FBQyxFQXJGZ0IsbUJBQW1CLG1DQUFuQixtQkFBbUIsUUFxRm5DIn0=