"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tonHandler = exports.raise = void 0;
const core_1 = require("@ton/core");
const tonBridge_1 = require("../../contractsTypes/ton/tonBridge");
const tonNftCollection_1 = require("../../contractsTypes/ton/tonNftCollection");
const tonNftContract_1 = require("../../contractsTypes/ton/tonNftContract");
const utils_1 = require("../utils");
const nftc_1 = require("./nftc");
const tep64_1 = require("./tep64");
function raise(message) {
    throw new Error(message);
}
exports.raise = raise;
function tonHandler({ client, bridgeAddress, storage, identifier, }) {
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
        identifier,
        validateAddress(address) {
            try {
                core_1.Address.parse(address);
                return Promise.resolve(true);
            }
            catch {
                return Promise.resolve(false);
            }
        },
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
        async deployNftCollection(signer, da) {
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
        async decodeLockedEvent(txHash) {
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
                        transactionHash: hash,
                        lockTxChain: identifier,
                        metaDataUri: metaDataUri.asSlice().loadStringRefTail(),
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
            const nftItemAddress = await collection.getGetNftAddressByIndex(BigInt(tokenId));
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
                tokenId: BigInt(tokenId),
                metaDataUri: (0, core_1.beginCell)().storeStringRefTail(metaDataUri).endCell(),
            })(locked);
            await nftItem.send(signer, {
                value: (0, core_1.toNano)("1.5"),
                bounce: true,
            }, {
                $$type: "Transfer",
                forward_payload: (0, core_1.beginCell)()
                    .storeInt(BigInt(tokenId), 256)
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
            const collection_md = await (0, utils_1.fetchHttpOrIpfs)(collection_md_uri).catch((_) => {
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
            const md = await (0, utils_1.fetchHttpOrIpfs)(nft_uri).catch((_) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdG9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9DQUFtRTtBQUVuRSxrRUFNNEM7QUFDNUMsZ0ZBQTBFO0FBRTFFLDRFQUFrRTtBQUNsRSxvQ0FBMkM7QUFDM0MsaUNBQThDO0FBQzlDLG1DQUE2QztBQUc3QyxTQUFnQixLQUFLLENBQUMsT0FBZTtJQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFGRCxzQkFFQztBQUVELFNBQWdCLFVBQVUsQ0FBQyxFQUN6QixNQUFNLEVBQ04sYUFBYSxFQUNiLE9BQU8sRUFDUCxVQUFVLEdBQ0M7SUFDWCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUN4QixrQkFBTSxDQUFDLFdBQVcsQ0FBQyxjQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNqRSxDQUFDO0lBRUYsS0FBSyxVQUFVLDJCQUEyQjtRQUN4QyxJQUFJLENBQUM7WUFDSCxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztZQUNaLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTztRQUNMLFVBQVU7UUFDVixlQUFlLENBQUMsT0FBTztZQUNyQixJQUFJLENBQUM7Z0JBQ0gsY0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdkIsT0FBTyxPQUFPLENBQUMsT0FB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