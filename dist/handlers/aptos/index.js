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
        approveNft() {
            throw new Error("Approval not required in aptos");
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
            const signatures = sigs.map((e) => Buffer.from(e.signature.replace("0x", ""), "hex"));
            const signers = sigs.map((e) => Buffer.from(e.signerAddress));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvYXB0b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQXNFO0FBQ3RFLDBDQUFtRDtBQUNuRCxpQ0FBa0M7QUFDbEMsZ0NBQStCO0FBQy9CLCtCQUE0QjtBQUc1QixTQUFnQixZQUFZLENBQUMsRUFDM0IsTUFBTSxFQUNOLE9BQU8sRUFDUCxPQUFPLEVBQ1AsVUFBVSxHQUNHO0lBQ2IsTUFBTSxNQUFNLEdBQUcsSUFBSSxvQkFBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLGNBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxNQUFNLEVBQUUsR0FBRyxJQUFBLHVCQUFnQixFQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFBLFNBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRXZELE9BQU87UUFDTCxlQUFlLENBQUMsT0FBTztZQUNyQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBQSxxQkFBWSxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELFVBQVU7UUFDVixLQUFLLENBQUMsaUJBQWlCO1lBQ3JCLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2dCQUN6QyxpQkFBaUIsRUFBRSxFQUFFO2dCQUNyQixhQUFhLEVBQUUsRUFBRTthQUNsQixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsRUFBRTtnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDeEQsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFD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