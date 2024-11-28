import type { UserSigner } from "@multiversx/sdk-wallet/out";
import { type TMultiversXHandler, type TMultiversXParams, type TMultiversXSigner } from "./types";
export declare function multiversxHandler({ provider, gatewayURL, bridge, storage, chainId, identifier, }: TMultiversXParams): TMultiversXHandler;
export declare function userSignerToSigner(us: UserSigner): TMultiversXSigner;
//# sourceMappingURL=index.d.ts.map