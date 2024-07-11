"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHederaSigner = exports.hederaHandler = void 0;
const ethers_1 = require("ethers");
const ContractProxy__factory_1 = require("../../contractsTypes/Hedera/ContractProxy__factory");
const HederaBridge__factory_1 = require("../../contractsTypes/Hedera/HederaBridge__factory");
const IHRC__factory_1 = require("../../contractsTypes/Hedera/IHRC__factory");
const evm_1 = require("../../contractsTypes/evm");
const evm_2 = require("../evm");
const ton_1 = require("../ton");
function hederaHandler({ provider, royaltySalePrice, royaltyProxy, storage, identifier, bridge, }) {
    const proxy = ContractProxy__factory_1.ContractProxy__factory.connect(royaltyProxy, provider);
    const web3Helper = (0, evm_2.evmHandler)({
        provider,
        bridge,
        royaltySalePrice,
        storage,
        identifier,
    });
    return {
        async mintNft(signer, mintArgs, extraArgs) {
            const ihrc = IHRC__factory_1.IHRC__factory.connect(mintArgs.contract, signer);
            await ihrc.associate();
            const mint = await proxy
                .connect(signer)
                .mint(mintArgs.contract, mintArgs.uri, {
                value: ethers_1.ethers.parseEther("10"),
                gasLimit: 15000000,
                ...extraArgs,
            });
            console.log(mint);
            return mint;
        },
        getClaimData: web3Helper.getClaimData,
        getProvider: web3Helper.getProvider,
        transform: web3Helper.transform,
        getValidatorCount: web3Helper.getValidatorCount,
        getStorageContract: web3Helper.getStorageContract,
        async readClaimed721Event(hash) {
            const receipt = await provider.getTransactionReceipt(hash);
            if (!receipt)
                (0, ton_1.raise)("Transaction not found");
            const intf = HederaBridge__factory_1.HederaBridge__factory.createInterface();
            const log = receipt.logs.find((e) => e.topics.includes(intf.getEvent("Claimed").topicHash));
            if (!log)
                (0, ton_1.raise)("Log not found");
            const claimed = intf.parseLog({
                data: log.data,
                topics: log.topics,
            });
            if (!claimed)
                (0, ton_1.raise)("Failed to parse Log");
            return {
                nft_contract: claimed.args.nftContract,
                source_chain: claimed.args.sourceChain,
                token_id: claimed.args.emittedTokenId,
                transaction_hash: claimed.args.transactionHash,
            };
        },
        async claimNft(wallet, claimData, sigs, extraArgs) {
            if (isHederaSigner(wallet)) {
                throw new Error("unimplemented");
            }
            const contract = evm_1.Bridge__factory.connect(bridge, wallet);
            const ret = await contract.claimNFT721(claimData, sigs.map((e) => e.signature), {
                value: BigInt(claimData.fee) * BigInt(1e10),
                ...extraArgs,
            });
            return {
                ret: ret,
                hash: () => ret.hash,
            };
        },
        getBalance(signer) {
            if (isHederaSigner(signer)) {
                throw new Error("unimplemented");
            }
            return provider.getBalance(signer);
        },
        async approveNft(signer, tid, contract, extra) {
            if (isHederaSigner(signer)) {
                throw new Error("unimplemented");
            }
            return evm_1.ERC721Royalty__factory.connect(contract, signer).approve(bridge, tid, {
                ...extra,
            });
        },
        async deployCollection(signer, da, ga) {
            const rif = proxy.connect(signer);
            const deploy = await rif.deployNft(da.name, da.symbol, {
                ...ga,
                value: ethers_1.ethers.parseEther("10"),
            });
            const receipt = await deploy.wait();
            const ev = receipt?.logs.find((e) => {
                if (e instanceof ethers_1.EventLog) {
                    const a = e.eventName === "NftCollectionCreated";
                    return a;
                }
                return false;
            });
            const address = ev.args[0];
            return address;
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, extraArgs) {
            if (isHederaSigner(signer)) {
                throw new Error("unimplemented");
            }
            const contract = evm_1.Bridge__factory.connect(bridge, signer);
            const tx = await contract.lock721(tokenId.toString(), destinationChain, to, sourceNft, {
                ...extraArgs,
            });
            return {
                ret: tx,
                hash() {
                    return tx.hash;
                },
            };
        },
        async nftData(tokenId, contract, overrides) {
            const nft = evm_1.ERC721Royalty__factory.connect(contract, provider);
            const name = await retryFn(() => nft.name({ ...overrides }), `Trying to fetch name() for ${contract}`);
            const symbol = await retryFn(() => nft.symbol(), `Trying to fetch symbol() for ${contract}`);
            const rif = ContractProxy__factory_1.ContractProxy__factory.connect(royaltyProxy, provider);
            const tokenInfo = await retryFn(() => rif.royaltyInfo.staticCall(tokenId, royaltySalePrice), `Trying to fetch royaltyInfo() for ${contract}`);
            const metadata = await retryFn(() => nft.tokenURI(tokenId), `Trying to fetch tokenURI() for ${contract}`);
            const rinfo = tokenInfo?.[1].tokenInfo[7][0];
            // If undefined, set royalty as zero.
            const royalty = rinfo?.numerator ?? 0n;
            return {
                name: name || "XP Wrapped Nft",
                symbol: symbol || "XPNFT",
                royalty: royalty,
                metadata: metadata || "",
            };
        },
    };
}
exports.hederaHandler = hederaHandler;
const retryFn = async (func, ctx, retries = 3) => {
    if (retries === 0) {
        return undefined;
    }
    try {
        return await func();
    }
    catch (e) {
        return await retryFn(func, ctx, retries - 1);
    }
};
function isHederaSigner(signer) {
    return "getMirrorNetwork" in signer;
}
exports.isHederaSigner = isHederaSigner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaGVkZXJhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUFrRDtBQUNsRCwrRkFBNEY7QUFDNUYsNkZBQTBGO0FBQzFGLDZFQUEwRTtBQUMxRSxrREFHa0M7QUFDbEMsZ0NBQW9DO0FBQ3BDLGdDQUErQjtBQUcvQixTQUFnQixhQUFhLENBQUMsRUFDNUIsUUFBUSxFQUNSLGdCQUFnQixFQUNoQixZQUFZLEVBQ1osT0FBTyxFQUNQLFVBQVUsRUFDVixNQUFNLEdBQ1E7SUFDZCxNQUFNLEtBQUssR0FBRywrQ0FBc0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sVUFBVSxHQUFHLElBQUEsZ0JBQVUsRUFBQztRQUM1QixRQUFRO1FBQ1IsTUFBTTtRQUNOLGdCQUFnQjtRQUNoQixPQUFPO1FBQ1AsVUFBVTtLQUNYLENBQUMsQ0FBQztJQUNILE9BQU87UUFDTCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUztZQUN2QyxNQUFNLElBQUksR0FBRyw2QkFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzlELE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSztpQkFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQztpQkFDZixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsR0FBRyxFQUFFO2dCQUNyQyxLQUFLLEVBQUUsZUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7Z0JBQzlCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixHQUFHLFNBQVM7YUFDYixDQUFDLENBQUM7WUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FB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