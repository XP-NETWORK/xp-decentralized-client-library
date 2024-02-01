import { JsonRpcProvider, Overrides, Signer } from "ethers";
import { unimplemented } from "../utils";
import { NftChain } from "./chain";

export type EvmHandler = NftChain<Signer, Record<string, unknown>, Overrides>;

export type EvmParam = {
  identifier: string;
  rpc: string;
};

export function evmHandler({ rpc }: EvmParam): EvmHandler {
  new JsonRpcProvider(rpc);

  return {
    claimNft() {
      unimplemented();
    },
    getBalance() {
      unimplemented();
    },
    nftData() {
      unimplemented();
    },
    lockSft() {
      unimplemented();
    },
    claimSft() {
      unimplemented();
    },
    lockNft() {
      unimplemented();
    },
  };
}
