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
        };
        ethParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
        };
        polygonParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
        };
        hederaParams: {
            bridge: string;
            identifier: string;
            provider: JsonRpcProvider;
            royaltySalePrice: number;
        };
        tezosParams: {
            bridge: string;
            Tezos: TezosToolkit;
        };
        secretParams: {
            bridge: string;
            bridgeCodeHash: string;
            chainId: string;
            provider: SecretNetworkClient;
        };
        multiversxParams: {
            bridge: string;
            gatewayURL: string;
            provider: ProxyNetworkProvider;
        };
        tonParams: {
            bridgeAddress: string;
            client: TonClient;
        };
    };
}
//# sourceMappingURL=config.d.ts.map