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
        vArray.forEach((x) => m.set(x.key, x.value));
    }
    else {
        const vObject = value;
        Object.keys(vObject).forEach((key) => m.set(key, vObject[key]));
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
    signature: createStringTypeTas(),
    key: createStringTypeTas(),
    chest_key: createStringTypeTas(),
    timestamp: (value) => new Date(value).toISOString(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS1hbGlhc2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL3Rlem9zL3R5cGUtYWxpYXNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3REFJK0I7QUFDL0IsOENBQWdEO0FBQ2hELCtDQUF5QztBQWtDekMsTUFBTSxtQkFBbUIsR0FBRyxHQUFxQixFQUFFO0lBQy9DLE9BQU8sQ0FBQyxLQUFhLEVBQUssRUFBRSxDQUFDLEtBQVUsQ0FBQztBQUM1QyxDQUFDLENBQUM7QUFFRixNQUFNLHNCQUFzQixHQUFHLEdBQXdCLEVBQUU7SUFDckQsT0FBTyxDQUFDLEtBQWtDLEVBQUssRUFBRSxDQUFDLElBQUksd0JBQVMsQ0FBQyxLQUFLLENBQU0sQ0FBQztBQUNoRixDQUFDLENBQUM7QUFRRixTQUFTLEtBQUssQ0FBc0IsS0FBeUI7SUFDekQsTUFBTSxDQUFDLEdBQUcsSUFBSSxzQkFBWSxFQUFRLENBQUM7SUFDbkMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDdkIsTUFBTSxNQUFNLEdBQUcsS0FBb0MsQ0FBQztRQUNwRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztTQUFNLENBQUM7UUFDSixNQUFNLE9BQU8sR0FBRyxLQUE2QixDQUFDO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FDakMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFtQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUMzQyxDQUFDO0lBQ04sQ0FBQztJQUNELE9BQU8sQ0FBZSxDQUFDO0FBQzNCLENBQUM7QUFDRCxNQUFNLFFBQVEsR0FBRyxDQUFzQixLQUF5QixFQUFFLEVBQUUsQ0FDaEUsS0FBSyxDQUFDLEtBQUssQ0FBNEIsQ0FBQztBQUU1QyxTQUFTLEdBQUcsQ0FBc0IsQ0FBSSxFQUFFLENBQUk7SUFDeEMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTSxDQUFDO0FBQzFCLENBQUM7QUFDRCxTQUFTLFFBQVEsQ0FBc0IsQ0FBSSxFQUFFLENBQUk7SUFDN0MsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBTSxDQUFDO0FBQzNCLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLElBQVU7SUFDbkMsSUFBQSx5Q0FBMEIsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxPQUFPLElBQXFCLENBQUM7QUFDakMsQ0FBQztBQUVELCtDQUErQztBQUNsQyxRQUFBLEdBQUcsR0FBRztJQUNmLE9BQU8sRUFBRSxtQkFBbUIsRUFBVztJQUN2QyxLQUFLLEVBQUUsbUJBQW1CLEVBQVM7SUFDbkMsUUFBUSxFQUFFLG1CQUFtQixFQUFZO0lBQ3pDLEtBQUssRUFBRSxtQkFBbUIsRUFBUztJQUNuQyxTQUFTLEVBQUUsbUJBQW1CLEVBQWE7SUFDM0MsR0FBRyxFQUFFLG1CQUFtQixFQUFPO0lBQy9CLFNBQVMsRUFBRSxtQkFBbUIsRUFBYTtJQUMzQyxTQUFTLEVBQUUsQ0FBQyxLQUFvQixFQUFhLEVBQUUsQ0FDM0MsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFlO0lBRTlDLEdBQUcsRUFBRSxzQkFBc0IsRUFBTztJQUNsQyxHQUFHLEVBQUUsc0JBQXNCLEVBQU87SUFDbEMsS0FBSyxFQUFFLHNCQUFzQixFQUFTO0lBQ3RDLEdBQUcsRUFBRSxzQkFBc0IsRUFBTztJQUVsQyxHQUFHLEVBQUUsS0FBSztJQUNWLE1BQU0sRUFBRSxRQUFRO0lBRWhCLGFBQWE7SUFDYixHQUFHO0lBQ0gsUUFBUTtJQUVSLE1BQU0sRUFBRSxtQkFBbUI7SUFFM0IsWUFBWTtJQUNaLE1BQU0sRUFBRSxDQUFDLEtBQXlCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3pELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFZO0NBQzNCLENBQUMifQ==