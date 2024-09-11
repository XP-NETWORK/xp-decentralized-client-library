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
const tep64_1 = require("./tep64");
function raise(message) {
    throw new Error(message);
}
exports.raise = raise;
function tonHandler({ client, bridgeAddress, storage, identifier, }) {
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
        try {
            const txns = await client.getTransactions(bridge.address, { limit: 1 });
            return txns[0].hash().toString("base64");
        }
        catch (ex) {
            return "null";
        }
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
                value: claimData.data3.fee + 1300000000n,
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
            const txs = await client.getTransactions(bridge.address, {
                hash: bridgeTxHash,
                limit: 10,
            });
            if (!txs.length)
                raise("Transaction not found");
            for (const tx of txs) {
                const om = tx.outMessages;
                for (let i = 0; i < tx.outMessagesCount; i++) {
                    const msg = om.get(i) ?? raise("Unreachable");
                    if (msg.body.asSlice().loadUint(32) === 663924102) {
                        const { newlyDeployCollection, tokenId, sourceChain, transactionHash, lockTxChain, } = (0, tonBridge_1.loadClaimedEvent)(msg.body.asSlice());
                        return {
                            nft_contract: newlyDeployCollection.toString(),
                            source_chain: sourceChain,
                            token_id: tokenId.toString(),
                            transaction_hash: transactionHash,
                            lock_tx_chain: lockTxChain,
                        };
                    }
                }
            }
            throw new Error("Claimed event not found");
        },
        async deployCollection(signer, da) {
            const nft = client.open(await nftc_1.TestnetNftCollection.fromInit(da.owner_address, (0, tep64_1.buildJettonContent)(da.collection_meta), da.royalty_params));
            await nft.send(signer, {
                value: (0, core_1.toNano)("0.5"),
            }, {
                $$type: "Deploy",
                queryId: 3424n,
            });
            while (!(await client.isContractDeployed(nft.address))) {
                await new Promise((e) => setTimeout(e, 2000));
            }
            return nft.address.toString();
        },
        async getClaimData(txHash) {
            const txs = await client.getTransactions(bridge.address, {
                hash: txHash,
                limit: 15,
            });
            if (!txs.length) {
                throw new Error("Transaction not found");
            }
            for (const tx of txs) {
                for (let i = 0; i < tx.outMessages.size; i++) {
                    const msg = tx.outMessages.get(i) ?? raise("Unreachable");
                    const hash = txHash;
                    if (msg.body.asSlice().loadUint(32) !== 2105076052) {
                        continue;
                    }
                    const { tokenId, // Unique ID for the NFT transfer
                    destinationChain, // Chain to where the NFT is being transferred
                    destinationUserAddress, // User's address in the destination chain
                    sourceNftContractAddress, // Address of the NFT contract in the source chain
                    tokenAmount, // amount of nfts to be transfered ( 1 in 721 case )
                    nftType, // Sigular or multiple ( 721 / 1155)
                    sourceChain, // Source chain of NFT
                    metaDataUri, } = (0, tonBridge_1.loadLockedEvent)(msg.body.asSlice());
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
                    let nft = {
                        metadata: "",
                        name: "",
                        royalty: 0n,
                        symbol: "",
                    };
                    try {
                        nft = await this.nftData(tokenId.toString(), getSourceNftContractAddress(), undefined);
                    }
                    catch (_) { }
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
                        metadata: nft.metadata,
                        name: nft.name,
                        symbol: nft.symbol,
                        royalty: nft.royalty.toString(),
                        transactionHash: hash,
                        lockTxChain: identifier,
                        eventUri: metaDataUri.asSlice().loadStringRefTail(),
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
                    metadata: (0, core_1.beginCell)()
                        .storeInt(1, 8)
                        .storeStringTail(input.metadata)
                        .endCell(),
                    royaltyReceiver: core_1.Address.parseFriendly(input.royaltyReceiver).address,
                    sourceNftContractAddress: sourceNftContractAddress_,
                },
                data4: {
                    $$type: "ClaimData4",
                    newContent: (0, tep64_1.buildJettonContent)({
                        name: input.name,
                        symbol: input.symbol,
                        description: "",
                    }),
                    royalty: {
                        $$type: "RoyaltyParams",
                        denominator: 10000n,
                        destination: core_1.Address.parseFriendly(input.royaltyReceiver).address,
                        numerator: BigInt(input.royalty),
                    },
                    transactionHash: input.transactionHash,
                    lockTxChain: input.lockTxChain,
                },
            };
        },
        async getValidatorCount() {
            return Number((await bridge.getValidatorsCount()) ?? 0);
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metaDataUri, _) {
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
                metaDataUri: (0, core_1.beginCell)().storeStringRefTail(metaDataUri).endCell(),
            })(locked);
            await nftItem.send(signer, {
                value: (0, core_1.toNano)("1.5"),
                bounce: true,
            }, {
                $$type: "Transfer",
                forward_payload: (0, core_1.beginCell)()
                    .storeInt(tokenId, 256)
                    .storeAddress(core_1.Address.parse(sourceNft))
                    .storeRef((0, core_1.beginCell)().storeStringRefTail(destinationChain))
                    .storeRef((0, core_1.beginCell)().storeStringRefTail(to))
                    .storeRef((0, core_1.beginCell)().storeStringRefTail(metaDataUri))
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
                        if (msg.body.asSlice().loadUint(32) !== 2105076052) {
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
            const contract = core_1.Address.parse(ma.contract);
            const prevHash = (await client.getTransactions(contract, { limit: 1 }))[0]
                .hash()
                .toString("base64");
            const nft = client.open(nftc_1.TestnetNftCollection.fromAddress(contract));
            await nft.send(signer, {
                value: (0, core_1.toNano)("0.4"),
            }, {
                $$type: "Mint",
                content: (0, core_1.beginCell)().storeInt(1, 8).storeStringTail(ma.uri).endCell(),
                owner: ma.owner,
                token_id: ma.token_id,
            });
            let foundTx = false;
            while (!foundTx) {
                await new Promise((e) => setTimeout(e, 2000));
                const tx = (await client.getTransactions(contract, { limit: 1 }))[0];
                if (tx.hash().toString("base64") === prevHash) {
                    await new Promise((e) => setTimeout(e, 10000));
                    continue;
                }
                foundTx = true;
            }
            return;
        },
        async nftData(tokenId, contract, _overrides) {
            const collection = client.open(tonNftCollection_1.NftCollection.fromAddress(core_1.Address.parse(contract)));
            const royaltyParams = await collection.getRoyaltyParams().catch((_) => {
                return {
                    $$type: "RoyaltyParams",
                    numerator: 0n,
                    denominator: 0n,
                    destination: bridge.address,
                };
            });
            const denom = 10000 / Number(royaltyParams.denominator);
            const royalty = Number(royaltyParams.numerator) * denom;
            const collection_md_slice = (await collection.getGetCollectionData()).collection_content.asSlice();
            collection_md_slice.loadInt(8);
            const collection_md_uri = collection_md_slice.loadStringTail();
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
            const firstBit = content.preloadBits(8).toString();
            if (firstBit === "01" || firstBit === "00") {
                content.loadBits(8);
            }
            const uri = content.loadStringTail();
            const nft_uri = uri.includes("://")
                ? uri
                : `${collection_md_uri.substring(0, collection_md_uri.lastIndexOf("/") + 1)}${uri}`;
            const md = await fetchHttpOrIpfs(nft_uri).catch((_) => {
                return {
                    name: undefined,
                };
            });
            return {
                metadata: nft_uri,
                symbol: collection_md.name ?? "TTON",
                name: md.name ?? collection_md.name ?? "TTON",
                royalty: BigInt(royalty),
            };
        },
    };
}
exports.tonHandler = tonHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdG9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9DQUFtRTtBQUVuRSxrREFBMEI7QUFDMUIsa0VBTTRDO0FBQzVDLGdGQUEwRTtBQUUxRSw0RUFBa0U7QUFFbEUsaUNBQThDO0FBQzlDLG1DQUE2QztBQUc3QyxTQUFnQixLQUFLLENBQUMsT0FBZTtJQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFGRCxzQkFFQztBQUVELFNBQWdCLFVBQVUsQ0FBQyxFQUN6QixNQUFNLEVBQ04sYUFBYSxFQUNiLE9BQU8sRUFDUCxVQUFVLEdBQ0M7SUFDWCxNQUFNLElBQUksR0FBRyxlQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFNUIsS0FBSyxVQUFVLGVBQWUsQ0FBQyxHQUFXO1FBQ3hDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUMxRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckMsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFLENBQUM7WUFDN0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUM3Qix3QkFBd0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FDckQsQ0FBQztZQUNGLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztRQUN2QixDQUFDO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxz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