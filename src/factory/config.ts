import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { JsonRpcProvider, ethers } from "ethers";
import { SecretNetworkClient } from "secretjs";
import { BridgeStorage__factory } from "../contractsTypes";
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

export namespace ChainFactoryConfigs {
  export function TestNet() {
    const optimism = new JsonRpcProvider(
      "https://optimism-goerli.publicnode.com",
    );
    const storage = BridgeStorage__factory.connect(
      "0xaeD15b9AEd9401658A177abaab5854f31973F5C8",
      optimism,
    );
    return {
      bscParams: {
        identifier: "BSC",
        provider: new JsonRpcProvider("https://bsc-testnet.publicnode.com"),
        bridge: ethers.getAddress("0x3EC2839EcEAfa2Ce9e419718364B070563Db516e"),
        royaltySalePrice: 0,
        storage,
      },
      ethParams: {
        identifier: "ETH",
        provider: new JsonRpcProvider("https://rpc.notadegen.com/eth/sepolia"),
        bridge: ethers.getAddress("0xA0C15702892491597D369A04d7366Af234cF5F73"),
        royaltySalePrice: 0,
        storage,
      },
      polygonParams: {
        identifier: "MATIC",
        provider: new JsonRpcProvider(
          "https://polygon-mumbai-bor.publicnode.com",
        ),
        bridge: ethers.getAddress("0x1f89dce7eBFb78D6CA0A4d16F9B6a9F61B186ebc"),
        royaltySalePrice: 0,
        storage,
      },
      hederaParams: {
        bridge: ethers.getAddress("0x742f68F53583Be22a62338e916eB8DE90D07daB1"),
        identifier: "HEDERA",
        provider: new JsonRpcProvider("https://testnet.hashio.io/api"),
        royaltySalePrice: 0,
        storage,
      },
      tezosParams: {
        bridge: "KT1NHxTSXAFKH2y94PpfqDsg4bZ5SiF2V8a4",
        Tezos: new TezosToolkit("https://ghostnet.ecadinfra.com"),
        storage,
      },
      secretParams: {
        bridge: "secret1uxthnjt74cny9wnwx8czmgrc8taz0r8yfas565",
        bridgeCodeHash: "",
        chainId: "pulsar-3",
        provider: new SecretNetworkClient({
          chainId: "pulsar-3",
          url: "https://lcd.pulsar-3.secretsaturn.net",
        }),
        storage,
      },
      multiversxParams: {
        bridge:
          "erd1qqqqqqqqqqqqqpgqtsw8s3evjjyqqa2j2tfn9yvufqskdv236n9s2a06h9",
        gatewayURL: "https://devnet-gateway.multiversx.com",
        provider: new ProxyNetworkProvider(
          "https://devnet-gateway.multiversx.com",
        ),
        storage,
      },
      tonParams: {
        bridgeAddress: "EQDI6P9gheuWLh1euThjFE2muUpa9tp2y49TD6Zz5oOF5gWL",
        client: new TonClient({
          endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
        }),
        storage,
      },
    } satisfies Partial<TChainParams>;
  }
}
