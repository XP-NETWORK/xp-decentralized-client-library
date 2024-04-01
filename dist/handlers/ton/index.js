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
        async claimNft(signer, claimData, sig, _) {
            const sigs = sig.map((e) => {
                return {
                    $$type: "SignerAndSignature",
                    key: BigInt(`0x${e.signerAddress}`),
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
                value: claimData.data3.fee,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdG9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9DQUFtRTtBQUVuRSxrREFBMEI7QUFDMUIsa0VBSTRDO0FBQzVDLGdGQUEwRTtBQUMxRSw0RUFBa0U7QUFDbEUsK0JBQXlDO0FBR3pDLFNBQWdCLEtBQUssQ0FBQyxPQUFlO0lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUZELHNCQUVDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLEVBQ3pCLE1BQU0sRUFDTixhQUFhLEVBQ2IsT0FBTyxHQUNJO0lBQ1gsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLGtCQUFNLENBQUMsV0FBVyxDQUFDLGNBQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pFLENBQUM7SUFDRixPQUFPO1FBQ0wsa0JBQWtCO1lBQ2hCLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUNELFVBQVUsQ0FBQyxNQUFNO1lBQ2YsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUN0QixNQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUN4RCxDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUN0QyxNQUFNLElBQUksR0FBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUMvQyxPQUFPO29CQUNMLE1BQU0sRUFBRSxvQkFBb0I7b0JBQzVCLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ25DLFNBQVMsRUFBRSxJQUFBLGdCQUFTLEdBQUU7eUJBQ25CLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt5QkFDOUQsT0FBTyxFQUFFO2lCQUNiLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksS0FBSyxHQUFHLGlCQUFVLENBQUMsS0FBSyxFQUE4QixDQUFDO1lBQzNELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQzNCLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDZixNQUFNLEVBQ047Z0JBQ0UsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRzthQUMzQixFQUNEO2dCQUNFLE1BQU0sRUFBRSxhQUFhO2dCQUNyQixJQUFJLEVBQUUsU0FBUztnQkFDZixVQUFVLEVBQUUsS0FBSztnQkFDakIsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ3pCLENBQ0YsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDL0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxzQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVyQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRW5CLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQyxDQUFDO1FBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNO1lBQ3ZCLE1BQU0sRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ1IsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQzNDLENBQUM7WUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDN0MsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDVCxTQUFTO2dCQUNYLENBQUM7Z0JBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDO2dCQUNwQixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLFVBQVUsRUFBRSxDQUFDO29CQUNuRCxTQUFTO2dCQUNYLENBQUM7Z0JBQ0QsTUFBTSxFQUNKLE9BQU8sRUFBRSxpQ0FBaUM7Z0JBQzFDLGdCQUFnQixFQUFFLDhDQUE4QztnQkFDaEUsc0JBQXNCLEVBQUUsMENBQTBDO2dCQUNsRSx3QkFBd0IsRUFBRSxrREFBa0Q7Z0JBQzVFLFdBQVcsRUFBRSxvREFBb0Q7Z0JBQ2pFLE9BQU8sRUFBRSxvQ0FBb0M7Z0JBQzdDLFdBQVcsRUFBRSxzQkFBc0I7a0JBQ3BDLEdBQUcsSUFBQSwyQkFBZSxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFFeEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3JELE1BQU0sZUFBZSxHQUFHLE1BQU0sT0FBTyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUVyRSxNQUFNLDJCQUEyQixHQUFHLEdBQUcsRUFBRTtvQkFDdkMsSUFBSSxDQUFDO3dCQUNILE9BQU8sd0JBQXdCLENBQUMsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3JFLENBQUM7b0JBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQzt3QkFDWCxPQUFPLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUM3RCxDQUFDO2dCQUNILENBQUMsQ0FBQztnQkFFRixNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUM1RCxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQ2xCLDJCQUEyQixFQUFFLEVBQzdCLFNBQVMsQ0FDVixDQUFDO2dCQUVGLE9BQU87b0JBQ0wsZ0JBQWdCO29CQUNoQixzQkFBc0IsRUFBRSxzQkFBc0IsQ0FBQyxRQUFRLEVBQUU7b0JBQ3pELHdCQUF3QixFQUFFLDJCQUEyQixFQUFFO29CQUN2RCxPQUFPLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRTtvQkFDM0IsV0FBVyxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUU7b0JBQ25DLE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO29CQUMzQixXQUFXLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRTtvQkFDbkMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUU7b0JBQ25CLGVBQWUsRUFBRSxlQUFlLENBQUMsUUFBUSxFQUFFO29CQUMzQyxRQUFRO29CQUNSLElBQUk7b0JBQ0osTUFBTTtvQkFDTixPQUFPLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRTtvQkFDM0IsZUFBZSxFQUFFLElBQUk7aUJBQ3RCLENBQUM7WUFDSixDQUFDO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxTQUFTLENBQUMsS0FBSztZQUNiLElBQUksa0JBQTJCLENBQUM7WUFDaEMsSUFBSSxDQUFDO2dCQUNILGtCQUFrQixHQUFHLGNBQU8sQ0FBQyxhQUFhLENBQ3hDLEtBQUssQ0FBQyxzQkFBc0IsQ0FDN0IsQ0FBQyxPQUFPLENBQUM7WUFDWixDQUFDO1lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDWCxrQkFBa0IsR0FBRyxjQUFPLENBQUMsYUFBYSxDQUN4QyxLQUFLLENBQUMsZUFBZSxDQUN0QixDQUFDLE9BQU8sQ0FBQztZQUNaLENBQUM7WUFDRCxJQUFJLHlCQUF5QixHQUFHLElBQUEsZ0JBQVMsR0FBRTtpQkFDeEMsVUFBVSxDQUNULElBQUEsZ0JBQVMsR0FBRTtpQkFDUixlQUFlLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDO2lCQUMvQyxPQUFPLEVBQUU7aUJBQ1QsT0FBTyxFQUFFLENBQ2I7aUJBQ0EsT0FBTyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUM7Z0JBQ0gseUJBQXlCLEdBQUcsSUFBQSxnQkFBUyxHQUFFO3FCQUNwQyxVQUFVLENBQ1QsSUFBQSxnQkFBUyxHQUFFO3FCQUNSLFlBQVksQ0FDWCxjQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLE9BQU8sQ0FDOUQ7cUJBQ0EsT0FBTyxFQUFFO3FCQUNULE9BQU8sRUFBRSxDQUNiO3FCQUNBLE9BQU8sRUFBRSxDQUFDO1lBQ2YsQ0FBQztZQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3hDLENBQUM7WUFDRCxPQUFPO2dCQUNMLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLFlBQVk7b0JBQ3BCLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7b0JBQ3hDLHNCQUFzQixFQUFFLGtCQUFrQjtvQkFDMUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO29CQUM5QixXQUFXLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7b0JBQ3RDLE9BQU8sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztpQkFDL0I7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLE1BQU0sRUFBRSxZQUFZO29CQUNwQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7b0JBQ2hCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztvQkFDdEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO2lCQUNyQjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLFlBQVk7b0JBQ3BCLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO29CQUN4QixlQUFlLEVBQUUsY0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTztvQkFDckUsd0JBQXdCLEVBQUUseUJBQXlCO2lCQUNwRDtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLFlBQVk7b0JBQ3BCLFVBQVUsRUFBRSxJQUFBLGdCQUFTLEdBQUU7eUJBQ3BCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO3lCQUNqQixrQkFBa0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO3lCQUNsQyxPQUFPLEVBQUU7b0JBQ1osT0FBTyxFQUFFO3dCQUNQLE1BQU0sRUFBRSxlQUFlO3dCQUN2QixXQUFXLEVBQUUsTUFBTTt3QkFDbkIsV0FBVyxFQUFFLGNBQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU87d0JBQ2pFLFNBQVMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztxQkFDakM7b0JBQ0QsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO2lCQUN2QzthQUNGLENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLGlCQUFpQjtZQUNyQixPQUFPLE1BQU0sQ0FBQyxDQUFDLE1BQU0sTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQztZQUMvRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDbEQsQ0FBQztZQUNELE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDZixNQUFNLEVBQ047Z0JBQ0UsS0FBSyxFQUFFLElBQUEsYUFBTSxFQUFDLEdBQUcsQ0FBQzthQUNuQixFQUNEO2dCQUNFLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixnQkFBZ0I7Z0JBQ2hCLHNCQUFzQixFQUFFLEVBQUU7Z0JBQzFCLHdCQUF3QixFQUFFLGNBQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTztnQkFDbEUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUM7YUFDekIsQ0FDRixDQUFDO1lBRUYsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNkLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNoQixPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLEVBQUUsR0FBRyxDQUNULE1BQU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQzNELENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQzdDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ1QsU0FBUztvQkFDWCxDQUFDO29CQUNELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssVUFBVSxFQUFFLENBQUM7d0JBQ25ELFNBQVM7b0JBQ1gsQ0FBQztvQkFDRCxNQUFNLEdBQUcsR0FBRyxJQUFBLDJCQUFlLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO29CQUNoRCxJQUNFLGdCQUFnQixLQUFLLEdBQUcsQ0FBQyxnQkFBZ0I7d0JBQ3pDLEVBQUUsS0FBSyxHQUFHLENBQUMsc0JBQXNCLEVBQ2pDLENBQUM7d0JBQ0QsT0FBTyxHQUFHLElBQUksQ0FBQzt3QkFDZixJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkMsQ0FBQztnQkFDSCxDQUFDO2dCQUNELE9BQU8sRUFBRSxDQUFDO1lBQ1osQ0FBQztZQUVELE9BQU87Z0JBQ0wsRUFBRSxFQUFFLFNBQVM7Z0JBQ2IsSUFBSTtvQkFDRixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxJQUFHLENBQUM7UUFDakQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6QixPQUFPO1FBQ1QsQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVO1lBQzFDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3pCLHdCQUFPLENBQUMsV0FBVyxDQUFDLGNBQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQzdELENBQUM7WUFFRixNQUFNLHFCQUFxQixHQUFHLEtBQUssSUFBSSxFQUFFO2dCQUN2QyxNQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDOUMsSUFBSSxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDL0IsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDL0IsZ0NBQWEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQ3RELENBQUM7b0JBQ0YsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEdBQzFCLE1BQU0sYUFBYSxDQUFDLG9CQUFvQixFQUFFLENBQUM7b0JBQzdDLE1BQU0sc0JBQXNCLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQzVELHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkMsTUFBTSxXQUFXLEdBQUcsc0JBQXNCLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO29CQUM3QixPQUFPLFdBQVcsQ0FBQztnQkFDckIsQ0FBQztnQkFDRCxNQUFNLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDcEUsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLFdBQVcsR0FBRyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDNUQsT0FBTyxXQUFXLENBQUM7WUFDckIsQ0FBQyxDQUFDO1lBRUYsTUFBTSxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDOUMsTUFBTSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEUsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sV0FBVyxHQUFHLHNCQUFzQixDQUFDLGNBQWMsRUFBRSxDQUFDO1lBRTVELE1BQU0sUUFBUSxHQUFHLENBQ2YsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFtQixNQUFNLHFCQUFxQixFQUFFLENBQUMsQ0FDaEUsQ0FBQyxJQUFJLENBQUM7WUFFUCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFFakIsSUFBSSxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDL0IsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDL0IsZ0NBQWEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQ3RELENBQUM7Z0JBQ0YsTUFBTSxhQUFhLEdBQUcsTUFBTSxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDN0QsTUFBTSxZQUFZLEdBQ2hCLGFBQWEsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQztnQkFDdEQsTUFBTSxlQUFlLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbEQsT0FBTyxHQUFHLGVBQWUsQ0FBQztZQUM1QixDQUFDO1lBQ0QsT0FBTztnQkFDTCxRQUFRLEVBQUUsV0FBVztnQkFDckIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO2dCQUNuQixPQUFPO2FBQ1IsQ0FBQztRQUNKLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQS9TRCxnQ0ErU0MifQ==