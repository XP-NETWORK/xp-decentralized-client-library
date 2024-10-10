import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { JsonRpcProvider, ethers } from "ethers";
import { SecretNetworkClient } from "secretjs";
import { BridgeStorage__factory } from "../contractsTypes/evm";
import { TAptosParams } from "../handlers/aptos/types";
import { TCosmWasmParams } from "../handlers/cosmwasm/types";
import { TEvmParams } from "../handlers/evm/types";
import { THederaParams } from "../handlers/hedera/types";
import { TICPParams } from "../handlers/icp/types";
import { TMultiversXParams } from "../handlers/multiversx/types";
import { TNearParams } from "../handlers/near/types";
import { TSecretParams } from "../handlers/secret/types";
import { TTezosParams } from "../handlers/tezos/types";
import { TTonParams } from "../handlers/ton/types";
import { Chain } from "./factory";

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
}

export namespace ChainFactoryConfigs {
  export function TestNet() {
    const skale = new JsonRpcProvider(
      "https://testnet.skalenodes.com/v1/juicy-low-small-testnet",
    );
    const storage = BridgeStorage__factory.connect(
      "0x8184bCDC0a4C24D1cB8e054E389660B5b7160186",
      skale,
    );
    return {
      bscParams: {
        identifier: Chain.BSC,
        provider: new JsonRpcProvider("https://bsc-testnet.publicnode.com"),
        bridge: ethers.getAddress("0xA86704500C991a5C1976756Ee3f458d59240A6cE"),
        royaltySalePrice: 10000,
        storage,
      },
      hederaParams: {
        identifier: Chain.HEDERA,
        bridge: ethers.getAddress("0xf33e51DccC7727F1ac62782de7811712420841a0"),
        bridgeContractId: "0.0.4622994",
        provider: new JsonRpcProvider("https://testnet.hashio.io/api"),
        royaltySalePrice: 10000,
        storage,
        royaltyProxy: "0xFdDEEbDf5F2e959A1637Cb130cE753d42083a2EA",
        mirrorNodeApi: "https://testnet.mirrornode.hedera.com/api",
      },
      tonParams: {
        identifier: Chain.TON,
        bridgeAddress: "kQCHrjSTU6W7XYUfJgwr_trmG3QL_llPJfPyXPmINYznrkh6",
        client: new TonClient({
          endpoint:
            "https://testnet.toncenter.com/api/v2/jsonRPC?api_key=f3f6ef64352ac53cdfca18a3ba5372983e4037182c2b510fc52de5a259ecf292",
        }),
        storage,
      },
      moonbeamParams: {
        bridge: ethers.getAddress("0x4144b9255B45691E1Cc9BEdE04726b26ebd6C90A"),
        identifier: "MOONBEAM",
        provider: new JsonRpcProvider(
          "https://rpc.api.moonbase.moonbeam.network",
        ),
        royaltySalePrice: 10000,
        storage,
      },
      secretParams: {
        bridge: "secret1grl2nduhjkvags56ewgcn80ymmmke8tfrm9zg9",
        bridgeCodeHash: "",
        chainId: "pulsar-3",
        identifier: "SECRET",
        nftCodeId: 10416,
        provider: new SecretNetworkClient({
          chainId: "pulsar-3",
          url: "https://api.pulsar.scrttestnet.com",
        }),
        storage,
      },
      tezosParams: {
        bridge: "KT1Gm6qaUmfuVnGJmfY46K6hiUzgFP8DLcke",
        identifier: "TEZOS",
        storage,
        Tezos: new TezosToolkit("https://ghostnet.ecadinfra.com"),
        tzktApi: "https://api.ghostnet.tzkt.io/",
      },
      multiversxParams: {
        bridge:
          "erd1qqqqqqqqqqqqqpgqlw5n62qnewxzesd4kesa0dk5u2l93pdptxsqlqrftf",
        chainId: "D",
        identifier: "MULTIVERSX",
        gatewayURL: "https://devnet-gateway.multiversx.com",
        provider: new ProxyNetworkProvider(
          "https://devnet-gateway.multiversx.com",
        ),
        storage,
      },
      icpParams: {
        agent: new HttpAgent({
          host: "https://tools.xp.network",
        }),
        bridge: Principal.fromText("bw4dl-smaaa-aaaaa-qaacq-cai"),
        identifier: "ICP",
        storage,
      },
      nearParams: {
        bridge: "xp-bridge-test.testnet",
        networkId: "testnet",
        nodeUrl: "https://archival-rpc.testnet.near.org",
        identifier: "NEAR",
        storage,
      },
    } satisfies Partial<TChainParams>;
  }

  export function MainNet() {
    const optimism = new JsonRpcProvider(
      "https://optimism-mainnet.public.blastapi.io",
    );
    const storage = BridgeStorage__factory.connect(
      "0xc6e84955ba7C354fb7ca60011883e5673Be3F629",
      optimism,
    );
    return {
      bscParams: {
        identifier: Chain.BSC,
        provider: new JsonRpcProvider("https://binance.llamarpc.com"),
        bridge: ethers.getAddress("0x289FDdDce5119C41B82C969135212061D5E7Dce5"),
        royaltySalePrice: 10000,
        storage,
      },
      maticParams: {
        identifier: Chain.MATIC,
        provider: new JsonRpcProvider("https://polygon-pokt.nodies.app"),
        bridge: ethers.getAddress("0x2011DAD5caE280243d075D12a38CcCc0Fb4412dE"),
        royaltySalePrice: 10000,
        storage,
      },
      baseParams: {
        identifier: Chain.BASE,
        provider: new JsonRpcProvider("https://base.llamarpc.com"),
        bridge: ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
        royaltySalePrice: 10000,
        storage,
      },
      hederaParams: {
        identifier: Chain.HEDERA,
        bridge: ethers.getAddress("0x00000000000000000000000000000000006bc585"),
        bridgeContractId: "0.0.7062917",
        provider: new JsonRpcProvider("https://mainnet.hashio.io/api"),
        royaltySalePrice: 10000,
        storage,
        royaltyProxy: "0x97fec8ed7203ea3ce58e2a4f44056fd954a35be4",
        mirrorNodeApi: "https://mainnet.mirrornode.hedera.com/api",
      },
      tonParams: {
        identifier: Chain.TON,
        bridgeAddress: "EQDn9dWuVp18AMnFc7yrEx6TxDwrbFI8FZYElkY7Exe1QcQO",
        client: new TonClient({
          endpoint:
            "https://toncenter.com/api/v2/jsonRPC?api_key=78b6f2e7cbe2900dd39ab51a3f8fe3090154973343929991ed9b4f63fbeb45a5",
        }),
        storage,
      },
      tezosParams: {
        bridge: "KT1UMVUP3XBpPrMUwuC6DXjEcLgZykV7p1PW",
        identifier: Chain.TEZOS,
        storage,
        Tezos: new TezosToolkit("https://mainnet.ecadinfra.com"),
        tzktApi: "https://api.tzkt.io/",
      },
      icpParams: {
        agent: new HttpAgent({
          host: "https://ic0.app",
        }),
        bridge: Principal.fromText("6gfde-pqaaa-aaaal-al76q-cai"),
        identifier: "ICP",
        storage,
      },
      multiversxParams: {
        bridge:
          "erd1qqqqqqqqqqqqqpgqgpeqtg36880f8rn6r6ngfcu73uq4dkextxsq7zjmm9",
        chainId: "1",
        identifier: "MULTIVERSX",
        gatewayURL: "https://gateway.multiversx.com",
        provider: new ProxyNetworkProvider("https://gateway.multiversx.com"),
        storage,
      },
    } satisfies Partial<TChainParams>;
  }
}
