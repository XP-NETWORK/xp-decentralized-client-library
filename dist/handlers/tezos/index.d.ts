import { TTezosHandler, TTezosParams } from "./types";
export declare function tezosHandler({ Tezos, bridge, storage, tzktApi, identifier, }: TTezosParams): TTezosHandler;
export declare const extractStrOrAddr: (addr: {
    str: string;
} | {
    addr: string;
}) => string;
//# sourceMappingURL=index.d.ts.map