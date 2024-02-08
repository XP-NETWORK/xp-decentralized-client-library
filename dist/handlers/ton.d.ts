import { Sender } from "@ton/core";
import { TonClient } from "@ton/ton";
import { ClaimData } from "../contractsTypes/contracts/tonBridge";
import { TSingularNftChain } from "./chain";
export type TonHandler = TSingularNftChain<Sender, ClaimData, [
    tokenId: string,
    contract: string
], unknown, undefined>;
export type TonParams = {
    client: TonClient;
    bridgeAddress: string;
};
export declare function raise(message: string): never;
export declare function tonHandler({ client, bridgeAddress }: TonParams): TonHandler;
//# sourceMappingURL=ton.d.ts.map