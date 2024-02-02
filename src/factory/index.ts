import { JsonRpcProvider, ethers } from "ethers";
import { EvmParams } from "../handlers/evm";

export interface ChainParams {
  bscParams: EvmParams;
}

export namespace ChainFactoryConfigs {
  export function TestNet() {
    return {
      bscParams: {
        identifier: "BSC",
        provider: new JsonRpcProvider("https://bsc-testnet.publicnode.com"),
        bridge: ethers.getAddress("0x3EC2839EcEAfa2Ce9e419718364B070563Db516e"),
        royaltySalePrice: 0,
      },
    } satisfies Partial<ChainParams>;
  }
}
