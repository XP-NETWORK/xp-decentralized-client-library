"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexStringToUtf8 = exports.aptosHandler = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const aptos_1 = require("aptos");
const ton_1 = require("../ton");
const bridge_client_1 = require("./bridge-client");
function aptosHandler({ bridge, network, storage, }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvYXB0b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQXdEO0FBQ3hELGlDQUFrQztBQUNsQyxnQ0FBK0I7QUFFL0IsbURBQStDO0FBRy9DLFNBQWdCLFlBQVksQ0FBQyxFQUMzQixNQUFNLEVBQ04sT0FBTyxFQUNQLE9BQU8sR0FDTTtJQUNiLE1BQU0sTUFBTSxHQUFHLElBQUksb0JBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxjQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsTUFBTSxFQUFFLEdBQUcsSUFBSSw0QkFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUUzQyxPQUFPO1FBQ0wsS0FBSyxDQUFDLGlCQUFpQjtZQUNyQixNQUFNLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsRUFBRTtnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDeEQsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDbkMsQ0FBQztRQUNELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUMvQixNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssQ0FBQywyQkFBMkIsQ0FBQztnQkFDMUQsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsV0FBVyxFQUFFLHVCQUF1QixFQUFFLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxNQUFNLGtCQUFrQjtnQkFDMUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJO2dCQUNiLEdBQUcsRUFBRSxvQkFBb0I7YUFDMUIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMs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