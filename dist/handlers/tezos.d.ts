import { SendParams, Signer, TezosToolkit, TransactionOperation } from "@taquito/taquito";
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
export type TezosHandler = TSingularNftChain<Signer, TezosClaimArgs, [
    tokenId: bigint,
    contract: string
], Partial<SendParams>, TransactionOperation>;
export type TezosParams = {
    Tezos: TezosToolkit;
    bridge: string;
};
export declare function tezosHandler({ Tezos, bridge }: TezosParams): TezosHandler;
//# sourceMappingURL=tezos.d.ts.map