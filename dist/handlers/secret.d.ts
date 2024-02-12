import { SecretNetworkClient, TxOptions, TxResponse } from "secretjs";
import { BridgeStorage } from "../contractsTypes";
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
export type TSecretHandler = TNftChain<SecretNetworkClient, SecretClaimData, TxOptions, TxResponse>;
export type TSecretParams = {
    provider: SecretNetworkClient;
    bridge: string;
    chainId: string;
    bridgeCodeHash: string;
    storage: BridgeStorage;
};
export declare function secretHandler({ bridge, provider, storage, bridgeCodeHash, }: TSecretParams): TSecretHandler;
//# sourceMappingURL=secret.d.ts.map