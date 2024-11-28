import type { ActorSubclass, HttpAgent } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";
import type { Principal } from "@dfinity/principal";
import type { BridgeStorage } from "../../contractsTypes/evm";
import type { ClaimData } from "../../contractsTypes/icp/bridge/bridge.types";
import type { Value } from "../../contractsTypes/icp/nft/nft.types";
import type { DeployNFTCollection, MintNft, ReadClaimed721Event, TNFTList, TSingularNftChain } from "../types";
export interface ActorArgs {
    interfaceFactory: IDL.InterfaceFactory;
    canisterId: string;
    host: string | undefined;
}
export interface BrowserSigners {
    createActor: <Type>(args: ActorArgs) => Promise<ActorSubclass<Type>>;
    getPrincipal(): Promise<Principal>;
}
export type TICPParams = {
    agent: HttpAgent;
    bridge: Principal;
    storage: BridgeStorage;
    identifier: string;
};
export type TICPMintArgs = {
    metadata: string;
    token_id: bigint;
    contract: string;
    owner: string;
};
export type TICPClaimArgs = ClaimData;
export type TICPHandler = TSingularNftChain<HttpAgent | BrowserSigners, TICPClaimArgs, undefined, string, HttpAgent> & MintNft<HttpAgent, TICPMintArgs, undefined, string> & DeployNFTCollection<HttpAgent, {
    name: string;
    symbol: string;
}, undefined, string> & ReadClaimed721Event & TNFTList<{
    md: [string, Value][];
}, null>;
//# sourceMappingURL=types.d.ts.map