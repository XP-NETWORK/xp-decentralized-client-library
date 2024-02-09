/// <reference types="node" />
import { INetworkProvider } from "@multiversx/sdk-network-providers/out/interface";
import { TSingularNftChain } from "./chain";
import { UserAddress } from "@multiversx/sdk-wallet/out/userAddress";
import { BridgeStorage } from "../contractsTypes";
export type MultiversXSigner = {
    sign: (message: Buffer) => Promise<Buffer>;
    getAddress: () => UserAddress;
};
export type ClaimStruct = {
    tokenId: string;
    sourceChain: string;
    destinationChain: string;
    destinationUserAddress: string;
    sourceNftContractAddress: string;
    name: string;
    symbol: string;
    royalty: string;
    royaltyReceiver: string;
    attrs: string;
    transactionHash: string;
    tokenAmount: string;
    nftType: string;
    fee: string;
    metadata: string;
};
export type MultiversXHandler = TSingularNftChain<MultiversXSigner, ClaimStruct, unknown, string>;
export type MultiversXParams = {
    provider: INetworkProvider;
    gatewayURL: string;
    bridge: string;
    storage: BridgeStorage;
};
export declare function multiversxHandler({ provider, gatewayURL, bridge, storage, }: MultiversXParams): MultiversXHandler;
//# sourceMappingURL=multiversx.d.ts.map