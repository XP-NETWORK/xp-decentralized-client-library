import { Cell, Slice, Address, Builder, ContractProvider, Sender, Contract, ContractABI } from "@ton/core";
export type StateInit = {
    $$type: "StateInit";
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
    $$type: "Context";
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
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
};
export type Deploy = {
    $$type: "Deploy";
    queryId: bigint;
};
export declare function storeDeploy(src: Deploy): (builder: Builder) => void;
export declare function loadDeploy(slice: Slice): {
    $$type: "Deploy";
    queryId: bigint;
};
export type DeployOk = {
    $$type: "DeployOk";
    queryId: bigint;
};
export declare function storeDeployOk(src: DeployOk): (builder: Builder) => void;
export declare function loadDeployOk(slice: Slice): {
    $$type: "DeployOk";
    queryId: bigint;
};
export type FactoryDeploy = {
    $$type: "FactoryDeploy";
    queryId: bigint;
    cashback: Address;
};
export declare function storeFactoryDeploy(src: FactoryDeploy): (builder: Builder) => void;
export declare function loadFactoryDeploy(slice: Slice): {
    $$type: "FactoryDeploy";
    queryId: bigint;
    cashback: Address;
};
export type LogEventMintRecord = {
    $$type: "LogEventMintRecord";
    minter: Address;
    item_id: bigint;
    generate_number: bigint;
};
export declare function storeLogEventMintRecord(src: LogEventMintRecord): (builder: Builder) => void;
export declare function loadLogEventMintRecord(slice: Slice): {
    $$type: "LogEventMintRecord";
    minter: Address;
    item_id: bigint;
    generate_number: bigint;
};
export type GetRoyaltyParams = {
    $$type: "GetRoyaltyParams";
    query_id: bigint;
};
export declare function storeGetRoyaltyParams(src: GetRoyaltyParams): (builder: Builder) => void;
export declare function loadGetRoyaltyParams(slice: Slice): {
    $$type: "GetRoyaltyParams";
    query_id: bigint;
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
    query_id: bigint;
    numerator: bigint;
    denominator: bigint;
    destination: Address;
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
    next_item_index: bigint;
    collection_content: Cell;
    owner_address: Address;
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
    numerator: bigint;
    denominator: bigint;
    destination: Address;
};
export type Transfer = {
    $$type: "Transfer";
    query_id: bigint;
    new_owner: Address;
    response_destination: Address | null;
    custom_payload: Cell | null;
    forward_amount: bigint;
    forward_payload: Cell;
};
export declare function storeTransfer(src: Transfer): (builder: Builder) => void;
export declare function loadTransfer(slice: Slice): {
    $$type: "Transfer";
    query_id: bigint;
    new_owner: Address;
    response_destination: Address | null;
    custom_payload: Cell | null;
    forward_amount: bigint;
    forward_payload: Cell;
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
    query_id: bigint;
    prev_owner: Address;
    forward_payload: Cell;
};
export type Excesses = {
    $$type: "Excesses";
    query_id: bigint;
};
export declare function storeExcesses(src: Excesses): (builder: Builder) => void;
export declare function loadExcesses(slice: Slice): {
    $$type: "Excesses";
    query_id: bigint;
};
export type GetStaticData = {
    $$type: "GetStaticData";
    query_id: bigint;
};
export declare function storeGetStaticData(src: GetStaticData): (builder: Builder) => void;
export declare function loadGetStaticData(slice: Slice): {
    $$type: "GetStaticData";
    query_id: bigint;
};
export type ReportStaticData = {
    $$type: "ReportStaticData";
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
    $$type: "GetNftData";
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
export type MintOne = {
    $$type: "MintOne";
    new_owner: Address;
    content: string;
};
export declare function storeMintOne(src: MintOne): (builder: Builder) => void;
export declare function loadMintOne(slice: Slice): {
    $$type: "MintOne";
    new_owner: Address;
    content: string;
};
export type Mint = {
    $$type: "Mint";
    token_id: bigint;
    owner: Address;
    content: string;
};
export declare function storeMint(src: Mint): (builder: Builder) => void;
export declare function loadMint(slice: Slice): {
    $$type: "Mint";
    token_id: bigint;
    owner: Address;
    content: string;
};
export declare class TestnetNftItem implements Contract {
    static init(collection_address: Address, item_index: bigint): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(collection_address: Address, item_index: bigint): Promise<TestnetNftItem>;
    static fromAddress(address: Address): TestnetNftItem;
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
    }, message: MintOne | Transfer | GetStaticData): Promise<void>;
    getGetNftData(provider: ContractProvider): Promise<{
        $$type: "GetNftData";
        is_initialized: boolean;
        index: bigint;
        collection_address: Address;
        owner_address: Address;
        individual_content: Cell;
    }>;
}
//# sourceMappingURL=nfti.d.ts.map