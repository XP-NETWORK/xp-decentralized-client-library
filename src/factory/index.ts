import { ethers } from "ethers";
import { EvmParams } from "../handlers/evm";

export interface ChainParams {
  bscParams: EvmParams;
}

export namespace ChainFactoryConfigs {
  export function TestNet(): Partial<ChainParams> {
    return {
      bscParams: {
        identifier: "BSC",
        rpc: "https://bsc-testnet.publicnode.com",
        bridge: ethers.getAddress("0x3EC2839EcEAfa2Ce9e419718364B070563Db516e"),
        royaltySalePrice: 0,
      },
    };
  }
}
