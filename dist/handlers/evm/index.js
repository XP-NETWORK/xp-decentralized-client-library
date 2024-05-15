"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmHandler = void 0;
const evm_1 = require("../../contractsTypes/evm");
const utils_1 = require("../utils");
function evmHandler({ provider, bridge, royaltySalePrice, storage, }) {
    return {
        async claimNft(wallet, claimData, sigs, extraArgs) {
            const contract = evm_1.Bridge__factory.connect(bridge, wallet);
            const ret = await contract.claimNFT721(claimData, sigs.map((e) => e.signature), {
                ...extraArgs,
                value: claimData.fee,
            });
            return {
                ret: ret,
                hash: () => ret.hash,
            };
        },
        async readClaimed721Event(hash) {
            const receipt = await provider.getTransactionReceipt(hash);
            if (!receipt) {
                throw new Error("Transaction not found");
            }
            const log = receipt.logs.find((e) => e.topics.includes(evm_1.Bridge__factory.createInterface().getEvent("Claimed721").topicHash));
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
                transaction_hash: claimed.args.transactionHash,
            };
        },
        async readClaimed1155Event(hash) {
            const receipt = await provider.getTransactionReceipt(hash);
            if (!receipt) {
                throw new Error("Transaction not found");
            }
            const log = receipt.logs.find((e) => e.topics.includes(evm_1.Bridge__factory.createInterface().getEvent("Claim1155").topicHash));
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
                transaction_hash: claimed.args.transactionHash,
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
        async claimSft(wallet, claimData, sigs, extraArgs) {
            const contract = evm_1.Bridge__factory.connect(bridge, wallet);
            const ret = await contract.claimNFT1155(claimData, sigs.map((e) => e.signature), {
                ...extraArgs,
                value: claimData.fee,
            });
            return {
                ret,
                hash: () => ret.hash,
            };
        },
        async lockNft(signer, sourceNftAddress, destinationChain, to, tokenId, extraArgs) {
            const contract = evm_1.Bridge__factory.connect(bridge, signer);
            const tx = await contract.lock721(tokenId.toString(), destinationChain, to, sourceNftAddress, {
                ...extraArgs,
            });
            return {
                ret: tx,
                hash() {
                    return tx.hash;
                },
            };
        },
    };
}
exports.evmHandler = evmHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvZXZtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtEQUdrQztBQUNsQyxvQ0FBbUM7QUFJbkMsU0FBZ0IsVUFBVSxDQUFDLEVBQ3pCLFFBQVEsRUFDUixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLE9BQU8sR0FDSTtJQUNYLE9BQU87UUFDTCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVM7WUFDL0MsTUFBTSxRQUFRLEdBQUcscUJBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pELE1BQU0sR0FBRyxHQUFHLE1BQU0sUUFBUSxDQUFDLFdBQVcsQ0FDcEMsU0FBUyxFQUNULElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFDNUI7Z0JBQ0UsR0FBRyxTQUFTO2dCQUNaLEtBQUssRUFBRSxTQUFTLENBQUMsR0FBRzthQUNyQixDQUNGLENBQUM7WUFDRixPQUFPO2dCQUNMLEdBQUcsRUFBRSxHQUFHO2dCQUNSLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSTthQUNyQixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJO1lBQzVCLE1BQU0sT0FBTyxHQUFHLE1BQU0sUUFBUSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDYixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUNELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDbEMs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