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
                bridge: ethers_1.ethers.getAddress("0xb3cE27eDadFE006f9f47C5ed5b62E63DFd9Cf3bD"),
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
                bridge: "secret1uxthnjt74cny9wnwx8czmgrc8taz0r8yfas565",
                bridgeCodeHash: "",
                chainId: "pulsar-3",
                provider: new secretjs_1.SecretNetworkClient({
                    chainId: "pulsar-3",
                    url: "https://lcd.pulsar-3.secretsaturn.net",
                }),
                storage,
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
                bridge: "terra1pscwnx4dch2pmdkda89mdnl5n576hnccrjw4dlssfq5nhgrr850scz0q64",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtEQUE2RTtBQUM3RSw4Q0FBZ0Q7QUFDaEQsa0NBQXFDO0FBQ3JDLG1DQUFpRDtBQUNqRCx1Q0FBK0M7QUFDL0MsK0NBQStEO0FBb0IvRCxJQUFpQixtQkFBbUIsQ0FvRm5DO0FBcEZELFdBQWlCLG1CQUFtQjtJQUNsQyxTQUFnQixPQUFPO1FBQ3JCLE1BQU0sUUFBUSxHQUFHLElBQUksd0JBQWUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sT0FBTyxHQUFHLDRCQUFzQixDQUFDLE9BQU8sQ0FDNUMsNENBQTRDLEVBQzVDLFFBQVEsQ0FDVCxDQUFDO1FBQ0YsT0FBTztZQUNMLFNBQVMsRUFBRTtnQkFDVCxVQUFVLEVBQUUsS0FBSztnQkFDakIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQyxvQ0FBb0MsQ0FBQztnQkFDbkUsTUFBTSxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsNENBQTRDLENBQUM7Z0JBQ3ZFLGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLE9BQU87YUFDUjtZQUNELFNBQVMsRUFBRTtnQkFDVCxVQUFVLEVBQUUsS0FBSztnQkFDakIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FDM0IseUNBQXlDLENBQzFDO2dCQUNELE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixPQUFPO2FBQ1I7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLE9BQU87Z0JBQ25CLFFBQVEsRUFBRSxJQUFJLHdCQUFlLENBQzNCLDZDQUE2QyxDQUM5QztnQkFDRCxNQUFNLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQztnQkFDdkUsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsT0FBTzthQUNSO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxVQUFVLEVBQUUsUUFBUTtnQkFDcEIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQywrQkFBK0IsQ0FBQztnQkFDOUQsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsT0FBTzthQUNSO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLE1BQU0sRUFBRSxzQ0FBc0M7Z0JBQzlDLEtBQUssRUFBRSxJQUFJLHNCQUFZLENBQUMsNkJBQTZCLENBQUM7Z0JBQ3RELE9BQU87Z0JBQ1AsT0FBTyxFQUFFLCtCQUErQjthQUN6QztZQUNELFlBQVksRUFBRTtnQkFDWixNQUFNLEVBQUUsK0NBQStDO2dCQUN2RCxjQUFjLEVBQUUsRUFBRTtnQkFDbEIsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLFFBQVEsRUFBRSxJQUFJLDhCQUFtQixDQUFDO29CQUNoQyxPQUFPLEVBQUUsVUFBVTtvQkFDbkIsR0FBRyxFQUFFLHVDQUF1QztpQkFDN0MsQ0FBQztnQkFDRixPQUFPO2FBQ1I7WUFDRCxnQkFBZ0IsRUFBRTtnQkFDaEIsTUFBTSxFQUNKLGdFQUFnRTtnQkFDbEUsVUFBVSxFQUFFLHVDQUF1QztnQkFDbkQsUUFBUSxFQUFFLElBQUksMEJBQW9CLENBQ2hDLHVDQUF1QyxDQUN4QztnQkFDRCxPQUFPO2dCQUNQLE9BQU8sRUFBRSxHQUFHO2FBQ2I7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsYUFBYSxFQUFFLGtEQUFrRDtnQkFDakUsTUFBTSxFQUFFLElBQUksZUFBUyxDQUFDO29CQUNwQixRQUFRLEVBQUUsOENBQThDO2lCQUN6RCxDQUFDO2dCQUNGLE9BQU87YUFDUjtZQUNELFdBQVcsRUFBRTtnQkFDWCxNQUFNLEVBQ0osa0VBQWtFO2dCQUNwRSxPQUFPLEVBQUUsU0FBUztnQkFDbEIsR0FBRyxFQUFFLGdEQUFnRDtnQkFDckQsT0FBTztnQkFDUCxLQUFLLEVBQUUsT0FBTztnQkFDZCxTQUFTLEVBQUUsS0FBSzthQUNqQjtTQUM4QixDQUFDO0lBQ3BDLENBQUM7SUFsRmUsMkJBQU8sVUFrRnRCLENBQUE7QUFDSCxDQUFDLEVBcEZnQixtQkFBbUIsbUNBQW5CLG1CQUFtQixRQW9GbkMifQ==