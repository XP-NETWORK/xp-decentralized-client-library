"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexStringToUtf8 = exports.aptosHandler = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const aptos_1 = require("aptos");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvYXB0b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQXdEO0FBQ3hELGlDQUFrQztBQUVsQyxtREFBK0M7QUFHL0MsU0FBZ0IsWUFBWSxDQUFDLEVBQzNCLE1BQU0sRUFDTixPQUFPLEVBQ1AsT0FBTyxHQUNNO0lBQ2IsTUFBTSxNQUFNLEdBQUcsSUFBSSxvQkFBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLGNBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxNQUFNLEVBQUUsR0FBRyxJQUFJLDRCQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRTNDLE9BQU87UUFDTCxLQUFLLENBQUMsaUJBQWlCO1lBQ3JCLE1BQU0sRUFBRSxHQUFHLE1BQU0sRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxFQUFFO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUN4RCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNuQyxDQUFDO1FBQ0QsU0FBUyxDQUFDLEtBQUs7WUFDYixPQUFPO2dCQUNMLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztnQkFDakMsVUFBVSxFQUFFLEtBQUssQ0FBQyx3QkFBd0I7Z0JBQzFDLFdBQVcsRUFBRSxLQUFLLENBQUMsd0JBQXdCO2dCQUMzQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDckQsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUN0QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7Z0JBQ3hCLEdBQUcs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