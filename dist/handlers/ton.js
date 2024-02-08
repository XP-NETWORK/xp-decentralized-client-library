"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tonHandler = exports.raise = void 0;
const core_1 = require("@ton/core");
const tonBridge_1 = require("../contractsTypes/contracts/tonBridge");
const tonNftCollection_1 = require("../contractsTypes/contracts/tonNftCollection");
const tonNftContract_1 = require("../contractsTypes/contracts/tonNftContract");
function raise(message) {
    throw new Error(message);
}
exports.raise = raise;
function tonHandler({ client, bridgeAddress }) {
    const bridge = client.open(tonBridge_1.Bridge.fromAddress(core_1.Address.parseFriendly(bridgeAddress).address));
    return {
        getBalance(signer) {
            return client.getBalance(signer.address ?? raise("No Address present in signer"));
        },
        async claimNft(signer, claimData, _, sig) {
            const sigs = sig.map((e) => {
                return {
                    $$type: "SignerAndSignature",
                    key: BigInt(`0x${e.signer}`),
                    signature: (0, core_1.beginCell)()
                        .storeBuffer(Buffer.from(e.signature.replace("0x", ""), "hex"))
                        .endCell(),
                };
            });
            let dictA = core_1.Dictionary.empty();
            sigs.forEach((item, index) => {
                dictA = dictA.set(BigInt(index), item);
            });
            await bridge.send(signer, {
                value: (0, core_1.toNano)(claimData.data3.fee),
            }, {
                $$type: "ClaimNFT721",
                data: claimData,
                signatures: dictA,
                len: BigInt(sigs.length),
            });
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, _) {
            await bridge.send(signer, {
                value: (0, core_1.toNano)("2"),
            }, {
                $$type: "Lock721",
                destinationChain,
                destinationUserAddress: to,
                sourceNftContractAddress: core_1.Address.parseFriendly(sourceNft).address,
                tokenId: BigInt(tokenId),
            });
        },
        async approveNft(_signer, _tokenId, _contract, _ex) { },
        async nftData(_signer, _, _tokenId, contract) {
            const nftItem = client.open(tonNftContract_1.NftItem.fromAddress(core_1.Address.parseFriendly(contract).address));
            const getCollectionMetaData = async () => {
                const nftData = await nftItem.getGetNftData();
                if (nftData.collection_address) {
                    const nftCollection = client.open(tonNftCollection_1.NftCollection.fromAddress(nftData.collection_address));
                    const { collection_content } = await nftCollection.getGetCollectionData();
                    const collectionContentSlice = collection_content.asSlice();
                    collectionContentSlice.loadUint(8);
                    const metaDataURL = collectionContentSlice.loadStringTail();
                    console.log({ metaDataURL });
                    return metaDataURL;
                }
                const individualContentSlice = nftData.individual_content.asSlice();
                individualContentSlice.loadBits(8);
                const metaDataURL = individualContentSlice.loadStringTail();
                return metaDataURL;
            };
            const nftData = await nftItem.getGetNftData();
            const individualContentSlice = nftData.individual_content.asSlice();
            individualContentSlice.loadBits(8);
            const metaDataURL = individualContentSlice.loadStringTail();
            const metaData = (await (await fetch(await getCollectionMetaData())).json()).data;
            let royalty = 0n;
            if (nftData.collection_address) {
                const nftCollection = client.open(tonNftCollection_1.NftCollection.fromAddress(nftData.collection_address));
                const royaltyParams = await nftCollection.getRoyaltyParams();
                const royaltyInNum = royaltyParams.numerator / royaltyParams.denominator;
                const standardRoyalty = royaltyInNum * BigInt(10);
                royalty = standardRoyalty;
            }
            return {
                metadata: metaDataURL,
                symbol: "TTON",
                name: metaData.name,
                royalty,
            };
        },
    };
}
exports.tonHandler = tonHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhbmRsZXJzL3Rvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvQ0FBMkU7QUFFM0UscUVBSStDO0FBQy9DLG1GQUE2RTtBQUM3RSwrRUFBcUU7QUFlckUsU0FBZ0IsS0FBSyxDQUFDLE9BQWU7SUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRkQsc0JBRUM7QUFFRCxTQUFnQixVQUFVLENBQUMsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFhO0lBQzdELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLGtCQUFNLENBQUMsV0FBVyxDQUFDLGNBQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pFLENBQUM7SUFDRixPQUFPO1FBQ0wsVUFBVSxDQUFDLE1BQU07WUFDZixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQ3RCLE1BQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQ3hELENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxHQUFHO1lBQ3RDLE1BQU0sSUFBSSxHQUF5QixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQy9DLE9BQU87b0JBQ0wsTUFBTSxFQUFFLG9CQUFvQjtvQkFDNUIsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDNUIsU0FBUyxFQUFFLElBQUEsZ0JBQVMsR0FBRTt5QkFDbkIsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO3lCQUM5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