import { StdSignature } from "secretjs";
import { Pubkey } from "secretjs/dist/wallet_amino";
import { TSecretHandler, TSecretParams } from "./types";
export declare function secretHandler({ bridge, provider, storage, bridgeCodeHash, }: TSecretParams): TSecretHandler;
export declare function encodeSecp256k1Signature(pubkey: Uint8Array, signature: Uint8Array): StdSignature;
export declare function encodeSecp256k1Pubkey(pubkey: Uint8Array): Pubkey;
//# sourceMappingURL=index.d.ts.map