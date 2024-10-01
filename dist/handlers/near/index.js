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
        validateAddress(address) {
            if (address.includes(".near") || address.includes(".testnet")) {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
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