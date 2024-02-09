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
                royalty: (await nft.royaltyInfo("", royaltySalePrice))[1],
                metadata: await nft.tokenURI(tokenId),
            };
        },
        lockSft(signer, sourceNftAddress, destinationChain, to, tokenId, amt, extraArgs) {
            const contract = contractsTypes_1.Bridge__factory.connect(bridge, signer);
            return contract.lock1155(tokenId.toString(), destinationChain, to, sourceNftAddress, amt, extraArgs);
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
        lockNft(signer, sourceNftAddress, destinationChain, to, tokenId, extraArgs) {
            const contract = contractsTypes_1.Bridge__factory.connect(bridge, signer);
            return contract.lock721(tokenId.toString(), destinationChain, to, sourceNftAddress, extraArgs);
        },
    };
}
exports.evmHandler = evmHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhbmRsZXJzL2V2bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFNQSxzREFLMkI7QUFrQjNCLFNBQWdCLFVBQVUsQ0FBQyxFQUN6QixRQUFRLEVBQ1IsTUFBTSxFQUNOLGdCQUFnQixFQUNoQixPQUFPLEdBQ0c7SUFDVixPQUFPO1FBQ0wsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUk7WUFDekMsTUFBTSxRQUFRLEdBQUcsZ0NBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pELE9BQU8sUUFBUSxDQUFDLFlBQVksQ0FDMUIsU0FBUyxFQUNULElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFDNUIsU0FBUyxDQUNWLENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNO1lBQ3ZCLE1BQU0sT0FBTyxHQUFHLE1BQU0sUUFBUSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDYixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUNELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDbEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQ2YsZ0NBQWUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUMvRCxDQUNGLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQzFDLENBQUM7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