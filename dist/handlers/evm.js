"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmHandler = void 0;
const contractsTypes_1 = require("../contractsTypes");
function evmHandler({ provider, bridge, royaltySalePrice, }) {
    return {
        claimNft(wallet, claimData, ex, sigs) {
            const contract = contractsTypes_1.Bridge__factory.connect(bridge, wallet);
            return contract.claimNFT1155(claimData, sigs.map((e) => e.signature), ex);
        },
        getBalance(signer) {
            return provider.getBalance(signer);
        },
        async nftData(signer, args, tokenId, contract) {
            const nft = contractsTypes_1.ERC721Royalty__factory.connect(contract, signer);
            return {
                name: await nft.name({
                    ...args,
                }),
                symbol: await nft.symbol(),
                royalty: (await nft.royaltyInfo("", royaltySalePrice))[1],
                metadata: await nft.tokenURI(tokenId),
            };
        },
        lockSft(signer, sourceNftAddress, destinationChain, to, tokenId, amt, ex) {
            const contract = contractsTypes_1.Bridge__factory.connect(bridge, signer);
            return contract.lock1155(tokenId.toString(), destinationChain, to, sourceNftAddress, amt, ex);
        },
        async approveNft(signer, tokenId, contract, ex) {
            return contractsTypes_1.ERC721Royalty__factory.connect(contract, signer).approve(bridge, tokenId, {
                ...ex,
            });
        },
        claimSft(wallet, claimData, sigs, ex) {
            const contract = contractsTypes_1.Bridge__factory.connect(bridge, wallet);
            return contract.claimNFT1155(claimData, sigs.map((e) => e.signature), ex);
        },
        lockNft(signer, sourceNftAddress, destinationChain, to, tokenId, ex) {
            const contract = contractsTypes_1.Bridge__factory.connect(bridge, signer);
            return contract.lock721(tokenId.toString(), destinationChain, to, sourceNftAddress, ex);
        },
    };
}
exports.evmHandler = evmHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhbmRsZXJzL2V2bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFNQSxzREFJMkI7QUFrQjNCLFNBQWdCLFVBQVUsQ0FBQyxFQUN6QixRQUFRLEVBQ1IsTUFBTSxFQUNOLGdCQUFnQixHQUNOO0lBQ1YsT0FBTztRQUNMLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxJQUFJO1lBQ2xDLE1BQU0sUUFBUSxHQUFHLGdDQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN6RCxPQUFPLFFBQVEsQ0FBQyxZQUFZLENBQzFCLFNBQVMsRUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQzVCLEVBQUUsQ0FDSCxDQUFDO1FBQ0osQ0FBQztRQUNELFVBQVUsQ0FBQyxNQUFNO1lBQ2YsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVE7WUFDM0MsTUFBTSxHQUFHLEdBQUcsdUNBQXNCLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM3RCxPQUFPO2dCQUNMLElBQUksRUFBRSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ25CLEdBQUcsSUFBSTtpQkFDUixDQUFDO2dCQUNGLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxNQUFNLEVBQUU7Z0JBQzFCLE9BQU8sRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsUUFBUSxFQUFFLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFDdEMsQ0FBQztRQUNKLENBQUM7UUFDRCxPQUFPLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDdEUsTUFBTSxRQUFRLEdBQUcsZ0NBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pELE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FDdEIsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUNsQixnQkFBZ0IsRUFDaEIsRUFBRSxFQUNGLGdCQUFnQixFQUNoQixHQUFHLEVBQ0gsRUFBRSxDQUNILENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQzVDLE9BQU8sdUNBQXNCLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQzdELE1BQU0sRUFDTixPQUFPLEVBQ1A7Z0JBQ0UsR0FBRyxFQUFFO2FBQ04sQ0FDRixDQUFDO1FBQ0osQ0FBQztRQUNELFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2xDLE1BQU0sUUFBUSxHQUFHLGdDQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN6RCxPQUFPLFFBQVEsQ0FBQyxZQUFZLENBQzFCLFNBQVMsRUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQzVCLEVBQUUsQ0FDSCxDQUFDO1FBQ0osQ0FBQztRQUNELE9BQU8sQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ2pFLE1BQU0sUUFBUSxHQUFHLGdDQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN6RCxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQ3JCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFDbEIsZ0JBQWdCLEVBQ2hCLEVBQUUsRUFDRixnQkFBZ0IsRUFDaEIsRUFBRSxDQUNILENBQUM7UUFDSixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFuRUQsZ0NBbUVDIn0=