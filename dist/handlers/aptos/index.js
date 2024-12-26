"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexStringToUtf8 = exports.aptosHandler = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const surf_1 = require("@thalalabs/surf");
const aptos_1 = require("aptos");
const ton_1 = require("../ton");
const abi_1 = require("./abi");
const types_1 = require("./types");
function aptosHandler({ bridge, network, storage, identifier, }) {
    const config = new ts_sdk_1.AptosConfig({ network });
    const aptos = new ts_sdk_1.Aptos(config);
    const bc = (0, surf_1.createSurfClient)(aptos).useABI((0, abi_1.ABI)(bridge));
    return {
        validateAddress(address) {
            return Promise.resolve((0, ts_sdk_1.isBcsAddress)(address));
        },
        async nftList(owner, _) {
            const ledgerVersion = (await aptos.getLedgerInfo()).ledger_version;
            const tokens = await aptos.getAccountOwnedTokens({
                accountAddress: owner,
                minimumLedgerVersion: BigInt(ledgerVersion),
            });
            return tokens.map((e) => {
                return {
                    collectionIdent: e.current_token_data?.current_collection?.collection_id ?? "",
                    native: {
                        tokenId: e.current_token_data?.token_data_id ?? "",
                        amount: e.amount,
                    },
                    tokenId: e.current_token_data?.token_data_id ?? "",
                    type: "NFT",
                    uri: e.current_token_data?.token_uri ?? "",
                };
            });
        },
        identifier,
        async getValidatorCount() {
            const bc = (0, surf_1.createSurfClient)(aptos).useABI((0, abi_1.ABI)(bridge));
            const [bd] = await bc.view.validator_count({
                functionArguments: [],
                typeArguments: [],
            });
            if (!bd)
                throw new Error("Failed to fetch bridge data");
            return Number.parseInt(bd);
        },
        async deployNftCollection(signer, da) {
            if ((0, types_1.isWindowSigner)(signer)) {
                throw new Error("Unsupported signer");
            }
            const transaction = await aptos.createCollectionTransaction({
                creator: signer,
                description: `Testnet Collection: ${da.name}(${da.symbol}) by XP Network.`,
                name: da.name,
                uri: "https://xp.network",
            });
            const response = await aptos.signAndSubmitTransaction({
                signer,
                transaction,
            });
            await aptos.waitForTransaction({
                transactionHash: response.hash,
                options: {
                    checkSuccess: true,
                },
            });
            return da.name;
        },
        async mintNft(signer, ma) {
            if ((0, types_1.isWindowSigner)(signer)) {
                throw new Error("Unsupported signer");
            }
            const transaction = await aptos.mintDigitalAssetTransaction({
                collection: ma.contract,
                creator: signer,
                name: ma.name,
                uri: ma.uri,
                description: "Test Asset for XP Network",
            });
            const response = await aptos.signAndSubmitTransaction({
                signer,
                transaction,
            });
            const tx = await aptos.waitForTransaction({
                transactionHash: response.hash,
                options: {
                    checkSuccess: true,
                },
            });
            const assets = await aptos.getOwnedDigitalAssets({
                ownerAddress: signer.accountAddress,
                minimumLedgerVersion: BigInt(tx.version),
            });
            return (assets.find((e) => e.current_token_data?.current_collection?.collection_name ===
                ma.contract && e.current_token_data?.token_name === ma.name)?.token_data_id ?? (0, ton_1.raise)("Failed to send tx"));
        },
        transform(input) {
            return {
                amount: BigInt(input.tokenAmount),
                collection: input.sourceNftContractAddress,
                description: input.sourceNftContractAddress,
                destinationChain: Buffer.from(input.destinationChain),
                fee: BigInt(input.fee),
                metadata: input.metadata,
                uri: input.metadata,
                royaltyPayeeAddress: aptos_1.HexString.ensure(input.royaltyReceiver),
                royaltyPointsNumerator: Number(input.royalty),
                royaltyPointsDenominator: 10000,
                sourceChain: Buffer.from(input.sourceChain),
                nftType: Buffer.from(input.nftType),
                symbol: input.symbol,
                iconUri: input.metadata,
                projectUri: input.metadata,
                tokenId: input.tokenId,
                transactionHash: Buffer.from(input.transactionHash),
                sourceNftContractAddress: Buffer.from(input.sourceNftContractAddress),
                destination_chain: input.destinationChain,
                destinationUserAddress: input.destinationUserAddress,
                name: input.name,
                nft_type: input.nftType,
                royaltyPercentage: BigInt(input.royalty),
                royaltyReceiver: input.royaltyReceiver,
                source_chain: input.sourceChain,
                source_nft_contract_address: input.sourceNftContractAddress,
                token_id: BigInt(input.tokenId),
                transaction_hash: input.transactionHash,
            };
        },
        // @ts-ignore
        async approveNft() {
            return Promise.resolve("Approval not required in aptos");
        },
        async getBalance(signer) {
            if ((0, types_1.isAccount)(signer)) {
                const balance = await aptos.getAccountAPTAmount({
                    accountAddress: signer.accountAddress,
                });
                return BigInt(balance);
            }
            const acc = await signer.account();
            const balance = await aptos.getAccountAPTAmount({
                accountAddress: acc.address,
            });
            return BigInt(balance);
        },
        getProvider() {
            return aptos;
        },
        getStorageContract() {
            return storage;
        },
        async nftData(tokenId, _contract, _extraArgs) {
            const data = await aptos.digitalAsset.getDigitalAssetData({
                digitalAssetAddress: tokenId.replace("0x", ""),
            });
            return {
                metadata: data.token_uri,
                name: data.token_name,
                royalty: 0n,
                symbol: data.current_collection?.collection_name ?? "ANFT",
            };
        },
        async decodeLockedEvent(transactionHash) {
            const tx = await aptos.waitForTransaction({ transactionHash });
            const events = await aptos.getEvents({
                options: {
                    where: {
                        transaction_version: {
                            _eq: tx.version,
                        },
                    },
                },
            });
            const event = events.find((e) => e.type.includes("aptos_nft_bridge::LockedEvent"));
            if (!event)
                throw new Error("Event not found");
            return {
                tokenAmount: event.data.token_amount,
                sourceChain: hexStringToUtf8(event.data.self_chain),
                sourceNftContractAddress: hexStringToUtf8(event.data.source_nft_contract_address),
                tokenId: event.data.token_id,
                destinationChain: hexStringToUtf8(event.data.destination_chain),
                destinationUserAddress: event.data.destination_user_address,
                nftType: hexStringToUtf8(event.data.nft_type),
                transactionHash: transactionHash,
                lockTxChain: identifier,
                metaDataUri: "",
            };
        },
        async claimSft(signer, claimData, sigs) {
            const signatures = sigs.map((e) => Buffer.from(e.signature.replace("0x", ""), "hex"));
            const signers = sigs.map((e) => Buffer.from(e.signerAddress));
            if ((0, types_1.isAccount)(signer)) {
                const response = await bc.entry.claim_1155({
                    functionArguments: [
                        claimData.destinationUserAddress,
                        claimData.name,
                        claimData.uri,
                        claimData.royaltyPercentage,
                        claimData.royaltyReceiver,
                        claimData.fee,
                        signatures,
                        signers,
                        claimData.destination_chain,
                        claimData.source_chain,
                        claimData.source_nft_contract_address,
                        claimData.token_id,
                        claimData.transaction_hash,
                        claimData.nft_type,
                        claimData.metadata,
                        claimData.symbol,
                        claimData.amount,
                    ],
                    typeArguments: [],
                    account: signer,
                });
                return {
                    hash() {
                        return response.hash;
                    },
                    ret: response,
                };
            }
            const payload = (0, surf_1.createEntryPayload)((0, abi_1.ABI)(bridge), {
                function: "claim_1155",
                functionArguments: [
                    claimData.destinationUserAddress,
                    claimData.name,
                    claimData.uri,
                    claimData.royaltyPercentage,
                    claimData.royaltyReceiver,
                    claimData.fee,
                    signatures,
                    signers,
                    claimData.destination_chain,
                    claimData.source_chain,
                    claimData.source_nft_contract_address,
                    claimData.token_id,
                    claimData.transaction_hash,
                    claimData.nft_type,
                    claimData.metadata,
                    claimData.symbol,
                    claimData.amount,
                ],
                typeArguments: [],
            });
            const response = await signer.signAndSubmitTransaction({ payload });
            return {
                hash() {
                    return response.hash;
                },
                ret: response,
            };
        },
        async claimNft(signer, claimData, sigs) {
            const signatures = sigs.map((e) => Buffer.from(e.signature.slice(2), "hex"));
            const signers = sigs.map((e) => Buffer.from(e.signerAddress, "hex"));
            if ((0, types_1.isAccount)(signer)) {
                const response = await bc.entry.claim_721({
                    functionArguments: [
                        claimData.destinationUserAddress,
                        claimData.name,
                        claimData.uri,
                        claimData.royaltyPercentage,
                        claimData.royaltyReceiver,
                        claimData.fee,
                        signatures,
                        signers,
                        claimData.destination_chain,
                        claimData.source_chain,
                        claimData.source_nft_contract_address,
                        claimData.token_id,
                        claimData.transaction_hash,
                        claimData.nft_type,
                        claimData.metadata,
                        claimData.symbol,
                    ],
                    typeArguments: [],
                    account: signer,
                });
                return {
                    hash() {
                        return response.hash;
                    },
                    ret: response,
                };
            }
            const payload = (0, surf_1.createEntryPayload)((0, abi_1.ABI)(bridge), {
                function: "claim_721",
                functionArguments: [
                    claimData.destinationUserAddress,
                    claimData.name,
                    claimData.uri,
                    claimData.royaltyPercentage,
                    claimData.royaltyReceiver,
                    claimData.fee,
                    signatures,
                    signers,
                    claimData.destination_chain,
                    claimData.source_chain,
                    claimData.source_nft_contract_address,
                    claimData.token_id,
                    claimData.transaction_hash,
                    claimData.nft_type,
                    claimData.metadata,
                    claimData.symbol,
                ],
                typeArguments: [],
            });
            const response = await signer.signAndSubmitTransaction({ payload });
            return {
                hash() {
                    return response.hash;
                },
                ret: response,
            };
        },
        async lockNft(signer, sourceNft, destinationChain, destinationUserAddress, tokenId, metadataUri) {
            if ((0, types_1.isAccount)(signer)) {
                const response = await bc.entry.lock_721({
                    account: signer,
                    functionArguments: [
                        tokenId,
                        destinationChain,
                        destinationUserAddress,
                        sourceNft,
                        metadataUri,
                    ],
                    typeArguments: [],
                });
                return {
                    hash() {
                        return response.hash;
                    },
                    ret: response,
                };
            }
            const lp = (0, surf_1.createEntryPayload)((0, abi_1.ABI)(bridge), {
                function: "lock_721",
                functionArguments: [
                    tokenId,
                    destinationChain,
                    destinationUserAddress,
                    sourceNft,
                    metadataUri,
                ],
                typeArguments: [],
            });
            const lock = await signer.signAndSubmitTransaction({ payload: lp });
            return {
                hash() {
                    return lock.hash;
                },
                ret: lock,
            };
        },
        async lockSft(signer, sourceNft, destinationChain, destinationUserAddress, tokenId, amount, metadataUri) {
            if ((0, types_1.isAccount)(signer)) {
                const response = await bc.entry.lock_1155({
                    account: signer,
                    functionArguments: [
                        tokenId,
                        destinationChain,
                        destinationUserAddress,
                        sourceNft,
                        amount,
                        metadataUri,
                    ],
                    typeArguments: [],
                });
                return {
                    hash() {
                        return response.hash;
                    },
                    ret: response,
                };
            }
            const payload = (0, surf_1.createEntryPayload)((0, abi_1.ABI)(bridge), {
                function: "lock_1155",
                functionArguments: [
                    tokenId,
                    destinationChain,
                    destinationUserAddress,
                    sourceNft,
                    amount,
                    metadataUri,
                ],
                typeArguments: [],
            });
            const lock = await signer.signAndSubmitTransaction({ payload });
            return {
                hash() {
                    return lock.hash;
                },
                ret: lock,
            };
        },
    };
}
exports.aptosHandler = aptosHandler;
function hexStringToUtf8(src) {
    let source = src;
    if (source.startsWith("0x")) {
        source = src.replace("0x", "");
    }
    return Buffer.from(source, "hex").toString("utf-8");
}
exports.hexStringToUtf8 = hexStringToUtf8;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvYXB0b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQXNFO0FBQ3RFLDBDQUF1RTtBQUN2RSxpQ0FBa0M7QUFDbEMsZ0NBQStCO0FBQy9CLCtCQUE0QjtBQUM1QixtQ0FLaUI7QUFFakIsU0FBZ0IsWUFBWSxDQUFDLEVBQzNCLE1BQU0sRUFDTixPQUFPLEVBQ1AsT0FBTyxFQUNQLFVBQVUsR0FDRztJQUNiLE1BQU0sTUFBTSxHQUFHLElBQUksb0JBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxjQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsTUFBTSxFQUFFLEdBQUcsSUFBQSx1QkFBZ0IsRUFBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBQSxTQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUV2RCxPQUFPO1FBQ0wsZUFBZSxDQUFDLE9BQU87WUFDckIsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUEscUJBQVksRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BCLE1BQU0sYUFBYSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUM7WUFDbkUsTUFBTSxNQUFNLEdBQUcsTUFBTSxLQUFLLENBQUMscUJBQXFCLENBQUM7Z0JBQy9DLGNBQWMsRUFBRSxLQUFLO2dCQUNyQixvQkFBb0IsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDO2FBQzVDLENBQUMsQ0FBQztZQUNILE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUN0QixPQUFPO29CQUNMLGVBQWUsRUFD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