"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiversxHandler = void 0;
const near_api_js_1 = require("near-api-js");
const format_1 = require("near-api-js/lib/utils/format");
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
async function multiversxHandler({ networkId, nodeUrl, bridge, storage, identifier, }) {
    const provider = await (0, near_api_js_1.connect)({
        networkId,
        nodeUrl,
    });
    const bc = new near_api_js_1.Contract(provider.connection, bridge, {
        changeMethods: ["lock_nft", "claim_nft"],
        useLocalViewExecution: false,
        viewMethods: ["validator_count"],
    });
    async function nftData(nonce, collection) {
        const contract = new near_api_js_1.Contract(provider.connection, collection, {
            viewMethods: ["nft_token", "nft_metadata"],
            changeMethods: [],
            useLocalViewExecution: false,
        });
        //@ts-ignore ik it works.
        const nft_metadata = await contract.nft_token({ token_id: nonce });
        //@ts-ignore ik it works.
        const collection_metadata = await contract.nft_metadata();
        return {
            name: nft_metadata.metadata.title,
            symbol: collection_metadata.symbol,
            metadata: nft_metadata.metadata.media || nft_metadata.metadata.extra,
            royalty: BigInt(Object.values(nft_metadata.metadata.royalty).reduce(
            //@ts-ignore ik it works
            (e, c) => c + e)),
        };
    }
    return {
        nftData,
        async deployNftCollection(_signer, _da, _ga) {
            (0, utils_1.unimplemented)();
        },
        getProvider() {
            return provider;
        },
        async readClaimed721Event(hash) {
            const receipts = await provider.connection.provider.txStatusReceipts(hash, bridge, "FINAL");
            const log = receipts.receipts_outcome
                .map((e) => e.outcome.logs)
                .flatMap((e) => e)
                .filter((e) => e.includes("claimed"))[0];
            if (!log)
                throw new Error("No Claimed Event Found");
            const parsed = JSON.parse(log);
            return {
                transaction_hash: parsed.data.transaction_hash,
                nft_contract: parsed.data.contract,
                source_chain: parsed.data.source_chain,
                token_id: parsed.data.token_id,
                lock_tx_chain: parsed.data.lock_tx_chain,
            };
        },
        async getValidatorCount() {
            //@ts-ignore ik it works
            return bc.validator_count();
        },
        getStorageContract() {
            return storage;
        },
        async mintNft(signer, ma, gasArgs) {
            const call = await signer.functionCall({
                contractId: ma.contract,
                methodName: "nft_mint",
                args: {
                    token_id: ma.token_id,
                    receiver_id: ma.owner,
                    metadata: {
                        title: ma.title || "Xp Nft",
                        description: ma.description || "Xp Nft Description",
                        media: ma.uri,
                    },
                },
                attachedDeposit: format_1.NEAR_NOMINATION / 1000n,
                gas: gasArgs ? BigInt(gasArgs.gasLimit) : undefined,
            });
            return call.transaction.hash;
        },
        transform(input) {
            return {
                destination_chain: input.destinationChain,
                destination_user_address: input.destinationUserAddress,
                fee: input.fee,
                metadata: input.metadata,
                name: input.name,
                nft_type: input.nftType,
                royalty: Number(input.royalty),
                royalty_receiver: input.royaltyReceiver,
                source_chain: input.sourceChain,
                source_nft_contract_address: input.sourceNftContractAddress,
                symbol: input.symbol,
                token_amount: BigInt(input.tokenAmount),
                token_id: input.tokenId,
                transaction_hash: input.transactionHash,
                lock_tx_chain: input.lockTxChain,
            };
        },
        async approveNft(signer, tokenId, contract) {
            const approve = await signer.functionCall({
                contractId: contract,
                methodName: "nft_approve",
                args: {
                    token_id: tokenId,
                    account_id: bridge,
                    msg: null,
                },
                attachedDeposit: 0n,
            });
            return approve.transaction.hash;
        },
        async getClaimData(txHash) {
            const receipts = await provider.connection.provider.txStatusReceipts(txHash, bridge, "FINAL");
            const log = receipts.receipts_outcome
                .map((e) => e.outcome.logs)
                .flatMap((e) => e)
                .filter((e) => e.includes("locked"))[0];
            if (!log)
                throw new Error("No Locked Event Found");
            const parsed = JSON.parse(log).data;
            const destinationChain = parsed.destination_chain;
            const sourceChain = parsed.source_chain;
            const tokenId = parsed.token_id;
            const tokenAmount = parsed.token_amount.toString();
            const fee = await storage.chainFee(destinationChain);
            const royaltyReceiver = await storage.chainRoyalty(destinationChain);
            let metadata = {
                metadata: "",
                name: "",
                royalty: 0n,
                symbol: "",
            };
            if (sourceChain === "NEAR") {
                metadata = await nftData(tokenId, parsed.source_nft_contract_address);
            }
            const imgUri = (await (0, utils_2.fetchHttpOrIpfs)(metadata.metadata)).image;
            return {
                destinationChain,
                destinationUserAddress: parsed.destination_user_address,
                tokenAmount,
                tokenId,
                nftType: parsed.nft_type,
                sourceNftContractAddress: parsed.source_nft_contract_address,
                sourceChain,
                transactionHash: txHash,
                fee: fee.toString(),
                royaltyReceiver,
                metadata: metadata.metadata,
                name: metadata.name,
                symbol: metadata.symbol,
                royalty: metadata.royalty.toString(),
                lockTxChain: identifier,
                imgUri: imgUri,
            };
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metadata_uri) {
            const locked = await signer.functionCall({
                contractId: bridge,
                methodName: "lock_nft",
                args: {
                    source_nft_contract_address: sourceNft,
                    destination_chain: destinationChain,
                    destination_user_address: to,
                    token_id: tokenId,
                    metadata_uri,
                },
            });
            return {
                ret: locked,
                hash() {
                    return locked.transaction.hash;
                },
            };
        },
        async claimNft(signer, claimData, sig) {
            const claimed = await signer.functionCall({
                contractId: bridge,
                methodName: "claim_nft",
                args: {
                    cd: claimData,
                    signatures: sig.map((e) => {
                        return {
                            signer: e.signerAddress.replace("0x", ""),
                            signature: [...Buffer.from(e.signature.replace("0x", ""), "hex")],
                        };
                    }),
                },
                attachedDeposit: BigInt(claimData.fee),
            });
            return { hash: () => claimed.transaction.hash, ret: claimed };
        },
        async getBalance(signer, _) {
            const ab = await signer.getAccountBalance();
            return BigInt(ab.available);
        },
    };
}
exports.multiversxHandler = multiversxHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvbmVhci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBZ0Q7QUFDaEQseURBQStEO0FBQy9ELHVDQUE0QztBQUU1QyxvQ0FBMkM7QUFHcEMsS0FBSyxVQUFVLGlCQUFpQixDQUFDLEVBQ3RDLFNBQVMsRUFDVCxPQUFPLEVBQ1AsTUFBTSxFQUNOLE9BQU8sRUFDUCxVQUFVLEdBQ0U7SUFDWixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEscUJBQU8sRUFBQztRQUM3QixTQUFTO1FBQ1QsT0FBTztLQUNSLENBQUMsQ0FBQztJQUNILE1BQU0sRUFBRSxHQUFHLElBQUksc0JBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRTtRQUNuRCxhQUFhLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDO1FBQ3hDLHFCQUFxQixFQUFFLEtBQUs7UUFDNUIsV0FBVyxFQUFFLENBQUMsaUJBQWlCLENBQUM7S0FDakMsQ0FBQyxDQUFDO0lBRUgsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFhLEVBQUUsVUFBa0I7UUFDdEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxzQkFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFO1lBQzdELFdBQVcsRUFBRSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUM7WUFDMUMsYUFBYSxFQUFFLEVBQUU7WUFDakIscUJBQXFCLEVBQUUsS0FBSztTQUM3QixDQUFDLENBQUM7UUFDSCx5QkFBeUI7UUFDekIsTUFBTSxZQUFZLEdBQUcsTUFBTSxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbkUseUJBQXlCO1FBQ3pCLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUQsT0FBTztZQUNMLElB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