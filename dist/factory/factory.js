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
            const imgUri = (await (0, utils_1.fetchHttpOrIpfs)(ogNftData.metadata)).image;
            return {
                ...data,
                ...ogNftData,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mYWN0b3J5L2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsNkNBQWlEO0FBQ2pELG1EQUF1RDtBQUN2RCx5Q0FBNkM7QUFDN0MsK0NBQW1EO0FBQ25ELHlDQUE2QztBQUM3Qyx1REFBMkQ7QUFDM0QsMkNBQStDO0FBQy9DLCtDQUFtRDtBQUNuRCw2Q0FBaUQ7QUFDakQseUNBQW9EO0FBQ3BELDZDQUFvRDtBQUdwRCxJQUFpQixLQUFLLENBY3JCO0FBZEQsV0FBaUIsS0FBSztJQUNQLGdCQUFVLEdBQUcsWUFBWSxDQUFDO0lBQzFCLFlBQU0sR0FBRyxRQUFRLENBQUM7SUFDbEIsU0FBRyxHQUFHLEtBQUssQ0FBQztJQUNaLFNBQUcsR0FBRyxLQUFLLENBQUM7SUFDWixTQUFHLEdBQUcsS0FBSyxDQUFDO0lBQ1osV0FBSyxHQUFHLE9BQU8sQ0FBQztJQUNoQixXQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ2hCLFdBQUssR0FBRyxPQUFPLENBQUM7SUFDaEIsWUFBTSxHQUFHLFFBQVEsQ0FBQztJQUNsQixXQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ2hCLFNBQUcsR0FBRyxLQUFLLENBQUM7SUFDWixVQUFJLEdBQUcsTUFBTSxDQUFDO0lBQ2QsVUFBSSxHQUFHLE1BQU0sQ0FBQztBQUM3QixDQUFDLEVBZGdCLEtBQUsscUJBQUwsS0FBSyxRQWNyQjtBQUVELFNBQVMsZ0JBQWdCLENBQUMsV0FBa0M7SUFDMUQsTUFBTSxJQUFJLEdBQWMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLEVBQXlCO0lBQ3BELE1BQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxFQUFrRCxDQUFDO0lBQzFFLE9BQU87UUFDTCxLQUFLLENBQUMsT0FBTyxDQUNYLFdBQVcsRUFDWCxNQUFNLEVBQ04sd0JBQXdCLEVBQ3hCLGdCQUFnQixFQUNoQixFQUFFLEVBQ0YsT0FBTyxFQUNQLFdBQVcsRUFDWCxTQUFTO1lBRVQsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDdkQsTUFBTSxLQUFLLEdBQUcsTUFBTSxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDWCxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDdEQsQ0FBQztZQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sV0FBVyxDQUFDLE9BQU8sQ0FDcEMsTUFBTSxFQUNOLHdCQUF3QixFQUN4QixnQkFBZ0IsRUFDaEIsRUFBRSxFQUNGLE9BQU8sRUFDUCxXQUFXLEVBQ1gsU0FBUyxDQUNWLENBQUM7WUFDRixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUs7WUFDZixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ1gsT0FBTyxNQUFNLENBQUM7WUFDaEIsQ0FBQztZQUNELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksSUFBQSxXQUFLLEVBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUN0RSxNQUFNLEVBQUUsR0FBRyxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFBLFdBQUssRUFBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sT0FBTyxHQUFHLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QixPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTTtZQUM5QixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMzQyxNQUFNLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuRCxNQUFNLGVBQWUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDMUUsTUFBTSxHQUFHLEdBQUcsTUFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzFELE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FDekIsSUFBSSxDQUFDLFdBQXlDLENBQy9DLENBQUM7WUFDRixNQUFNLFNBQVMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQ2hDLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLHdCQUF3QixFQUM3QixTQUFTLENBQ1YsQ0FBQztZQUNGLE1BQU0sTUFBTSxHQUFHLENBQUMsTUFBTSxJQUFBLHVCQUFlLEVBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ2pFLE9BQU87Z0JBQ0wsR0FBRyxJQUFJO2dCQUNQLEdBQUcsU0FBUztnQkFDWixPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7Z0JBQ3JDLGVBQWUsRUFBRSxlQUFlO2dCQUNoQyxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRTtnQkFDbkIsTUFBTTtnQkFDTixXQUFXLEVBQUUsS0FBSyxDQUFDLFVBQVU7YUFDOUIsQ0FBQztRQUNKLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQWxFRCxvQ0FrRUM7QUFFWSxRQUFBLFVBQVUsR0FBZSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRWhELGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7SUFDeEIsV0FBVyxFQUFFLGdCQUFVO0NBQ3hCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7SUFDeEIsV0FBVyxFQUFFLGdCQUFVO0NBQ3hCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7SUFDMUIsV0FBVyxFQUFFLGdCQUFVO0NBQ3hCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7SUFDekIsV0FBVyxFQUFFLGdCQUFVO0NBQ3hCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7SUFDM0IsV0FBVyxFQUFFLHNCQUFhO0NBQzNCLENBQUMsQ0FBQztBQUNILGtCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7SUFDL0IsV0FBVyxFQUFFLDhCQUFpQjtDQUMvQixDQUFDLENBQUM7QUFDSCxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0lBQzNCLFdBQVcsRUFBRSxzQkFBYTtDQUMzQixDQUFDLENBQUM7QUFDSCxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO0lBQ3hCLFdBQVcsRUFBRSxnQkFBVTtDQUN4QixDQUFDLENBQUM7QUFDSCxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO0lBQzFCLFdBQVcsRUFBRSxvQkFBWTtDQUMxQixDQUFDLENBQUM7QUFDSCxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO0lBQzFCLFdBQVcsRUFBRSwwQkFBZTtDQUM3QixDQUFDLENBQUM7QUFDSCxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO0lBQzFCLFdBQVcsRUFBRSxvQkFBWTtDQUMxQixDQUFDLENBQUM7QUFDSCxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO0lBQ3hCLFdBQVcsRUFBRSxnQkFBVTtDQUN4QixDQUFDLENBQUM7QUFDSCxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3pCLFdBQVcsRUFBRSxrQkFBVztDQUN6QixDQUFDLENBQUMifQ==