"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolygonGas = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const getConstantGasForPolygon = () => (0, utils_1.getConstantGas)(800);
const getGasFromGasStation = async () => {
    const response = await axios_1.default.get("https://gasstation.polygon.technology/v2");
    console.log("polygon gas response", response.data);
    const gas = (0, utils_1.convertToGwei)(String(response?.data?.fast.maxFee));
    return {
        maxPriorityFeePerGas: gas,
        maxFeePerGas: gas,
        gasLimit: utils_1.GAS_LIMIT,
    };
};
const getPolygonGas = async () => {
    const gas = await (0, utils_1.getGas)(getGasFromGasStation, getConstantGasForPolygon);
    console.log({ gas }, "gas in internal polygon");
    return gas;
};
exports.getPolygonGas = getPolygonGas;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oYW5kbGVycy9nYXNGYWN0b3JpZXMvcG9seWdvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsbUNBTWlCO0FBRWpCLE1BQU0sd0JBQXdCLEdBQUcsR0FBUyxFQUFFLENBQUMsSUFBQSxzQkFBYyxFQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRWpFLE1BQU0sb0JBQW9CLEdBQUcsS0FBSyxJQUFtQixFQUFFO0lBQ3JELE1BQU0sUUFBUSxHQUFHLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0lBQzdFLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRW5ELE1BQU0sR0FBRyxHQUFHLElBQUEscUJBQWEsRUFBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUUvRCxPQUFPO1FBQ0wsb0JBQW9CLEVBQUUsR0FBRztRQUN6QixZQUFZLEVBQUUsR0FBRztRQUNqQixRQUFRLEVBQUUsaUJBQVM7S0FDcEIsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVLLE1BQU0sYUFBYSxHQUFHLEtBQUssSUFBbUIsRUFBRTtJQUNyRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsY0FBTSxFQUFDLG9CQUFvQixFQUFFLHdCQUF3QixDQUFDLENBQUM7SUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLHlCQUF5QixDQUFDLENBQUM7SUFDaEQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFKVyxRQUFBLGFBQWEsaUJBSXhCIn0=