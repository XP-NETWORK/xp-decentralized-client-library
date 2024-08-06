"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainFactoryConfigs = void 0;
const taquito_1 = require("@taquito/taquito");
const ton_1 = require("@ton/ton");
const ethers_1 = require("ethers");
const evm_1 = require("../contractsTypes/evm");
const factory_1 = require("./factory");
var ChainFactoryConfigs;
(function (ChainFactoryConfigs) {
    function TestNet() {
        const skale = new ethers_1.JsonRpcProvider("https://testnet.skalenodes.com/v1/juicy-low-small-testnet");
        const storage = evm_1.BridgeStorage__factory.connect("0x04cAEd1763B2C121D92FcaEaB41BFfe3EAB57EFC", skale);
        return {
            bscParams: {
                identifier: factory_1.Chain.BSC,
                provider: new ethers_1.JsonRpcProvider("https://bsc-testnet.publicnode.com"),
                bridge: ethers_1.ethers.getAddress("0xA70D9c05EB97FeDF4EA6CD52Dc426E66C0959968"),
                royaltySalePrice: 10000,
                storage,
            },
            hederaParams: {
                identifier: factory_1.Chain.HEDERA,
                bridge: ethers_1.ethers.getAddress("0x5AaC11DDCf117A789f339ece3CBC23756985E554"),
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
                bridge: ethers_1.ethers.getAddress("0x2b4082b5cBe5958888d68985524939ec1c871007"),
                identifier: "MOONBEAM",
                provider: new ethers_1.JsonRpcProvider("https://rpc.api.moonbase.moonbeam.network"),
                royaltySalePrice: 10000,
                storage,
            },
            tezosParams: {
                bridge: "KT1UGfH2Hk2MVKt8ADqqkRqcGZussRnfpahV",
                identifier: "TEZOS",
                storage,
                Tezos: new taquito_1.TezosToolkit("https://ghostnet.smartpy.io"),
                tzktApi: "https://api.ghostnet.tzkt.io/",
            },
        };
    }
    ChainFactoryConfigs.TestNet = TestNet;
    function MainNet() {
        const optimism = new ethers_1.JsonRpcProvider("https://optimism-mainnet.public.blastapi.io");
        const storage = evm_1.BridgeStorage__factory.connect("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83", optimism);
        return {
            bscParams: {
                identifier: factory_1.Chain.BSC,
                provider: new ethers_1.JsonRpcProvider("https://bsc-pokt.nodies.app"),
                bridge: ethers_1.ethers.getAddress("0xE0ea24108ec2754467D2c1D9320Cb6A16276478f"),
                royaltySalePrice: 10000,
                storage,
            },
            maticParams: {
                identifier: factory_1.Chain.MATIC,
                provider: new ethers_1.JsonRpcProvider("https://polygon-pokt.nodies.app"),
                bridge: ethers_1.ethers.getAddress("0x5055E15963504374d989CebC2707f5E46Efb3BDC"),
                royaltySalePrice: 10000,
                storage,
            },
            hederaParams: {
                identifier: factory_1.Chain.HEDERA,
                bridge: ethers_1.ethers.getAddress("0x000000000000000000000000000000000064a394"),
                bridgeContractId: "0.0.6595476",
                provider: new ethers_1.JsonRpcProvider("https://mainnet.hashio.io/api"),
                royaltySalePrice: 10000,
                storage,
                royaltyProxy: "0x97fec8ed7203ea3ce58e2a4f44056fd954a35be4",
                mirrorNodeApi: "https://mainnet.mirrornode.hedera.com/api",
            },
            tonParams: {
                identifier: factory_1.Chain.TON,
                bridgeAddress: "EQDxgiJHXQS3Bd9a6wK4Y6G81vTL27EPERq0qKzYAcDcYlHb",
                client: new ton_1.TonClient({
                    endpoint: "https://toncenter.com/api/v2/jsonRPC?api_key=05645d6b549f33bf80cee8822bd63df720c6781bd00020646deb7b2b2cd53b73",
                }),
                storage,
            },
        };
    }
    ChainFactoryConfigs.MainNet = MainNet;
})(ChainFactoryConfigs || (exports.ChainFactoryConfigs = ChainFactoryConfigs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZhY3RvcnkvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhDQUFnRDtBQUNoRCxrQ0FBcUM7QUFDckMsbUNBQWlEO0FBQ2pELCtDQUErRDtBQVMvRCx1Q0FBa0M7QUFnQmxDLElBQWlCLG1CQUFtQixDQW1HbkM7QUFuR0QsV0FBaUIsbUJBQW1CO0lBQ2xDLFNBQWdCLE9BQU87UUFDckIsTUFBTSxLQUFLLEdBQUcsSUFBSSx3QkFBZSxDQUMvQiwyREFBMkQsQ0FDNUQsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLDRCQUFzQixDQUFDLE9BQU8sQ0FDNUMsNENBQTRDLEVBQzVDLEtBQUssQ0FDTixDQUFDO1FBQ0YsT0FBTztZQUNMLFNBQVMsRUFBRTtnQkFDVCxVQUFVLEVBQUUsZUFBSyxDQUFDLEdBQUc7Z0JBQ3JCLFFBQVEsRUFBRSxJQUFJLHdCQUFlLENBQUMsb0NBQW9DLENBQUM7Z0JBQ25FLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixPQUFPO2FBQ1I7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osVUFBVSxFQUFFLGVBQUssQ0FBQyxNQUFNO2dCQUN4QixNQUFNLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQztnQkFDdkUsZ0JBQWdCLEVBQUUsYUFBYTtnQkFDL0IsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQywrQkFBK0IsQ0FBQztnQkFDOUQsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsT0FBTztnQkFDUCxZQUFZLEVBQUUsNENBQTRDO2dCQUMxRCxhQUFhLEVBQUUsMkNBQTJDO2FBQzNEO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFVBQVUsRUFBRSxlQUFLLENBQUMsR0FBRztnQkFDckIsYUFBYSxFQUFFLGtEQUFrRDtnQkFDakUsTUFBTSxFQUFFLElBQUksZUFBUyxDQUFDO29CQUNwQixRQUFRLEVBQ04sdUhBQXVIO2lCQUMxSCxDQUFDO2dCQUNGLE9BQU87YUFDUjtZQUNELGNBQWMsRUFBRTtnQkFDZCxNQUFNLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQztnQkFDdkUsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLFFBQVEsRUFBRSxJQUFJLHdCQUFlLENBQzNCLDJDQUEyQyxDQUM1QztnQkFDRCxnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixPQUFPO2FBQ1I7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsTUFBTSxFQUFFLHNDQUFzQztnQkFDOUMsVUFBVSxFQUFFLE9BQU87Z0JBQ25CLE9BQU87Z0JBQ1AsS0FBSyxFQUFFLElBQUksc0JBQVksQ0FBQyw2QkFBNkIsQ0FBQztnQkFDdEQsT0FBTyxFQUFFLCtCQUErQjthQUN6QztTQUM4QixDQUFDO0lBQ3BDLENBQUM7SUFwRGUsMkJBQU8sVUFvRHRCLENBQUE7SUFFRCxTQUFnQixPQUFPO1FBQ3JCLE1BQU0sUUFBUSxHQUFHLElBQUksd0JBQWUsQ0FDbEMsNkNBQTZDLENBQzlDLENBQUM7UUFDRixNQUFNLE9BQU8sR0FBRyw0QkFBc0IsQ0FBQyxPQUFPLENBQzVDLDRDQUE0QyxFQUM1QyxRQUFRLENBQ1QsQ0FBQztRQUNGLE9BQU87WUFDTCxTQUFTLEVBQUU7Z0JBQ1QsVUFBVSxFQUFFLGVBQUssQ0FBQyxHQUFHO2dCQUNyQixRQUFRLEVBQUUsSUFBSSx3QkFBZSxDQUFDLDZCQUE2QixDQUFDO2dCQUM1RCxNQUFNLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQztnQkFDdkUsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsT0FBTzthQUNSO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxlQUFLLENBQUMsS0FBSztnQkFDdkIsUUFBUSxFQUFFLElBQUksd0JBQWUsQ0FBQyxpQ0FBaUMsQ0FBQztnQkFDaEUsTUFBTSxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsNENBQTRDLENBQUM7Z0JBQ3ZFLGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLE9BQU87YUFDUjtZQUNELFlBQVksRUFBRTtnQkFDWixVQUFVLEVBQUUsZUFBSyxDQUFDLE1BQU07Z0JBQ3hCLE1BQU0sRUFBRSxlQUFNLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDO2dCQUN2RSxnQkFBZ0IsRUFBRSxhQUFhO2dCQUMvQixRQUFRLEVBQUUsSUFBSSx3QkFBZSxDQUFDLCtCQUErQixDQUFDO2dCQUM5RCxnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixPQUFPO2dCQUNQLFlBQVksRUFBRSw0Q0FBNEM7Z0JBQzFELGFBQWEsRUFBRSwyQ0FBMkM7YUFDM0Q7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsVUFBVSxFQUFFLGVBQUssQ0FBQyxHQUFHO2dCQUNyQixhQUFhLEVBQUUsa0RBQWtEO2dCQUNqRSxNQUFNLEVBQUUsSUFBSSxlQUFTLENBQUM7b0JBQ3BCLFFBQVEsRUFDTiwrR0FBK0c7aUJBQ2xILENBQUM7Z0JBQ0YsT0FBTzthQUNSO1NBQzhCLENBQUM7SUFDcEMsQ0FBQztJQTNDZSwyQkFBTyxVQTJDdEIsQ0FBQTtBQUNILENBQUMsRUFuR2dCLG1CQUFtQixtQ0FBbkIsbUJBQW1CLFFBbUduQyJ9