import { SendParams, TezosToolkit, TransactionOperation } from "@taquito/taquito";
import { Signer } from "@taquito/taquito";
import BigNumber from "bignumber.js";
import { BridgeStorage } from "../../contractsTypes/evm";
import { address, mutez, nat } from "../../contractsTypes/tezos/type-aliases";
import { DeployCollection, MintNft, TSingularNftChain } from "../types";
export type TTezosClaimArgs = {
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
export type TezosMintArgs = {
    contract: string;
    tokenId: BigNumber;
    uri: string;
};
export type TTezosHandler = TSingularNftChain<Signer, TTezosClaimArgs, Partial<SendParams>, TransactionOperation, TezosToolkit> & MintNft<Signer, TezosMintArgs, Partial<SendParams>, TransactionOperation> & DeployCollection<Signer, object, Partial<SendParams>, string>;
export type TTezosParams = {
    Tezos: TezosToolkit;
    bridge: string;
    storage: BridgeStorage;
};
//# sourceMappingURL=types.d.ts.map