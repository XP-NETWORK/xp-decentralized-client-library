import { Sender } from "@ton/core";
import { TonClient } from "@ton/ton";
import { BridgeStorage } from "../contractsTypes";
import { ClaimData } from "../contractsTypes/contracts/tonBridge";
import { TSingularNftChain } from "./chain";
export type TTonHandler = TSingularNftChain<Sender, ClaimData, unknown, undefined, TonClient>;
export type TTonParams = {
    client: TonClient;
    bridgeAddress: string;
    storage: BridgeStorage;
};
export declare function raise(message: string): never;
export declare function tonHandler({ client, bridgeAddress, storage, }: TTonParams): TTonHandler;
//# sourceMappingURL=ton.d.ts.map