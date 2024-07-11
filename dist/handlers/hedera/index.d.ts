import { Signer as HederaSigner } from "@hashgraph/sdk";
import { Signer } from "ethers";
import { THederaHandler, THederaParams } from "./types";
export declare function hederaHandler({ provider, royaltySalePrice, royaltyProxy, storage, identifier, bridge, }: THederaParams): THederaHandler;
export declare function isHederaSigner(signer: HederaSigner | Signer): signer is HederaSigner;
//# sourceMappingURL=index.d.ts.map