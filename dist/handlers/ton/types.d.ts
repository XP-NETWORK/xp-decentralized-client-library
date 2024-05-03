import { Address, Cell, Sender } from "@ton/core";
import { TonClient } from "@ton/ton";
import { BridgeStorage } from "../../contractsTypes/evm";
import { ClaimData } from "../../contractsTypes/ton/tonBridge";
import { DeployCollection, MintNft, TSingularNftChain } from "../types";
import { RoyaltyParams } from "./nftc";
export type TonDeployArgs = {
    owner_address: Address;
    collection_content: Cell;
    royalty_params: RoyaltyParams;
};
export type TonMintArgs = {
    contract: Address;
};
export type TTonHandler = TSingularNftChain<Sender, ClaimData, unknown, undefined, TonClient> & MintNft<Sender, TonMintArgs, never, undefined> & DeployCollection<Sender, TonDeployArgs, never, string>;
export type TTonParams = {
    client: TonClient;
    bridgeAddress: string;
    storage: BridgeStorage;
};
//# sourceMappingURL=types.d.ts.map