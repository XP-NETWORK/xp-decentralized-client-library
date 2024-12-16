import { Network } from "@aptos-labs/ts-sdk";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import { Framework } from "@vechain/connex-framework";
import * as thor from "@vechain/web3-providers-connex";
import { BrowserProvider, JsonRpcProvider, ethers } from "ethers";
import { SecretNetworkClient } from "secretjs";
import { BridgeStorage__factory } from "../contractsTypes/evm";
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
  blastParams: TEvmParams;
  fantomParams: TEvmParams;
  avaxParams: TEvmParams;
  casperParams: TCasperParams;
  vechainParams: TEvmParams;
}

export namespace ChainFactoryConfigs {
  export async function TestNet() {
    const skale = new JsonRpcProvider(
      "https://testnet.skalenodes.com/v1/juicy-low-small-testnet",
    );
    const storage = BridgeStorage__factory.connect(
      "0x8184bCDC0a4C24D1cB8e054E389660B5b7160186",
      skale,
    );
    const net = new SimpleNet("https://sync-testnet.veblocks.net");
    const driver = await Driver.connect(net);
    const connexObj = new Framework(driver);

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
        bridge: "secret1ym9jslryg6r8nlch2036py92gd50vejznwhuvx",
        bridgeCodeHash: "",
        chainId: "secret-4",
        identifier: "SECRET",
        nftCodeId: 1983,
        provider: new SecretNetworkClient({
          chainId: "secret-4",
          url: "https://rpc.ankr.com/http/scrt_cosmos",
        }),
        storage,
      },
      tezosParams: {
        bridge: "KT1CFXpeB7RPAvzgGAVBkKZ5fXsAB61h72rs",
        identifier: "TEZOS",
        storage,
        Tezos: new TezosToolkit("https://ghostnet.ecadinfra.com"),
        tzktApi: "https://api.ghostnet.tzkt.io/",
      },
      multiversxParams: {
        bridge:
          "erd1qqqqqqqqqqqqqpgq4tfugv4aks67l6ggh2zs0xuxk7d00x4ttxsqud4vpp",
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
      blastParams: {
        identifier: Chain.BLAST,
        provider: new JsonRpcProvider(
          "https://blast-sepolia.blockpi.network/v1/rpc/public",
        ),
        bridge: ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
        royaltySalePrice: 10000,
        storage,
      },
      aptosParams: {
        bridge:
          "68c508b1b20701c8ddecbbc8e603e788be96c1dcb6ccdcf43ac8594f6f49077a",
        identifier: "APTOS",
        network: Network.TESTNET,
        storage,
      },
      casperParams: {
        bridge:
          "hash-047ddacdb2d4c44b3d0d6c02341ff96e951409d30d4627d7b580db46743a6111",
        identifier: Chain.CASPER,
        network: "casper-test",
        rpc: "https://rpc.testnet.casperlabs.io/rpc",
        storage,
        proxy_url: "https://sheltered-crag-76748.herokuapp.com/",
      },
      vechainParams: {
        identifier: Chain.VECHAIN,
        provider: new BrowserProvider(
          new thor.Provider({
            connex: connexObj,
            net,
          }),
        ),
        bridge: ethers.getAddress("0x7111eb5f8d9dA472e9608f2ab3De275C040D60B2"),
        royaltySalePrice: 10000,
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
      terraParams: {
        bridge:
          "terra1sryye399v0wrq5aap0s9jlqn9s6wm34gmd27pnlmceghd9qsgyqsugalra",
        chainId: "pisco-1",
        denom: "uluna",
        identifier: "TERRA",
        nftCodeId: 14213,
        rpc: "https://rpc.testcosmos.directory/terra2testnet",
        storage,
      },
      multiversxParams: {
        bridge:
          "erd1qqqqqqqqqqqqqpgqmads3ruz3ywdq47a2whdgwsxdvtgut84txsqnuwr6c",
        chainId: "1",
        identifier: "MULTIVERSX",
        gatewayURL: "https://gateway.multiversx.com",
        provider: new ProxyNetworkProvider("https://gateway.multiversx.com"),
        storage,
      },
      blastParams: {
        identifier: Chain.BLAST,
        provider: new JsonRpcProvider("https://blast.gateway.tenderly.co"),
        bridge: ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
        royaltySalePrice: 10000,
        storage,
      },
      fantomParams: {
        identifier: Chain.FANTOM,
        provider: new JsonRpcProvider("https://rpc.fantom.network"),
        bridge: ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
        royaltySalePrice: 10000,
        storage,
      },
      avaxParams: {
        identifier: Chain.AVALANCHE,
        provider: new JsonRpcProvider("https://avalanche.public-rpc.com"),
        bridge: ethers.getAddress("0x92764FF21a1a8cC4e8eEec43ED04Bea3B76D8fD3"),
        royaltySalePrice: 10000,
        storage,
      },
      moonbeamParams: {
        bridge: ethers.getAddress("0x2Aa8Dbb7543754d70B5A40D52cB81c2a0bB08B83"),
        identifier: "MOONBEAM",
        provider: new JsonRpcProvider("https://1rpc.io/glmr"),
        royaltySalePrice: 10000,
        storage,
      },
      ethParams: {
        bridge: ethers.getAddress("0x4B2A837613bA45C734439155CC7030c79095a2ed"),
        identifier: "ETHEREUM",
        provider: new JsonRpcProvider("https://eth.llamarpc.com"),
        royaltySalePrice: 10000,
        storage,
      },
      casperParams: {
        bridge:
          "hash-284d7eeee5d0ece8b0d56cc7162a3cf72e6fabc62946e3a9abae219c646d56c3",
        identifier: Chain.CASPER,
        network: "casper",
        rpc: "http://37.27.69.30:7777/rpc",
        storage,
        proxy_url: "https://sheltered-crag-76748.herokuapp.com/",
      },
      nearParams: {
        bridge: "xp-bridge-main.near",
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        identifier: Chain.NEAR,
        storage,
      },
    } satisfies Partial<TChainParams>;
  }
}
