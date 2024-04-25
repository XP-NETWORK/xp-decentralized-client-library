import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { JsonRpcProvider } from "ethers";
import { SecretNetworkClient } from "secretjs";
import { TCosmWasmParams } from "../handlers/cosmwasm/types";
import { TEvmParams } from "../handlers/evm/types";
import { TMultiversXParams } from "../handlers/multiversx/types";
import { TSecretParams } from "../handlers/secret/types";
import { TTezosParams } from "../handlers/tezos/types";
import { TTonParams } from "../handlers/ton/types";
export interface TChainParams {
    bscParams: TEvmParams;
    ethParams: TEvmParams;
    maticParams: TEvmParams;
    hederaParams: TEvmParams;
    tezosParams: TTezosParams;
    secretParams: TSecretParams;
    multiversxParams: TMultiversXParams;
    tonParams: TTonParams;
    terraParams: TCosmWasmParams;
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
        ethParams: {
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
        hederaParams: {
            bridge: string;
            identifier: string;
            provider: JsonRpcProvider;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        tezosParams: {
            bridge: string;
            Tezos: TezosToolkit;
            storage: import("../contractsTypes/evm").BridgeStorage;
            tzktApi: string;
        };
        secretParams: {
            bridge: string;
            bridgeCodeHash: string;
            chainId: string;
            provider: SecretNetworkClient;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        multiversxParams: {
            bridge: string;
            gatewayURL: string;
            provider: ProxyNetworkProvider;
            storage: import("../contractsTypes/evm").BridgeStorage;
            chainId: string;
        };
        tonParams: {
            bridgeAddress: string;
            client: TonClient;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        terraParams: {
            bridge: string;
            chainId: string;
            rpc: string;
            storage: import("../contractsTypes/evm").BridgeStorage;
            denom: string;
            nftCodeId: number;
        };
    };
}
//# sourceMappingURL=config.d.ts.map