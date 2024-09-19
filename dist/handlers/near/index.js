"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearHandler = void 0;
const near_api_js_1 = require("near-api-js");
const format_1 = require("near-api-js/lib/utils/format");
const utils_1 = require("../../utils");
async function nearHandler({ networkId, nodeUrl, bridge, storage, identifier, }) {
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
            royalty: BigInt(Object.values(nft_metadata.metadata.royalty || { a: 0 }).reduce(
            //@ts-ignore ik it works
            (e, c) => c + e)),
        };
    }
    return {
        identifier,
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
                attachedDeposit: BigInt((0, format_1.parseNearAmount)("0.007") ?? 0),
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
                attachedDeposit: BigInt((0, format_1.parseNearAmount)("0.005") ?? 0),
            });
            return approve.transaction.hash;
        },
        async decodeLockedEvent(txHash) {
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
            return {
                destinationChain,
                destinationUserAddress: parsed.destination_user_address,
                tokenAmount,
                tokenId,
                nftType: parsed.nft_type,
                sourceNftContractAddress: parsed.source_nft_contract_address,
                sourceChain,
                transactionHash: txHash,
                lockTxChain: identifier,
                metaDataUri: parsed.metadata_uri,
            };
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metadata_uri) {
            const locked = await signer.functionCall({
                contractId: bridge,
                methodName: "lock_nft",
                args: {
                    source_nft_contract_address: sourceNft,
                    destination_chain: destinationChain,
                    destination_address: to,
                    token_id: tokenId.toString(),
                    metadata_uri,
                },
                gas: 100000000000000n,
                attachedDeposit: BigInt((0, format_1.parseNearAmount)("2") ?? 0),
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
exports.nearHandler = nearHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvbmVhci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBZ0Q7QUFDaEQseURBQStEO0FBQy9ELHVDQUE0QztBQUdyQyxLQUFLLFVBQVUsV0FBVyxDQUFDLEVBQ2hDLFNBQVMsRUFDVCxPQUFPLEVBQ1AsTUFBTSxFQUNOLE9BQU8sRUFDUCxVQUFVLEdBQ0U7SUFDWixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEscUJBQU8sRUFBQztRQUM3QixTQUFTO1FBQ1QsT0FBTztLQUNSLENBQUMsQ0FBQztJQUNILE1BQU0sRUFBRSxHQUFHLElBQUksc0JBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRTtRQUNuRCxhQUFhLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDO1FBQ3hDLHFCQUFxQixFQUFFLEtBQUs7UUFDNUIsV0FBVyxFQUFFLENBQUMsaUJBQWlCLENBQUM7S0FDakMsQ0FBQyxDQUFDO0lBRUgsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFhLEVBQUUsVUFBa0I7UUFDdEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxzQkFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFO1lBQzdELFdBQVcsRUFBRSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUM7WUFDMUMsYUFBYSxFQUFFLEVBQUU7WUFDakIscUJBQXFCLEVBQUUsS0FBSztTQUM3QixDQUFDLENBQUM7UUFDSCx5QkFBeUI7UUFDekIsTUFBTSxZQUFZLEdBQUcsTUFBTSxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbkUseUJBQXlCO1FBQ3pCLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUQsT0FBTztZQUNMLElBQUksRUFBRSxZQUFZLENB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