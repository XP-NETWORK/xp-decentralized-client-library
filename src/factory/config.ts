import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { Network } from "aptos";
import { JsonRpcProvider, ethers } from "ethers";
import { SecretNetworkClient } from "secretjs";
import { BridgeStorage__factory } from "../contractsTypes/evm";
import { TAptosParams } from "../handlers/aptos/types";
import { TCosmWasmParams } from "../handlers/cosmwasm/types";
import { TEvmParams } from "../handlers/evm/types";
import { THederaParams } from "../handlers/hedera/types";
import { TMultiversXParams } from "../handlers/multiversx/types";
import { TSecretParams } from "../handlers/secret/types";
import { TTezosParams } from "../handlers/tezos/types";
import { TTonParams } from "../handlers/ton/types";
import { Chain } from "./factory";

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

export namespace ChainFactoryConfigs {
  export function TestNet() {
    const optimism = new JsonRpcProvider("https://sepolia.optimism.io");
    const storage = BridgeStorage__factory.connect(
      "0x8411EeadD374bDE549F61a166FFBeFca592bC60a",
      optimism,
    );
    return {
      bscParams: {
        identifier: Chain.BSC,
        provider: new JsonRpcProvider("https://bsc-testnet.publicnode.com"),
        bridge: ethers.getAddress("0xCa5c7090Fa1F3C0939E226ec827Ae140494d81F4"),
        royaltySalePrice: 10000,
        storage,
      },
      ethParams: {
        identifier: Chain.ETH,
        provider: new JsonRpcProvider(
          "https://ethereum-sepolia.publicnode.com",
        ),
        bridge: ethers.getAddress("0xCa3563d84f0D62344B8467382623d780Bb58871f"),
        royaltySalePrice: 10000,
        storage,
      },
      maticParams: {
        identifier: Chain.MATIC,
        provider: new JsonRpcProvider(
          "https://polygon-amoy-bor-rpc.publicnode.com",
        ),
        bridge: ethers.getAddress("0x820c0b504fe85b43E3c43D2EA24cb764ad78d52e"),
        royaltySalePrice: 10000,
        storage,
      },
      hederaParams: {
        identifier: Chain.HEDERA,
        bridge: ethers.getAddress("0x473D25d2f26d8288c15EBB608A11cb067a74A692"),
        bridgeContractId: "0.0.4392930",
        provider: new JsonRpcProvider("https://testnet.hashio.io/api"),
        royaltySalePrice: 10000,
        storage,
        royaltyProxy: "0xFdDEEbDf5F2e959A1637Cb130cE753d42083a2EA",
        mirrorNodeApi: "https://testnet.mirrornode.hedera.com/api/",
      },
      tezosParams: {
        identifier: Chain.TEZOS,
        bridge: "KT18pSSB3f9H3xtHzBfMCjTdPja82nqpAm66",
        Tezos: new TezosToolkit("https://ghostnet.smartpy.io"),
        storage,
        tzktApi: "https://api.ghostnet.tzkt.io/",
      },
      secretParams: {
        identifier: Chain.SECRET,
        bridge: "secret1elt03d87zqvuwv8567fmnpjpyh4rt9tgyutqx3",
        bridgeCodeHash: "",
        chainId: "pulsar-3",
        provider: new SecretNetworkClient({
          chainId: "pulsar-3",
          url: "https://api.pulsar.scrttestnet.com",
        }),
        storage,
        nftCodeId: 7104,
      },
      multiversxParams: {
        identifier: Chain.MULTIVERSX,
        bridge:
          "erd1qqqqqqqqqqqqqpgqju4xpyzqhlpth298zyd23sx9ge628qhssjrspl5sye",
        gatewayURL: "https://devnet-gateway.multiversx.com",
        provider: new ProxyNetworkProvider(
          "https://devnet-gateway.multiversx.com",
        ),
        storage,
        chainId: "D",
      },
      tonParams: {
        identifier: Chain.TON,
        bridgeAddress: "kQA44UbG1OwwD3E-oScnetLJwWasDFuTSJb6hOHq8KvrudxM",
        client: new TonClient({
          endpoint:
            "https://testnet.toncenter.com/api/v2/jsonRPC?api_key=f3f6ef64352ac53cdfca18a3ba5372983e4037182c2b510fc52de5a259ecf292",
        }),
        storage,
      },
      aptosParams: {
        identifier: Chain.APTOS,
        bridge:
          "0xcd863684221790d5b8b9d37b1a7173590494cc888286f384d716cc35ac98f4f8",
        network: Network.DEVNET,
        storage,
      },
      terraParams: {
        identifier: Chain.TERRA,
        bridge:
          "terra1jdek24uwru97s8c48smzx035tmw55yqxzrc2sy7flepr980rx7hsrnyl03",
        chainId: "pisco-1",
        rpc: "https://pisco-rpc.terra.dev/",
        storage,
        denom: "uluna",
        nftCodeId: 13488,
      },
    } satisfies Partial<TChainParams>;
  }

  export function MainNet() {
    const optimism = new JsonRpcProvider(
      "https://optimism-mainnet.public.blastapi.io",
    );
    const storage = BridgeStorage__factory.connect(
      "0x4b7b56588d95C74953bf7d7eF0F540859BD1c941",
      optimism,
    );
    return {
      bscParams: {
        identifier: Chain.BSC,
        provider: new JsonRpcProvider("https://bsc-pokt.nodies.app"),
        bridge: ethers.getAddress("0x1704D2170683E7CC3c849Bb30cD265844dAd2B49"),
        royaltySalePrice: 10000,
        storage,
      },
      maticParams: {
        identifier: Chain.MATIC,
        provider: new JsonRpcProvider("https://polygon-pokt.nodies.app"),
        bridge: ethers.getAddress("0xb11aa122633A8104B1A655C3a12e296e8634926c"),
        royaltySalePrice: 10000,
        storage,
      },
      hederaParams: {
        identifier: Chain.HEDERA,
        bridge: ethers.getAddress("0x75e1a0c8974851fbb3845529d630ed32a30eee76"),
        bridgeContractId: "0.0.6445330",
        provider: new JsonRpcProvider("https://mainnet.hashio.io/api"),
        royaltySalePrice: 10000,
        storage,
        royaltyProxy: "0x97fec8ed7203ea3ce58e2a4f44056fd954a35be4",
        mirrorNodeApi: "https://mainnet.mirrornode.hedera.com/api/",
      },
    } satisfies Partial<TChainParams>;
  }
}
