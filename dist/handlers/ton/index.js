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
            const txs = await client.getTransactions(bridge.address, {
                hash: txHash,
                limit: 100,
            });
            if (!txs.length) {
                throw new Error("Transaction not found");
            }
            for (const tx of txs) {
                for (let i = 0; i < tx.outMessages.size; i++) {
                    const msg = tx.outMessages.get(i) ?? raise("Unreachable");
                    const hash = txHash;
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
                value: (0, core_1.toNano)("0.8"),
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
                forward_amount: (0, core_1.toNano)("0.5"),
                new_owner: bridge.address,
                query_id: 42069n,
                response_destination: bridge.address,
            });
            let foundTx = false;
            let hash = "";
            let retries = 0;
            while (!foundTx && retries < 10) {
                await new Promise((e) => setTimeout(e, 2000));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdG9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9DQUFtRTtBQUVuRSxrREFBMEI7QUFDMUIsa0VBTTRDO0FBQzVDLGdGQUEwRTtBQUUxRSw0RUFBa0U7QUFDbEUsaUNBQThDO0FBRzlDLFNBQWdCLEtBQUssQ0FBQyxPQUFlO0lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUZELHNCQUVDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLEVBQ3pCLE1BQU0sRUFDTixhQUFhLEVBQ2IsT0FBTyxHQUNJO0lBQ1gsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRTVCLEtBQUssVUFBVSxlQUFlLENBQUMsR0FBVztRQUN4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDMUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztRQUN2QixDQUFDO1FBQ0QsSUFBSSxHQUFHLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQzdCLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FDN0Isd0JBQXdCLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQ3JELENBQUM7WUFDRixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDdkIsQ0FBQztRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUMxQyxD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