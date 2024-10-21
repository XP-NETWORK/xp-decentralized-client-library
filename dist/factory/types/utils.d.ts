import { MetaMap } from ".";
import type { TClaimSFT, TGetChainIdentifier, TGetClaimData, TGetStorage, TLockNFT, TLockSFT, TNftTransferDetailsObject } from "../../handlers/index";
export type TSupportedChain = keyof MetaMap;
export type TSupportedSftChain = keyof {
    [k in TSupportedChain as MetaMap[k][0] extends TClaimSFT<any, any, any, any> ? k : never]: k;
};
export type TInferChainParam<K extends TSupportedChain> = MetaMap[K][1];
export type TInferChainH<K extends TSupportedChain> = MetaMap[K][0];
export type TChainFactory = {
    inner: <T extends TSupportedChain>(chain: T) => Promise<TInferChainH<T>>;
    getClaimData: (chain: TGetClaimData & TGetStorage & TGetChainIdentifier, txHash: string) => Promise<TNftTransferDetailsObject>;
    lockNft: <Signer, ExtraArgs, Ret>(sourceChain: TLockNFT<Signer, ExtraArgs, Ret>, signer: Signer, sourceNftContractAddress: string, destinationChain: TSupportedChain, to: string, tokenId: string, metadataUri: string, extraArgs?: ExtraArgs) => Promise<{
        ret: Ret;
        hash: () => string;
    }>;
    lockSft: <Signer, ExtraArgs, Ret>(sourceChain: TLockSFT<Signer, ExtraArgs, Ret>, signer: Signer, sourceNftContractAddress: string, destinationChain: TSupportedSftChain, to: string, tokenId: string, amt: bigint, metadataUri: string, extraArgs?: ExtraArgs) => Promise<{
        ret: Ret;
        hash: () => string;
    }>;
};
export type TParamMap = {
    set<T extends TSupportedChain>(k: T, v: TInferChainParam<T> | undefined): void;
    get<T extends TSupportedChain>(k: T): TInferChainParam<T> | undefined;
};
type TChainData<T extends TSupportedChain> = {
    constructor: (p: TInferChainParam<T>) => Promise<TInferChainH<T>> | TInferChainH<T>;
};
export type TChainInfo = {
    set<T extends TSupportedChain>(k: T, v: TChainData<T> | undefined): void;
    get<T extends TSupportedChain>(k: T): TChainData<T> | undefined;
} & Map<TSupportedChain, TChainData<TSupportedChain>>;
export {};
//# sourceMappingURL=utils.d.ts.map