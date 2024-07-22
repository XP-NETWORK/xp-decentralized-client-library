import { Signer } from "ethers";
import { THederaHandler, THederaParams } from "./types";
export declare function hederaHandler({ provider, royaltySalePrice, royaltyProxy, storage, identifier, bridge, bridgeContractId, mirrorNodeApi, }: THederaParams): THederaHandler;
export declare function isEvmSigner(signer: any): signer is Signer;
//# sourceMappingURL=index.d.ts.map