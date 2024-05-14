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
const nftc_1 = require("./nftc");
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
            return {
                hash: () => "",
                ret: undefined,
            };
        },
        async readClaimed721Event(bridgeTxHash) {
            const tx = await client.getTransactions(bridge.address, {
                hash: bridgeTxHash,
                limit: 1,
            });
            if (!tx.length)
                raise("Transaction not found");
            const om = tx[0].outMessages;
            const size = om.size;
            for (let i = 0; i < size; i++) {
                const msg = om.get(i) ?? raise("Unreachable");
                if (msg.body.asSlice().loadUint(32) === 663924102) {
                    const { newlyDeployCollection, tokenId, sourceChain, transactionHash, } = (0, tonBridge_1.loadClaimedEvent)(msg.body.asSlice());
                    return {
                        nft_contract: newlyDeployCollection.toString(),
                        source_chain: sourceChain,
                        token_id: tokenId.toString(),
                        transaction_hash: transactionHash,
                    };
                }
            }
            throw new Error("Claimed event not found");
        },
        async deployCollection(signer, da) {
            const nft = client.open(await nftc_1.ExampleNFTCollection.fromInit(da.owner_address, da.collection_content, da.royalty_params));
            await nft.send(signer, {
                value: (0, core_1.toNano)("0.5"),
            }, {
                $$type: "Deploy",
                queryId: 3424n,
            });
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
            const nft = client.open(nftc_1.ExampleNFTCollection.fromAddress(ma.contract));
            await nft.send(signer, {
                value: (0, core_1.toNano)("0.1"),
            }, "Mint");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdG9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9DQUFtRTtBQUVuRSxrREFBMEI7QUFDMUIsa0VBSzRDO0FBQzVDLGdGQUEwRTtBQUMxRSw0RUFBa0U7QUFDbEUsaUNBQThDO0FBRzlDLFNBQWdCLEtBQUssQ0FBQyxPQUFlO0lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUZELHNCQUVDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLEVBQ3pCLE1BQU0sRUFDTixhQUFhLEVBQ2IsT0FBTyxHQUNJO0lBQ1gsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLGtCQUFNLENBQUMsV0FBVyxDQUFDLGNBQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pFLENBQUM7SUFDRixPQUFPO1FBQ0wsa0JBQWtCO1lBQ2hCLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUNELFVBQVUsQ0FBQyxNQUFNO1lBQ2YsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUN0QixNQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUN4RCxDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUN0QyxNQUFNLElBQUksR0FBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUMvQyxPQUFPO29CQUNMLE1BQU0sRUFBRSxvQkFBb0I7b0JBQzVCLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ25DLFNBQVMsRUFBRSxJQUFBLGdCQUFTLEdBQUU7eUJBQ25CLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt5QkFDOUQsT0FBTyxFQUFFO2lCQUNiLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksS0FBSyxHQUFHLGlCQUFVLENBQUMsS0FBSyxFQUE4QixDQUFDO1lBQzNELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQzNCLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDZixNQUFNLEVBQ047Z0JBQ0UsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRzthQUMzQixFQUNEO2dCQUNFLE1BQU0sRUFBRSxhQUFhO2dCQUNyQixJQUFJLEVBQUUsU0FBUztnQkFDZixVQUFVLEVBQUUsS0FBSztnQkFDakIsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ3pCLENBQ0YsQ0FBQztZQUNGLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7Z0JBQ2QsR0FBRyxFQUFFLFNBQVM7YUFDZixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZO1lBQ3BDLE1BQU0sRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO2dCQUN0RCxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsS0FBSyxFQUFFLENBQUM7YUFDVCxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU07Z0JBQUUsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDL0MsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztZQUM3QixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDOUIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzlDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQ2xELE1BQU0sRUFDSixxQkFBcUIsRUFDckIsT0FBTyxFQUNQLFdBQVcsRUFDWCxlQUFlLEdBQ2hCLEdBQUcsSUFBQSw0QkFBZ0IsRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7b0JBQ3pDLE9BQU87d0JBQ0wsWUFBWSxFQUFFLHFCQUFxQixDQUFDLFFBQVEsRUFBRTt3QkFDOUMsWUFBWSxFQUFFLFdBQVc7d0JBQ3pCLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO3dCQUM1QixnQkFBZ0IsRUFBRSxlQUFlO3FCQUNsQyxDQUFDO2dCQUNKLENBQUM7WUFDSCxDQUFDO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDL0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDckIsTUFBTSwyQkFBb0IsQ0FBQyxRQUFRLENBQ2pDLEVBQUUsQ0FBQyxhQUFhLEVBQ2hCLEVBQUUsQ0FBQyxrQkFBa0IsRUFDckIsRUFBRSxDQUFDLGNBQWMsQ0FDbEIsQ0FDRixDQUFDO1lBRUYsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUNaLE1BQU0sRUFDTjtnQkFDRSxLQUFLLEVBQUUsSUFBQSxhQUFNLEVBQUMsS0FBSyxDQUFDO2FBQ3JCLEVBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLE9BQU8sRUFBRSxLQUFLO2FBQ2YsQ0FDRixDQUFDO1lBRUYsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLENBQUM7UUFDRCxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU07WUFDdkIsTUFBTSxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDUixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM3QyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNULFNBQVM7Z0JBQ1gsQ0FBQztnQkFDRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUM7Z0JBQ3BCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssVUFBVSxFQUFFLENBQUM7b0JBQ25ELFNBQVM7Z0JBQ1gsQ0FBQztnQkFDRCxNQUFNLEVBQ0osT0FBTyxFQUFFLGlDQUFpQztnQkFDMUMsZ0JBQWdCLEVBQUUsOENBQThDO2dCQUNoRSxzQkFBc0IsRUFBRSwwQ0FBMEM7Z0JBQ2xFLHdCQUF3QixFQUFFLGtEQUFrRDtnQkFDNUUsV0FBVyxFQUFFLG9EQUFvRDtnQkFDakUsT0FBTyxFQUFFLG9DQUFvQztnQkFDN0MsV0FBVyxFQUFFLHNCQUFzQjtrQkFDcEMsR0FBRyxJQUFBLDJCQUFlLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUV4QyxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDckQsTUFBTSxlQUFlLEdBQUcsTUFBTSxPQUFPLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBRXJFLE1BQU0sMkJBQTJCLEdBQUcsR0FBRyxFQUFFO29CQUN2QyxJQUFJLENBQUM7d0JBQ0gsT0FBTyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDckUsQ0FBQztvQkFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO3dCQUNYLE9BQU8sd0JBQXdCLENBQUMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQzdELENBQUM7Z0JBQ0gsQ0FBQyxDQUFDO2dCQUVGLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQzVELE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFDbEIsMkJBQTJCLEVBQUUsRUFDN0IsU0FBUyxDQUNWLENBQUM7Z0JBRUYsT0FBTztvQkFDTCxnQkFBZ0I7b0JBQ2hCLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDLFFBQVEsRUFBRTtvQkFDekQsd0JBQXdCLEVBQUUsMkJBQTJCLEVBQUU7b0JBQ3ZELE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO29CQUMzQixXQUFXLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRTtvQkFDbkMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7b0JBQzNCLFdBQVcsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFO29CQUNuQyxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRTtvQkFDbkIsZUFBZSxFQUFFLGVBQWUsQ0FBQyxRQUFRLEVBQUU7b0JBQzNDLFFBQVE7b0JBQ1IsSUFBSTtvQkFDSixNQUFNO29CQUNOLE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO29CQUMzQixlQUFlLEVBQUUsSUFBSTtpQkFDdEIsQ0FBQztZQUNKLENBQUM7WUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUNELFNBQVMsQ0FBQyxLQUFLO1lBQ2IsSUFBSSxrQkFBMkIsQ0FBQztZQUNoQyxJQUFJLENBQUM7Z0JBQ0gsa0JBQWtCLEdBQUcsY0FBTyxDQUFDLGFBQWEsQ0FDeEMsS0FBSyxDQUFDLHNCQUFzQixDQUM3QixDQUFDLE9BQU8sQ0FBQztZQUNaLENBQUM7WUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNYLGtCQUFrQixHQUFHLGNBQU8sQ0FBQyxhQUFhLENBQ3hDLEtBQUssQ0FBQyxlQUFlLENBQ3RCLENBQUMsT0FBTyxDQUFDO1lBQ1osQ0FBQztZQUNELElBQUkseUJBQXlCLEdBQUcsSUFBQSxnQkFBUyxHQUFFO2lCQUN4QyxVQUFVLENBQ1QsSUFBQSxnQkFBUyxHQUFFO2lCQUNSLGVBQWUsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUM7aUJBQy9DLE9BQU8sRUFBRTtpQkFDVCxPQUFPLEVBQUUsQ0FDYjtpQkFDQSxPQUFPLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQztnQkFDSCx5QkFBeUIsR0FBRyxJQUFBLGdCQUFTLEdBQUU7cUJBQ3BDLFVBQVUsQ0FDVCxJQUFBLGdCQUFTLEdBQUU7cUJBQ1IsWUFBWSxDQUNYLGNBQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUMsT0FBTyxDQUM5RDtxQkFDQSxPQUFPLEVBQUU7cUJBQ1QsT0FBTyxFQUFFLENBQ2I7cUJBQ0EsT0FBTyxFQUFFLENBQUM7WUFDZixDQUFDO1lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDeEMsQ0FBQztZQUNELE9BQU87Z0JBQ0wsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsWUFBWTtvQkFDcEIsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQjtvQkFDeEMsc0JBQXNCLEVBQUUsa0JBQWtCO29CQUMxQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7b0JBQzlCLFdBQVcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO2lCQUMvQjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLFlBQVk7b0JBQ3BCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtvQkFDaEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO29CQUN0QixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07aUJBQ3JCO2dCQUNELEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsWUFBWTtvQkFDcEIsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO29CQUN0QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7b0JBQ3hCLGVBQWUsRUFBRSxjQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPO29CQUNyRSx3QkFBd0IsRUFBRSx5QkFBeUI7aUJBQ3BEO2dCQUNELEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsWUFBWTtvQkFDcEIsVUFBVSxFQUFFLElBQUEsZ0JBQVMsR0FBRTt5QkFDcEIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7eUJBQ2pCLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7eUJBQ2xDLE9BQU8sRUFBRTtvQkFDWixPQUFPLEVBQUU7d0JBQ1AsTUFBTSxFQUFFLGVBQWU7d0JBQ3ZCLFdBQVcsRUFBRSxNQUFNO3dCQUNuQixXQUFXLEVBQUUsY0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTzt3QkFDakUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO3FCQUNqQztvQkFDRCxlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7aUJBQ3ZDO2FBQ0YsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsaUJBQWlCO1lBQ3JCLE9BQU8sTUFBTSxDQUFDLENBQUMsTUFBTSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUNsRCxDQUFDO1lBQ0QsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUNmLE1BQU0sRUFDTjtnQkFDRSxLQUFLLEVBQUUsSUFBQSxhQUFNLEVBQUMsR0FBRyxDQUFDO2FBQ25CLEVBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLGdCQUFnQjtnQkFDaEIsc0JBQXNCLEVBQUUsRUFBRTtnQkFDMUIsd0JBQXdCLEVBQUUsY0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPO2dCQUNsRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUN6QixDQUNGLENBQUM7WUFFRixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUMvQixNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sRUFBRSxHQUFHLENBQ1QsTUFBTSxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FDM0QsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDTCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDN0MsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDVCxTQUFTO29CQUNYLENBQUM7b0JBQ0QsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxVQUFVLEVBQUUsQ0FBQzt3QkFDbkQsU0FBUztvQkFDWCxDQUFDO29CQUNELE1BQU0sR0FBRyxHQUFHLElBQUEsMkJBQWUsRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7b0JBQ2hELElBQ0UsZ0JBQWdCLEtBQUssR0FBRyxDQUFDLGdCQUFnQjt3QkFDekMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxzQkFBc0IsRUFDakMsQ0FBQzt3QkFDRCxPQUFPLEdBQUcsSUFBSSxDQUFDO3dCQUNmLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNuQyxDQUFDO2dCQUNILENBQUM7Z0JBQ0QsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDO1lBRUQsT0FBTztnQkFDTCxFQUFFLEVBQUUsU0FBUztnQkFDYixJQUFJO29CQUNGLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7YUFDRixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLElBQUcsQ0FBQztRQUNqRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3RCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsMkJBQW9CLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FDWixNQUFNLEVBQ047Z0JBQ0UsS0FBSyxFQUFFLElBQUEsYUFBTSxFQUFDLEtBQUssQ0FBQzthQUNyQixFQUNELE1BQU0sQ0FDUCxDQUFDO1lBQ0YsT0FBTztRQUNULENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVTtZQUMxQyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUN6Qix3QkFBTyxDQUFDLFdBQVcsQ0FBQyxjQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUM3RCxDQUFDO1lBRUYsTUFBTSxxQkFBcUIsR0FBRyxLQUFLLElBQUksRUFBRTtnQkFDdkMsTUFBTSxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQzlDLElBQUksT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7b0JBQy9CLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQy9CLGdDQUFhLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUN0RCxDQUFDO29CQUNGLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxHQUMxQixNQUFNLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO29CQUM3QyxNQUFNLHNCQUFzQixHQUFHLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUM1RCxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLE1BQU0sV0FBVyxHQUFHLHNCQUFzQixDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztvQkFDN0IsT0FBTyxXQUFXLENBQUM7Z0JBQ3JCLENBQUM7Z0JBQ0QsTUFBTSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3BFLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxXQUFXLEdBQUcsc0JBQXNCLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQzVELE9BQU8sV0FBVyxDQUFDO1lBQ3JCLENBQUMsQ0FBQztZQUVGLE1BQU0sT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzlDLE1BQU0sc0JBQXNCLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BFLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLFdBQVcsR0FBRyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUU1RCxNQUFNLFFBQVEsR0FBRyxDQUNmLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBbUIsTUFBTSxxQkFBcUIsRUFBRSxDQUFDLENBQ2hFLENBQUMsSUFBSSxDQUFDO1lBRVAsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBRWpCLElBQUksT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQy9CLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQy9CLGdDQUFhLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUN0RCxDQUFDO2dCQUNGLE1BQU0sYUFBYSxHQUFHLE1BQU0sYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQzdELE1BQU0sWUFBWSxHQUNoQixhQUFhLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUM7Z0JBQ3RELE1BQU0sZUFBZSxHQUFHLFlBQVksR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2xELE9BQU8sR0FBRyxlQUFlLENBQUM7WUFDNUIsQ0FBQztZQUNELE9BQU87Z0JBQ0wsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLE1BQU0sRUFBRSxNQUFNO2dCQUNkLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtnQkFDbkIsT0FBTzthQUNSLENBQUM7UUFDSixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFuV0QsZ0NBbVdDIn0=