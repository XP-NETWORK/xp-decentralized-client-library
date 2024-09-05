import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { _SERVICE as BridgeService } from "../../contractsTypes/icp/bridge/bridge.types";
import { _SERVICE } from "../../contractsTypes/icp/nft/nft.types";
import { TICPHandler, TICPParams } from "./types";
export declare function createNftActor(contract: string | Principal, { agent }: {
    agent: HttpAgent;
}): import("@dfinity/agent").ActorSubclass<_SERVICE>;
export declare function createBridgeActor(contract: string | Principal, { agent }: {
    agent: HttpAgent;
}): import("@dfinity/agent").ActorSubclass<BridgeService>;
export declare function icpHandler({ agent, bridge, storage, identifier, }: TICPParams): Promise<TICPHandler>;
//# sourceMappingURL=index.d.ts.map