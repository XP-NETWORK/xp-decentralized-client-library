import { type StdSignature } from "secretjs";
import type { Pubkey } from "secretjs/dist/wallet_amino";
import type { TSecretHandler, TSecretParams } from "./types";
export declare function secretHandler({ bridge, provider, storage, bridgeCodeHash, nftCodeId, identifier, }: TSecretParams): TSecretHandler;
export declare function encodeSecp256k1Signature(pubkey: Uint8Array, signature: Uint8Array): StdSignature;
export declare function encodeSecp256k1Pubkey(pubkey: Uint8Array): Pubkey;
//# sourceMappingURL=index.d.ts.map