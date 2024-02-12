"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmHandler = void 0;
const contractsTypes_1 = require("../contractsTypes");
function evmHandler({ provider, bridge, royaltySalePrice, storage, }) {
    return {
        claimNft(wallet, claimData, extraArgs, sigs) {
            const contract = contractsTypes_1.Bridge__factory.connect(bridge, wallet);
            return contract.claimNFT1155(claimData, sigs.map((e) => e.signature), extraArgs);
        },
        getProvider() {
            return provider;
        },
        async getClaimData(txHash) {
            const receipt = await provider.getTransactionReceipt(txHash);
            if (!receipt) {
                throw new Error("Transaction not found");
            }
            const log = receipt.logs.find((e) => e.topics.includes(contractsTypes_1.Bridge__factory.createInterface().getEvent("Locked").topicHash));
            if (!log) {
                throw new Error("Lock event not found");
            }
            const locked = contractsTypes_1.Bridge__factory.createInterface().parseLog({
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
        async nftData(tokenId, contract, overrides) {
            const nft = contractsTypes_1.ERC721Royalty__factory.connect(contract, provider);
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
            const contract = contractsTypes_1.Bridge__factory.connect(bridge, signer);
            const tx = await contract.lock1155(tokenId.toString(), destinationChain, to, sourceNftAddress, amt, extraArgs);
            return {
                tx,
                hash() {
                    return tx.hash;
                },
            };
        },
        async approveNft(signer, tokenId, contract, extraArgs) {
            return contractsTypes_1.ERC721Royalty__factory.connect(contract, signer).approve(bridge, tokenId, {
                ...extraArgs,
            });
        },
        claimSft(wallet, claimData, sigs, extraArgs) {
            const contract = contractsTypes_1.Bridge__factory.connect(bridge, wallet);
            return contract.claimNFT1155(claimData, sigs.map((e) => e.signature), extraArgs);
        },
        async lockNft(signer, sourceNftAddress, destinationChain, to, tokenId, extraArgs) {
            const contract = contractsTypes_1.Bridge__factory.connect(bridge, signer);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhbmRsZXJzL2V2bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSxzREFLMkI7QUFtQjNCLFNBQWdCLFVBQVUsQ0FBQyxFQUN6QixRQUFRLEVBQ1IsTUFBTSxFQUNOLGdCQUFnQixFQUNoQixPQUFPLEdBQ0k7SUFDWCxPQUFPO1FBQ0wsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUk7WUFDekMsTUFBTSxRQUFRLEdBQUcsZ0NBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pELE9BQU8sUUFBUSxDQUFDLFlBQVksQ0FDMUIsU0FBUyxFQUNULElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFDNUIsU0FBUyxDQUNWLENBQUM7UUFDSixDQUFDO1FBQ0QsV0FBVztZQUNULE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU07WUFDdkIsTUFBTSxPQUFPLEdBQUcsTUFBTSxRQUFRLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBQ0QsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUNsQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FDZixnQ0FBZSxDQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQy9ELENBQ0YsQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDVCxNQUFNLElB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