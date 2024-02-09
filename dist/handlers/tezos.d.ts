import { SendParams, Signer, TezosToolkit, TransactionOperation } from "@taquito/taquito";
import { BridgeStorage } from "../contractsTypes";
import { address, mutez, nat } from "../contractsTypes/tezosContractTypes/type-aliases";
import { TSingularNftChain } from "./chain";
export type TezosClaimArgs = {
    token_id: nat;
    source_chain: string;
    dest_chain: string;
    dest_address: address;
    source_nft_contract_address: string;
    name: string;
    symbol: string;
    royalty: nat;
    royalty_receiver: address;
    metadata: string;
    transaction_hash: string;
    token_amount: nat;
    nft_type: string;
    fee: mutez;
};
export type TezosHandler = TSingularNftChain<Signer, TezosClaimArgs, Partial<SendParams>, TransactionOperation>;
export type TezosParams = {
    Tezos: TezosToolkit;
    bridge: string;
    storage: BridgeStorage;
};
export declare function tezosHandler({ Tezos, bridge, storage, }: TezosParams): TezosHandler;
export declare const extractStrOrAddr: (addr: {
    str: string;
} | {
    addr: string;
}) => string;
//# sourceMappingURL=tezos.d.ts.map