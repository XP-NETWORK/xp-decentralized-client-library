"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_INFO = exports.ChainFactory = exports.Chain = void 0;
const cosmwasm_1 = require("../handlers/cosmwasm");
const evm_1 = require("../handlers/evm");
const multiversx_1 = require("../handlers/multiversx");
const secret_1 = require("../handlers/secret");
const tezos_1 = require("../handlers/tezos");
const ton_1 = require("../handlers/ton");
var Chain;
(function (Chain) {
    Chain.MULTIVERSX = "MULTIVERSX";
    Chain.SECRET = "SECRET";
    Chain.TON = "TON";
    Chain.ETH = "ETH";
    Chain.BSC = "BSC";
    Chain.TEZOS = "TEZOS";
    Chain.TERRA = "TERRA";
    Chain.MATIC = "MATIC";
    Chain.HEDERA = "HEDERA";
})(Chain || (exports.Chain = Chain = {}));
function mapNonceToParams(chainParams) {
    const cToP = new Map();
    cToP.set(Chain.MULTIVERSX, chainParams.multiversxParams);
    cToP.set(Chain.BSC, chainParams.bscParams);
    cToP.set(Chain.MATIC, chainParams.maticParams);
    cToP.set(Chain.HEDERA, chainParams.hederaParams);
    cToP.set(Chain.ETH, chainParams.ethParams);
    cToP.set(Chain.TEZOS, chainParams.tezosParams);
    cToP.set(Chain.SECRET, chainParams.secretParams);
    cToP.set(Chain.TON, chainParams.tonParams);
    cToP.set(Chain.TERRA, chainParams.terraParams);
    return cToP;
}
function ChainFactory(cp) {
    const map = mapNonceToParams(cp);
    const helpers = new Map();
    return {
        async inner(chain) {
            const helper = helpers.get(chain);
            if (helper) {
                return helper;
            }
            const params = map.get(chain) ?? (0, ton_1.raise)("No Such Chain Found in cToP");
            const cf = exports.CHAIN_INFO.get(chain) ?? (0, ton_1.raise)("No such chain in CHAIN_INFO");
            const handler = await cf.constructor(params);
            helpers.set(chain, handler);
            return handler;
        },
        async getClaimData(chain, txHash) {
            const data = await chain.getClaimData(txHash);
            const sc = await this.inner(data.sourceChain);
            const ogNftData = await sc.nftData(data.tokenId, data.sourceNftContractAddress, {});
            return {
                ...data,
                ...ogNftData,
                royalty: ogNftData.royalty.toString(),
            };
        },
    };
}
exports.ChainFactory = ChainFactory;
exports.CHAIN_INFO = new Map();
exports.CHAIN_INFO.set(Chain.BSC, {
    constructor: evm_1.evmHandler,
});
exports.CHAIN_INFO.set(Chain.ETH, {
    constructor: evm_1.evmHandler,
});
exports.CHAIN_INFO.set(Chain.MATIC, {
    constructor: evm_1.evmHandler,
});
exports.CHAIN_INFO.set(Chain.HEDERA, {
    constructor: evm_1.evmHandler,
});
exports.CHAIN_INFO.set(Chain.MULTIVERSX, {
    constructor: multiversx_1.multiversxHandler,
});
exports.CHAIN_INFO.set(Chain.SECRET, {
    constructor: secret_1.secretHandler,
});
exports.CHAIN_INFO.set(Chain.TON, {
    constructor: ton_1.tonHandler,
});
exports.CHAIN_INFO.set(Chain.TEZOS, {
    constructor: tezos_1.tezosHandler,
});
exports.CHAIN_INFO.set(Chain.TERRA, {
    constructor: cosmwasm_1.cosmWasmHandler,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mYWN0b3J5L2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsbURBQXVEO0FBQ3ZELHlDQUE2QztBQUM3Qyx1REFBMkQ7QUFDM0QsK0NBQW1EO0FBQ25ELDZDQUFpRDtBQUNqRCx5Q0FBb0Q7QUFHcEQsSUFBaUIsS0FBSyxDQVVyQjtBQVZELFdBQWlCLEtBQUs7SUFDUCxnQkFBVSxHQUFHLFlBQVksQ0FBQztJQUMxQixZQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ2xCLFNBQUcsR0FBRyxLQUFLLENBQUM7SUFDWixTQUFHLEdBQUcsS0FBSyxDQUFDO0lBQ1osU0FBRyxHQUFHLEtBQUssQ0FBQztJQUNaLFdBQUssR0FBRyxPQUFPLENBQUM7SUFDaEIsV0FBSyxHQUFHLE9BQU8sQ0FBQztJQUNoQixXQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ2hCLFlBQU0sR0FBRyxRQUFRLENBQUM7QUFDakMsQ0FBQyxFQVZnQixLQUFLLHFCQUFMLEtBQUssUUFVckI7QUFFRCxTQUFTLGdCQUFnQixDQUFDLFdBQWtDO0lBQzFELE1BQU0sSUFBSSxHQUFjLElBQUksR0FBRyxFQUFFLENBQUM7SUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2pELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcs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