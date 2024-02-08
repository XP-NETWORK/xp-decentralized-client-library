import { SecretNetworkClient, TxOptions, TxResponse } from "secretjs";
import { TNftChain } from "./chain";
export type SecretClaimData = {
    token_id: string;
    source_chain: string;
    destination_chain: string;
    destination_user_address: string;
    source_nft_contract_address: string;
    name: string;
    symbol: string;
    royalty: number;
    royalty_receiver: string;
    metadata: string;
    transaction_hash: string;
    token_amount: string;
    nft_type: string;
    fee: string;
};
export type GetNftArgs = [contract: string, tokenId: bigint];
export type SecretHandler = TNftChain<SecretNetworkClient, SecretClaimData, GetNftArgs, TxOptions, TxResponse>;
export type SecretParams = {
    provider: SecretNetworkClient;
    bridge: string;
    chainId: string;
    bridgeCodeHash: string;
};
export declare function secretHandler({ bridge, bridgeCodeHash, }: SecretParams): SecretHandler;
//# sourceMappingURL=secret.d.ts.map