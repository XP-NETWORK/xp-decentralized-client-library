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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS1hbGlhc2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL3Rlem9zQ29udHJhY3RUeXBlcy90eXBlLWFsaWFzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0RBSStCO0FBQy9CLDhDQUFnRDtBQUNoRCwrQ0FBeUM7QUFrQ3pDLE1BQU0sbUJBQW1CLEdBQUcsR0FBcUIsRUFBRTtJQUMvQyxPQUFPLENBQUMsS0FBYSxFQUFLLEVBQUUsQ0FBQyxLQUFVLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxzQkFBc0IsR0FBRyxHQUF3QixFQUFFO0lBQ3JELE9BQU8sQ0FBQyxLQUFrQyxFQUFLLEVBQUUsQ0FBQyxJQUFJLHdCQUFTLENBQUMsS0FBSyxDQUFNLENBQUM7QUFDaEYsQ0FBQyxDQUFDO0FBUUYsU0FBUyxLQUFLLENBQXNCLEtBQXlCO0lBQ3pELE1BQU0sQ0FBQyxHQUFHLElBQUksc0JBQVksRUFBUSxDQUFDO0lBQ25DLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sTUFBTSxHQUFHLEtBQW9DLENBQUM7UUFDcEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7U0FBTSxDQUFDO1FBQ0osTUFBTSxPQUFPLEdBQUcsS0FBNkIsQ0FBQztRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQ2pDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBbUIsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FDM0MsQ0FBQztJQUNOLENBQUM7SUFDRCxPQUFPLENBQWUsQ0FBQztBQUMzQixDQUFDO0FBQ0QsTUFBTSxRQUFRLEdBQUcsQ0FBc0IsS0FBeUIsRUFBRSxFQUFFLENBQ2hFLEtBQUssQ0FBQyxLQUFLLENBQTRCLENBQUM7QUFFNUMsU0FBUyxHQUFHLENBQXNCLENBQUksRUFBRSxDQUFJO0lBQ3hDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sQ0FBQztBQUMxQixDQUFDO0FBQ0QsU0FBUyxRQUFRLENBQXNCLENBQUksRUFBRSxDQUFJO0lBQzdDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQU0sQ0FBQztBQUMzQixDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxJQUFVO0lBQ25DLElBQUEseUNBQTBCLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsT0FBTyxJQUFxQixDQUFDO0FBQ2pDLENBQUM7QUFFRCwrQ0FBK0M7QUFDbEMsUUFBQSxHQUFHLEdBQUc7SUFDZixPQUFPLEVBQUUsbUJBQW1CLEVBQVc7SUFDdkMsS0FBSyxFQUFFLG1CQUFtQixFQUFTO0lBQ25DLFFBQVEsRUFBRSxtQkFBbUIsRUFBWTtJQUN6QyxLQUFLLEVBQUUsbUJBQW1CLEVBQVM7SUFDbkMsU0FBUyxFQUFFLG1CQUFtQixFQUFhO0lBQzNDLEdBQUcsRUFBRSxtQkFBbUIsRUFBTztJQUMvQixTQUFTLEVBQUUsbUJBQW1CLEVBQWE7SUFDM0MsU0FBUyxFQUFFLENBQUMsS0FBb0IsRUFBYSxFQUFFLENBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBZTtJQUU5QyxHQUFHLEVBQUUsc0JBQXNCLEVBQU87SUFDbEMsR0FBRyxFQUFFLHNCQUFzQixFQUFPO0lBQ2xDLEtBQUssRUFBRSxzQkFBc0IsRUFBUztJQUN0QyxHQUFHLEVBQUUsc0JBQXNCLEVBQU87SUFFbEMsR0FBRyxFQUFFLEtBQUs7SUFDVixNQUFNLEVBQUUsUUFBUTtJQUVoQixhQUFhO0lBQ2IsR0FBRztJQUNILFFBQVE7SUFFUixNQUFNLEVBQUUsbUJBQW1CO0lBRTNCLFlBQVk7SUFDWixNQUFNLEVBQUUsQ0FBQyxLQUF5QixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUN6RCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBWTtDQUMzQixDQUFDIn0=