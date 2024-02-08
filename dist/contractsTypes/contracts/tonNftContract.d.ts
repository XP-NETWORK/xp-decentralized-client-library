import { Cell, Slice, Address, Builder, Dictionary, ContractProvider, Sender, Contract, ContractABI } from '@ton/core';
export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
};
export declare function storeStateInit(src: StateInit): (builder: Builder) => void;
export declare function loadStateInit(slice: Slice): {
    $$type: "StateInit";
    code: Cell;
    data: Cell;
};
export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
};
export declare function storeContext(src: Context): (builder: Builder) => void;
export declare function loadContext(slice: Slice): {
    $$type: "Context";
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
};
export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
};
export declare function storeSendParameters(src: SendParameters): (builder: Builder) => void;
export declare function loadSendParameters(slice: Slice): {
    $$type: "SendParameters";
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
};
export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
};
export declare function storeDeploy(src: Deploy): (builder: Builder) => void;
export declare function loadDeploy(slice: Slice): {
    $$type: "Deploy";
    queryId: bigint;
};
export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
};
export declare function storeDeployOk(src: DeployOk): (builder: Builder) => void;
export declare function loadDeployOk(slice: Slice): {
    $$type: "DeployOk";
    queryId: bigint;
};
export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
};
export declare function storeFactoryDeploy(src: FactoryDeploy): (builder: Builder) => void;
export declare function loadFactoryDeploy(slice: Slice): {
    $$type: "FactoryDeploy";
    queryId: bigint;
    cashback: Address;
};
export type HiFromParent = {
    $$type: 'HiFromParent';
    greeting: string;
};
export declare function storeHiFromParent(src: HiFromParent): (builder: Builder) => void;
export declare function loadHiFromParent(slice: Slice): {
    $$type: "HiFromParent";
    greeting: string;
};
export type HiFromChild = {
    $$type: 'HiFromChild';
    fromSeqno: bigint;
    greeting: string;
};
export declare function storeHiFromChild(src: HiFromChild): (builder: Builder) => void;
export declare function loadHiFromChild(slice: Slice): {
    $$type: "HiFromChild";
    fromSeqno: bigint;
    greeting: string;
};
export type UnlockToken = {
    $$type: 'UnlockToken';
    to: Address;
};
export declare function storeUnlockToken(src: UnlockToken): (builder: Builder) => void;
export declare function loadUnlockToken(slice: Slice): {
    $$type: "UnlockToken";
    to: Address;
};
export type DeployNFT721Storage = {
    $$type: 'DeployNFT721Storage';
    collectionAddress: Address;
};
export declare function storeDeployNFT721Storage(src: DeployNFT721Storage): (builder: Builder) => void;
export declare function loadDeployNFT721Storage(slice: Slice): {
    $$type: "DeployNFT721Storage";
    collectionAddress: Address;
};
export type DeployNFT721Collection = {
    $$type: 'DeployNFT721Collection';
    owner_address: Address;
    collection_content: Cell;
    royalty_params: RoyaltyParams;
};
export declare function storeDeployNFT721Collection(src: DeployNFT721Collection): (builder: Builder) => void;
export declare function loadDeployNFT721Collection(slice: Slice): {
    $$type: "DeployNFT721Collection";
    owner_address: Address;
    collection_content: Cell;
    royalty_params: {
        $$type: "RoyaltyParams";
        numerator: bigint;
        denominator: bigint;
        destination: Address;
    };
};
export type CreatedCollection = {
    $$type: 'CreatedCollection';
    collectionAddress: Address;
};
export declare function storeCreatedCollection(src: CreatedCollection): (builder: Builder) => void;
export declare function loadCreatedCollection(slice: Slice): {
    $$type: "CreatedCollection";
    collectionAddress: Address;
};
export type GetRoyaltyParams = {
    $$type: 'GetRoyaltyParams';
    query_id: bigint;
};
export declare function storeGetRoyaltyParams(src: GetRoyaltyParams): (builder: Builder) => void;
export declare function loadGetRoyaltyParams(slice: Slice): {
    $$type: "GetRoyaltyParams";
    query_id: bigint;
};
export type ReportRoyaltyParams = {
    $$type: 'ReportRoyaltyParams';
    query_id: bigint;
    numerator: bigint;
    denominator: bigint;
    destination: Address;
};
export declare function storeReportRoyaltyParams(src: ReportRoyaltyParams): (builder: Builder) => void;
export declare function loadReportRoyaltyParams(slice: Slice): {
    $$type: "ReportRoyaltyParams";
    query_id: bigint;
    numerator: bigint;
    denominator: bigint;
    destination: Address;
};
export type CollectionData = {
    $$type: 'CollectionData';
    next_item_index: bigint;
    collection_content: Cell;
    owner_address: Address;
};
export declare function storeCollectionData(src: CollectionData): (builder: Builder) => void;
export declare function loadCollectionData(slice: Slice): {
    $$type: "CollectionData";
    next_item_index: bigint;
    collection_content: Cell;
    owner_address: Address;
};
export type RoyaltyParams = {
    $$type: 'RoyaltyParams';
    numerator: bigint;
    denominator: bigint;
    destination: Address;
};
export declare function storeRoyaltyParams(src: RoyaltyParams): (builder: Builder) => void;
export declare function loadRoyaltyParams(slice: Slice): {
    $$type: "RoyaltyParams";
    numerator: bigint;
    denominator: bigint;
    destination: Address;
};
export type Transfer = {
    $$type: 'Transfer';
    query_id: bigint;
    new_owner: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_amount: bigint;
    forward_payload: Cell;
};
export declare function storeTransfer(src: Transfer): (builder: Builder) => void;
export declare function loadTransfer(slice: Slice): {
    $$type: "Transfer";
    query_id: bigint;
    new_owner: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_amount: bigint;
    forward_payload: Cell;
};
export type OwnershipAssigned = {
    $$type: 'OwnershipAssigned';
    query_id: bigint;
    prev_owner: Address;
    forward_payload: Cell;
};
export declare function storeOwnershipAssigned(src: OwnershipAssigned): (builder: Builder) => void;
export declare function loadOwnershipAssigned(slice: Slice): {
    $$type: "OwnershipAssigned";
    query_id: bigint;
    prev_owner: Address;
    forward_payload: Cell;
};
export type Excesses = {
    $$type: 'Excesses';
    query_id: bigint;
};
export declare function storeExcesses(src: Excesses): (builder: Builder) => void;
export declare function loadExcesses(slice: Slice): {
    $$type: "Excesses";
    query_id: bigint;
};
export type GetStaticData = {
    $$type: 'GetStaticData';
    query_id: bigint;
};
export declare function storeGetStaticData(src: GetStaticData): (builder: Builder) => void;
export declare function loadGetStaticData(slice: Slice): {
    $$type: "GetStaticData";
    query_id: bigint;
};
export type ReportStaticData = {
    $$type: 'ReportStaticData';
    query_id: bigint;
    index_id: bigint;
    collection: Address;
};
export declare function storeReportStaticData(src: ReportStaticData): (builder: Builder) => void;
export declare function loadReportStaticData(slice: Slice): {
    $$type: "ReportStaticData";
    query_id: bigint;
    index_id: bigint;
    collection: Address;
};
export type GetNftData = {
    $$type: 'GetNftData';
    is_initialized: boolean;
    index: bigint;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
};
export declare function storeGetNftData(src: GetNftData): (builder: Builder) => void;
export declare function loadGetNftData(slice: Slice): {
    $$type: "GetNftData";
    is_initialized: boolean;
    index: bigint;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
};
export type HiFromDeployNFT721Storage = {
    $$type: 'HiFromDeployNFT721Storage';
    storageAddress: Address;
};
export declare function storeHiFromDeployNFT721Storage(src: HiFromDeployNFT721Storage): (builder: Builder) => void;
export declare function loadHiFromDeployNFT721Storage(slice: Slice): {
    $$type: "HiFromDeployNFT721Storage";
    storageAddress: Address;
};
export type HiFromDeployNFT721Collection = {
    $$type: 'HiFromDeployNFT721Collection';
    collectionAddress: Address;
};
export declare function storeHiFromDeployNFT721Collection(src: HiFromDeployNFT721Collection): (builder: Builder) => void;
export declare function loadHiFromDeployNFT721Collection(slice: Slice): {
    $$type: "HiFromDeployNFT721Collection";
    collectionAddress: Address;
};
export type Validator = {
    $$type: 'Validator';
    added: boolean;
    pendingRewards: bigint;
};
export declare function storeValidator(src: Validator): (builder: Builder) => void;
export declare function loadValidator(slice: Slice): {
    $$type: "Validator";
    added: boolean;
    pendingRewards: bigint;
};
export type SignerAndSignature = {
    $$type: 'SignerAndSignature';
    signature: Cell;
    key: bigint;
};
export declare function storeSignerAndSignature(src: SignerAndSignature): (builder: Builder) => void;
export declare function loadSignerAndSignature(slice: Slice): {
    $$type: "SignerAndSignature";
    signature: Cell;
    key: bigint;
};
export type NewValidator = {
    $$type: 'NewValidator';
    key: bigint;
};
export declare function storeNewValidator(src: NewValidator): (builder: Builder) => void;
export declare function loadNewValidator(slice: Slice): {
    $$type: "NewValidator";
    key: bigint;
};
export type DuplicateToOriginalContractInfo = {
    $$type: 'DuplicateToOriginalContractInfo';
    keyChain: string;
    chain: string;
    contractAddress: string;
};
export declare function storeDuplicateToOriginalContractInfo(src: DuplicateToOriginalContractInfo): (builder: Builder) => void;
export declare function loadDuplicateToOriginalContractInfo(slice: Slice): {
    $$type: "DuplicateToOriginalContractInfo";
    keyChain: string;
    chain: string;
    contractAddress: string;
};
export type OriginalToDuplicateContractInfo = {
    $$type: 'OriginalToDuplicateContractInfo';
    keyChain: string;
    chain: string;
    contractAddress: Address;
};
export declare function storeOriginalToDuplicateContractInfo(src: OriginalToDuplicateContractInfo): (builder: Builder) => void;
export declare function loadOriginalToDuplicateContractInfo(slice: Slice): {
    $$type: "OriginalToDuplicateContractInfo";
    keyChain: string;
    chain: string;
    contractAddress: Address;
};
export type ClaimData = {
    $$type: 'ClaimData';
    tokenId: bigint;
    sourceChain: string;
    destinationChain: string;
    destinationUserAddress: Address;
    sourceNftContractAddress: string;
    name: string;
    symbol: string;
    royalty: bigint;
    royaltyReceiver: Address;
    metadata: string;
    transactionHash: string;
    tokenAmount: bigint;
    nftType: string;
    fee: bigint;
};
export declare function storeClaimData(src: ClaimData): (builder: Builder) => void;
export declare function loadClaimData(slice: Slice): {
    $$type: "ClaimData";
    tokenId: bigint;
    sourceChain: string;
    destinationChain: string;
    destinationUserAddress: Address;
    sourceNftContractAddress: string;
    name: string;
    symbol: string;
    royalty: bigint;
    royaltyReceiver: Address;
    metadata: string;
    transactionHash: string;
    tokenAmount: bigint;
    nftType: string;
    fee: bigint;
};
export type AddValidator = {
    $$type: 'AddValidator';
    newValidatorPublicKey: NewValidator;
    sigs: Dictionary<bigint, SignerAndSignature>;
    len: bigint;
};
export declare function storeAddValidator(src: AddValidator): (builder: Builder) => void;
export declare function loadAddValidator(slice: Slice): {
    $$type: "AddValidator";
    newValidatorPublicKey: {
        $$type: "NewValidator";
        key: bigint;
    };
    sigs: Dictionary<bigint, SignerAndSignature>;
    len: bigint;
};
export type RewardValidator = {
    $$type: 'RewardValidator';
    validator: NewValidator;
    sigs: Dictionary<bigint, SignerAndSignature>;
    len: bigint;
};
export declare function storeRewardValidator(src: RewardValidator): (builder: Builder) => void;
export declare function loadRewardValidator(slice: Slice): {
    $$type: "RewardValidator";
    validator: {
        $$type: "NewValidator";
        key: bigint;
    };
    sigs: Dictionary<bigint, SignerAndSignature>;
    len: bigint;
};
export type Lock721 = {
    $$type: 'Lock721';
    tokenId: bigint;
    destinationChain: string;
    destinationUserAddress: string;
    sourceNftContractAddress: Address;
};
export declare function storeLock721(src: Lock721): (builder: Builder) => void;
export declare function loadLock721(slice: Slice): {
    $$type: "Lock721";
    tokenId: bigint;
    destinationChain: string;
    destinationUserAddress: string;
    sourceNftContractAddress: Address;
};
export type StakeEvent = {
    $$type: 'StakeEvent';
    amount: bigint;
    asd: string;
};
export declare function storeStakeEvent(src: StakeEvent): (builder: Builder) => void;
export declare function loadStakeEvent(slice: Slice): {
    $$type: "StakeEvent";
    amount: bigint;
    asd: string;
};
export type AddNewValidatorEvent = {
    $$type: 'AddNewValidatorEvent';
    validator: bigint;
};
export declare function storeAddNewValidatorEvent(src: AddNewValidatorEvent): (builder: Builder) => void;
export declare function loadAddNewValidatorEvent(slice: Slice): {
    $$type: "AddNewValidatorEvent";
    validator: bigint;
};
export type RewardValidatorEvent = {
    $$type: 'RewardValidatorEvent';
    validator: bigint;
};
export declare function storeRewardValidatorEvent(src: RewardValidatorEvent): (builder: Builder) => void;
export declare function loadRewardValidatorEvent(slice: Slice): {
    $$type: "RewardValidatorEvent";
    validator: bigint;
};
export type LockedEvent = {
    $$type: 'LockedEvent';
    tokenId: bigint;
    destinationChain: string;
    destinationUserAddress: string;
    sourceNftContractAddress: string;
    tokenAmount: bigint;
    nftType: string;
    sourceChain: string;
};
export declare function storeLockedEvent(src: LockedEvent): (builder: Builder) => void;
export declare function loadLockedEvent(slice: Slice): {
    $$type: "LockedEvent";
    tokenId: bigint;
    destinationChain: string;
    destinationUserAddress: string;
    sourceNftContractAddress: string;
    tokenAmount: bigint;
    nftType: string;
    sourceChain: string;
};
export type UnLock721Event = {
    $$type: 'UnLock721Event';
    to: Address;
    tokenId: bigint;
    contractAddr: Address;
};
export declare function storeUnLock721Event(src: UnLock721Event): (builder: Builder) => void;
export declare function loadUnLock721Event(slice: Slice): {
    $$type: "UnLock721Event";
    to: Address;
    tokenId: bigint;
    contractAddr: Address;
};
export type ClaimedEvent = {
    $$type: 'ClaimedEvent';
    sourceChain: string;
    transactionHash: string;
};
export declare function storeClaimedEvent(src: ClaimedEvent): (builder: Builder) => void;
export declare function loadClaimedEvent(slice: Slice): {
    $$type: "ClaimedEvent";
    sourceChain: string;
    transactionHash: string;
};
export declare class NftItem implements Contract {
    static init(collection_address: Address, item_index: bigint, owner: Address, individual_content: Cell): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(collection_address: Address, item_index: bigint, owner: Address, individual_content: Cell): Promise<NftItem>;
    static fromAddress(address: Address): NftItem;
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    };
    readonly abi: ContractABI;
    private constructor();
    send(provider: ContractProvider, via: Sender, args: {
        value: bigint;
        bounce?: boolean | null | undefined;
    }, message: Transfer | GetStaticData): Promise<void>;
    getGetNftData(provider: ContractProvider): Promise<{
        $$type: "GetNftData";
        is_initialized: boolean;
        index: bigint;
        collection_address: Address;
        owner_address: Address;
        individual_content: Cell;
    }>;
}
//# sourceMappingURL=tonNftContract.d.ts.map