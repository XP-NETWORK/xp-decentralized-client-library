"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexStringToUtf8 = exports.aptosHandler = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const aptos_1 = require("aptos");
const ton_1 = require("../ton");
const bridge_client_1 = require("./bridge-client");
function aptosHandler({ bridge, network, storage, identifier, }) {
    const config = new ts_sdk_1.AptosConfig({ network });
    const aptos = new ts_sdk_1.Aptos(config);
    const bc = new bridge_client_1.BridgeClient(aptos, bridge);
    return {
        async getValidatorCount() {
            const bd = await bc.getBridgeData();
            if (!bd)
                throw new Error("Failed to fetch bridge data");
            return bd.validators.data.length;
        },
        async deployCollection(signer, da) {
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
            const tx = await aptos.waitForTransaction({
                transactionHash: response.hash,
                options: {
                    checkSuccess: true,
                },
            });
            const alicesCollection = await aptos.getCollectionData({
                creatorAddress: signer.accountAddress,
                collectionName: da.name,
                minimumLedgerVersion: BigInt(tx.version),
            });
            return alicesCollection.collection_id;
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
            return (assets.find((e) => e.current_token_data?.collection_id === ma.contract &&
                e.current_token_data.token_name === ma.name)?.token_data_id ?? (0, ton_1.raise)("Failed to send tx"));
        },
        transform(input) {
            return {
                amount: Number(input.tokenAmount),
                collection: input.sourceNftContractAddress,
                description: input.sourceNftContractAddress,
                destinationChain: Buffer.from(input.destinationChain),
                fee: Number(input.fee),
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
            };
        },
        approveNft() {
            throw new Error("Approval not required in aptos ");
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
        async getClaimData(transactionHash) {
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
            const destinationChain = hexStringToUtf8(event.data.destination_chain);
            const fee = await storage.chainFee(destinationChain);
            const royaltyReceiver = await storage.chainRoyalty(destinationChain);
            let data = {
                metadata: "",
                name: "",
                royalty: 0n,
                symbol: "",
            };
            try {
                data = await this.nftData(hexStringToUtf8(event.data.source_nft_contract_address), "", undefined);
            }
            catch (e) { }
            return {
                tokenAmount: event.data.token_amount,
                sourceChain: hexStringToUtf8(event.data.self_chain),
                sourceNftContractAddress: hexStringToUtf8(event.data.source_nft_contract_address),
                tokenId: event.data.token_id,
                destinationChain: hexStringToUtf8(event.data.destination_chain),
                destinationUserAddress: event.data.destination_user_address,
                nftType: hexStringToUtf8(event.data.nft_type),
                fee: fee.toString(),
                royaltyReceiver,
                metadata: data.metadata,
                name: data.name,
                royalty: data.royalty.toString(),
                transactionHash: transactionHash,
                symbol: data.symbol,
                lockTxChain: identifier,
                eventUri: "",
            };
        },
        async claimSft(signer, claimData, sigs) {
            const signatures = sigs.map((e) => Buffer.from(e.signature.replace("0x", ""), "hex"));
            const signers = sigs.map((e) => Buffer.from(e.signerAddress));
            const response = await bc.claim1155(signer, claimData, signatures, signers);
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
            const response = await bc.claim721(signer, claimData, signatures, signers);
            return {
                hash() {
                    return response.hash;
                },
                ret: response,
            };
        },
        async lockNft(signer, sourceNft, destinationChain, _, tokenId) {
            const lock = await bc.lock721(signer, sourceNft, tokenId.toString(), Buffer.from(destinationChain), 0, Buffer.from(sourceNft));
            return {
                hash() {
                    return lock.hash;
                },
                ret: lock,
            };
        },
        async lockSft(signer, sourceNft, destinationChain, _, tokenId, amount) {
            const lock = await bc.lock1155(signer, sourceNft, tokenId.toString(), Number(amount), Buffer.from(destinationChain), 0, Buffer.from(sourceNft));
            return {
                hash() {
                    return lock.hash;
                },
                tx: lock,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvYXB0b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQXdEO0FBQ3hELGlDQUFrQztBQUNsQyxnQ0FBK0I7QUFFL0IsbURBQStDO0FBRy9DLFNBQWdCLFlBQVksQ0FBQyxFQUMzQixNQUFNLEVBQ04sT0FBTyxFQUNQLE9BQU8sRUFDUCxVQUFVLEdBQ0c7SUFDYixNQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksY0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLE1BQU0sRUFBRSxHQUFHLElBQUksNEJBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFM0MsT0FBTztRQUNMLEtBQUssQ0FBQyxpQkFBaUI7WUFDckIsTUFBTSxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDcEMsSUFBSSxDQUFDLEVBQUU7Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ25DLENBQUM7UUFDRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDL0IsTUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsMkJBQTJCLENBQUM7Z0JBQzFELE9BQU8sRUFBRSxNQUFNO2dCQUNmLFdBQVcsRUFBRSx1QkFBdUIsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsTUFBTSxrQkFBa0I7Z0JBQzFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSTtnQkFDYixHQUFHLEVBQUUsb0JBQW9CO2FBQzFCLENBQUMsQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0s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