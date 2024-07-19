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
        identifier: "BSC",
        provider: new JsonRpcProvider("https://bsc-testnet.publicnode.com"),
        bridge: ethers.getAddress("0xCa5c7090Fa1F3C0939E226ec827Ae140494d81F4"),
        royaltySalePrice: 10000,
        storage,
      },
      ethParams: {
        identifier: "ETH",
        provider: new JsonRpcProvider(
          "https://ethereum-sepolia.publicnode.com",
        ),
        bridge: ethers.getAddress("0xCa3563d84f0D62344B8467382623d780Bb58871f"),
        royaltySalePrice: 10000,
        storage,
      },
      maticParams: {
        identifier: "MATIC",
        provider: new JsonRpcProvider(
          "https://polygon-amoy-bor-rpc.publicnode.com",
        ),
        bridge: ethers.getAddress("0x820c0b504fe85b43E3c43D2EA24cb764ad78d52e"),
        royaltySalePrice: 10000,
        storage,
      },
      hederaParams: {
        bridge: ethers.getAddress("0x473D25d2f26d8288c15EBB608A11cb067a74A692"),
        bridgeContractId: "0.0.4392930",
        identifier: "HEDERA",
        provider: new JsonRpcProvider("https://testnet.hashio.io/api"),
        royaltySalePrice: 10000,
        storage,
        royaltyProxy: "0xFdDEEbDf5F2e959A1637Cb130cE753d42083a2EA",
      },
      tezosParams: {
        bridge: "KT18pSSB3f9H3xtHzBfMCjTdPja82nqpAm66",
        Tezos: new TezosToolkit("https://ghostnet.smartpy.io"),
        storage,
        tzktApi: "https://api.ghostnet.tzkt.io/",
      },
      secretParams: {
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
        bridgeAddress: "kQA44UbG1OwwD3E-oScnetLJwWasDFuTSJb6hOHq8KvrudxM",
        client: new TonClient({
          endpoint:
            "https://testnet.toncenter.com/api/v2/jsonRPC?api_key=f3f6ef64352ac53cdfca18a3ba5372983e4037182c2b510fc52de5a259ecf292",
        }),
        storage,
      },
      aptosParams: {
        bridge:
          "0xcd863684221790d5b8b9d37b1a7173590494cc888286f384d716cc35ac98f4f8",
        network: Network.DEVNET,
        storage,
      },
      terraParams: {
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
      "0x463E4A5eA947D9DFC250687E469AA487cbD8e1A7",
      optimism,
    );
    return {
      bscParams: {
        identifier: "BSC",
        provider: new JsonRpcProvider("https://bsc-pokt.nodies.app"),
        bridge: ethers.getAddress("0xdb3ae6531D405D341d7b25597A64082D7ed05a07"),
        royaltySalePrice: 10000,
        storage,
      },
      maticParams: {
        identifier: "MATIC",
        provider: new JsonRpcProvider("https://polygon-pokt.nodies.app"),
        bridge: ethers.getAddress("0xBd68244C35E660A328266c9cc1411a69992D022D"),
        royaltySalePrice: 10000,
        storage,
      },
      hederaParams: {
        bridge: ethers.getAddress("0x463e4a5ea947d9dfc250687e469aa487cbd8e1a7"),
        bridgeContractId: "0.0.6406398",
        identifier: "HEDERA",
        provider: new JsonRpcProvider("https://mainnet.hashio.io/api"),
        royaltySalePrice: 10000,
        storage,
        royaltyProxy: "0x97fec8ed7203ea3ce58e2a4f44056fd954a35be4",
      },
    } satisfies Partial<TChainParams>;
  }
}
