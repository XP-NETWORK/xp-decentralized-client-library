import { SecretNetworkClient, TxOptions, TxResponse } from "secretjs";
import { Snip721GetTokensResponse } from "secretjs/dist/extensions/snip721/msg/GetTokens";
import { BridgeStorage } from "../../contractsTypes/evm";
import { DeployNFTCollection, MintNft, ReadClaimed721Event, ReadClaimed1155Event, TNFTList, TNftChain } from "../types";
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
    owner: string;
};
export type TSecretHandler = TNftChain<SecretNetworkClient, TSecretClaimArgs, TxOptions, TxResponse, SecretNetworkClient> & MintNft<SecretNetworkClient, SecretMintArgs, TxOptions, TxResponse> & ReadClaimed721Event & ReadClaimed1155Event & TNFTList<Record<string, unknown>, {
    viewingKey: string;
    codeHash?: string;
}> & DeployNFTCollection<SecretNetworkClient, {
    name: string;
    symbol: string;
    codeId?: number;
}, TxOptions, string> & {
    setViewingKey: (signer: SecretNetworkClient, contract: string, vk: string) => Promise<TxResponse>;
};
export type TSecretParams = {
    provider: SecretNetworkClient;
    bridge: string;
    chainId: string;
    bridgeCodeHash: string;
    storage: BridgeStorage;
    nftCodeId: number;
    identifier: string;
};
export type GetOwnedTokensResponse = Snip721GetTokensResponse | string;
export type TNftInfo = {
    contract_info: {
        name: string;
        symbol: string;
    };
};
export type TSftInfo = {
    token_id_public_info: {
        token_id_info: {
            token_id: string;
            name: string;
            symbol: string;
            curator: string;
        };
        total_supply: string;
        owner: string | undefined | null;
    };
};
//# sourceMappingURL=types.d.ts.map