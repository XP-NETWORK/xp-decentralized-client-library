declare const multiversXBridgeABI: {
    buildInfo: {
        rustc: {
            version: string;
            commitHash: string;
            commitDate: string;
            channel: string;
            short: string;
        };
        contractCrate: {
            name: string;
            version: string;
        };
        framework: {
            name: string;
            version: string;
        };
    };
    name: string;
    constructor: {
        inputs: {
            name: string;
            type: string;
        }[];
        outputs: never[];
    };
    endpoints: ({
        name: string;
        mutability: string;
        inputs: {
            name: string;
            type: string;
        }[];
        outputs: {
            type: string;
            multi_result: boolean;
        }[];
        payableInTokens?: undefined;
    } | {
        name: string;
        mutability: string;
        payableInTokens: string[];
        inputs: ({
            name: string;
            type: string;
            multi_arg?: undefined;
        } | {
            name: string;
            type: string;
            multi_arg: boolean;
        })[];
        outputs: never[];
    } | {
        name: string;
        mutability: string;
        inputs: {
            name: string;
            type: string;
        }[];
        outputs: {
            type: string;
        }[];
        payableInTokens?: undefined;
    })[];
    events: {
        identifier: string;
        inputs: {
            name: string;
            type: string;
            indexed: boolean;
        }[];
    }[];
    esdtAttributes: never[];
    hasCallback: boolean;
    types: {
        ClaimData: {
            type: string;
            fields: {
                name: string;
                type: string;
            }[];
        };
        ContractInfo: {
            type: string;
            fields: {
                name: string;
                type: string;
            }[];
        };
        SignatureInfo: {
            type: string;
            fields: {
                name: string;
                type: string;
            }[];
        };
        TokenInfo: {
            type: string;
            fields: {
                name: string;
                type: string;
            }[];
        };
        Validator: {
            type: string;
            fields: {
                name: string;
                type: string;
            }[];
        };
    };
};
export default multiversXBridgeABI;
//# sourceMappingURL=multiversXBridgeABI.d.ts.map