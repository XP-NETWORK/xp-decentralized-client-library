import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { JsonRpcProvider } from "ethers";
import { TAptosParams } from "../handlers/aptos/types";
import { TCosmWasmParams } from "../handlers/cosmwasm/types";
import { TEvmParams } from "../handlers/evm/types";
import { THederaParams } from "../handlers/hedera/types";
import { TICPParams } from "../handlers/icp/types";
import { TMultiversXParams } from "../handlers/multiversx/types";
import { TSecretParams } from "../handlers/secret/types";
import { TTezosParams } from "../handlers/tezos/types";
import { TTonParams } from "../handlers/ton/types";
export interface TChainParams {
    bscParams: TEvmParams;
    ethParams: TEvmParams;
    maticParams: TEvmParams;
    baseParams: TEvmParams;
    hederaParams: THederaParams;
    tezosParams: TTezosParams;
    secretParams: TSecretParams;
    multiversxParams: TMultiversXParams;
    tonParams: TTonParams;
    terraParams: TCosmWasmParams;
    aptosParams: TAptosParams;
    moonbeamParams: TEvmParams;
    icpParams: TICPParams;
}
export declare namespace ChainFactoryConfigs {
    function TestNet(): {
        bscParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        hederaParams: {
            identifier: string;
            bridge: string;
            bridgeContractId: string;
            provider: JsonRpcProvider;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
            royaltyProxy: string;
            mirrorNodeApi: string;
        };
        tonParams: {
            identifier: string;
            bridgeAddress: string;
            client: TonClient;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        moonbeamParams: {
            bridge: string;
            identifier: string;
            provider: JsonRpcProvider;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        tezosParams: {
            bridge: string;
            identifier: string;
            storage: import("../contractsTypes/evm").BridgeStorage;
            Tezos: TezosToolkit;
            tzktApi: string;
        };
        multiversxParams: {
            bridge: string;
            chainId: string;
            identifier: string;
            gatewayURL: string;
            provider: ProxyNetworkProvider;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        icpParams: {
            agent: HttpAgent;
            bridge: Principal;
            identifier: string;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
    };
    function MainNet(): {
        bscParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        maticParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        baseParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        hederaParams: {
            identifier: string;
            bridge: string;
            bridgeContractId: string;
            provider: JsonRpcProvider;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
            royaltyProxy: string;
            mirrorNodeApi: string;
        };
        tonParams: {
            identifier: string;
            bridgeAddress: string;
            client: TonClient;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
    };
}
//# sourceMappingURL=config.d.ts.map