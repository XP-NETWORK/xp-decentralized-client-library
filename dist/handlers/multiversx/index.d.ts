import { UserSigner } from "@multiversx/sdk-wallet/out";
import { TMultiversXHandler, TMultiversXParams, TMultiversXSigner } from "./types";
export declare function multiversxHandler({ provider, gatewayURL, bridge, storage, chainId, identifier, }: TMultiversXParams): TMultiversXHandler;
export declare function userSignerToSigner(us: UserSigner): TMultiversXSigner;
//# sourceMappingURL=index.d.ts.map