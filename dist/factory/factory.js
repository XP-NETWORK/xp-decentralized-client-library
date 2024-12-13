"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_INFO = exports.ChainFactory = exports.Chain = void 0;
const aptos_1 = require("../handlers/aptos");
const casper_1 = require("../handlers/casper");
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
    Chain.ETHEREUM = "ETHEREUM";
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
    Chain.CASPER = "CASPER";
})(Chain || (exports.Chain = Chain = {}));
function mapNonceToParams(chainParams) {
    const cToP = new Map();
    cToP.set(Chain.MULTIVERSX, chainParams.multiversxParams);
    cToP.set(Chain.BSC, chainParams.bscParams);
    cToP.set(Chain.MATIC, chainParams.maticParams);
    cToP.set(Chain.BASE, chainParams.baseParams);
    cToP.set(Chain.HEDERA, chainParams.hederaParams);
    cToP.set(Chain.ETHEREUM, chainParams.ethParams);
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
    cToP.set(Chain.CASPER, chainParams.casperParams);
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
            let convertedTokenId = data.tokenId;
            if (data.sourceChain === "SECRET") {
                if (chain.identifier === "SECRET") {
                    convertedTokenId = (0, utils_1.convertStringToHexToNumb)(data.tokenId);
                }
                else if (data.destinationChain === "SECRET") {
                    convertedTokenId = (0, utils_1.convertNumbToHexToString)(data.tokenId);
                }
            }
            const ogNftData = await sc.nftData(data.sourceChain === "SECRET" ? convertedTokenId : data.tokenId, data.sourceNftContractAddress, undefined);
            if (data.destinationChain === "MULTIVERSX") {
                ogNftData.name = ogNftData.name.replace(/[^a-zA-Z0-9]/g, "");
                ogNftData.symbol = ogNftData.symbol
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .toUpperCase()
                    .substring(0, 8);
            }
            let metadata = "";
            if (data.sourceChain === "CASPER" || data.sourceChain === "SECRET") {
                metadata = data.metaDataUri;
            }
            else {
                metadata = ogNftData.metadata || data.metaDataUri;
            }
            if (data.destinationChain === "CASPER") {
                metadata = JSON.stringify({
                    token_uri: metadata,
                });
            }
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
exports.CHAIN_INFO.set(Chain.ETHEREUM, {
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
exports.CHAIN_INFO.set(Chain.CASPER, {
    constructor: casper_1.casperHandler,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mYWN0b3J5L2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsNkNBQWlEO0FBQ2pELCtDQUFtRDtBQUNuRCxtREFBdUQ7QUFDdkQseUNBQTZDO0FBQzdDLCtDQUFtRDtBQUNuRCx5Q0FBNkM7QUFDN0MsdURBQTJEO0FBQzNELDJDQUErQztBQUMvQywrQ0FBbUQ7QUFDbkQsNkNBQWlEO0FBQ2pELHlDQUFvRDtBQUNwRCw2Q0FJMkI7QUFHM0IsSUFBaUIsS0FBSyxDQW1CckI7QUFuQkQsV0FBaUIsS0FBSztJQUNQLGdCQUFVLEdBQUcsWUFBWSxDQUFDO0lBQzFCLFlBQU0sR0FBRyxRQUFRLENBQUM7SUFDbEIsU0FBRyxHQUFHLEtBQUssQ0FBQztJQUNaLGNBQVEsR0FBRyxVQUFVLENBQUM7SUFDdEIsU0FBRyxHQUFHLEtBQUssQ0FBQztJQUNaLFdBQUssR0FBRyxPQUFPLENBQUM7SUFDaEIsV0FBSyxHQUFHLE9BQU8sQ0FBQztJQUNoQixXQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ2hCLFlBQU0sR0FBRyxRQUFRLENBQUM7SUFDbEIsV0FBSyxHQUFHLE9BQU8sQ0FBQztJQUNoQixTQUFHLEdBQUcsS0FBSyxDQUFDO0lBQ1osVUFBSSxHQUFHLE1BQU0sQ0FBQztJQUNkLFVBQUksR0FBRyxNQUFNLENBQUM7SUFDZCxjQUFRLEdBQUcsVUFBVSxDQUFDO0lBQ3RCLFdBQUssR0FBRyxPQUFPLENBQUM7SUFDaEIsWUFBTSxHQUFHLFFBQVEsQ0FBQztJQUNsQixlQUFTLEdBQUcsV0FBVyxDQUFDO0lBQ3hCLFlBQU0sR0FBRyxRQUFRLENBQUM7QUFDakMsQ0FBQyxFQW5CZ0IsS0FBSyxxQkFBTCxLQUFLLFFBbUJyQjtBQUVELFNBQVMsZ0JBQWdCLENBQUMsV0FBa0M7SUFDMUQsTUFBTSxJQUFJLEdBQWMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsVUFB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