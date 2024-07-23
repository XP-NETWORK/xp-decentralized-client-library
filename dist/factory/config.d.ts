import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { Network } from "aptos";
import { JsonRpcProvider } from "ethers";
import { SecretNetworkClient } from "secretjs";
import { TAptosParams } from "../handlers/aptos/types";
import { TCosmWasmParams } from "../handlers/cosmwasm/types";
import { TEvmParams } from "../handlers/evm/types";
import { THederaParams } from "../handlers/hedera/types";
import { TMultiversXParams } from "../handlers/multiversx/types";
import { TSecretParams } from "../handlers/secret/types";
import { TTezosParams } from "../handlers/tezos/types";
import { TTonParams } from "../handlers/ton/types";
export interface TChainParams {
    bscParams: TEvmParams;
    ethParams: TEvmParams;
    maticParams: TEvmParams;
    hederaParams: THederaParams;
    tezosParams: TTezosParams;
    secretParams: TSecretParams;
    multiversxParams: TMultiversXParams;
    tonParams: TTonParams;
    terraParams: TCosmWasmParams;
    aptosParams: TAptosParams;
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
            identifier: string;
            bridge: string;
            bridgeContractId: string;
            provider: JsonRpcProvider;
            royaltySalePrice: number;
            storage: import("../contractsTypes/evm").BridgeStorage;
            royaltyProxy: string;
            mirrorNodeApi: string;
        };
        tezosParams: {
            identifier: string;
            bridge: string;
            Tezos: TezosToolkit;
            storage: import("../contractsTypes/evm").BridgeStorage;
            tzktApi: string;
        };
        secretParams: {
            identifier: string;
            bridge: string;
            bridgeCodeHash: string;
            chainId: string;
            provider: SecretNetworkClient;
            storage: import("../contractsTypes/evm").BridgeStorage;
            nftCodeId: number;
        };
        multiversxParams: {
            identifier: string;
            bridge: string;
            gatewayURL: string;
            provider: ProxyNetworkProvider;
            storage: import("../contractsTypes/evm").BridgeStorage;
            chainId: string;
        };
        tonParams: {
            identifier: string;
            bridgeAddress: string;
            client: TonClient;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        aptosParams: {
            identifier: string;
            bridge: string;
            network: Network.DEVNET;
            storage: import("../contractsTypes/evm").BridgeStorage;
        };
        terraParams: {
            identifier: string;
            bridge: string;
            chainId: string;
            rpc: string;
            storage: import("../contractsTypes/evm").BridgeStorage;
            denom: string;
            nftCodeId: number;
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
    };
}
//# sourceMappingURL=config.d.ts.map