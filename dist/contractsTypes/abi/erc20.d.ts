declare const erc20ABI: ({
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    name?: undefined;
    anonymous?: undefined;
    outputs?: undefined;
} | {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    stateMutability?: undefined;
    anonymous?: undefined;
    outputs?: undefined;
} | {
    anonymous: boolean;
    inputs: {
        indexed: boolean;
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    stateMutability?: undefined;
    outputs?: undefined;
} | {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
})[];
export default erc20ABI;
//# sourceMappingURL=erc20.d.ts.map