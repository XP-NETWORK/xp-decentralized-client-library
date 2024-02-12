import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { JsonRpcProvider } from "ethers";
import { SecretNetworkClient } from "secretjs";
import { TEvmParams } from "../handlers/evm";
import { TMultiversXParams } from "../handlers/multiversx";
import { TSecretParams } from "../handlers/secret";
import { TTezosParams } from "../handlers/tezos";
import { TTonParams } from "../handlers/ton";
export interface TChainParams {
    bscParams: TEvmParams;
    ethParams: TEvmParams;
    polygonParams: TEvmParams;
    hederaParams: TEvmParams;
    tezosParams: TTezosParams;
    secretParams: TSecretParams;
    multiversxParams: TMultiversXParams;
    tonParams: TTonParams;
}
export declare namespace ChainFactoryConfigs {
    function TestNet(): {
        bscParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes").BridgeStorage;
        };
        ethParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes").BridgeStorage;
        };
        polygonParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes").BridgeStorage;
        };
        hederaParams: {
            bridge: string;
            identifier: string;
            provider: JsonRpcProvider;
            royaltySalePrice: number;
            storage: import("../contractsTypes").BridgeStorage;
        };
        tezosParams: {
            bridge: string;
            Tezos: TezosToolkit;
            storage: import("../contractsTypes").BridgeStorage;
        };
        secretParams: {
            bridge: string;
            bridgeCodeHash: string;
            chainId: string;
            provider: SecretNetworkClient;
            storage: import("../contractsTypes").BridgeStorage;
        };
        multiversxParams: {
            bridge: string;
            gatewayURL: string;
            provider: ProxyNetworkProvider;
            storage: import("../contractsTypes").BridgeStorage;
        };
        tonParams: {
            bridgeAddress: string;
            client: TonClient;
            storage: import("../contractsTypes").BridgeStorage;
        };
    };
}
//# sourceMappingURL=config.d.ts.map