"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.getGas = exports.getConstantGas = exports.convertToGwei = exports.GAS_LIMIT = void 0;
const ethers_1 = require("ethers");
exports.GAS_LIMIT = 5000000;
const convertToGwei = (value) => {
    return ethers_1.ethers.parseUnits(value, "gwei");
};
exports.convertToGwei = convertToGwei;
const getConstantGas = (fee) => {
    const maxPriorityFeePerGas = (0, exports.convertToGwei)(`${fee}`);
    const maxFeePerGas = (0, exports.convertToGwei)(`${fee}`);
    return {
        maxPriorityFeePerGas,
        maxFeePerGas,
        gasLimit: exports.GAS_LIMIT,
    };
};
exports.getConstantGas = getConstantGas;
const getGas = async (getGasStationGas, getConstantGas) => {
    let retriesForGettingGas = 0;
    while (retriesForGettingGas < 5) {
        try {
            return await getGasStationGas();
        }
        catch (error) {
            console.log("error when getting gas for", error);
            if (retriesForGettingGas === 4) {
                return getConstantGas();
            }
            await sleep(5000);
            retriesForGettingGas++;
        }
    }
    return getConstantGas();
};
exports.getGas = getGas;
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvZ2FzRmFjdG9yaWVzL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFzRTtBQWV6RCxRQUFBLFNBQVMsR0FBRyxPQUFTLENBQUM7QUFTNUIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUFhLEVBQW1CLEVBQUU7SUFDOUQsT0FBTyxlQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFGVyxRQUFBLGFBQWEsaUJBRXhCO0FBRUssTUFBTSxjQUFjLEdBQUcsQ0FBQyxHQUFXLEVBQVEsRUFBRTtJQUNsRCxNQUFNLG9CQUFvQixHQUFHLElBQUEscUJBQWEsRUFBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckQsTUFBTSxZQUFZLEdBQUcsSUFBQSxxQkFBYSxFQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM3QyxPQUFPO1FBQ0wsb0JBQW9CO1FBQ3BCLFlBQVk7UUFDWixRQUFRLEVBQUUsaUJBQVM7S0FDcEIsQ0FBQztBQUNKLENBQUMsQ0FBQztBQVJXLFFBQUEsY0FBYyxrQkFRekI7QUFFSyxNQUFNLE1BQU0sR0FBWSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLEVBQUU7SUFDeEUsSUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7SUFDN0IsT0FBTyxvQkFBb0IsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUM7WUFDSCxPQUFPLE1BQU0sZ0JBQWdCLEVBQUUsQ0FBQztRQUNsQyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDakQsSUFBSSxvQkFBb0IsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsT0FBTyxjQUFjLEVBQUUsQ0FBQztZQUMxQixDQUFDO1lBQ0QsTUFBTSxLQUFLLENBQUMsSUFBSyxDQUFDLENBQUM7WUFDbkIsb0JBQW9CLEVBQUUsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sY0FBYyxFQUFFLENBQUM7QUFDMUIsQ0FBQyxDQUFDO0FBZlcsUUFBQSxNQUFNLFVBZWpCO0FBRUYsU0FBZ0IsS0FBSyxDQUFDLEVBQVU7SUFDOUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzdCLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBSkQsc0JBSUMifQ==