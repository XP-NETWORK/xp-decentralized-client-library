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
    async function fetchHttpOrIpfs(uri) {
        const url = new URL(uri);
        if (url.protocol === "http:" || url.protocol === "https:") {
            const response = await http.get(uri);
            return response.data;
        }
        if (url.protocol === "ipfs:") {
            const response = await http.get(`https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`);
            return response.data;
        }
        throw new Error("Unsupported protocol");
    }
    const bridge = client.open(tonBridge_1.Bridge.fromAddress(core_1.Address.parseFriendly(bridgeAddress).address));
    async function getLastBridgeTxHashInBase64() {
        const txns = await client.getTransactions(bridge.address, { limit: 1 });
        return txns[0].hash().toString("base64");
    }
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
            if (!signer.address)
                raise("No Address present in signer");
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
            const lastBridgeTxHash = await getLastBridgeTxHashInBase64();
            await bridge.send(signer, {
                value: claimData.data3.fee,
            }, {
                $$type: "ClaimNFT721",
                data: claimData,
                signatures: dictA,
                len: BigInt(sigs.length),
            });
            let foundTx = false;
            let hash = "";
            let retries = 0;
            while (!foundTx && retries < 20) {
                await new Promise((e) => setTimeout(e, 4000));
                const tx = (await client.getTransactions(bridge.address, { limit: 1 }))[0];
                if (tx.hash().toString("base64") === lastBridgeTxHash) {
                    await new Promise((e) => setTimeout(e, 10000));
                    retries++;
                    continue;
                }
                hash = tx.hash().toString("base64");
                foundTx = true;
            }
            return {
                ret: undefined,
                hash() {
                    return hash;
                },
            };
        },
        async readClaimed721Event(bridgeTxHash) {
            const tx = await client.getTransactions(bridge.address, {
                hash: bridgeTxHash,
                limit: 2,
            });
            if (!tx.length)
                raise("Transaction not found");
            const om = tx[1].outMessages;
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
            console.log(txHash);
            const txs = await client.getTransactions(bridge.address, {
                hash: txHash,
                limit: 1,
            });
            if (!txs.length) {
                throw new Error("Transaction not found");
            }
            for (const tx of txs) {
                for (let i = 0; i < tx.outMessages.size; i++) {
                    const msg = tx.outMessages.get(i) ?? raise("Unreachable");
                    const hash = txHash;
                    console.log(msg.body.asSlice().loadUint(32));
                    if (msg.body.asSlice().loadUint(32) !== 4205190074) {
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
                    const fee = await storage.chainFee(destinationChain.asSlice().loadStringRefTail());
                    const royaltyReceiver = await storage.chainRoyalty(destinationChain.asSlice().loadStringRefTail());
                    const getSourceNftContractAddress = () => {
                        try {
                            return sourceNftContractAddress
                                .asSlice()
                                .loadAddress()
                                .toString();
                        }
                        catch (e) {
                            return sourceNftContractAddress.asSlice().loadStringTail();
                        }
                    };
                    const { royalty, name, symbol, metadata } = await this.nftData(tokenId.toString(), getSourceNftContractAddress(), undefined);
                    return {
                        destinationChain: destinationChain.asSlice().loadStringRefTail(),
                        destinationUserAddress: destinationUserAddress
                            .asSlice()
                            .loadStringRefTail(),
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
            const lastBridgeTxHash = await getLastBridgeTxHashInBase64();
            const collection = client.open(tonNftCollection_1.NftCollection.fromAddress(core_1.Address.parse(sourceNft)));
            const nftItemAddress = await collection.getGetNftAddressByIndex(tokenId);
            if (!nftItemAddress)
                raise("NFT Does not exist.");
            const nftItem = client.open(tonNftContract_1.NftItem.fromAddress(nftItemAddress));
            const nftItemData = await nftItem.getGetNftData();
            const exists = nftItemData.is_initialized;
            if (!exists)
                raise("NFT Is not initialized.");
            const locked = (0, core_1.beginCell)();
            (0, tonBridge_1.storeLock721)({
                $$type: "Lock721",
                destinationChain: (0, core_1.beginCell)()
                    .storeStringRefTail(destinationChain)
                    .endCell(),
                destinationUserAddress: (0, core_1.beginCell)().storeStringRefTail(to).endCell(),
                sourceNftContractAddress: core_1.Address.parse(sourceNft),
                tokenId: tokenId,
            })(locked);
            await nftItem.send(signer, {
                value: (0, core_1.toNano)("2.0"),
                bounce: true,
            }, {
                $$type: "Transfer",
                forward_payload: (0, core_1.beginCell)()
                    .storeInt(tokenId, 256)
                    .storeAddress(core_1.Address.parse(sourceNft))
                    .storeRef((0, core_1.beginCell)().storeStringRefTail(destinationChain))
                    .storeRef((0, core_1.beginCell)().storeStringRefTail(to))
                    .endCell(),
                custom_payload: null,
                forward_amount: (0, core_1.toNano)("1.0"),
                new_owner: bridge.address,
                query_id: 42069n,
                response_destination: bridge.address,
            });
            //  let foundTx = false;
            //  let hash = "";
            //  let retries = 0;
            //  while (!foundTx && retries < 20) {
            //    await new Promise((e) => setTimeout(e, 4000));
            //    const tx = (
            //      await client.getTransactions(bridge.address, { limit: 1 })
            //    )[0];
            //    if (tx.hash().toString("base64") === lastBridgeTxHash) {
            //      await new Promise((e) => setTimeout(e, 10000));
            //      retries++;
            //      continue;
            //    }
            //    hash = tx.hash().toString("base64");
            //    foundTx = true;
            //  }
            let foundTx = false;
            let hash = "";
            let retries = 0;
            while (!foundTx && retries < 10) {
                await new Promise((e) => setTimeout(e, 2000));
                const latestTx = (await client.getTransactions(bridge.address, { limit: 1 }))[0];
                if (latestTx.hash().toString("base64") === lastBridgeTxHash) {
                    await new Promise((e) => setTimeout(e, 10000));
                    retries++;
                    continue;
                }
                const txs = await client.getTransactions(bridge.address, { limit: 2 });
                for (const tx of txs) {
                    for (let i = 0; i < tx.outMessages.size; i++) {
                        const msg = tx.outMessages.get(i) ?? raise("Unreachable");
                        if (tx.hash().toString("base64") === lastBridgeTxHash) {
                            await new Promise((e) => setTimeout(e, 10000));
                            continue;
                        }
                        if (msg.body.asSlice().loadUint(32) !== 3571773646) {
                            continue;
                        }
                        const log = (0, tonBridge_1.loadLockedEvent)(msg.body.asSlice());
                        const log_dest_chain = log.destinationChain
                            .asSlice()
                            .loadStringRefTail();
                        const log_dest_ua = log.destinationUserAddress
                            .asSlice()
                            .loadStringRefTail();
                        if (destinationChain === log_dest_chain && to === log_dest_ua) {
                            foundTx = true;
                            hash = tx.hash().toString("base64");
                        }
                    }
                }
                retries++;
            }
            return {
                ret: undefined,
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
        async nftData(tokenId, contract, _overrides) {
            const collection = client.open(tonNftCollection_1.NftCollection.fromAddress(core_1.Address.parse(contract)));
            const royaltyParams = await collection.getRoyaltyParams();
            const denom = 10000 / Number(royaltyParams.denominator);
            const royalty = Number(royaltyParams.numerator) * denom;
            const collection_md_uri = (await collection.getGetCollectionData()).collection_content
                .asSlice()
                .loadStringTail();
            const collection_md = await fetchHttpOrIpfs(collection_md_uri).catch((_) => {
                return {
                    name: "TTON",
                    symbol: "TTON",
                };
            });
            const nftItem = client.open(tonNftContract_1.NftItem.fromAddress((await collection.getGetNftAddressByIndex(BigInt(tokenId))) ??
                raise("NFT Does not exist.")));
            const nftData = await nftItem.getGetNftData();
            const content = nftData.individual_content.asSlice();
            content.loadUint(8);
            const uri = content.loadStringTail();
            const nft_uri = uri.includes("://")
                ? uri
                : `${collection_md_uri.substring(0, collection_md_uri.lastIndexOf("/") + 1)}${uri}`;
            const md = await fetchHttpOrIpfs(nft_uri).catch((_) => {
                return {
                    name: "TTON",
                };
            });
            return {
                metadata: uri,
                symbol: collection_md.name ?? "TTON",
                name: md.name ?? collection_md.name ?? "TTON",
                royalty: BigInt(royalty),
            };
        },
    };
}
exports.tonHandler = tonHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdG9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9DQUFtRTtBQUVuRSxrREFBMEI7QUFDMUIsa0VBTTRDO0FBQzVDLGdGQUEwRTtBQUUxRSw0RUFBa0U7QUFDbEUsaUNBQThDO0FBRzlDLFNBQWdCLEtBQUssQ0FBQyxPQUFlO0lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUZELHNCQUVDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLEVBQ3pCLE1BQU0sRUFDTixhQUFhLEVBQ2IsT0FBTyxHQUNJO0lBQ1gsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRTVCLEtBQUssVUFBVSxlQUFlLENBQUMsR0FBVztRQUN4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDMUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztRQUN2QixDQUFDO1FBQ0QsSUFBSSxHQUFHLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQzdCLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FDN0Isd0JBQXdCLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQ3JELENBQUM7WUFDRixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDdkIsQ0FBQztRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDeEIsa0JBQU0sQ0FBQyxXQUFXLENBQUMsY0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDakUsQ0FBQztJQUVGLEtBQUssVUFBVSwyQkFBMkI7UUFDeEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4RSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELE9BQU87UUFDTCxrQkFBa0I7WUFDaEIsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUNELFdBQVc7WUFDVCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBQ0QsVUFBVSxDQUFDLE1BQU07WUFDZixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQ3RCLE1BQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQ3hELENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFBRSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUMzRCxNQUFNLElBQUksR0FBeUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUMvQyxPQUFPO29CQUNMLE1BQU0sRUFBRSxvQkFBb0I7b0JBQzVCLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ25DLFNBQVMsRUFBRSxJQUFBLGdCQUFTLEdBQUU7eUJBQ25CLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt5QkFDOUQsT0FBTyxFQUFFO2lCQUNiLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksS0FBSyxHQUFHLGlCQUFVLENBQUMsS0FBSyxFQUE4QixDQUFDO1lBQzNELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQzNCLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSwyQkFBMkIsRUFBRSxDQUFDO1lBQzdELE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDZixNQUFNLEVBQ047Z0JBQ0UsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRzthQUMzQixFQUNEO2dCQUNFLE1BQU0sRUFBRSxhQUFhO2dCQUNyQixJQUFJLEVBQUUsU0FBUztnQkFDZixVQUFVLEVBQUUsS0FBSztnQkFDakIsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ3pCLENBQ0YsQ0FBQztZQUNGLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDaEIsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLEdBQUcsRUFBRSxFQUFFLENBQUM7Z0JBQ2hDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxFQUFFLEdBQUcsQ0FDVCxNQUFNLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUMzRCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxnQkFBZ0IsRUFBRSxDQUFDO29CQUN0RCxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQy9DLE9BQU8sRUFBRSxDQUFDO29CQUNWLFNBQVM7Z0JBQ1gsQ0FBQztnQkFDRCxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNqQixDQUFDO1lBQ0QsT0FBTztnQkFDTCxHQUFHLEVBQUUsU0FBUztnQkFDZCxJQUFJO29CQUNGLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7YUFDRixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZO1lBQ3BDLE1BQU0sRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO2dCQUN0RCxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsS0FBSyxFQUFFLENBQUM7YUFDVCxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU07Z0JBQUUsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDL0MsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztZQUM3QixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDOUIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzlDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQ2xELE1BQU0sRUFDSixxQkFBcUIsRUFDckIsT0FBTyxFQUNQLFdBQVcsRUFDWCxlQUFlLEdBQ2hCLEdBQUcsSUFBQSw0QkFBZ0IsRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7b0JBQ3pDLE9BQU87d0JBQ0wsWUFBWSxFQUFFLHFCQUFxQixDQUFDLFFBQVEsRUFBRTt3QkFDOUMsWUFBWSxFQUFFLFdBQVc7d0JBQ3pCLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO3dCQUM1QixnQkFBZ0IsRUFBRSxlQUFlO3FCQUNsQyxDQUFDO2dCQUNKLENBQUM7WUFDSCxDQUFDO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDL0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDckIsTUFBTSwyQkFBb0IsQ0FBQyxRQUFRLENBQ2pDLEVBQUUsQ0FBQyxhQUFhLEVBQ2hCLEVBQUUsQ0FBQyxrQkFBa0IsRUFDckIsRUFBRSxDQUFDLGNBQWMsQ0FDbEIsQ0FDRixDQUFDO1lBRUYsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUNaLE1BQU0sRUFDTjtnQkFDRSxLQUFLLEVBQUUsSUFBQSxhQUFNLEVBQUMsS0FBSyxDQUFDO2FBQ3JCLEVBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLE9BQU8sRUFBRSxLQUFLO2FBQ2YsQ0FDRixDQUFDO1lBRUYsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLENBQUM7UUFDRCxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU07WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwQixNQUFNLEdBQUcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDdkQsSUFBSSxFQUFFLE1BQU07Z0JBQ1osS0FBSyxFQUFFLENBQUM7YUFDVCxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUNELEtBQUssTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUM3QyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzFELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQztvQkFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLFVBQVUsRUFBRSxDQUFDO3dCQUNuRCxTQUFTO29CQUNYLENBQUM7b0JBQ0QsTUFBTSxFQUNKLE9BQU8sRUFBRSxpQ0FBaUM7b0JBQzFDLGdCQUFnQixFQUFFLDhDQUE4QztvQkFDaEUsc0JBQXNCLEVBQUUsMENBQTBDO29CQUNsRSx3QkFBd0IsRUFBRSxrREFBa0Q7b0JBQzVFLFdBQVcsRUFBRSxvREFBb0Q7b0JBQ2pFLE9BQU8sRUFBRSxvQ0FBb0M7b0JBQzdDLFdBQVcsRUFBRSxzQkFBc0I7c0JBQ3BDLEdBQUcsSUFBQSwyQkFBZSxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFFeEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxPQUFPLENBQUMsUUFBUSxDQUNoQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUMvQyxDQUFDO29CQUNGLE1BQU0sZUFBZSxHQUFHLE1BQU0sT0FBTyxDQUFDLFlBQVksQ0FDaEQsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FDL0MsQ0FBQztvQkFFRixNQUFNLDJCQUEyQixHQUFHLEdBQUcsRUFBRTt3QkFDdkMsSUFBSSxDQUFDOzRCQUNILE9BQU8sd0JBQXdCO2lDQUM1QixPQUFPLEVBQUU7aUNBQ1QsV0FBVyxFQUFFO2lDQUNiLFFBQVEsRUFBRSxDQUFDO3dCQUNoQixDQUFDO3dCQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7NEJBQ1gsT0FBTyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDN0QsQ0FBQztvQkFDSCxDQUFDLENBQUM7b0JBRUYsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FDNUQsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUNsQiwyQkFBMkIsRUFBRSxFQUM3QixTQUFTLENBQ1YsQ0FBQztvQkFFRixPQUFPO3dCQUNMLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFO3dCQUNoRSxzQkFBc0IsRUFBRSxzQkFBc0I7NkJBQzNDLE9BQU8sRUFBRTs2QkFDVCxpQkFBaUIsRUFBRTt3QkFDdEIsd0JBQXdCLEVBQUUsMkJBQTJCLEVBQUU7d0JBQ3ZELE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO3dCQUMzQixXQUFXLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRTt3QkFDbkMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7d0JBQzNCLFdBQVcsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFO3dCQUNuQyxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRTt3QkFDbkIsZUFBZSxFQUFFLGVBQWUsQ0FBQyxRQUFRLEVBQUU7d0JBQzNDLFFBQVE7d0JBQ1IsSUFBSTt3QkFDSixNQUFNO3dCQUNOLE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO3dCQUMzQixlQUFlLEVBQUUsSUFBSTtxQkFDdEIsQ0FBQztnQkFDSixDQUFDO1lBQ0gsQ0FBQztZQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsU0FBUyxDQUFDLEtBQUs7WUFDYixJQUFJLGtCQUEyQixDQUFDO1lBQ2hDLElBQUksQ0FBQztnQkFDSCxrQkFBa0IsR0FBRyxjQUFPLENBQUMsYUFBYSxDQUN4QyxLQUFLLENBQUMsc0JBQXNCLENBQzdCLENBQUMsT0FBTyxDQUFDO1lBQ1osQ0FBQztZQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ1gsa0JBQWtCLEdBQUcsY0FBTyxDQUFDLGFBQWEsQ0FDeEMsS0FBSyxDQUFDLGVBQWUsQ0FDdEIsQ0FBQyxPQUFPLENBQUM7WUFDWixDQUFDO1lBQ0QsSUFBSSx5QkFBeUIsR0FBRyxJQUFBLGdCQUFTLEdBQUU7aUJBQ3hDLFVBQVUsQ0FDVCxJQUFBLGdCQUFTLEdBQUU7aUJBQ1IsZUFBZSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztpQkFDL0MsT0FBTyxFQUFFO2lCQUNULE9BQU8sRUFBRSxDQUNiO2lCQUNBLE9BQU8sRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDO2dCQUNILHlCQUF5QixHQUFHLElBQUEsZ0JBQVMsR0FBRTtxQkFDcEMsVUFBVSxDQUNULElBQUEsZ0JBQVMsR0FBRTtxQkFDUixZQUFZLENBQ1gsY0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxPQUFPLENBQzlEO3FCQUNBLE9BQU8sRUFBRTtxQkFDVCxPQUFPLEVBQUUsQ0FDYjtxQkFDQSxPQUFPLEVBQUUsQ0FBQztZQUNmLENBQUM7WUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBQ0QsT0FBTztnQkFDTCxNQUFNLEVBQUUsV0FBVztnQkFDbkIsS0FBSyxFQUFFO29CQUNMLE1BQU0sRUFBRSxZQUFZO29CQUNwQixnQkFBZ0IsRUFBRSxLQUFLLENBQUMsZ0JBQWdCO29CQUN4QyxzQkFBc0IsRUFBRSxrQkFBa0I7b0JBQzFDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztvQkFDOUIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO29CQUN0QyxPQUFPLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7aUJBQy9CO2dCQUNELEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsWUFBWTtvQkFDcEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO29CQUNoQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87b0JBQ3RCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtpQkFDckI7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLE1BQU0sRUFBRSxZQUFZO29CQUNwQixHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtvQkFDeEIsZUFBZSxFQUFFLGNBQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU87b0JBQ3JFLHdCQUF3QixFQUFFLHlCQUF5QjtpQkFDcEQ7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLE1BQU0sRUFBRSxZQUFZO29CQUNwQixVQUFVLEVBQUUsSUFBQSxnQkFBUyxHQUFFO3lCQUNwQixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzt5QkFDakIsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQzt5QkFDbEMsT0FBTyxFQUFFO29CQUNaLE9BQU8sRUFBRTt3QkFDUCxNQUFNLEVBQUUsZUFBZTt3QkFDdkIsV0FBVyxFQUFFLE1BQU07d0JBQ25CLFdBQVcsRUFBRSxjQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPO3dCQUNqRSxTQUFTLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7cUJBQ2pDO29CQUNELGVBQWUsRUFBRSxLQUFLLENBQUMsZUFBZTtpQkFDdkM7YUFDRixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxpQkFBaUI7WUFDckIsT0FBTyxNQUFNLENBQUMsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUM7WUFDL0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFDRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sMkJBQTJCLEVBQUUsQ0FBQztZQUU3RCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUM1QixnQ0FBYSxDQUFDLFdBQVcsQ0FBQyxjQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQ3BELENBQUM7WUFDRixNQUFNLGNBQWMsR0FBRyxNQUFNLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6RSxJQUFJLENBQUMsY0FBYztnQkFBRSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNsRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDakUsTUFBTSxXQUFXLEdBQUcsTUFBTSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDbEQsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQztZQUMxQyxJQUFJLENBQUMsTUFBTTtnQkFBRSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUU5QyxNQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFTLEdBQUUsQ0FBQztZQUUzQixJQUFBLHdCQUFZLEVBQUM7Z0JBQ1gsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLGdCQUFnQixFQUFFLElBQUEsZ0JBQVMsR0FBRTtxQkFDMUIsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUM7cUJBQ3BDLE9BQU8sRUFBRTtnQkFDWixzQkFBc0IsRUFBRSxJQUFBLGdCQUFTLEdBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BFLHdCQUF3QixFQUFFLGNBQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO2dCQUNsRCxPQUFPLEVBQUUsT0FBTzthQUNqQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFWCxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQ2hCLE1BQU0sRUFDTjtnQkFDRSxLQUFLLEVBQUUsSUFBQSxhQUFNLEVBQUMsS0FBSyxDQUFDO2dCQUNwQixNQUFNLEVBQUUsSUFBSTthQUNiLEVBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLGVBQWUsRUFBRSxJQUFBLGdCQUFTLEdBQUU7cUJBQ3pCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDO3FCQUN0QixZQUFZLENBQUMsY0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztxQkFDdEMsUUFBUSxDQUFDLElBQUEsZ0JBQVMsR0FBRSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUM7cUJBQzFELFFBQVEsQ0FBQyxJQUFBLGdCQUFTLEdBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDNUMsT0FBTyxFQUFFO2dCQUNaLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixjQUFjLEVBQUUsSUFBQSxhQUFNLEVBQUMsS0FBSyxDQUFDO2dCQUM3QixTQUFTLEVBQUUsTUFBTSxDQUFDLE9BQU87Z0JBQ3pCLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixvQkFBb0IsRUFBRSxNQUFNLENBQUMsT0FBTzthQUNyQyxDQUNGLENBQUM7WUFFRix3QkFBd0I7WUFDeEIsa0JBQWtCO1lBQ2xCLG9CQUFvQjtZQUNwQixzQ0FBc0M7WUFDdEMsb0RBQW9EO1lBQ3BELGtCQUFrQjtZQUNsQixrRUFBa0U7WUFDbEUsV0FBVztZQUNYLDhEQUE4RDtZQUM5RCx1REFBdUQ7WUFDdkQsa0JBQWtCO1lBQ2xCLGlCQUFpQjtZQUNqQixPQUFPO1lBQ1AsMENBQTBDO1lBQzFDLHFCQUFxQjtZQUNyQixLQUFLO1lBRUwsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNkLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNoQixPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sR0FBRyxFQUFFLEVBQUUsQ0FBQztnQkFDaEMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLFFBQVEsR0FBRyxDQUNmLE1BQU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQzNELENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLGdCQUFnQixFQUFFLENBQUM7b0JBQzVELE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDL0MsT0FBTyxFQUFFLENBQUM7b0JBQ1YsU0FBUztnQkFDWCxDQUFDO2dCQUNELE1BQU0sR0FBRyxHQUFHLE1BQU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3ZFLEtBQUssTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUM3QyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQzFELElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxnQkFBZ0IsRUFBRSxDQUFDOzRCQUN0RCxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQy9DLFNBQVM7d0JBQ1gsQ0FBQzt3QkFDRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLFVBQVUsRUFBRSxDQUFDOzRCQUNuRCxTQUFTO3dCQUNYLENBQUM7d0JBQ0QsTUFBTSxHQUFHLEdBQUcsSUFBQSwyQkFBZSxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQzt3QkFDaEQsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLGdCQUFnQjs2QkFDeEMsT0FBTyxFQUFFOzZCQUNULGlCQUFpQixFQUFFLENBQUM7d0JBQ3ZCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxzQkFBc0I7NkJBQzNDLE9BQU8sRUFBRTs2QkFDVCxpQkFBaUIsRUFBRSxDQUFDO3dCQUN2QixJQUFJLGdCQUFnQixLQUFLLGNBQWMsSUFBSSxFQUFFLEtBQUssV0FBVyxFQUFFLENBQUM7NEJBQzlELE9BQU8sR0FBRyxJQUFJLENBQUM7NEJBQ2YsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ3RDLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO2dCQUNELE9BQU8sRUFBRSxDQUFDO1lBQ1osQ0FBQztZQUVELE9BQU87Z0JBQ0wsR0FBRyxFQUFFLFNBQVM7Z0JBQ2QsSUFBSTtvQkFDRixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxJQUFHLENBQUM7UUFDakQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN0QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUFvQixDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQ1osTUFBTSxFQUNOO2dCQUNFLEtBQUssRUFBRSxJQUFBLGFBQU0sRUFBQyxLQUFLLENBQUM7YUFDckIsRUFDRCxNQUFNLENBQ1AsQ0FBQztZQUNGLE9BQU87UUFDVCxDQUFDO1FBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVU7WUFDekMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDNUIsZ0NBQWEsQ0FBQyxXQUFXLENBQUMsY0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUNuRCxDQUFDO1lBQ0YsTUFBTSxhQUFhLEdBQUcsTUFBTSxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxRCxNQUFNLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4RCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUN4RCxNQUFNLGlCQUFpQixHQUFHLENBQ3hCLE1BQU0sVUFBVSxDQUFDLG9CQUFvQixFQUFFLENBQ3hDLENBQUMsa0JBQWtCO2lCQUNqQixPQUFPLEVBQUU7aUJBQ1QsY0FBYyxFQUFFLENBQUM7WUFDcEIsTUFBTSxhQUFhLEdBQUcsTUFBTSxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLENBQ2xFLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ0osT0FBTztvQkFDTCxJQUFJLEVBQUUsTUFBTTtvQkFDWixNQUFNLEVBQUUsTUFBTTtpQkFDZixDQUFDO1lBQ0osQ0FBQyxDQUNGLENBQUM7WUFFRixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUN6Qix3QkFBTyxDQUFDLFdBQVcsQ0FDakIsQ0FBQyxNQUFNLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDekQsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQy9CLENBQ0YsQ0FBQztZQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzlDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyRCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNyQyxNQUFNLE9BQU8sR0FBVyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztnQkFDekMsQ0FBQyxDQUFDLEdBQUc7Z0JBQ0wsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUM1QixDQUFDLEVBQ0QsaUJBQWlCLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FDdkMsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNkLE1BQU0sRUFBRSxHQUFHLE1BQU0sZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNwRCxPQUFPO29CQUNMLElBQUksRUFBRSxNQUFNO2lCQUNiLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUNILE9BQU87Z0JBQ0wsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsTUFBTSxFQUFFLGFBQWEsQ0FBQyxJQUFJLElBQUksTUFBTTtnQkFDcEMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksYUFBYSxDQUFDLElBQUksSUFBSSxNQUFNO2dCQUM3QyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUN6QixDQUFDO1FBQ0osQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBcGRELGdDQW9kQyJ9