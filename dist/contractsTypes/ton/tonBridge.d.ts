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
export type DeployNFT721Storage = {
    $$type: 'DeployNFT721Storage';
    collectionAddress: Address;
    isOriginal: boolean;
    key: bigint;
    tokenId: bigint;
    destinationChain: Cell;
    destinationUserAddress: Cell;
    sourceNftContractAddressLock: Cell;
    sourceChain: string;
    nftItemAddress: Address;
};
export declare function storeDeployNFT721Storage(src: DeployNFT721Storage): (builder: Builder) => void;
export declare function loadDeployNFT721Storage(slice: Slice): {
    $$type: "DeployNFT721Storage";
    collectionAddress: Address;
    isOriginal: boolean;
    key: bigint;
    tokenId: bigint;
    destinationChain: Cell;
    destinationUserAddress: Cell;
    sourceNftContractAddressLock: Cell;
    sourceChain: string;
    nftItemAddress: Address;
};
export type DeployNFT721Collection = {
    $$type: 'DeployNFT721Collection';
    collection_content: Cell;
    royalty_params: RoyaltyParams;
    destination_user_address: Address;
    source_chain: string;
    transaction_hash: string;
};
export declare function storeDeployNFT721Collection(src: DeployNFT721Collection): (builder: Builder) => void;
export declare function loadDeployNFT721Collection(slice: Slice): {
    $$type: "DeployNFT721Collection";
    collection_content: Cell;
    royalty_params: {
        $$type: "RoyaltyParams";
        numerator: bigint;
        denominator: bigint;
        destination: Address;
    };
    destination_user_address: Address;
    source_chain: string;
    transaction_hash: string;
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
export type UnlockToken = {
    $$type: 'UnlockToken';
    to: Address;
    token_id: bigint;
};
export declare function storeUnlockToken(src: UnlockToken): (builder: Builder) => void;
export declare function loadUnlockToken(slice: Slice): {
    $$type: "UnlockToken";
    to: Address;
    token_id: bigint;
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
    sourceNftContractAddress: Address;
    storageAddress: Address;
    isOriginal: boolean;
    key: bigint;
    tokenId: bigint;
    destinationChain: Cell;
    destinationUserAddress: Cell;
    sourceNftContractAddressLock: Cell;
    sourceChain: string;
    nftItemAddress: Address;
};
export declare function storeHiFromDeployNFT721Storage(src: HiFromDeployNFT721Storage): (builder: Builder) => void;
export declare function loadHiFromDeployNFT721Storage(slice: Slice): {
    $$type: "HiFromDeployNFT721Storage";
    sourceNftContractAddress: Address;
    storageAddress: Address;
    isOriginal: boolean;
    key: bigint;
    tokenId: bigint;
    destinationChain: Cell;
    destinationUserAddress: Cell;
    sourceNftContractAddressLock: Cell;
    sourceChain: string;
    nftItemAddress: Address;
};
export type HiFromDeployNFT721Collection = {
    $$type: 'HiFromDeployNFT721Collection';
    tokenId: bigint;
    newlyDeployCollection: Address;
    sourceChain: string;
    transactionHash: string;
};
export declare function storeHiFromDeployNFT721Collection(src: HiFromDeployNFT721Collection): (builder: Builder) => void;
export declare function loadHiFromDeployNFT721Collection(slice: Slice): {
    $$type: "HiFromDeployNFT721Collection";
    tokenId: bigint;
    newlyDeployCollection: Address;
    sourceChain: string;
    transactionHash: string;
};
export type CollectionDeploy = {
    $$type: 'CollectionDeploy';
    newOwner: Address;
};
export declare function storeCollectionDeploy(src: CollectionDeploy): (builder: Builder) => void;
export declare function loadCollectionDeploy(slice: Slice): {
    $$type: "CollectionDeploy";
    newOwner: Address;
};
export type StorageDeploy = {
    $$type: 'StorageDeploy';
    sourceNftContractAddress: Address;
    isOriginal: boolean;
    key: bigint;
    tokenId: bigint;
    destinationChain: Cell;
    destinationUserAddress: Cell;
    sourceNftContractAddressLock: Cell;
    sourceChain: string;
    nftItemAddress: Address;
};
export declare function storeStorageDeploy(src: StorageDeploy): (builder: Builder) => void;
export declare function loadStorageDeploy(slice: Slice): {
    $$type: "StorageDeploy";
    sourceNftContractAddress: Address;
    isOriginal: boolean;
    key: bigint;
    tokenId: bigint;
    destinationChain: Cell;
    destinationUserAddress: Cell;
    sourceNftContractAddressLock: Cell;
    sourceChain: string;
    nftItemAddress: Address;
};
export type Validator = {
    $$type: 'Validator';
    address: Address;
    added: boolean;
    pendingRewards: bigint;
};
export declare function storeValidator(src: Validator): (builder: Builder) => void;
export declare function loadValidator(slice: Slice): {
    $$type: "Validator";
    address: Address;
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
export type ValidatorsToRewards = {
    $$type: 'ValidatorsToRewards';
    addresses: Dictionary<bigint, Address>;
    publicKeys: Dictionary<bigint, bigint>;
    len: bigint;
};
export declare function storeValidatorsToRewards(src: ValidatorsToRewards): (builder: Builder) => void;
export declare function loadValidatorsToRewards(slice: Slice): {
    $$type: "ValidatorsToRewards";
    addresses: Dictionary<bigint, Address>;
    publicKeys: Dictionary<bigint, bigint>;
    len: bigint;
};
export type DuplicateToOriginalContractInfo = {
    $$type: 'DuplicateToOriginalContractInfo';
    keyChain: string;
    chain: string;
    contractAddress: Cell;
    lastIndex: bigint;
    collectionContent: Cell;
};
export declare function storeDuplicateToOriginalContractInfo(src: DuplicateToOriginalContractInfo): (builder: Builder) => void;
export declare function loadDuplicateToOriginalContractInfo(slice: Slice): {
    $$type: "DuplicateToOriginalContractInfo";
    keyChain: string;
    chain: string;
    contractAddress: Cell;
    lastIndex: bigint;
    collectionContent: Cell;
};
export type OriginalToDuplicateContractInfo = {
    $$type: 'OriginalToDuplicateContractInfo';
    keyChain: string;
    chain: string;
    contractAddress: Address;
    lastIndex: bigint;
    collectionContent: Cell;
};
export declare function storeOriginalToDuplicateContractInfo(src: OriginalToDuplicateContractInfo): (builder: Builder) => void;
export declare function loadOriginalToDuplicateContractInfo(slice: Slice): {
    $$type: "OriginalToDuplicateContractInfo";
    keyChain: string;
    chain: string;
    contractAddress: Address;
    lastIndex: bigint;
    collectionContent: Cell;
};
export type ClaimData1 = {
    $$type: 'ClaimData1';
    tokenId: bigint;
    sourceChain: string;
    destinationChain: string;
    destinationUserAddress: Address;
    tokenAmount: bigint;
};
export declare function storeClaimData1(src: ClaimData1): (builder: Builder) => void;
export declare function loadClaimData1(slice: Slice): {
    $$type: "ClaimData1";
    tokenId: bigint;
    sourceChain: string;
    destinationChain: string;
    destinationUserAddress: Address;
    tokenAmount: bigint;
};
export type ClaimData2 = {
    $$type: 'ClaimData2';
    name: string;
    symbol: string;
    nftType: string;
};
export declare function storeClaimData2(src: ClaimData2): (builder: Builder) => void;
export declare function loadClaimData2(slice: Slice): {
    $$type: "ClaimData2";
    name: string;
    symbol: string;
    nftType: string;
};
export type ClaimData3 = {
    $$type: 'ClaimData3';
    fee: bigint;
    sourceNftContractAddress: Cell;
    royaltyReceiver: Address;
    metadata: string;
};
export declare function storeClaimData3(src: ClaimData3): (builder: Builder) => void;
export declare function loadClaimData3(slice: Slice): {
    $$type: "ClaimData3";
    fee: bigint;
    sourceNftContractAddress: Cell;
    royaltyReceiver: Address;
    metadata: string;
};
export type ClaimData4 = {
    $$type: 'ClaimData4';
    newContent: Cell;
    transactionHash: string;
    royalty: RoyaltyParams;
};
export declare function storeClaimData4(src: ClaimData4): (builder: Builder) => void;
export declare function loadClaimData4(slice: Slice): {
    $$type: "ClaimData4";
    newContent: Cell;
    transactionHash: string;
    royalty: {
        $$type: "RoyaltyParams";
        numerator: bigint;
        denominator: bigint;
        destination: Address;
    };
};
export type ClaimData = {
    $$type: 'ClaimData';
    data1: ClaimData1;
    data2: ClaimData2;
    data3: ClaimData3;
    data4: ClaimData4;
};
export declare function storeClaimData(src: ClaimData): (builder: Builder) => void;
export declare function loadClaimData(slice: Slice): {
    $$type: "ClaimData";
    data1: {
        $$type: "ClaimData1";
        tokenId: bigint;
        sourceChain: string;
        destinationChain: string;
        destinationUserAddress: Address;
        tokenAmount: bigint;
    };
    data2: {
        $$type: "ClaimData2";
        name: string;
        symbol: string;
        nftType: string;
    };
    data3: {
        $$type: "ClaimData3";
        fee: bigint;
        sourceNftContractAddress: Cell;
        royaltyReceiver: Address;
        metadata: string;
    };
    data4: {
        $$type: "ClaimData4";
        newContent: Cell;
        transactionHash: string;
        royalty: {
            $$type: "RoyaltyParams";
            numerator: bigint;
            denominator: bigint;
            destination: Address;
        };
    };
};
export type Token = {
    $$type: 'Token';
    tokenId: bigint;
    chain: string;
    contractAddress: Cell;
};
export declare function storeToken(src: Token): (builder: Builder) => void;
export declare function loadToken(slice: Slice): {
    $$type: "Token";
    tokenId: bigint;
    chain: string;
    contractAddress: Cell;
};
export type AddValidator = {
    $$type: 'AddValidator';
    newValidatorPublicKey: NewValidator;
    newValidatorAddress: Address;
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
    newValidatorAddress: Address;
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
    destinationChain: Cell;
    destinationUserAddress: Cell;
    sourceNftContractAddress: Address;
};
export declare function storeLock721(src: Lock721): (builder: Builder) => void;
export declare function loadLock721(slice: Slice): {
    $$type: "Lock721";
    tokenId: bigint;
    destinationChain: Cell;
    destinationUserAddress: Cell;
    sourceNftContractAddress: Address;
};
export type ClaimNFT721 = {
    $$type: 'ClaimNFT721';
    data: ClaimData;
    signatures: Dictionary<bigint, SignerAndSignature>;
    len: bigint;
};
export declare function storeClaimNFT721(src: ClaimNFT721): (builder: Builder) => void;
export declare function loadClaimNFT721(slice: Slice): {
    $$type: "ClaimNFT721";
    data: {
        $$type: "ClaimData";
        data1: {
            $$type: "ClaimData1";
            tokenId: bigint;
            sourceChain: string;
            destinationChain: string;
            destinationUserAddress: Address;
            tokenAmount: bigint;
        };
        data2: {
            $$type: "ClaimData2";
            name: string;
            symbol: string;
            nftType: string;
        };
        data3: {
            $$type: "ClaimData3";
            fee: bigint;
            sourceNftContractAddress: Cell;
            royaltyReceiver: Address;
            metadata: string;
        };
        data4: {
            $$type: "ClaimData4";
            newContent: Cell;
            transactionHash: string;
            royalty: {
                $$type: "RoyaltyParams";
                numerator: bigint;
                denominator: bigint;
                destination: Address;
            };
        };
    };
    signatures: Dictionary<bigint, SignerAndSignature>;
    len: bigint;
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
    destinationChain: Cell;
    destinationUserAddress: Cell;
    sourceNftContractAddress: Cell;
    tokenAmount: bigint;
    nftType: string;
    sourceChain: string;
};
export declare function storeLockedEvent(src: LockedEvent): (builder: Builder) => void;
export declare function loadLockedEvent(slice: Slice): {
    $$type: "LockedEvent";
    tokenId: bigint;
    destinationChain: Cell;
    destinationUserAddress: Cell;
    sourceNftContractAddress: Cell;
    tokenAmount: bigint;
    nftType: string;
    sourceChain: string;
};
export type UnLock721Event = {
    $$type: 'UnLock721Event';
    to: Address;
    tokenId: bigint;
    contractAddress: Address;
};
export declare function storeUnLock721Event(src: UnLock721Event): (builder: Builder) => void;
export declare function loadUnLock721Event(slice: Slice): {
    $$type: "UnLock721Event";
    to: Address;
    tokenId: bigint;
    contractAddress: Address;
};
export type ClaimedEvent = {
    $$type: 'ClaimedEvent';
    tokenId: bigint;
    newlyDeployCollection: Address;
    sourceChain: string;
    transactionHash: string;
};
export declare function storeClaimedEvent(src: ClaimedEvent): (builder: Builder) => void;
export declare function loadClaimedEvent(slice: Slice): {
    $$type: "ClaimedEvent";
    tokenId: bigint;
    newlyDeployCollection: Address;
    sourceChain: string;
    transactionHash: string;
};
export declare class Bridge implements Contract {
    static init(validatorPublicKey: bigint, validatorAddress: Address, chainType: string): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(validatorPublicKey: bigint, validatorAddress: Address, chainType: string): Promise<Bridge>;
    static fromAddress(address: Address): Bridge;
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
    }, message: Excesses | 'Deploy' | AddValidator | RewardValidator | HiFromDeployNFT721Storage | HiFromDeployNFT721Collection | OwnershipAssigned | ClaimNFT721): Promise<void>;
    getOriginal721Mapping(provider: ContractProvider, sourceNftContractAddress: Address, sourceChain: string): Promise<Address | null>;
    getDuplicate721Mapping(provider: ContractProvider, contractAddress: Address): Promise<Address | null>;
    getOriginalToDuplicate(provider: ContractProvider, sourceNftContractAddress: string, sourceChain: string): Promise<{
        $$type: "OriginalToDuplicateContractInfo";
        keyChain: string;
        chain: string;
        contractAddress: Address;
        lastIndex: bigint;
        collectionContent: Cell;
    } | null>;
    getDuplicateToOriginal(provider: ContractProvider, key: Address): Promise<{
        $$type: "DuplicateToOriginalContractInfo";
        keyChain: string;
        chain: string;
        contractAddress: Cell;
        lastIndex: bigint;
        collectionContent: Cell;
    } | null>;
    getTokenInfo(provider: ContractProvider, key: Address): Promise<{
        $$type: "Token";
        tokenId: bigint;
        chain: string;
        contractAddress: Cell;
    } | null>;
    getTokenInfoSelf(provider: ContractProvider, tokenId: bigint, sourceChain: string, sourceNftContractAddress: Cell): Promise<Address | null>;
    getValidator(provider: ContractProvider, key: bigint): Promise<{
        $$type: "Validator";
        address: Address;
        added: boolean;
        pendingRewards: bigint;
    } | null>;
    getValidatorsCount(provider: ContractProvider): Promise<bigint | null>;
    getCollectionDeployer(provider: ContractProvider): Promise<Address | null>;
    getStorageDeployer(provider: ContractProvider): Promise<Address | null>;
    getCollections(provider: ContractProvider, key: bigint): Promise<Address | null>;
}
//# sourceMappingURL=tonBridge.d.ts.map