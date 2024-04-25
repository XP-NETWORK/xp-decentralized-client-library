import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { JsonRpcProvider, ethers } from "ethers";
import { SecretNetworkClient } from "secretjs";
import { BridgeStorage__factory } from "../contractsTypes/evm";
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
        bridge: ethers.getAddress("0xb3cE27eDadFE006f9f47C5ed5b62E63DFd9Cf3bD"),
        identifier: "HEDERA",
        provider: new JsonRpcProvider("https://testnet.hashio.io/api"),
        royaltySalePrice: 10000,
        storage,
      },
      tezosParams: {
        bridge: "KT18pSSB3f9H3xtHzBfMCjTdPja82nqpAm66",
        Tezos: new TezosToolkit("https://ghostnet.smartpy.io"),
        storage,
        tzktApi: "https://api.ghostnet.tzkt.io/",
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
        chainId: "D",
      },
      tonParams: {
        bridgeAddress: "EQDI6P9gheuWLh1euThjFE2muUpa9tp2y49TD6Zz5oOF5gWL",
        client: new TonClient({
          endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
        }),
        storage,
      },
      terraParams: {
        bridge:
          "terra1pscwnx4dch2pmdkda89mdnl5n576hnccrjw4dlssfq5nhgrr850scz0q64",
        chainId: "pisco-1",
        rpc: "https://rpc.testcosmos.directory/terra2testnet",
        storage,
        denom: "uluna",
        nftCodeId: 13488,
      },
    } satisfies Partial<TChainParams>;
  }
}
