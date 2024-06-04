import { Cell } from '@ton/core';
export declare const ONCHAIN_CONTENT_PREFIX = 0;
export declare const OFFCHAIN_TAG = 1;
export declare const SNAKE_PREFIX = 0;
export declare const CELL_MAX_SIZE_BYTES: number;
export declare const NFT_BASE_URL = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/";
export interface JettonContent {
    uri?: string;
    name: string;
    description: string;
    symbol: string;
    image?: string;
    decimals?: string;
    amount_style?: string;
    render_type?: string;
}
export declare function buildJettonContent(data: JettonContent): Cell;
export declare function buildNFTCollectionContent(base_url?: string): Cell;
//# sourceMappingURL=tep64.d.ts.map