"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiversXBridgeABI = exports.erc721RoyalityABI = exports.erc1155RoyalityABI = exports.evmBridgeABI = exports.bridgeStorageABI = exports.stakingABI = exports.erc20ABI = void 0;
const erc20_1 = __importDefault(require("./erc20"));
exports.erc20ABI = erc20_1.default;
const staking_1 = __importDefault(require("./staking"));
exports.stakingABI = staking_1.default;
const bridgeStorage_1 = __importDefault(require("./bridgeStorage"));
exports.bridgeStorageABI = bridgeStorage_1.default;
const evmBridgeABI_1 = __importDefault(require("./evmBridgeABI"));
exports.evmBridgeABI = evmBridgeABI_1.default;
const erc1155Royality_1 = __importDefault(require("./erc1155Royality"));
exports.erc1155RoyalityABI = erc1155Royality_1.default;
const erc721Royality_1 = __importDefault(require("./erc721Royality"));
exports.erc721RoyalityABI = erc721Royality_1.default;
const multiversXBridgeABI_1 = __importDefault(require("./multiversXBridgeABI"));
exports.multiversXBridgeABI = multiversXBridgeABI_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJhY3RzVHlwZXMvYWJpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUErQjtBQVMzQixtQkFURyxlQUFRLENBU0g7QUFSWix3REFBbUM7QUFTL0IscUJBVEcsaUJBQVUsQ0FTSDtBQVJkLG9FQUErQztBQVMzQywyQkFURyx1QkFBZ0IsQ0FTSDtBQVJwQixrRUFBMEM7QUFTdEMsdUJBVEcsc0JBQVksQ0FTSDtBQVJoQix3RUFBbUQ7QUFTL0MsNkJBVEcseUJBQWtCLENBU0g7QUFSdEIsc0VBQWlEO0FBUzdDLDRCQVRHLHdCQUFpQixDQVNIO0FBUnJCLGdGQUF3RDtBQVNwRCw4QkFURyw2QkFBbUIsQ0FTSCJ9