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
const factory_1 = require("./factory");
var ChainFactoryConfigs;
(function (ChainFactoryConfigs) {
    function TestNet() {
        const optimism = new ethers_1.JsonRpcProvider("https://sepolia.optimism.io");
        const storage = evm_1.BridgeStorage__factory.connect("0x8411EeadD374bDE549F61a166FFBeFca592bC60a", optimism);
        return {
            bscParams: {
                identifier: factory_1.Chain.BSC,
                provider: new ethers_1.JsonRpcProvider("https://bsc-testnet.publicnode.com"),
                bridge: ethers_1.ethers.getAddress("0xCa5c7090Fa1F3C0939E226ec827Ae140494d81F4"),
                royaltySalePrice: 10000,
                storage,
            },
            ethParams: {
                identifier: factory_1.Chain.ETH,
                provider: new ethers_1.JsonRpcProvider("https://ethereum-sepolia.publicnode.com"),
                bridge: ethers_1.ethers.getAddress("0xCa3563d84f0D62344B8467382623d780Bb58871f"),
                royaltySalePrice: 10000,
                storage,
            },
            maticParams: {
                identifier: factory_1.Chain.MATIC,
                provider: new ethers_1.JsonRpcProvider("https://polygon-amoy-bor-rpc.publicnode.com"),
                bridge: ethers_1.ethers.getAddress("0x820c0b504fe85b43E3c43D2EA24cb764ad78d52e"),
                royaltySalePrice: 10000,
                storage,
            },
            hederaParams: {
                identifier: factory_1.Chain.HEDERA,
                bridge: ethers_1.ethers.getAddress("0x473D25d2f26d8288c15EBB608A11cb067a74A692"),
                bridgeContractId: "0.0.4392930",
                provider: new ethers_1.JsonRpcProvider("https://testnet.hashio.io/api"),
                royaltySalePrice: 10000,
                storage,
                royaltyProxy: "0xFdDEEbDf5F2e959A1637Cb130cE753d42083a2EA",
                mirrorNodeApi: "https://testnet.mirrornode.hedera.com/api",
            },
            tezosParams: {
                identifier: factory_1.Chain.TEZOS,
                bridge: "KT18pSSB3f9H3xtHzBfMCjTdPja82nqpAm66",
                Tezos: new taquito_1.TezosToolkit("https://ghostnet.smartpy.io"),
                storage,
                tzktApi: "https://api.ghostnet.tzkt.io/",
            },
            secretParams: {
                identifier: factory_1.Chain.SECRET,
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
                identifier: factory_1.Chain.MULTIVERSX,
                bridge: "erd1qqqqqqqqqqqqqpgqju4xpyzqhlpth298zyd23sx9ge628qhssjrspl5sye",
                gatewayURL: "https://devnet-gateway.multiversx.com",
                provider: new out_1.ProxyNetworkProvider("https://devnet-gateway.multiversx.com"),
                storage,
                chainId: "D",
            },
            tonParams: {
                identifier: factory_1.Chain.TON,
                bridgeAddress: "kQA44UbG1OwwD3E-oScnetLJwWasDFuTSJb6hOHq8KvrudxM",
                client: new ton_1.TonClient({
                    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC?api_key=f3f6ef64352ac53cdfca18a3ba5372983e4037182c2b510fc52de5a259ecf292",
                }),
                storage,
            },
            aptosParams: {
                identifier: factory_1.Chain.APTOS,
                bridge: "0xcd863684221790d5b8b9d37b1a7173590494cc888286f384d716cc35ac98f4f8",
                network: aptos_1.Network.DEVNET,
                storage,
            },
            terraParams: {
                identifier: factory_1.Chain.TERRA,
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
    function MainNet() {
        const optimism = new ethers_1.JsonRpcProvider("https://optimism-mainnet.public.blastapi.io");
        const storage = evm_1.BridgeStorage__factory.connect("0xA8802be1Bd39888EBD38b236e2A4fAd4d8e76a1d", optimism);
        return {
            bscParams: {
                identifier: factory_1.Chain.BSC,
                provider: new ethers_1.JsonRpcProvider("https://bsc-pokt.nodies.app"),
                bridge: ethers_1.ethers.getAddress("0x0E8457f9F2a323DD91673e2D8e9eCA80763Dd98f"),
                royaltySalePrice: 10000,
                storage,
            },
            maticParams: {
                identifier: factory_1.Chain.MATIC,
                provider: new ethers_1.JsonRpcProvider("https://polygon-pokt.nodies.app"),
                bridge: ethers_1.ethers.getAddress("0xDAc202538A33adC727e95768f472f232eDD2EC56"),
                royaltySalePrice: 10000,
                storage,
            },
            hederaParams: {
                identifier: factory_1.Chain.HEDERA,
                bridge: ethers_1.ethers.getAddress("0xdb3ae6531d405d341d7b25597a64082d7ed05a07"),
                bridgeContractId: "0.0.6446319",
                provider: new ethers_1.JsonRpcProvider("https://mainnet.hashio.io/api"),
                royaltySalePrice: 10000,
                storage,
                royaltyProxy: "0x97fec8ed7203ea3ce58e2a4f44056fd954a35be4",
                mirrorNodeApi: "https://mainnet.mirrornode.hedera.com/api",
            },
        };
    }
    ChainFactoryConfigs.MainNet = MainNet;
})(ChainFactoryConfigs || (exports.ChainFactoryConfigs = ChainFactoryConfigs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtEQUE2RTtBQUM3RSw4Q0FBZ0Q7QUFDaEQsa0NBQXFDO0FBQ3JDLGlDQUFnQztBQUNoQyxtQ0FBaUQ7QUFDakQsdUNBQStDO0FBQy9DLCtDQUErRDtBQVMvRCx1Q0FBa0M7QUFlbEMsSUFBaUIsbUJBQW1CLENBeUluQztBQXpJRCxXQUFpQixtQkFBbUI7SUFDbEMsU0FBZ0IsT0FBTztRQUNyQixNQUFNLFFBQVEsR0FBRyxJQUFJLHdCQUFlLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUNwRSxNQUFNLE9BQU8sR0FBRyw0QkFBc0IsQ0FBQyxPQUFPLENBQzVDLDRDQUE0QyxFQUM1QyxRQUFRLENBQ1QsQ0FBQztRQUNGLE9BQU87WUFDTCxTQUFTLEVBQUU7Z0JBQ1QsVUFBVSxFQUFFLGVBQUssQ0FBQyxHQUFHO2dCQUNyQixRQUFRLEVBQUUsSUFBSSx3QkFBZSxDQUFDLG9DQUFvQyxDQUFDO2dCQUNuRSxNQUFNLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQztnQkFDdkUsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsT0FBTzthQUNSO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFVBQVUsRUFBRSxlQUFLLENBQUMsR0FBRztnQkFDckIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FDM0IseUNBQXlDLENBQzFDO2dCQUNELE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixPQUFPO2FBQ1I7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLGVBQUssQ0FBQyxLQUFLO2dCQUN2QixRQUFRLEVBQUUsSUFBSSx3QkFBZSxDQUMzQiw2Q0FBNkMsQ0FDOUM7Z0JBQ0QsTUFBTSxFQUFFLGVBQU0sQ0FBQyxV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