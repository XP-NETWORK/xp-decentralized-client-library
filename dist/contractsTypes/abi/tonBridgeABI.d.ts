declare const tonBridgeABI: {
    name: string;
    types: ({
        name: string;
        header: number;
        fields: ({
            name: string;
            type: {
                kind: string;
                type: string;
                optional: boolean;
                format: number;
            };
        } | {
            name: string;
            type: {
                kind: string;
                type: string;
                optional: boolean;
                format?: undefined;
            };
        })[];
    } | {
        name: string;
        header: number;
        fields: ({
            name: string;
            type: {
                kind: string;
                type: string;
                optional: boolean;
                format: number;
                key?: undefined;
                value?: undefined;
                valueFormat?: undefined;
            };
        } | {
            name: string;
            type: {
                kind: string;
                key: string;
                value: string;
                valueFormat: string;
                type?: undefined;
                optional?: undefined;
                format?: undefined;
            };
        })[];
    } | {
        name: string;
        header: null;
        fields: ({
            name: string;
            type: {
                kind: string;
                type: string;
                optional: boolean;
                format: number;
            };
        } | {
            name: string;
            type: {
                kind: string;
                type: string;
                optional: boolean;
                format?: undefined;
            };
        } | {
            name: string;
            type: {
                kind: string;
                type: string;
                optional: boolean;
                format: string;
            };
        })[];
    } | {
        name: string;
        header: number;
        fields: {
            name: string;
            type: {
                kind: string;
                type: string;
                optional: boolean;
                format: string;
            };
        }[];
    })[];
    receivers: ({
        receiver: string;
        message: {
            kind: string;
            text: string;
            type?: undefined;
        };
    } | {
        receiver: string;
        message: {
            kind: string;
            type: string;
            text?: undefined;
        };
    })[];
    getters: never[];
    errors: {
        '2': {
            message: string;
        };
        '3': {
            message: string;
        };
        '4': {
            message: string;
        };
        '5': {
            message: string;
        };
        '6': {
            message: string;
        };
        '7': {
            message: string;
        };
        '8': {
            message: string;
        };
        '9': {
            message: string;
        };
        '10': {
            message: string;
        };
        '13': {
            message: string;
        };
        '32': {
            message: string;
        };
        '34': {
            message: string;
        };
        '37': {
            message: string;
        };
        '38': {
            message: string;
        };
        '128': {
            message: string;
        };
        '129': {
            message: string;
        };
        '130': {
            message: string;
        };
        '131': {
            message: string;
        };
        '132': {
            message: string;
        };
        '133': {
            message: string;
        };
        '134': {
            message: string;
        };
        '135': {
            message: string;
        };
        '136': {
            message: string;
        };
        '137': {
            message: string;
        };
        '48401': {
            message: string;
        };
    };
    interfaces: string[];
};
export default tonBridgeABI;
//# sourceMappingURL=tonBridgeABI.d.ts.map