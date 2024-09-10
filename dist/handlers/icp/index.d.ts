import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { _SERVICE as BridgeService } from "../../contractsTypes/icp/bridge/bridge.types";
import { _SERVICE as LedgerService } from "../../contractsTypes/icp/ledger/ledger.types";
import { _SERVICE } from "../../contractsTypes/icp/nft/nft.types";
import { BrowserSigners, TICPHandler, TICPParams } from "./types";
export declare function createNftActor(contract: string | Principal, { agent }: {
    agent: HttpAgent | BrowserSigners;
}): Promise<import("@dfinity/agent").ActorSubclass<_SERVICE>>;
export declare function createBridgeActor(contract: string | Principal, { agent }: {
    agent: HttpAgent | BrowserSigners;
}): Promise<import("@dfinity/agent").ActorSubclass<BridgeService>>;
export declare function createLedgerActor(contract: string | Principal, { agent }: {
    agent: HttpAgent | BrowserSigners;
}): Promise<import("@dfinity/agent").ActorSubclass<LedgerService>>;
export declare function ifBrowserSigners(signers: BrowserSigners | HttpAgent): signers is BrowserSigners;
export declare function icpHandler({ agent, bridge, storage, identifier, }: TICPParams): Promise<TICPHandler>;
//# sourceMappingURL=index.d.ts.map