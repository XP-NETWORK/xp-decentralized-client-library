"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAccount = exports.isWindowSigner = void 0;
function isWindowSigner(signer) {
    return "isConnected" in signer;
}
exports.isWindowSigner = isWindowSigner;
function isAccount(signer) {
    return "publicKey" in signer;
}
exports.isAccount = isAccount;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvYXB0b3MvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBc0VBLFNBQWdCLGNBQWMsQ0FDNUIsTUFBaUM7SUFFakMsT0FBTyxhQUFhLElBQUksTUFBTSxDQUFDO0FBQ2pDLENBQUM7QUFKRCx3Q0FJQztBQUNELFNBQWdCLFNBQVMsQ0FDdkIsTUFBaUM7SUFFakMsT0FBTyxXQUFXLElBQUksTUFBTSxDQUFDO0FBQy9CLENBQUM7QUFKRCw4QkFJQyJ9