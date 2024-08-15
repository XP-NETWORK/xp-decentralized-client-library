import { TezosToolkit } from "@taquito/taquito";
import { TonClient } from "@ton/ton";
import { JsonRpcProvider, ethers } from "ethers";
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
  moonbeamParams: TEvmParams;
}

export namespace ChainFactoryConfigs {
  export function TestNet() {
    const skale = new JsonRpcProvider(
      "https://testnet.skalenodes.com/v1/juicy-low-small-testnet",
    );
    const storage = BridgeStorage__factory.connect(
      "0x04cAEd1763B2C121D92FcaEaB41BFfe3EAB57EFC",
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
      tezosParams: {
        bridge: "KT1S9vCe85fpjfPNEnuDJ2zb453bSjcGNBH8",
        identifier: "TEZOS",
        storage,
        Tezos: new TezosToolkit("https://ghostnet.smartpy.io"),
        tzktApi: "https://api.ghostnet.tzkt.io/",
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
        provider: new JsonRpcProvider("https://bsc-pokt.nodies.app"),
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
      hederaParams: {
        identifier: Chain.HEDERA,
        bridge: ethers.getAddress("0x000000000000000000000000000000000064a394"),
        bridgeContractId: "0.0.6595476",
        provider: new JsonRpcProvider("https://mainnet.hashio.io/api"),
        royaltySalePrice: 10000,
        storage,
        royaltyProxy: "0x97fec8ed7203ea3ce58e2a4f44056fd954a35be4",
        mirrorNodeApi: "https://mainnet.mirrornode.hedera.com/api",
      },
      tonParams: {
        identifier: Chain.TON,
        bridgeAddress: "EQD3MmAJjHK3iyynZMRb0_shk5BdG_wgP4VRIdGfSW5_-Vsu",
        client: new TonClient({
          endpoint:
            "https://toncenter.com/api/v2/jsonRPC?api_key=05645d6b549f33bf80cee8822bd63df720c6781bd00020646deb7b2b2cd53b73",
        }),
        storage,
      },
    } satisfies Partial<TChainParams>;
  }
}
