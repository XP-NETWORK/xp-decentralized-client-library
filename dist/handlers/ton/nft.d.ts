import { Address, Cell, OpenedContract, Sender, StateInit } from "@ton/core";
import { KeyPair } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
export type collectionData = {
    ownerAddress: Address;
    royaltyPercent: number;
    royaltyAddress: Address;
    nextItemIndex: number;
    collectionContentUrl: string;
    commonContentUrl: string;
};
export declare class TonNftCollection {
    private collectionData;
    constructor(collectionData: collectionData);
    private createCodeCell;
    private createDataCell;
    get stateInit(): StateInit;
    get address(): Address;
    deploy(contract: Sender): Promise<void>;
    topUpBalance(wallet: OpenedWallet, nftAmount: number): Promise<number>;
}
type OpenedWallet = {
    contract: OpenedContract<WalletContractV4>;
    keyPair: KeyPair;
};
export declare function encodeOffChainContent(content: string): Cell;
export {};
//# sourceMappingURL=nft.d.ts.map