"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_INFO = exports.ChainFactory = exports.Chain = void 0;
const aptos_1 = require("../handlers/aptos");
const cosmwasm_1 = require("../handlers/cosmwasm");
const evm_1 = require("../handlers/evm");
const hedera_1 = require("../handlers/hedera");
const icp_1 = require("../handlers/icp");
const multiversx_1 = require("../handlers/multiversx");
const near_1 = require("../handlers/near");
const secret_1 = require("../handlers/secret");
const tezos_1 = require("../handlers/tezos");
const ton_1 = require("../handlers/ton");
const utils_1 = require("../handlers/utils");
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
    Chain.APTOS = "APTOS";
    Chain.ICP = "ICP";
    Chain.BASE = "BASE";
    Chain.NEAR = "NEAR";
    Chain.MOONBEAM = "MOONBEAM";
    Chain.BLAST = "BLAST";
    Chain.FANTOM = "FANTOM";
    Chain.AVALANCHE = "AVALANCHE";
})(Chain || (exports.Chain = Chain = {}));
function mapNonceToParams(chainParams) {
    const cToP = new Map();
    cToP.set(Chain.MULTIVERSX, chainParams.multiversxParams);
    cToP.set(Chain.BSC, chainParams.bscParams);
    cToP.set(Chain.MATIC, chainParams.maticParams);
    cToP.set(Chain.BASE, chainParams.baseParams);
    cToP.set(Chain.HEDERA, chainParams.hederaParams);
    cToP.set(Chain.ETH, chainParams.ethParams);
    cToP.set(Chain.TEZOS, chainParams.tezosParams);
    cToP.set(Chain.SECRET, chainParams.secretParams);
    cToP.set(Chain.TON, chainParams.tonParams);
    cToP.set(Chain.TERRA, chainParams.terraParams);
    cToP.set(Chain.APTOS, chainParams.aptosParams);
    cToP.set(Chain.ICP, chainParams.icpParams);
    cToP.set(Chain.NEAR, chainParams.nearParams);
    cToP.set(Chain.MOONBEAM, chainParams.moonbeamParams);
    cToP.set(Chain.BLAST, chainParams.blastParams);
    cToP.set(Chain.FANTOM, chainParams.fantomParams);
    cToP.set(Chain.AVALANCHE, chainParams.avaxParams);
    return cToP;
}
function ChainFactory(cp) {
    const map = mapNonceToParams(cp);
    const helpers = new Map();
    return {
        async lockNft(sourceChain, signer, sourceNftContractAddress, destinationChain, to, tokenId, metadataUri, extraArgs) {
            const destination = await this.inner(destinationChain);
            const valid = await destination.validateAddress(to);
            if (!valid) {
                throw new Error("Invalid destination user address");
            }
            const lock = await sourceChain.lockNft(signer, sourceNftContractAddress, destinationChain, to, tokenId, metadataUri, extraArgs);
            return lock;
        },
        async lockSft(sourceChain, signer, sourceNftContractAddress, destinationChain, to, tokenId, amt, metadataUri, extraArgs) {
            const destination = await this.inner(destinationChain);
            const valid = await destination.validateAddress(to);
            if (!valid) {
                throw new Error("Invalid destination user address");
            }
            if (!("claimSft" in destination)) {
                throw new Error("Destination chain does not support SFTs .");
            }
            const lock = await sourceChain.lockSft(signer, sourceNftContractAddress, destinationChain, to, tokenId, amt, metadataUri, extraArgs);
            return lock;
        },
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
            const storage = chain.getStorageContract();
            const data = await chain.decodeLockedEvent(txHash);
            const royaltyReceiver = await storage.chainRoyalty(data.destinationChain);
            const fee = await storage.chainFee(data.destinationChain);
            const sc = await this.inner(data.sourceChain);
            const ogNftData = await sc.nftData(data.tokenId, data.sourceNftContractAddress, undefined);
            if (data.destinationChain === "MULTIVERSX") {
                ogNftData.name = ogNftData.name.replace(/[^a-zA-Z0-9]/g, "");
                ogNftData.symbol = ogNftData.symbol
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .toUpperCase()
                    .substring(0, 8);
            }
            let convertedTokenId = data.tokenId;
            if (data.sourceChain === "SECRET") {
                if (chain.identifier === "SECRET") {
                    convertedTokenId = (0, utils_1.convertStringToHexToNumb)(data.tokenId);
                }
                else if (data.destinationChain === "SECRET") {
                    convertedTokenId = (0, utils_1.convertNumbToHexToString)(data.tokenId);
                }
            }
            const metadata = ogNftData.metadata || data.metaDataUri;
            const imgUri = (await (0, utils_1.fetchHttpOrIpfs)(metadata)).image;
            return {
                ...data,
                ...ogNftData,
                metadata,
                tokenId: convertedTokenId,
                royalty: ogNftData.royalty.toString(),
                royaltyReceiver: royaltyReceiver,
                fee: fee.toString(),
                imgUri,
                lockTxChain: chain.identifier,
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
exports.CHAIN_INFO.set(Chain.BASE, {
    constructor: evm_1.evmHandler,
});
exports.CHAIN_INFO.set(Chain.MOONBEAM, {
    constructor: evm_1.evmHandler,
});
exports.CHAIN_INFO.set(Chain.HEDERA, {
    constructor: hedera_1.hederaHandler,
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
exports.CHAIN_INFO.set(Chain.APTOS, {
    constructor: aptos_1.aptosHandler,
});
exports.CHAIN_INFO.set(Chain.ICP, {
    constructor: icp_1.icpHandler,
});
exports.CHAIN_INFO.set(Chain.NEAR, {
    constructor: near_1.nearHandler,
});
exports.CHAIN_INFO.set(Chain.BLAST, {
    constructor: evm_1.evmHandler,
});
exports.CHAIN_INFO.set(Chain.FANTOM, {
    constructor: evm_1.evmHandler,
});
exports.CHAIN_INFO.set(Chain.AVALANCHE, {
    constructor: evm_1.evmHandler,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mYWN0b3J5L2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsNkNBQWlEO0FBQ2pELG1EQUF1RDtBQUN2RCx5Q0FBNkM7QUFDN0MsK0NBQW1EO0FBQ25ELHlDQUE2QztBQUM3Qyx1REFBMkQ7QUFDM0QsMkNBQStDO0FBQy9DLCtDQUFtRDtBQUNuRCw2Q0FBaUQ7QUFDakQseUNBQW9EO0FBQ3BELDZDQUkyQjtBQUczQixJQUFpQixLQUFLLENBa0JyQjtBQWxCRCxXQUFpQixLQUFLO0lBQ1AsZ0JBQVUsR0FBRyxZQUFZLENBQUM7SUFDMUIsWUFBTSxHQUFHLFFBQVEsQ0FBQztJQUNsQixTQUFHLEdBQUcsS0FBSyxDQUFDO0lBQ1osU0FBRyxHQUFHLEtBQUssQ0FBQztJQUNaLFNBQUcsR0FBRyxLQUFLLENBQUM7SUFDWixXQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ2hCLFdBQUssR0FBRyxPQUFPLENBQUM7SUFDaEIsV0FBSyxHQUFHLE9BQU8sQ0FBQztJQUNoQixZQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ2xCLFdBQUssR0FBRyxPQUFPLENBQUM7SUFDaEIsU0FBRyxHQUFHLEtBQUssQ0FBQztJQUNaLFVBQUksR0FBRyxNQUFNLENBQUM7SUFDZCxVQUFJLEdBQUcsTUFBTSxDQUFDO0lBQ2QsY0FBUSxHQUFHLFVBQVUsQ0FBQztJQUN0QixXQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ2hCLFlBQU0sR0FBRyxRQUFRLENBQUM7SUFDbEIsZUFBUyxHQUFHLFdBQVcsQ0FBQztBQUN2QyxDQUFDLEVBbEJnQixLQUFLLHFCQUFMLEtBQUssUUFrQnJCO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxXQUFrQztJQUMxRCxNQUFNLElBQUksR0FBYyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2pELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2pELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLEtB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