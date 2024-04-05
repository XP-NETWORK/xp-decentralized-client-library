"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmHandler = void 0;
const evm_1 = require("../../contractsTypes/evm");
const utils_1 = require("../utils");
function evmHandler({ provider, bridge, royaltySalePrice, storage, }) {
    return {
        claimNft(wallet, claimData, sigs, extraArgs) {
            const contract = evm_1.Bridge__factory.connect(bridge, wallet);
            return contract.claimNFT721(claimData, sigs.map((e) => e.signature), {
                ...extraArgs,
                value: claimData.fee,
            });
        },
        async readClaimed721Event(hash) {
            const receipt = await provider.getTransactionReceipt(hash);
            if (!receipt) {
                throw new Error("Transaction not found");
            }
            const log = receipt.logs.find((e) => e.topics.includes(evm_1.Bridge__factory.createInterface().getEvent("Claimed").topicHash));
            if (!log) {
                throw new Error("Log not found");
            }
            const claimed = evm_1.Bridge__factory.createInterface().parseLog({
                data: log.data,
                topics: log.topics,
            });
            if (!claimed) {
                throw new Error("Failed to parse log");
            }
            return {
                nft_contract: claimed.args.nftContract,
                source_chain: claimed.args.sourceChain,
                token_id: claimed.args.tokenId,
                transaction_hash: claimed.args.transaction_hash,
            };
        },
        async readClaimed1155Event(hash) {
            const receipt = await provider.getTransactionReceipt(hash);
            if (!receipt) {
                throw new Error("Transaction not found");
            }
            const log = receipt.logs.find((e) => e.topics.includes(evm_1.Bridge__factory.createInterface().getEvent("Claimed").topicHash));
            if (!log) {
                throw new Error("Log not found");
            }
            const claimed = evm_1.Bridge__factory.createInterface().parseLog({
                data: log.data,
                topics: log.topics,
            });
            if (!claimed) {
                throw new Error("Failed to parse log");
            }
            return {
                nft_contract: claimed.args.nftContract,
                source_chain: claimed.args.sourceChain,
                token_id: claimed.args.tokenId,
                transaction_hash: claimed.args.transaction_hash,
                amount: claimed.args.amount,
            };
        },
        async deployCollection(signer, da, ga) {
            const contract = await new evm_1.ERC721Royalty__factory(signer).deploy(da.name, da.symbol, da.owner ?? signer, {
                ...ga,
                from: await signer.getAddress(),
            });
            return await contract.getAddress();
        },
        async mintNft(signer, ma, gas) {
            const minter = evm_1.ERC721Royalty__factory.connect(ma.contract, signer);
            const response = await minter.mint(await signer.getAddress(), ma.tokenId, ma.royalty, ma.royaltyReceiver, ma.uri, {
                ...gas,
            });
            await response.wait();
            return response;
        },
        getProvider() {
            return provider;
        },
        async getClaimData(txHash) {
            const receipt = await provider.getTransactionReceipt(txHash);
            if (!receipt) {
                throw new Error("Transaction not found");
            }
            const log = receipt.logs.find((e) => e.topics.includes(evm_1.Bridge__factory.createInterface().getEvent("Locked").topicHash));
            if (!log) {
                throw new Error("Lock event not found");
            }
            const locked = evm_1.Bridge__factory.createInterface().parseLog({
                data: log.data,
                topics: log.topics,
            });
            if (!locked) {
                throw new Error("Failed to parse log");
            }
            const fee = await storage.chainFee(locked.args.destinationChain);
            const royaltyReceiver = await storage.chainRoyalty(locked.args.destinationChain);
            const data = await this.nftData(locked.args.tokenId, locked.args.sourceNftContractAddress, {});
            return {
                destinationChain: locked.args.destinationChain,
                destinationUserAddress: locked.args.destinationUserAddress,
                sourceNftContractAddress: locked.args.sourceNftContractAddress,
                tokenId: locked.args.tokenId.toString(),
                tokenAmount: locked.args.tokenAmount.toString(),
                nftType: locked.args.nftType,
                sourceChain: locked.args.sourceChain,
                fee: fee.toString(),
                royaltyReceiver: royaltyReceiver,
                transactionHash: txHash,
                metadata: data.metadata,
                name: data.name,
                symbol: data.symbol,
                royalty: data.royalty.toString(),
            };
        },
        getBalance(signer) {
            return provider.getBalance(signer);
        },
        transform(input) {
            return { ...input };
        },
        getStorageContract() {
            return storage;
        },
        async getValidatorCount() {
            return Number(await evm_1.Bridge__factory.connect(bridge, provider).validatorsCount());
        },
        async nftData(tokenId, contract, overrides) {
            const nft = evm_1.ERC721Royalty__factory.connect(contract, provider);
            const code = await provider.getCode(contract).catch(() => "");
            const name = await (0, utils_1.retryFn)(() => nft.name({ ...overrides }), `Trying to fetch name() for ${contract}`, nft.name.fragment.selector, code);
            const symbol = await (0, utils_1.retryFn)(() => nft.symbol(), `Trying to fetch symbol() for ${contract}`, nft.symbol.fragment.selector, code);
            const royalty = await (0, utils_1.retryFn)(() => nft.royaltyInfo(tokenId, royaltySalePrice), `Trying to fetch royaltyInfo() for ${contract}`, nft.royaltyInfo.fragment.selector, code);
            const metadata = await (0, utils_1.retryFn)(() => nft.tokenURI(tokenId), `Trying to fetch tokenURI() for ${contract}`, nft.tokenURI.fragment.selector, code);
            return {
                name: name || "XP Wrapped Nft",
                symbol: symbol || "XPNFT",
                // If undefined, set royalty as zero.
                royalty: (royalty ?? [0n, 0n])[1],
                metadata: metadata || "",
            };
        },
        async lockSft(signer, sourceNftAddress, destinationChain, to, tokenId, amt, extraArgs) {
            const contract = evm_1.Bridge__factory.connect(bridge, signer);
            const tx = await contract.lock1155(tokenId.toString(), destinationChain, to, sourceNftAddress, amt, {
                ...extraArgs,
            });
            return {
                tx,
                hash() {
                    return tx.hash;
                },
            };
        },
        async approveNft(signer, tokenId, contract, extraArgs) {
            return evm_1.ERC721Royalty__factory.connect(contract, signer).approve(bridge, tokenId, {
                ...extraArgs,
            });
        },
        claimSft(wallet, claimData, sigs, extraArgs) {
            const contract = evm_1.Bridge__factory.connect(bridge, wallet);
            return contract.claimNFT1155(claimData, sigs.map((e) => e.signature), {
                ...extraArgs,
                value: claimData.fee,
            });
        },
        async lockNft(signer, sourceNftAddress, destinationChain, to, tokenId, extraArgs) {
            const contract = evm_1.Bridge__factory.connect(bridge, signer);
            const tx = await contract.lock721(tokenId.toString(), destinationChain, to, sourceNftAddress, {
                ...extraArgs,
            });
            return {
                tx,
                hash() {
                    return tx.hash;
                },
            };
        },
    };
}
exports.evmHandler = evmHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvZXZtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtEQUdrQztBQUNsQyxvQ0FBbUM7QUFJbkMsU0FBZ0IsVUFBVSxDQUFDLEVBQ3pCLFFBQVEsRUFDUixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLE9BQU8sR0FDSTtJQUNYLE9BQU87UUFDTCxRQUFRLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUztZQUN6QyxNQUFNLFFBQVEsR0FBRyxxQkFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDekQsT0FBTyxRQUFRLENBQUMsV0FBVyxDQUN6QixTQUFTLEVBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUM1QjtnQkFDRSxHQUFHLFNBQVM7Z0JBQ1osS0FBSyxFQUFFLFNBQVMsQ0FBQyxHQUFHO2FBQ3JCLENBQ0YsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSTtZQUM1QixNQUFNLE9BQU8sR0FBRyxNQUFNLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQzNDLENBQUM7WUFDRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQ2xDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUNmLHFCQUFlLENBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FDaEUsQ0FDRixDQUFDO1lBQ0YsSUFBSSxD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