"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmHandler = void 0;
const evm_1 = require("../../contractsTypes/evm");
function evmHandler({ provider, bridge, royaltySalePrice, storage, }) {
    return {
        claimNft(wallet, claimData, extraArgs, sigs) {
            const contract = evm_1.Bridge__factory.connect(bridge, wallet);
            return contract.claimNFT1155(claimData, sigs.map((e) => e.signature), extraArgs);
        },
        async deployCollection(signer, da, ga) {
            const contract = await new evm_1.ERC721Royalty__factory(signer).deploy(da.name, da.symbol, da.owner ?? signer, {
                ...ga,
                from: await signer.getAddress(),
            });
            return await contract.getAddress();
        },
        async mintNft(signer, ma) {
            const minter = evm_1.ERC721Royalty__factory.connect(ma.contract, signer);
            return minter.mint(await signer.getAddress(), ma.tokenId, ma.royalty, ma.royaltyReceiver, ma.uri);
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
                tokenId: locked.args.tokenId,
                tokenAmount: locked.args.tokenAmount,
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
            return {
                name: await nft.name({
                    ...overrides,
                }),
                symbol: await nft.symbol(),
                royalty: (await nft.royaltyInfo(tokenId, royaltySalePrice))[1],
                metadata: await nft.tokenURI(tokenId),
            };
        },
        async lockSft(signer, sourceNftAddress, destinationChain, to, tokenId, amt, extraArgs) {
            const contract = evm_1.Bridge__factory.connect(bridge, signer);
            const tx = await contract.lock1155(tokenId.toString(), destinationChain, to, sourceNftAddress, amt, extraArgs);
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
            return contract.claimNFT1155(claimData, sigs.map((e) => e.signature), extraArgs);
        },
        async lockNft(signer, sourceNftAddress, destinationChain, to, tokenId, extraArgs) {
            const contract = evm_1.Bridge__factory.connect(bridge, signer);
            const tx = await contract.lock721(tokenId.toString(), destinationChain, to, sourceNftAddress, extraArgs);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvZXZtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtEQUdrQztBQUlsQyxTQUFnQixVQUFVLENBQUMsRUFDekIsUUFBUSxFQUNSLE1BQU0sRUFDTixnQkFBZ0IsRUFDaEIsT0FBTyxHQUNJO0lBQ1gsT0FBTztRQUNMLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJO1lBQ3pDLE1BQU0sUUFBUSxHQUFHLHFCQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN6RCxPQUFPLFFBQVEsQ0FBQyxZQUFZLENBQzFCLFNBQVMsRUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQzVCLFNBQVMsQ0FDVixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLDRCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FDOUQsRUFBRSxDQUFDLElBQUksRUFDUCxFQUFFLENBQUMsTUFBTSxFQUNULEVBQUUsQ0FBQyxLQUFLLElBQUksTUFBTSxFQUNsQjtnQkFDRSxHQUFHLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDLFVBQVUsRUFBRTthQUNoQyxDQUNGLENBQUM7WUFDRixPQUFPLE1BQU0sUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3RCLE1BQU0sTUFBTSxHQUFHLDRCQUFzQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxD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