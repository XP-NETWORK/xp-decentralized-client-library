import { SecretNetworkClient, TxOptions, TxResponse } from "secretjs";
import { BridgeStorage } from "../../contractsTypes/evm";
import { DeployNFTCollection, MintNft, ReadClaimed721Event, ReadClaimed1155Event, TNftChain } from "../types";
export type TSecretClaimArgs = {
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
export type SecretMintArgs = {
    contractAddress: string;
    uri: string;
    tokenId: string;
};
export type TSecretHandler = TNftChain<SecretNetworkClient, TSecretClaimArgs, TxOptions, TxResponse, SecretNetworkClient> & MintNft<SecretNetworkClient, SecretMintArgs, TxOptions, TxResponse> & ReadClaimed721Event & ReadClaimed1155Event & DeployNFTCollection<SecretNetworkClient, {
    name: string;
    symbol: string;
    codeId?: number;
}, TxOptions, string>;
export type TSecretParams = {
    provider: SecretNetworkClient;
    bridge: string;
    chainId: string;
    bridgeCodeHash: string;
    storage: BridgeStorage;
    nftCodeId: number;
    identifier: string;
};
//# sourceMappingURL=types.d.ts.map