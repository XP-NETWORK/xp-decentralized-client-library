import { Network } from "@aptos-labs/ts-sdk";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { BrowserProvider, JsonRpcProvider } from "ethers";
import { SecretNetworkClient } from "secretjs";
import type { TAptosParams } from "../handlers/aptos/types";
import type { TCasperParams } from "../handlers/casper/types";
import type { TCosmWasmParams } from "../handlers/cosmwasm/types";
import type { TEvmParams } from "../handlers/evm/types";
import type { THederaParams } from "../handlers/hedera/types";
import type { TICPParams } from "../handlers/icp/types";
import type { TMultiversXParams } from "../handlers/multiversx/types";
import type { TNearParams } from "../handlers/near/types";
import type { TSecretParams } from "../handlers/secret/types";
import type { TTezosParams } from "../handlers/tezos/types";
import type { TTonParams } from "../handlers/ton/types";
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
    nearParams: TNearParams;
    blastParams: TEvmParams;
    fantomParams: TEvmParams;
    avaxParams: TEvmParams;
    casperParams: TCasperParams;
    vechainParams: TEvmParams;
}
export declare namespace ChainFactoryConfigs {
    function TestNet(): Promise<{
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
        secretParams: {
            bridge: string;
            bridgeCodeHash: string;
            chainId: string;
            identifier: string;
            nftCodeId: number;
            provider: SecretNetworkClient;
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
        nearParams: {
            bridge: string;
            networkId: string;
            nodeUrl: string;
            identifier: string;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        blastParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        aptosParams: {
            bridge: string;
            identifier: string;
            network: Network.TESTNET;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        casperParams: {
            bridge: string;
            identifier: string;
            network: string;
            rpc: string;
            storage: import("../contractsTypes/evm").BridgeStorage;
            proxy_url: string;
        };
        vechainParams: {
            identifier: string;
            provider: BrowserProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
    }>;
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
        tezosParams: {
            bridge: string;
            identifier: string;
            storage: import("../contractsTypes/evm").BridgeStorage;
            Tezos: TezosToolkit;
            tzktApi: string;
        };
        icpParams: {
            agent: HttpAgent;
            bridge: Principal;
            identifier: string;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        multiversxParams: {
            bridge: string;
            chainId: string;
            identifier: string;
            gatewayURL: string;
            provider: ProxyNetworkProvider;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        blastParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        fantomParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        avaxParams: {
            identifier: string;
            provider: JsonRpcProvider;
            bridge: string;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        moonbeamParams: {
            bridge: string;
            identifier: string;
            provider: JsonRpcProvider;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        ethParams: {
            bridge: string;
            identifier: string;
            provider: JsonRpcProvider;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        casperParams: {
            bridge: string;
            identifier: string;
            network: string;
            rpc: string;
            storage: import("../contractsTypes/evm").BridgeStorage;
            proxy_url: string;
        };
        nearParams: {
            bridge: string;
            networkId: string;
            nodeUrl: string;
            identifier: string;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
    };
}
//# sourceMappingURL=config.d.ts.map