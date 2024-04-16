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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9uQnJpZGdlQUJJLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL211bHRpdmVyc3gvdG9uQnJpZGdlQUJJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxZQUFZLEdBQUc7SUFDakIsSUFBSSxFQUFFLFFBQVE7SUFDZCxLQUFLLEVBQUU7UUFDSDtZQUNJLElBQUksRUFBRSxXQUFXO1lBQ2pCLE1BQU0sRUFBRSxJQUFJO1lBQ1osTUFBTSxFQUFFO2dCQUNKO29CQUNJLElBQUksRUFBRSxNQUFNO29CQUNaLElBQUksRUFBRTt3QkFDRixJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsTUFBTTt3QkFDWixRQUFRLEVBQUUsS0FBSztxQkFDbEI7aUJBQ0o7Z0JBQ0Q7b0JBQ0ksSUFBSSxFQUFFLE1BQU07b0JBQ1osSUFBSSxFQUFFO3dCQUNGLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxNQUFNO3dCQUNaLFFBQVEsRUFBRSxLQUFLO3FCQUNsQjtpQkFDSjthQUNKO1NBQ0o7UUFDRDtZQUNJLElBQUksRUFBRSxTQUFTO1lBQ2YsTUFBTSxFQUFFLElBQUk7WUFDWixNQUFNLEVBQUU7Z0JBQ0o7b0JBQ0ksSUFBSSxFQUFFLFNBQVM7b0JBQ2YsSUFBSSxFQUFFO3dCQUNGLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxNQUFNO3dCQUNaLFFBQVEsRUFBRSxLQUFLO3FCQUNsQjtpQkFDSjtnQkFDRDtvQkFDSSxJQUFJLEVBQUUsUUFBUTtvQkFDZCxJQUFJLEVBQUU7d0JBQ0YsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsUUFBUSxFQUFFLEtBQUs7cUJBQ2xCO2lCQUNKO2dCQUNEO29CQUNJLElBQUksRUFBRSxPQUFPO29CQUNiLElBQUksRUFBRTt3QkFDRixJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsS0FBSzt3QkFD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