"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tonBridgeABI = {
    name: 'Bridge',
    types: [
        {
            name: 'StateInit',
            header: null,
            fields: [
                {
                    name: 'code',
                    type: {
                        kind: 'simple',
                        type: 'cell',
                        optional: false,
                    },
                },
                {
                    name: 'data',
                    type: {
                        kind: 'simple',
                        type: 'cell',
                        optional: false,
                    },
                },
            ],
        },
        {
            name: 'Context',
            header: null,
            fields: [
                {
                    name: 'bounced',
                    type: {
                        kind: 'simple',
                        type: 'bool',
                        optional: false,
                    },
                },
                {
                    name: 'sender',
                    type: {
                        kind: 'simple',
                        type: 'address',
                        optional: false,
                    },
                },
                {
                    name: 'value',
                    type: {
                        kind: 'simple',
                        type: 'int',
                        optional: false,
                        format: 257,
                    },
                },
                {
                    name: 'raw',
                    type: {
                        kind: 'simple',
                        type: 'slice',
                        optional: false,
                    },
                },
            ],
        },
        {
            name: 'SendParameters',
            header: null,
            fields: [
                {
                    name: 'bounce',
                    type: { kind: 'simple', type: 'bool', optional: false },
                },
                {
                    name: 'to',
                    type: {
                        kind: 'simple',
                        type: 'address',
                        optional: false,
                    },
                },
                {
                    name: 'value',
                    type: {
                        kind: 'simple',
                        type: 'int',
                        optional: false,
                        format: 257,
                    },
                },
                {
                    name: 'mode',
                    type: {
                        kind: 'simple',
                        type: 'int',
                        optional: false,
                        format: 257,
                    },
                },
                {
                    name: 'body',
                    type: { kind: 'simple', type: 'cell', optional: true },
                },
                {
                    name: 'code',
                    type: { kind: 'simple', type: 'cell', optional: true },
                },
                {
                    name: 'data',
                    type: { kind: 'simple', type: 'cell', optional: true },
                },
            ],
        },
        {
            name: 'Deploy',
            header: 2490013878,
            fields: [
                {
                    name: 'queryId',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 64,
                    },
                },
            ],
        },
        {
            name: 'DeployOk',
            header: 2952335191,
            fields: [
                {
                    name: 'queryId',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 64,
                    },
                },
            ],
        },
        {
            name: 'FactoryDeploy',
            header: 1829761339,
            fields: [
                {
                    name: 'queryId',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 64,
                    },
                },
                {
                    name: 'cashback',
                    type: { kind: 'simple', type: 'address', optional: false },
                },
            ],
        },
        {
            name: 'Validator',
            header: null,
            fields: [
                {
                    name: 'added',
                    type: { kind: 'simple', type: 'bool', optional: false },
                },
                {
                    name: 'pendingRewards',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 'coins',
                    },
                },
            ],
        },
        {
            name: 'Sig',
            header: null,
            fields: [
                {
                    name: 'signature',
                    type: { kind: 'simple', type: 'slice', optional: false },
                },
                {
                    name: 'key',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 256,
                    },
                },
            ],
        },
        {
            name: 'AddValidator',
            header: 630696568,
            fields: [
                {
                    name: 'newValidatorPublicKey',
                    type: {
                        kind: 'simple',
                        type: 'int',
                        optional: false,
                        format: 257,
                    },
                },
                {
                    name: 'sigs',
                    type: {
                        kind: 'dict',
                        key: 'int',
                        value: 'Sig',
                        valueFormat: 'ref',
                    },
                },
                {
                    name: 'len',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 256,
                    },
                },
            ],
        },
        {
            name: 'Transfer',
            header: null,
            fields: [
                {
                    name: 'seqno',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 32,
                    },
                },
                {
                    name: 'mode',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 8,
                    },
                },
                {
                    name: 'to',
                    type: { kind: 'simple', type: 'address', optional: false },
                },
                {
                    name: 'amount',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 'coins',
                    },
                },
                {
                    name: 'body',
                    type: { kind: 'simple', type: 'cell', optional: true },
                },
            ],
        },
        {
            name: 'TransferMessage',
            header: 123,
            fields: [
                {
                    name: 'signature',
                    type: { kind: 'simple', type: 'slice', optional: false },
                },
                {
                    name: 'transfer',
                    type: { kind: 'simple', type: 'Transfer', optional: false },
                },
                {
                    name: 'key',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 256,
                    },
                },
            ],
        },
        {
            name: 'StakeEvent',
            header: 2917934626,
            fields: [
                {
                    name: 'amount',
                    type: {
                        kind: 'simple',
                        type: 'uint',
                        optional: false,
                        format: 'coins',
                    },
                },
            ],
        },
    ],
    receivers: [
        {
            receiver: 'internal',
            message: {
                kind: 'text',
                text: 'Deploy',
            },
        },
        {
            receiver: 'internal',
            message: { kind: 'typed', type: 'AddValidator' },
        },
        {
            receiver: 'internal',
            message: { kind: 'typed', type: 'TransferMessage' },
        },
    ],
    getters: [],
    errors: {
        '2': { message: 'Stack undeflow' },
        '3': { message: 'Stack overflow' },
        '4': { message: 'Integer overflow' },
        '5': { message: 'Integer out of expected range' },
        '6': { message: 'Invalid opcode' },
        '7': { message: 'Type check error' },
        '8': { message: 'Cell overflow' },
        '9': { message: 'Cell underflow' },
        '10': { message: 'Dictionary error' },
        '13': { message: 'Out of gas error' },
        '32': { message: 'Method ID not found' },
        '34': { message: 'Action is invalid or not supported' },
        '37': { message: 'Not enough TON' },
        '38': { message: 'Not enough extra-currencies' },
        '128': { message: 'Null reference exception' },
        '129': { message: 'Invalid serialization prefix' },
        '130': { message: 'Invalid incoming message' },
        '131': { message: 'Constraints error' },
        '132': { message: 'Access denied' },
        '133': { message: 'Contract stopped' },
        '134': { message: 'Invalid argument' },
        '135': { message: 'Code of a contract was not found' },
        '136': { message: 'Invalid address' },
        '137': {
            message: 'Masterchain support is not enabled for this contract',
        },
        '48401': { message: 'Invalid signature' },
    },
    interfaces: [
        'org.ton.introspection.v0',
        'org.ton.abi.ipfs.v0',
        'org.ton.deploy.lazy.v0',
        'org.ton.chain.workchain.v0',
    ],
};
exports.default = tonBridgeABI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9uQnJpZGdlQUJJLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL2FiaS90b25CcmlkZ2VBQkkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLFlBQVksR0FBRztJQUNqQixJQUFJLEVBQUUsUUFBUTtJQUNkLEtBQUssRUFBRTtRQUNIO1lBQ0ksSUFBSSxFQUFFLFdBQVc7WUFDakIsTUFBTSxFQUFFLElBQUk7WUFDWixNQUFNLEVBQUU7Z0JBQ0o7b0JBQ0ksSUFBSSxFQUFFLE1BQU07b0JBQ1osSUFBSSxFQUFFO3dCQUNGLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxNQUFNO3dCQUNaLFFBQVEsRUFBRSxLQUFLO3FCQUNsQjtpQkFDSjtnQkFDRDtvQkFDSSxJQUFJLEVBQUUsTUFBTTtvQkFDWixJQUFJLEVBQUU7d0JBQ0YsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLE1BQU07d0JBQ1osUUFBUSxFQUFFLEtBQUs7cUJBQ2xCO2lCQUNKO2FBQ0o7U0FDSjtRQUNEO1lBQ0ksSUFBSSxFQUFFLFNBQVM7WUFDZixNQUFNLEVBQUUsSUFBSTtZQUNaLE1BQU0sRUFBRTtnQkFDSjtvQkFDSSxJQUFJLEVBQUUsU0FBUztvQkFDZixJQUFJLEVBQUU7d0JBQ0YsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLE1BQU07d0JBQ1osUUFBUSxFQUFFLEtBQUs7cUJBQ2xCO2lCQUNKO2dCQUNEO29CQUNJLElBQUksRUFBRSxRQUFRO29CQUNkLElBQUksRUFBRTt3QkFDRixJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsU0FBUzt3QkFDZixRQUFRLEVBQUUsS0FBSztxQkFDbEI7aUJBQ0o7Z0JBQ0Q7b0JBQ0ksSUFBSSxFQUFFLE9BQU87b0JBQ2IsSUFBSSxFQUFFO3dCQUNGLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxLQUFLO3dCQUNYLFFBQVEs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