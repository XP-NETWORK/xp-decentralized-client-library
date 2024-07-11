"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHederaSigner = exports.hederaHandler = void 0;
const sdk_1 = require("@hashgraph/sdk");
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
                // throw new Error("unimplemented");
                const tx = await new sdk_1.ContractExecuteTransaction()
                    .setContractId(sdk_1.ContractId.fromString(bridge))
                    .setGas(1500000)
                    .setFunction("claimNFT721", new sdk_1.ContractFunctionParameters().addStringArray(sigs.map((e) => e.signature)))
                    .freezeWithSigner(wallet);
                const response = await tx.executeWithSigner(wallet);
                return {
                    ret: response,
                    hash() {
                        return response.transactionHash.toString();
                    },
                };
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
    return "accountToSign" in signer;
}
exports.isHederaSigner = isHederaSigner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaGVkZXJhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUt3QjtBQUN4QixtQ0FBa0Q7QUFDbEQsK0ZBQTRGO0FBQzVGLDZGQUEwRjtBQUMxRiw2RUFBMEU7QUFDMUUsa0RBR2tDO0FBQ2xDLGdDQUFvQztBQUNwQyxnQ0FBK0I7QUFHL0IsU0FBZ0IsYUFBYSxDQUFDLEVBQzVCLFFBQVEsRUFDUixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLE9BQU8sRUFDUCxVQUFVLEVBQ1YsTUFBTSxHQUNRO0lBQ2QsTUFBTSxLQUFLLEdBQUcsK0NBQXNCLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRSxNQUFNLFVBQVUsR0FBRyxJQUFBLGdCQUFVLEVBQUM7UUFDNUIsUUFBUTtRQUNSLE1BQU07UUFDTixnQkFBZ0I7UUFDaEIsT0FBTztRQUNQLFVBQVU7S0FDWCxDQUFDLENBQUM7SUFDSCxPQUFPO1FBQ0wsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVM7WUFDdkMsTUFBTSxJQUFJLEdBQUcsNkJBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5RCxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QixNQUFNLElBQUksR0FBRyxNQUFNLEtBQUs7aUJBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUM7aUJBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRTtnQkFDckMsS0FBSyxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUM5QixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsR0FBRyxTQUFTO2FBQ2IsQ0FBQyxDQUFDO1lBQ0wsT0FBTyxDQUFDLEdBQUcs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