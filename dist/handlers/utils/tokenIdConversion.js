"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNumbToHexToString = exports.convertStringToHexToNumb = void 0;
function convertStringToHexToNumb(str) {
    const hex = Array.from(str)
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");
    const numb = BigInt(`0x${hex}`);
    return numb.toString();
}
exports.convertStringToHexToNumb = convertStringToHexToNumb;
function convertNumbToHexToString(num) {
    const numberToBigInt = BigInt(num);
    const hex = numberToBigInt.toString(16);
    const string = (hex.match(/.{1,2}/g) || [])
        .map((byte) => String.fromCharCode(Number.parseInt(byte, 16)))
        .join("");
    return string;
}
exports.convertNumbToHexToString = convertNumbToHexToString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5JZENvbnZlcnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdXRpbHMvdG9rZW5JZENvbnZlcnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsU0FBZ0Isd0JBQXdCLENBQUMsR0FBVztJQUNsRCxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUN4QixHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDL0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1osTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoQyxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN6QixDQUFDO0FBTkQsNERBTUM7QUFDRCxTQUFnQix3QkFBd0IsQ0FBQyxHQUFXO0lBQ2xELE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxNQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBVyxDQUFDO0lBQ2xELE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDeEMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDN0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1osT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQVBELDREQU9DIn0=