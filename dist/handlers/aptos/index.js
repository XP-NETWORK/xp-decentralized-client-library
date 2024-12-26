"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexStringToUtf8 = exports.aptosHandler = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const surf_1 = require("@thalalabs/surf");
const aptos_1 = require("aptos");
const ton_1 = require("../ton");
const abi_1 = require("./abi");
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
            const [bd] = await bc.view.validator_count({
                functionArguments: [],
                typeArguments: [],
            });
            if (!bd)
                throw new Error("Failed to fetch bridge data");
            return Number.parseInt(bd);
        },
        async deployNftCollection(signer, da) {
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
            const balance = await aptos.getAccountAPTAmount({
                accountAddress: signer.accountAddress,
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
            const response = await bc.entry.claim_1155({
                account: signer,
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
            const response = await bc.entry.claim_721({
                account: signer,
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
            return {
                hash() {
                    return response.hash;
                },
                ret: response,
            };
        },
        async lockNft(signer, sourceNft, destinationChain, destinationUserAddress, tokenId, metadataUri) {
            const lock = await bc.entry.lock_721({
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
                    return lock.hash;
                },
                ret: lock,
            };
        },
        async lockSft(signer, sourceNft, destinationChain, destinationUserAddress, tokenId, amount, metadataUri) {
            const lock = await bc.entry.lock_1155({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvYXB0b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQXNFO0FBQ3RFLDBDQUFtRDtBQUNuRCxpQ0FBa0M7QUFDbEMsZ0NBQStCO0FBQy9CLCtCQUE0QjtBQUc1QixTQUFnQixZQUFZLENBQUMsRUFDM0IsTUFBTSxFQUNOLE9BQU8sRUFDUCxPQUFPLEVBQ1AsVUFBVSxHQUNHO0lBQ2IsTUFBTSxNQUFNLEdBQUcsSUFBSSxvQkFBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLGNBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxNQUFNLEVBQUUsR0FBRyxJQUFBLHVCQUFnQixFQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFBLFNBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRXZELE9BQU87UUFDTCxlQUFlLENBQUMsT0FBTztZQUNyQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBQSxxQkFBWSxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDcEIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQztZQUNuRSxNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztnQkFDL0MsY0FBYyxFQUFFLEtBQUs7Z0JBQ3JCLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUM7YUFDNUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RCLE9BQU87b0JBQ0wsZUFBZSxFQUNiLENBQUMsQ0FBQyxr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