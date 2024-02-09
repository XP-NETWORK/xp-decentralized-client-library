import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { JsonRpcProvider } from "ethers";
import { SecretNetworkClient } from "secretjs";
import { EvmParams } from "../handlers/evm";
import { MultiversXParams } from "../handlers/multiversx";
import { SecretParams } from "../handlers/secret";
import { TezosParams } from "../handlers/tezos";
import { TonParams } from "../handlers/ton";
export interface ChainParams {
    bscParams: EvmParams;
    ethParams: EvmParams;
    polygonParams: EvmParams;
    hederaParams: EvmParams;
    tezosParams: TezosParams;
    secretParams: SecretParams;
    multiversxParams: MultiversXParams;
    tonParams: TonParams;
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