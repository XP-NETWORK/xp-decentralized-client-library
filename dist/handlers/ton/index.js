"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tonHandler = exports.raise = void 0;
const core_1 = require("@ton/core");
const axios_1 = __importDefault(require("axios"));
const tonBridge_1 = require("../../contractsTypes/ton/tonBridge");
const tonNftCollection_1 = require("../../contractsTypes/ton/tonNftCollection");
const tonNftContract_1 = require("../../contractsTypes/ton/tonNftContract");
const nft_1 = require("./nft");
function raise(message) {
    throw new Error(message);
}
exports.raise = raise;
function tonHandler({ client, bridgeAddress, storage, }) {
    const http = axios_1.default.create();
    const bridge = client.open(tonBridge_1.Bridge.fromAddress(core_1.Address.parseFriendly(bridgeAddress).address));
    return {
        getStorageContract() {
            return storage;
        },
        getProvider() {
            return client;
        },
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
        async deployCollection(signer, da) {
            const nft = new nft_1.TonNftCollection(da);
            nft.deploy(signer);
            return nft.address.toString();
        },
        async getClaimData(txHash) {
            const tx = await client.getTransaction(bridge.address, "", txHash);
            if (!tx) {
                throw new Error("Transaction not found");
            }
            for (let i = 0; i < tx.outMessages.size; i++) {
                const msg = tx.outMessages.get(i);
                if (!msg) {
                    continue;
                }
                const hash = txHash;
                if (msg.body.asSlice().loadUint(32) !== 3571773646) {
                    continue;
                }
                const { tokenId, // Unique ID for the NFT transfer
                destinationChain, // Chain to where the NFT is being transferred
                destinationUserAddress, // User's address in the destination chain
                sourceNftContractAddress, // Address of the NFT contract in the source chain
                tokenAmount, // amount of nfts to be transfered ( 1 in 721 case )
                nftType, // Sigular or multiple ( 721 / 1155)
                sourceChain, // Source chain of NFT
                 } = (0, tonBridge_1.loadLockedEvent)(msg.body.asSlice());
                const fee = await storage.chainFee(destinationChain);
                const royaltyReceiver = await storage.chainRoyalty(destinationChain);
                const getSourceNftContractAddress = () => {
                    try {
                        return sourceNftContractAddress.asSlice().loadAddress().toString();
                    }
                    catch (e) {
                        return sourceNftContractAddress.asSlice().loadStringTail();
                    }
                };
                const { royalty, name, symbol, metadata } = await this.nftData(tokenId.toString(), getSourceNftContractAddress(), undefined);
                return {
                    destinationChain,
                    destinationUserAddress: destinationUserAddress.toString(),
                    sourceNftContractAddress: getSourceNftContractAddress(),
                    tokenId: tokenId.toString(),
                    tokenAmount: tokenAmount.toString(),
                    nftType: nftType.toString(),
                    sourceChain: sourceChain.toString(),
                    fee: fee.toString(),
                    royaltyReceiver: royaltyReceiver.toString(),
                    metadata,
                    name,
                    symbol,
                    royalty: royalty.toString(),
                    transactionHash: hash,
                };
            }
            throw new Error("No locked event found");
        },
        transform(input) {
            let destinationAddress;
            try {
                destinationAddress = core_1.Address.parseFriendly(input.destinationUserAddress).address;
            }
            catch (e) {
                destinationAddress = core_1.Address.parseFriendly(input.royaltyReceiver).address;
            }
            let sourceNftContractAddress_ = (0, core_1.beginCell)()
                .storeSlice((0, core_1.beginCell)()
                .storeStringTail(input.sourceNftContractAddress)
                .endCell()
                .asSlice())
                .endCell();
            try {
                sourceNftContractAddress_ = (0, core_1.beginCell)()
                    .storeSlice((0, core_1.beginCell)()
                    .storeAddress(core_1.Address.parseFriendly(input.sourceNftContractAddress).address)
                    .endCell()
                    .asSlice())
                    .endCell();
            }
            catch (e) {
                console.log("Not Native TON Address");
            }
            return {
                $$type: "ClaimData",
                data1: {
                    $$type: "ClaimData1",
                    destinationChain: input.destinationChain,
                    destinationUserAddress: destinationAddress,
                    sourceChain: input.sourceChain,
                    tokenAmount: BigInt(input.tokenAmount),
                    tokenId: BigInt(input.tokenId),
                },
                data2: {
                    $$type: "ClaimData2",
                    name: input.name,
                    nftType: input.nftType,
                    symbol: input.symbol,
                },
                data3: {
                    $$type: "ClaimData3",
                    fee: BigInt(input.fee),
                    metadata: input.metadata,
                    royaltyReceiver: core_1.Address.parseFriendly(input.royaltyReceiver).address,
                    sourceNftContractAddress: sourceNftContractAddress_,
                },
                data4: {
                    $$type: "ClaimData4",
                    newContent: (0, core_1.beginCell)()
                        .storeInt(0x01, 8)
                        .storeStringRefTail(input.metadata)
                        .endCell(),
                    royalty: {
                        $$type: "RoyaltyParams",
                        denominator: 10000n,
                        destination: core_1.Address.parseFriendly(input.royaltyReceiver).address,
                        numerator: BigInt(input.royalty),
                    },
                    transactionHash: input.transactionHash,
                },
            };
        },
        async getValidatorCount() {
            return Number((await bridge.getValidatorsCount()) ?? 0);
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, _) {
            if (!signer.address) {
                throw new Error("No Address present in signer");
            }
            await bridge.send(signer, {
                value: (0, core_1.toNano)("2"),
            }, {
                $$type: "Lock721",
                destinationChain,
                destinationUserAddress: to,
                sourceNftContractAddress: core_1.Address.parseFriendly(sourceNft).address,
                tokenId: BigInt(tokenId),
            });
            let foundTx = false;
            let hash = "";
            let retries = 0;
            while (!foundTx && retries < 5) {
                await new Promise((e) => setTimeout(e, 2000));
                const tx = (await client.getTransactions(signer.address, { limit: 1 }))[0];
                for (let i = 0; i < tx.outMessages.size; i++) {
                    const msg = tx.outMessages.get(i);
                    if (!msg) {
                        continue;
                    }
                    if (msg.body.asSlice().loadUint(32) !== 3571773646) {
                        continue;
                    }
                    const log = (0, tonBridge_1.loadLockedEvent)(msg.body.asSlice());
                    if (destinationChain === log.destinationChain &&
                        to === log.destinationUserAddress) {
                        foundTx = true;
                        hash = tx.hash().toString("hex");
                    }
                }
                retries++;
            }
            return {
                tx: undefined,
                hash() {
                    return hash;
                },
            };
        },
        async approveNft(_signer, _tokenId, _contract) { },
        async mintNft(signer, ma) {
            const nft = new nft_1.TonNftCollection(ma);
            await nft.deploy(signer);
            return;
        },
        async nftData(_tokenId, contract, _overrides) {
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
            const metaData = (await http.get(await getCollectionMetaData())).data;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdG9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9DQUFtRTtBQUVuRSxrREFBMEI7QUFDMUIsa0VBSTRDO0FBQzVDLGdGQUEwRTtBQUMxRSw0RUFBa0U7QUFDbEUsK0JBQXlDO0FBR3pDLFNBQWdCLEtBQUssQ0FBQyxPQUFlO0lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUZELHNCQUVDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLEVBQ3pCLE1BQU0sRUFDTixhQUFhLEVBQ2IsT0FBTyxHQUNJO0lBQ1gsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLGtCQUFNLENBQUMsV0FBVyxDQUFDLGNBQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pFLENBQUM7SUFDRixPQUFPO1FBQ0wsa0JBQWtCO1lBQ2hCLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUNELFVBQVUsQ0FBQyxNQUFNO1lBQ2YsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUN0QixNQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUN4RCxDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsR0FBRztZQUN0QyxNQUFNLElBQUksR0FBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUMvQyxPQUFPO29CQUNMLE1BQU0sRUFBRSxvQkFBb0I7b0JBQzVCLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzVCLFNBQVMsRUFBRSxJQUFBLGdCQUFTLEdBQUU7eUJBQ25CLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt5QkFDOUQsT0FBTyxFQUFFO2lCQUNiLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksS0FBSyxHQUFHLGlCQUFVLENBQUMsS0FBSyxFQUE4QixDQUFDO1lBQzNELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQzNCLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDZixNQUFNLEVBQ047Z0JBQ0UsS0FBSyxFQUFFLElBQUEsYUFBTSxFQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2FBQ25DLEVBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLGFBQWE7Z0JBQ3JCLElBQUksRUFBRSxTQUFTO2dCQUNmLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDekIsQ0FDRixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUMvQixNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFbkIsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLENBQUM7UUFDRCxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU07WUFDdkIsTUFBTSxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDUixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM3QyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNULFNBQVM7Z0JBQ1gsQ0FBQztnQkFDRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUM7Z0JBQ3BCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssVUFBVSxFQUFFLENBQUM7b0JBQ25ELFNBQVM7Z0JBQ1gsQ0FBQztnQkFDRCxNQUFNLEVBQ0osT0FBTyxFQUFFLGlDQUFpQztnQkFDMUMsZ0JBQWdCLEVBQUUsOENBQThDO2dCQUNoRSxzQkFBc0IsRUFBRSwwQ0FBMEM7Z0JBQ2xFLHdCQUF3QixFQUFFLGtEQUFrRDtnQkFDNUUsV0FBVyxFQUFFLG9EQUFvRDtnQkFDakUsT0FBTyxFQUFFLG9DQUFvQztnQkFDN0MsV0FBVyxFQUFFLHNCQUFzQjtrQkFDcEMsR0FBRyxJQUFBLDJCQUFlLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUV4QyxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDckQsTUFBTSxlQUFlLEdBQUcsTUFBTSxPQUFPLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBRXJFLE1BQU0sMkJBQTJCLEdBQUcsR0FBRyxFQUFFO29CQUN2QyxJQUFJLENBQUM7d0JBQ0gsT0FBTyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDckUsQ0FBQztvQkFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO3dCQUNYLE9BQU8sd0JBQXdCLENBQUMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQzdELENBQUM7Z0JBQ0gsQ0FBQyxDQUFDO2dCQUVGLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQzVELE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFDbEIsMkJBQTJCLEVBQUUsRUFDN0IsU0FBUyxDQUNWLENBQUM7Z0JBRUYsT0FBTztvQkFDTCxnQkFBZ0I7b0JBQ2hCLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDLFFBQVEsRUFBRTtvQkFDekQsd0JBQXdCLEVBQUUsMkJBQTJCLEVBQUU7b0JBQ3ZELE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO29CQUMzQixXQUFXLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRTtvQkFDbkMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7b0JBQzNCLFdBQVcsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFO29CQUNuQyxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRTtvQkFDbkIsZUFBZSxFQUFFLGVBQWUsQ0FBQyxRQUFRLEVBQUU7b0JBQzNDLFFBQVE7b0JBQ1IsSUFBSTtvQkFDSixNQUFNO29CQUNOLE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO29CQUMzQixlQUFlLEVBQUUsSUFBSTtpQkFDdEIsQ0FBQztZQUNKLENBQUM7WUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUNELFNBQVMsQ0FBQyxLQUFLO1lBQ2IsSUFBSSxrQkFBMkIsQ0FBQztZQUNoQyxJQUFJLENBQUM7Z0JBQ0gsa0JBQWtCLEdBQUcsY0FBTyxDQUFDLGFBQWEsQ0FDeEMsS0FBSyxDQUFDLHNCQUFzQixDQUM3QixDQUFDLE9BQU8sQ0FBQztZQUNaLENBQUM7WUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNYLGtCQUFrQixHQUFHLGNBQU8sQ0FBQyxhQUFhLENBQ3hDLEtBQUssQ0FBQyxlQUFlLENBQ3RCLENBQUMsT0FBTyxDQUFDO1lBQ1osQ0FBQztZQUNELElBQUkseUJBQXlCLEdBQUcsSUFBQSxnQkFBUyxHQUFFO2lCQUN4QyxVQUFVLENBQ1QsSUFBQSxnQkFBUyxHQUFFO2lCQUNSLGVBQWUsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUM7aUJBQy9DLE9BQU8sRUFBRTtpQkFDVCxPQUFPLEVBQUUsQ0FDYjtpQkFDQSxPQUFPLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQztnQkFDSCx5QkFBeUIsR0FBRyxJQUFBLGdCQUFTLEdBQUU7cUJBQ3BDLFVBQVUsQ0FDVCxJQUFBLGdCQUFTLEdBQUU7cUJBQ1IsWUFBWSxDQUNYLGNBQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUMsT0FBTyxDQUM5RDtxQkFDQSxPQUFPLEVBQUU7cUJBQ1QsT0FBTyxFQUFFLENBQ2I7cUJBQ0EsT0FBTyxFQUFFLENBQUM7WUFDZixDQUFDO1lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDeEMsQ0FBQztZQUNELE9BQU87Z0JBQ0wsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsWUFBWTtvQkFDcEIsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQjtvQkFDeEMsc0JBQXNCLEVBQUUsa0JBQWtCO29CQUMxQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7b0JBQzlCLFdBQVcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO2lCQUMvQjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLFlBQVk7b0JBQ3BCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtvQkFDaEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO29CQUN0QixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07aUJBQ3JCO2dCQUNELEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsWUFBWTtvQkFDcEIsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO29CQUN0QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7b0JBQ3hCLGVBQWUsRUFBRSxjQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPO29CQUNyRSx3QkFBd0IsRUFBRSx5QkFBeUI7aUJBQ3BEO2dCQUNELEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsWUFBWTtvQkFDcEIsVUFBVSxFQUFFLElBQUEsZ0JBQVMsR0FBRTt5QkFDcEIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7eUJBQ2pCLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7eUJBQ2xDLE9BQU8sRUFBRTtvQkFDWixPQUFPLEVBQUU7d0JBQ1AsTUFBTSxFQUFFLGVBQWU7d0JBQ3ZCLFdBQVcsRUFBRSxNQUFNO3dCQUNuQixXQUFXLEVBQUUsY0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTzt3QkFDakUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO3FCQUNqQztvQkFDRCxlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7aUJBQ3ZDO2FBQ0YsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsaUJBQWlCO1lBQ3JCLE9BQU8sTUFBTSxDQUFDLENBQUMsTUFBTSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUNsRCxDQUFDO1lBQ0QsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUNmLE1BQU0sRUFDTjtnQkFDRSxLQUFLLEVBQUUsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDO2FBQ25CLEVBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLGdCQUFnQjtnQkFDaEIsc0JBQXNCLEVBQUUsRUFBRTtnQkFDMUIsd0JBQXdCLEVBQUUsY0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPO2dCQUNsRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUN6QixDQUNGLENBQUM7WUFFRixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUMvQixNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sRUFBRSxHQUFHLENBQ1QsTUFBTSxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FDM0QsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDTCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDN0MsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDVCxTQUFTO29CQUNYLENBQUM7b0JBQ0QsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxVQUFVLEVBQUUsQ0FBQzt3QkFDbkQsU0FBUztvQkFDWCxDQUFDO29CQUNELE1BQU0sR0FBRyxHQUFHLElBQUEsMkJBQWUsRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7b0JBQ2hELElBQ0UsZ0JBQWdCLEtBQUssR0FBRyxDQUFDLGdCQUFnQjt3QkFDekMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxzQkFBc0IsRUFDakMsQ0FBQzt3QkFDRCxPQUFPLEdBQUcsSUFBSSxDQUFDO3dCQUNmLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNuQyxDQUFDO2dCQUNILENBQUM7Z0JBQ0QsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDO1lBRUQsT0FBTztnQkFDTCxFQUFFLEVBQUUsU0FBUztnQkFDYixJQUFJO29CQUNGLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7YUFDRixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLElBQUcsQ0FBQztRQUNqRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksc0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckMsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLE9BQU87UUFDVCxDQUFDO1FBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVU7WUFDMUMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDekIsd0JBQU8sQ0FBQyxXQUFXLENBQUMsY0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDN0QsQ0FBQztZQUVGLE1BQU0scUJBQXFCLEdBQUcsS0FBSyxJQUFJLEVBQUU7Z0JBQ3ZDLE1BQU0sT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUM5QyxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUMvQixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUMvQixnQ0FBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FDdEQsQ0FBQztvQkFDRixNQUFNLEVBQUUsa0JBQWtCLEVBQUUsR0FDMUIsTUFBTSxhQUFhLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztvQkFDN0MsTUFBTSxzQkFBc0IsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDNUQsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxNQUFNLFdBQVcsR0FBRyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDNUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7b0JBQzdCLE9BQU8sV0FBVyxDQUFDO2dCQUNyQixDQUFDO2dCQUNELE1BQU0sc0JBQXNCLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNwRSxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sV0FBVyxHQUFHLHNCQUFzQixDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUM1RCxPQUFPLFdBQVcsQ0FBQztZQUNyQixDQUFDLENBQUM7WUFFRixNQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUM5QyxNQUFNLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwRSxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxXQUFXLEdBQUcsc0JBQXNCLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFNUQsTUFBTSxRQUFRLEdBQUcsQ0FDZixNQUFNLElBQUksQ0FBQyxHQUFHLENBQW1CLE1BQU0scUJBQXFCLEVBQUUsQ0FBQyxDQUNoRSxDQUFDLElBQUksQ0FBQztZQUVQLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUVqQixJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMvQixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUMvQixnQ0FBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FDdEQsQ0FBQztnQkFDRixNQUFNLGFBQWEsR0FBRyxNQUFNLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUM3RCxNQUFNLFlBQVksR0FDaEIsYUFBYSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDO2dCQUN0RCxNQUFNLGVBQWUsR0FBRyxZQUFZLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNsRCxPQUFPLEdBQUcsZUFBZSxDQUFDO1lBQzVCLENBQUM7WUFDRCxPQUFPO2dCQUNMLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixNQUFNLEVBQUUsTUFBTTtnQkFDZCxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ25CLE9BQU87YUFDUixDQUFDO1FBQ0osQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBL1NELGdDQStTQyJ9