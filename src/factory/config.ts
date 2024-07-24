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
        bridge: ethers.getAddress("0xA70D9c05EB97FeDF4EA6CD52Dc426E66C0959968"),
        royaltySalePrice: 10000,
        storage,
      },
      hederaParams: {
        identifier: Chain.HEDERA,
        bridge: ethers.getAddress("0x5AaC11DDCf117A789f339ece3CBC23756985E554"),
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
        bridge: ethers.getAddress("0x2b4082b5cBe5958888d68985524939ec1c871007"),
        identifier: "MOONBEAM",
        provider: new JsonRpcProvider(
          "https://rpc.api.moonbase.moonbeam.network",
        ),
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
      "0xA8802be1Bd39888EBD38b236e2A4fAd4d8e76a1d",
      optimism,
    );
    return {
      bscParams: {
        identifier: Chain.BSC,
        provider: new JsonRpcProvider("https://bsc-pokt.nodies.app"),
        bridge: ethers.getAddress("0x0E8457f9F2a323DD91673e2D8e9eCA80763Dd98f"),
        royaltySalePrice: 10000,
        storage,
      },
      maticParams: {
        identifier: Chain.MATIC,
        provider: new JsonRpcProvider("https://polygon-pokt.nodies.app"),
        bridge: ethers.getAddress("0xDAc202538A33adC727e95768f472f232eDD2EC56"),
        royaltySalePrice: 10000,
        storage,
      },
      hederaParams: {
        identifier: Chain.HEDERA,
        bridge: ethers.getAddress("0xdb3ae6531d405d341d7b25597a64082d7ed05a07"),
        bridgeContractId: "0.0.6446319",
        provider: new JsonRpcProvider("https://mainnet.hashio.io/api"),
        royaltySalePrice: 10000,
        storage,
        royaltyProxy: "0x97fec8ed7203ea3ce58e2a4f44056fd954a35be4",
        mirrorNodeApi: "https://mainnet.mirrornode.hedera.com/api",
      },
    } satisfies Partial<TChainParams>;
  }
}
