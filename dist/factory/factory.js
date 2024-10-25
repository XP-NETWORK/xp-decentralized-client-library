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
            const metadata = ogNftData.metadata || data.metaDataUri;
            const imgUri = (await (0, utils_1.fetchHttpOrIpfs)(metadata)).image;
            return {
                ...data,
                ...ogNftData,
                metadata,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mYWN0b3J5L2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsNkNBQWlEO0FBQ2pELG1EQUF1RDtBQUN2RCx5Q0FBNkM7QUFDN0MsK0NBQW1EO0FBQ25ELHlDQUE2QztBQUM3Qyx1REFBMkQ7QUFDM0QsMkNBQStDO0FBQy9DLCtDQUFtRDtBQUNuRCw2Q0FBaUQ7QUFDakQseUNBQW9EO0FBQ3BELDZDQUFvRDtBQUdwRCxJQUFpQixLQUFLLENBaUJyQjtBQWpCRCxXQUFpQixLQUFLO0lBQ1AsZ0JBQVUsR0FBRyxZQUFZLENBQUM7SUFDMUIsWUFBTSxHQUFHLFFBQVEsQ0FBQztJQUNsQixTQUFHLEdBQUcsS0FBSyxDQUFDO0lBQ1osU0FBRyxHQUFHLEtBQUssQ0FBQztJQUNaLFNBQUcsR0FBRyxLQUFLLENBQUM7SUFDWixXQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ2hCLFdBQUssR0FBRyxPQUFPLENBQUM7SUFDaEIsV0FBSyxHQUFHLE9BQU8sQ0FBQztJQUNoQixZQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ2xCLFdBQUssR0FBRyxPQUFPLENBQUM7SUFDaEIsU0FBRyxHQUFHLEtBQUssQ0FBQztJQUNaLFVBQUksR0FBRyxNQUFNLENBQUM7SUFDZCxVQUFJLEdBQUcsTUFBTSxDQUFDO0lBQ2QsY0FBUSxHQUFHLFVBQVUsQ0FBQztJQUN0QixXQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ2hCLFlBQU0sR0FBRyxRQUFRLENBQUM7QUFDakMsQ0FBQyxFQWpCZ0IsS0FBSyxxQkFBTCxLQUFLLFFBaUJyQjtBQUVELFNBQVMsZ0JBQWdCLENBQUMsV0FBa0M7SUFDMUQsTUFBTSxJQUFJLEdBQWMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FB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OEJBQWlCO0NBQy9CLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7SUFDM0IsV0FBVyxFQUFFLHNCQUFhO0NBQzNCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7SUFDeEIsV0FBVyxFQUFFLGdCQUFVO0NBQ3hCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7SUFDMUIsV0FBVyxFQUFFLG9CQUFZO0NBQzFCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7SUFDMUIsV0FBVyxFQUFFLDBCQUFlO0NBQzdCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7SUFDMUIsV0FBVyxFQUFFLG9CQUFZO0NBQzFCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7SUFDeEIsV0FBVyxFQUFFLGdCQUFVO0NBQ3hCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7SUFDekIsV0FBVyxFQUFFLGtCQUFXO0NBQ3pCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7SUFDMUIsV0FBVyxFQUFFLGdCQUFVO0NBQ3hCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7SUFDM0IsV0FBVyxFQUFFLGdCQUFVO0NBQ3hCLENBQUMsQ0FBQyJ9