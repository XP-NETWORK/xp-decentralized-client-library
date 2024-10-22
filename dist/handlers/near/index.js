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
        async nftList(owner, contract) {
            const nft = new near_api_js_1.Contract(provider.connection, contract, {
                changeMethods: [],
                viewMethods: ["nft_tokens_for_owner"],
                useLocalViewExecution: false,
            });
            //@ts-ignore
            const tokens = await nft.nft_tokens_for_owner({ account_id: owner });
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            return tokens.map((e) => {
                return {
                    native: e,
                    uri: e.metadata.media || e.metadata.extra,
                    tokenId: e.token_id,
                    collectionIdent: contract,
                };
            });
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
        async mintNft(connection, ma, gasArgs) {
            const call = await connection.signAndSendTransaction({
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            args: {
                                token_id: ma.token_id,
                                receiver_id: ma.owner,
                                metadata: {
                                    title: ma.title || "Xp Nft",
                                    description: ma.description || "Xp Nft Description",
                                    media: ma.uri,
                                },
                            },
                            // biome-ignore lint/style/noNonNullAssertion: <explanation>
                            deposit: (0, format_1.parseNearAmount)("0.007"),
                            gas: gasArgs ? gasArgs.gasLimit.toString() : "",
                            methodName: "nft_mint",
                        },
                    },
                ],
                receiverId: ma.contract,
            });
            return call?.transaction.hash;
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
                token_amount: Number(input.tokenAmount),
                token_id: input.tokenId,
                transaction_hash: input.transactionHash,
                lock_tx_chain: input.lockTxChain,
            };
        },
        async approveNft(connection, tokenId, contract) {
            const approve = await connection.signAndSendTransaction({
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            args: {
                                token_id: tokenId,
                                account_id: bridge,
                                msg: null,
                            },
                            // biome-ignore lint/style/noNonNullAssertion: <explanation>
                            deposit: (0, format_1.parseNearAmount)("0.005"),
                            methodName: "nft_approve",
                            gas: "50000000",
                        },
                    },
                ],
                receiverId: contract,
            });
            return approve?.transaction.hash;
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
        async lockNft(connection, sourceNft, destinationChain, to, tokenId, metadata_uri) {
            const locked = await connection.signAndSendTransaction({
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            args: {
                                source_nft_contract_address: sourceNft,
                                destination_chain: destinationChain,
                                destination_address: to,
                                token_id: tokenId.toString(),
                                metadata_uri,
                            },
                            // biome-ignore lint/style/noNonNullAssertion: <explanation>
                            deposit: (0, format_1.parseNearAmount)("2"),
                            gas: "100000000000000",
                            methodName: "lock_nft",
                        },
                    },
                ],
                receiverId: bridge,
            });
            return {
                ret: locked,
                hash() {
                    return locked?.transaction.hash;
                },
            };
        },
        async claimNft(connection, claimData, sig) {
            const claimed = await connection.signAndSendTransaction({
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            args: {
                                cd: claimData,
                                signatures: sig.map((e) => {
                                    return {
                                        signer: e.signerAddress.replace("0x", ""),
                                        signature: [
                                            ...Buffer.from(e.signature.replace("0x", ""), "hex"),
                                        ],
                                    };
                                }),
                            },
                            deposit: claimData.fee.toString(),
                            gas: "",
                            methodName: "claim_nft",
                        },
                    },
                ],
                receiverId: bridge,
            });
            return { hash: () => claimed?.transaction.hash, ret: claimed };
        },
        async getBalance(connection, _) {
            const ab = (await connection.getAccounts())[0];
            const acc = new near_api_js_1.Account(provider.connection, ab.accountId);
            const bal = await acc.getAccountBalance();
            return BigInt(bal.available);
        },
    };
}
exports.nearHandler = nearHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvbmVhci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBeUQ7QUFDekQseURBQStEO0FBQy9ELHVDQUE0QztBQUdyQyxLQUFLLFVBQVUsV0FBVyxDQUFDLEVBQ2hDLFNBQVMsRUFDVCxPQUFPLEVBQ1AsTUFBTSxFQUNOLE9BQU8sRUFDUCxVQUFVLEdBQ0U7SUFDWixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEscUJBQU8sRUFBQztRQUM3QixTQUFTO1FBQ1QsT0FBTztLQUNSLENBQUMsQ0FBQztJQUNILE1BQU0sRUFBRSxHQUFHLElBQUksc0JBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRTtRQUNuRCxhQUFhLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDO1FBQ3hDLHFCQUFxQixFQUFFLEtBQUs7UUFDNUIsV0FBVyxFQUFFLENBQUMsaUJBQWlCLENBQUM7S0FDakMsQ0FBQyxDQUFDO0lBRUgsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFhLEVBQUUsVUFBa0I7UUFDdEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxzQkFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFO1lBQzdELFdBQVcsRUFBRSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUM7WUFDMUMsYUFBYSxFQUFFLEVBQUU7WUFDakIscUJBQXFCLEVBQUUsS0FBSztTQUM3QixDQUFDLENBQUM7UUFDSCx5QkFBeUI7UUFDekIsTUFBTSxZQUFZLEdBQUcsTUFBTSxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbkUseUJBQXlCO1FBQ3pCLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUQsT0FBTztZQUNMLElBQUksRUFBRSxZQUFZLENB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