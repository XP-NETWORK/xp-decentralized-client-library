"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECDSA__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [],
        name: "ECDSAInvalidSignature",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "length",
                type: "uint256",
            },
        ],
        name: "ECDSAInvalidSignatureLength",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
            },
        ],
        name: "ECDSAInvalidSignatureS",
        type: "error",
    },
];
const _bytecode = "0x60808060405234601757603a9081601d823930815050f35b600080fdfe600080fdfea26469706673582212203d5e680e787b31787504be6b1431692bfe122f68a55af1a0738d809d4b6f5f6b64736f6c63430008150033";
const isSuperArgs = (xs) => xs.length > 1;
class ECDSA__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static createInterface() {
        return new ethers_1.Interface(_abi);
    }
    static connect(address, runner) {
        return new ethers_1.Contract(address, _abi, runner);
    }
}
exports.ECDSA__factory = ECDSA__factory;
ECDSA__factory.bytecode = _bytecode;
ECDSA__factory.abi = _abi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRUNEU0FfX2ZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY29udHJhY3RzVHlwZXMvZXZtL2ZhY3Rvcmllcy9Ab3BlbnplcHBlbGluL2NvbnRyYWN0cy91dGlscy9jcnlwdG9ncmFwaHkvRUNEU0FfX2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQStDO0FBQy9DLG9CQUFvQjtBQUNwQixvQkFBb0I7QUFDcEIsbUNBS2dCO0FBUWhCLE1BQU0sSUFBSSxHQUFHO0lBQ1g7UUFDRSxNQUFNLEVBQUUsRUFBRTtRQUNWLElBQUksRUFBRSx1QkFBdUI7UUFDN0IsSUFBSSxFQUFFLE9BQU87S0FDZDtJQUNEO1FBQ0UsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsWUFBWSxFQUFFLFNBQVM7Z0JBQ3ZCLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSxTQUFTO2FBQ2hCO1NBQ0Y7UUFDRCxJQUFJLEVBQUUsNkJBQTZCO1FBQ25DLElBQUksRUFBRSxPQUFPO0tBQ2Q7SUFDRDtRQUNFLE1BQU0sRUFBRTtZQUNOO2dCQUNFLFlBQVksRUFBRSxTQUFTO2dCQUN2QixJQUFJLEVBQUUsR0FBRztnQkFDVCxJQUFJLEVBQUUsU0FBUzthQUNoQjtTQUNGO1FBQ0QsSUFBSSxFQUFFLHdCQUF3QjtRQUM5QixJQUFJLEVBQUUsT0FBTztLQUNkO0NBQ08sQ0FBQztBQUVYLE1BQU0sU0FBUyxHQUNiLGtMQUFrTCxDQUFDO0FBTXJMLE1BQU0sV0FBVyxHQUFHLENBQ2xCLEVBQTBCLEVBQzJCLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUV4RSxNQUFhLGNBQWUsU0FBUSx3QkFBZTtJQUNqRCxZQUFZLEdBQUcsSUFBNEI7UUFDekMsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN0QixLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNqQixDQUFDO2FBQU0sQ0FBQztZQUNOLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7SUFDSCxDQUFDO0lBRVEsb0JBQW9CLENBQzNCLFNBQW1EO1FBRW5ELE9BQU8sS0FBSyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ1EsTUFBTSxDQUFDLFNBQW1EO1FBQ2pFLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUlsQyxDQUFDO0lBQ0osQ0FBQztJQUNRLE9BQU8sQ0FBQyxNQUE2QjtRQUM1QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFtQixDQUFDO0lBQ2pELENBQUM7SUFJRCxNQUFNLENBQUMsZUFBZTtRQUNwQixPQUFPLElBQUksa0JBQVMsQ0FBQyxJQUFJLENBQW1CLENBQUM7SUFDL0MsQ0FBQztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZSxFQUFFLE1BQThCO1FBQzVELE9BQU8sSUFBSSxpQkFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFxQixDQUFDO0lBQ2pFLENBQUM7O0FBaENILHdDQWlDQztBQVJpQix1QkFBUSxHQUFHLFNBQVMsQ0FBQztBQUNyQixrQkFBRyxHQUFHLElBQUksQ0FBQyJ9