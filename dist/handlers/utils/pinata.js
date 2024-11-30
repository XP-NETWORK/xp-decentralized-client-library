"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinata = void 0;
const dotenv_1 = require("dotenv");
const pinata_web3_1 = require("pinata-web3");
(0, dotenv_1.config)();
exports.pinata = new pinata_web3_1.PinataSDK({
    pinataJwt: `${process.env.PINATA_JWT}`,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hhbmRsZXJzL3V0aWxzL3BpbmF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBZ0M7QUFDaEMsNkNBQXdDO0FBRXhDLElBQUEsZUFBTSxHQUFFLENBQUM7QUFDSSxRQUFBLE1BQU0sR0FBRyxJQUFJLHVCQUFTLENBQUM7SUFDbEMsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7Q0FDdkMsQ0FBQyxDQUFDIn0=