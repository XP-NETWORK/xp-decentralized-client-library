import { Cell, Slice, Address, ContractProvider, Sender, Contract, ContractABI } from "ton-core";
export type StateInit = {
    $$type: "StateInit";
    code: Cell;
    data: Cell;
};
export declare function storeStateInit(src: StateInit): (builder: Builder) => void;
export declare function loadStateInit(slice: Slice): {
    $$type: "StateInit";
    code: any;
    data: any;
};
export type Context = {
    $$type: "Context";
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
};
export declare function storeContext(src: Context): (builder: Builder) => void;
export declare function loadContext(slice: Slice): {
    $$type: "Context";
    bounced: any;
    sender: any;
    value: any;
    raw: any;
};
export type SendParameters = {
    $$type: "SendParameters";
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
    bounce: any;
    to: any;
    value: any;
    mode: any;
    body: any;
    code: any;
    data: any;
};
export type Deploy = {
    $$type: "Deploy";
    queryId: bigint;
};
export declare function storeDeploy(src: Deploy): (builder: Builder) => void;
export declare function loadDeploy(slice: Slice): {
    $$type: "Deploy";
    queryId: any;
};
export type DeployOk = {
    $$type: "DeployOk";
    queryId: bigint;
};
export declare function storeDeployOk(src: DeployOk): (builder: Builder) => void;
export declare function loadDeployOk(slice: Slice): {
    $$type: "DeployOk";
    queryId: any;
};
export type FactoryDeploy = {
    $$type: "FactoryDeploy";
    queryId: bigint;
    cashback: Address;
};
export declare function storeFactoryDeploy(src: FactoryDeploy): (builder: Builder) => void;
export declare function loadFactoryDeploy(slice: Slice): {
    $$type: "FactoryDeploy";
    queryId: any;
    cashback: any;
};
export type CollectionData = {
    $$type: "CollectionData";
    next_item_index: bigint;
    collection_content: Cell;
    owner_address: Address;
};
export declare function storeCollectionData(src: CollectionData): (builder: Builder) => void;
export declare function loadCollectionData(slice: Slice): {
    $$type: "CollectionData";
    next_item_index: any;
    collection_content: any;
    owner_address: any;
};
export type RoyaltyParams = {
    $$type: "RoyaltyParams";
    numerator: bigint;
    denominator: bigint;
    destination: Address;
};
export declare function storeRoyaltyParams(src: RoyaltyParams): (builder: Builder) => void;
export declare function loadRoyaltyParams(slice: Slice): {
    $$type: "RoyaltyParams";
    numerator: any;
    denominator: any;
    destination: any;
};
export type GetRoyaltyParams = {
    $$type: "GetRoyaltyParams";
    query_id: bigint;
};
export declare function storeGetRoyaltyParams(src: GetRoyaltyParams): (builder: Builder) => void;
export declare function loadGetRoyaltyParams(slice: Slice): {
    $$type: "GetRoyaltyParams";
    query_id: any;
};
export type ReportRoyaltyParams = {
    $$type: "ReportRoyaltyParams";
    query_id: bigint;
    numerator: bigint;
    denominator: bigint;
    destination: Address;
};
export declare function storeReportRoyaltyParams(src: ReportRoyaltyParams): (builder: Builder) => void;
export declare function loadReportRoyaltyParams(slice: Slice): {
    $$type: "ReportRoyaltyParams";
    query_id: any;
    numerator: any;
    denominator: any;
    destination: any;
};
export type Transfer = {
    $$type: "Transfer";
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
    query_id: any;
    new_owner: any;
    response_destination: any;
    custom_payload: any;
    forward_amount: any;
    forward_payload: any;
};
export type OwnershipAssigned = {
    $$type: "OwnershipAssigned";
    query_id: bigint;
    prev_owner: Address;
    forward_payload: Cell;
};
export declare function storeOwnershipAssigned(src: OwnershipAssigned): (builder: Builder) => void;
export declare function loadOwnershipAssigned(slice: Slice): {
    $$type: "OwnershipAssigned";
    query_id: any;
    prev_owner: any;
    forward_payload: any;
};
export type Excesses = {
    $$type: "Excesses";
    query_id: bigint;
};
export declare function storeExcesses(src: Excesses): (builder: Builder) => void;
export declare function loadExcesses(slice: Slice): {
    $$type: "Excesses";
    query_id: any;
};
export type GetStaticData = {
    $$type: "GetStaticData";
    query_id: bigint;
};
export declare function storeGetStaticData(src: GetStaticData): (builder: Builder) => void;
export declare function loadGetStaticData(slice: Slice): {
    $$type: "GetStaticData";
    query_id: any;
};
export type ReportStaticData = {
    $$type: "ReportStaticData";
    query_id: bigint;
    index: bigint;
    collection: Address;
};
export declare function storeReportStaticData(src: ReportStaticData): (builder: Builder) => void;
export declare function loadReportStaticData(slice: Slice): {
    $$type: "ReportStaticData";
    query_id: any;
    index: any;
    collection: any;
};
export type NftData = {
    $$type: "NftData";
    is_initialized: boolean;
    index: bigint;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
};
export declare function storeNftData(src: NftData): (builder: Builder) => void;
export declare function loadNftData(slice: Slice): {
    $$type: "NftData";
    is_initialized: any;
    index: any;
    collection_address: any;
    owner_address: any;
    individual_content: any;
};
export declare class ExampleNFTCollection implements Contract {
    static init(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams): Promise<{
        code: any;
        data: any;
    }>;
    static fromInit(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams): Promise<ExampleNFTCollection>;
    static fromAddress(address: Address): ExampleNFTCollection;
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
    }, message: "Mint" | GetRoyaltyParams | Deploy): Promise<void>;
    getGetCollectionData(provider: ContractProvider): Promise<{
        $$type: "CollectionData";
        next_item_index: any;
        collection_content: any;
        owner_address: any;
    }>;
    getGetNftAddressByIndex(provider: ContractProvider, index: bigint): Promise<any>;
    getGetNftContent(provider: ContractProvider, index: bigint, individual_content: Cell): Promise<any>;
    getRoyaltyParams(provider: ContractProvider): Promise<{
        $$type: "RoyaltyParams";
        numerator: any;
        denominator: any;
        destination: any;
    }>;
}
//# sourceMappingURL=nftc.d.ts.map