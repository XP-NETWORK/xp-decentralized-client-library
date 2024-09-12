"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tas = void 0;
const michel_codec_1 = require("@taquito/michel-codec");
const taquito_1 = require("@taquito/taquito");
const bignumber_js_1 = require("bignumber.js");
const createStringTypeTas = () => {
    return (value) => value;
};
const createBigNumberTypeTas = () => {
    return (value) => new bignumber_js_1.BigNumber(value);
};
function asMap(value) {
    const m = new taquito_1.MichelsonMap();
    if (Array.isArray(value)) {
        const vArray = value;
        vArray.forEach(x => m.set(x.key, x.value));
    }
    else {
        const vObject = value;
        Object.keys(vObject).forEach(key => m.set(key, vObject[key]));
    }
    return m;
}
const asBigMap = (value) => asMap(value);
function add(a, b) {
    return a.plus(b);
}
function subtract(a, b) {
    return a.minus(b);
}
function createLambdaTypeTas(expr) {
    (0, michel_codec_1.assertMichelsonInstruction)(expr);
    return expr;
}
/** tas: Tezos 'as' casting for strict types */
exports.tas = {
    address: createStringTypeTas(),
    bytes: createStringTypeTas(),
    contract: createStringTypeTas(),
    chest: createStringTypeTas(),
    chest_key: createStringTypeTas(),
    timestamp: (value) => new Date(value).toISOString(),
    signature: createStringTypeTas(),
    key: createStringTypeTas(),
    int: createBigNumberTypeTas(),
    nat: createBigNumberTypeTas(),
    mutez: createBigNumberTypeTas(),
    tez: createBigNumberTypeTas(),
    map: asMap,
    bigMap: asBigMap,
    // Operations
    add,
    subtract,
    lambda: createLambdaTypeTas,
    // To number
    number: (value) => Number(value + ''),
    unit: () => true,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS1hbGlhc2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL3Rlem9zL3R5cGUtYWxpYXNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3REFBd0Y7QUFDeEYsOENBQWdEO0FBQ2hELCtDQUF5QztBQThCekMsTUFBTSxtQkFBbUIsR0FBRyxHQUFxQixFQUFFO0lBQ2xELE9BQU8sQ0FBQyxLQUFhLEVBQUssRUFBRSxDQUFDLEtBQVUsQ0FBQztBQUN6QyxDQUFDLENBQUM7QUFFRixNQUFNLHNCQUFzQixHQUFHLEdBQXdCLEVBQUU7SUFDeEQsT0FBTyxDQUFDLEtBQWtDLEVBQUssRUFBRSxDQUFDLElBQUksd0JBQVMsQ0FBQyxLQUFLLENBQU0sQ0FBQztBQUM3RSxDQUFDLENBQUM7QUFNRixTQUFTLEtBQUssQ0FBc0IsS0FBeUI7SUFDNUQsTUFBTSxDQUFDLEdBQUcsSUFBSSxzQkFBWSxFQUFRLENBQUM7SUFDbkMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDMUIsTUFBTSxNQUFNLEdBQUcsS0FBb0MsQ0FBQztRQUNwRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7U0FBTSxDQUFDO1FBQ1AsTUFBTSxPQUFPLEdBQUcsS0FBNkIsQ0FBQztRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBbUIsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFDRCxPQUFPLENBQWUsQ0FBQztBQUN4QixDQUFDO0FBQ0QsTUFBTSxRQUFRLEdBQUcsQ0FBc0IsS0FBeUIsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBNEIsQ0FBQztBQUU3RyxTQUFTLEdBQUcsQ0FBc0IsQ0FBSSxFQUFFLENBQUk7SUFDM0MsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTSxDQUFDO0FBQ3ZCLENBQUM7QUFDRCxTQUFTLFFBQVEsQ0FBc0IsQ0FBSSxFQUFFLENBQUk7SUFDaEQsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBTSxDQUFDO0FBQ3hCLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLElBQVU7SUFDdEMsSUFBQSx5Q0FBMEIsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixPQUFPLElBQXFCLENBQUM7QUFDakMsQ0FBQztBQUVELCtDQUErQztBQUNsQyxRQUFBLEdBQUcsR0FBRztJQUNsQixPQUFPLEVBQUUsbUJBQW1CLEVBQVc7SUFDdkMsS0FBSyxFQUFFLG1CQUFtQixFQUFTO0lBQ25DLFFBQVEsRUFBRSxtQkFBbUIsRUFBWTtJQUN6QyxLQUFLLEVBQUUsbUJBQW1CLEVBQVM7SUFDbkMsU0FBUyxFQUFFLG1CQUFtQixFQUFhO0lBQzNDLFNBQVMsRUFBRSxDQUFDLEtBQW9CLEVBQWEsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBZTtJQUMxRixTQUFTLEVBQUUsbUJBQW1CLEVBQWE7SUFDM0MsR0FBRyxFQUFFLG1CQUFtQixFQUFPO0lBQy9CLEdBQUcsRUFBRSxzQkFBc0IsRUFBTztJQUNsQyxHQUFHLEVBQUUsc0JBQXNCLEVBQU87SUFDbEMsS0FBSyxFQUFFLHNCQUFzQixFQUFTO0lBQ3RDLEdBQUcsRUFBRSxzQkFBc0IsRUFBTztJQUVsQyxHQUFHLEVBQUUsS0FBSztJQUNWLE1BQU0sRUFBRSxRQUFRO0lBRWhCLGFBQWE7SUFDYixHQUFHO0lBQ0gsUUFBUTtJQUVMLE1BQU0sRUFBRSxtQkFBbUI7SUFFOUIsWUFBWTtJQUNaLE1BQU0sRUFBRSxDQUFDLEtBQXlCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3pELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFZO0NBQ3hCLENBQUMifQ==