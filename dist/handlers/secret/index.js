"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecp256k1Pubkey = exports.encodeSecp256k1Signature = exports.secretHandler = void 0;
const promises_1 = require("fs/promises");
const secretjs_1 = require("secretjs");
const ton_1 = require("../ton");
function secretHandler({ bridge, provider, storage, bridgeCodeHash, }) {
    return {
        getProvider() {
            return provider;
        },
        async claimNft(signer, claimData, sigs, extraArgs) {
            const claim721 = {
                claim721: {
                    data: {
                        data: claimData,
                        signatures: sigs.map((e) => {
                            return {
                                signature: encodeSecp256k1Signature(Buffer.from(e.signerAddress, "hex"), Buffer.from(e.signature.replace("0x", ""), "hex")).signature,
                                signer_address: encodeSecp256k1Pubkey(Buffer.from(e.signerAddress, "hex")).value,
                            };
                        }),
                    },
                },
            };
            const tx = await signer.tx.compute.executeContract({
                contract_address: bridge,
                msg: claim721,
                code_hash: bridgeCodeHash,
                sender: signer.address,
                sent_funds: [{ amount: claimData.fee.toString(), denom: "uscrt" }],
            }, {
                gasLimit: 300000,
                ...extraArgs,
            });
            return {
                hash: () => tx.transactionHash,
                ret: tx,
            };
        },
        async deployCollection(signer, da, ga) {
            const stored = await signer.tx.compute.storeCode({
                wasm_byte_code: await (0, promises_1.readFile)("./contract.wasm.gz"),
                sender: "",
                builder: "",
                source: "",
            }, {
                ...ga,
            });
            const code = stored.arrayLog?.find((e) => e.key === "code_id")?.value;
            if (!code) {
                throw new Error("Code not found");
            }
            const contract = await signer.tx.compute.instantiateContract({
                code_id: code,
                init_msg: {
                    name: da.name,
                    symbol: da.symbol,
                    owner: signer.address,
                    config: {
                        public_token_supply: true,
                    },
                },
                init_funds: [],
                sender: signer.address,
                label: `${da.name}-${Date.now()}`,
            }, {
                ...ga,
            });
            const contractAddress = contract.arrayLog?.find((log) => log.type === "message" && log.key === "contract_address")?.value;
            return contractAddress ?? (0, ton_1.raise)("Contract not found");
        },
        mintNft(signer, ma, gasArgs) {
            const mint = signer.tx.snip721.mint({
                contract_address: ma.contractAddress,
                msg: {
                    mint_nft: {
                        public_metadata: {
                            token_uri: ma.uri,
                        },
                        token_id: ma.tokenId,
                        owner: signer.address,
                    },
                },
                sender: signer.address,
            }, gasArgs);
            return mint;
        },
        transform(input) {
            return {
                destination_chain: input.destinationChain,
                destination_user_address: input.destinationUserAddress,
                fee: input.fee,
                name: input.name,
                symbol: input.symbol,
                metadata: input.metadata,
                royalty: parseInt(input.royalty),
                nft_type: input.nftType,
                royalty_receiver: input.royaltyReceiver,
                source_chain: input.sourceChain,
                source_nft_contract_address: input.sourceNftContractAddress,
                token_amount: input.tokenAmount,
                token_id: input.tokenId,
                transaction_hash: input.transactionHash,
            };
        },
        async getValidatorCount() {
            const res = (await provider.query.compute.queryContract({
                contract_address: bridge,
                code_hash: bridgeCodeHash,
                query: {
                    get_validators_count: {},
                },
            }));
            return res.validator_count_response.count;
        },
        getStorageContract() {
            return storage;
        },
        async getClaimData(txHash) {
            const eventId = "LockedEventInfo";
            const tx = await provider.query.getTx(txHash);
            if (!tx) {
                throw new Error("Tx not found");
            }
            const log = tx.jsonLog
                ?.at(0)
                ?.events.find((item) => item.type === "wasm")
                ?.attributes.find((item) => item.key === eventId) ??
                (0, ton_1.raise)("Log not found");
            const { token_id: tokenId, // Unique ID for the NFT transfer
            destination_chain: destinationChain, // Chain to where the NFT is being transferred
            destination_user_address: destinationUserAddress, // User's address in the destination chain
            source_nft_contract_address: sourceNftContractAddress, // Address of the NFT contract in the source chain
            token_amount: tokenAmount, // amount of nfts to be transfered ( 1 in 721 case )
            nft_type: nftType, // Sigular or multiple ( 721 / 1155)
            source_chain: sourceChain, // Source chain of NFT
             } = JSON.parse(log.value);
            const fee = await storage.chainFee(destinationChain);
            const royaltyReceiver = await storage.chainRoyalty(destinationChain);
            const nft = await this.nftData(tokenId, sourceNftContractAddress, {});
            return {
                destinationChain,
                destinationUserAddress,
                sourceNftContractAddress,
                tokenId,
                tokenAmount,
                nftType,
                sourceChain,
                fee: fee.toString(),
                royaltyReceiver: royaltyReceiver,
                metadata: nft.metadata,
                name: nft.name,
                symbol: nft.symbol,
                royalty: nft.royalty.toString(),
                transactionHash: txHash,
            };
        },
        async claimSft(signer, claimData, sigs, extraArgs) {
            const claim1155 = {
                claim1155: {
                    data: {
                        claimData,
                        signatures: sigs.map((e) => {
                            return {
                                signature: encodeSecp256k1Signature(Buffer.from(e.signerAddress, "hex"), Buffer.from(e.signature.replace("0x", ""), "hex")).signature,
                                signer_address: encodeSecp256k1Pubkey(Buffer.from(e.signerAddress, "hex")).value,
                            };
                        }),
                    },
                },
            };
            const tx = await signer.tx.compute.executeContract({
                contract_address: bridge,
                msg: claim1155,
                code_hash: bridgeCodeHash,
                sender: signer.address,
                sent_funds: [{ amount: claimData.fee.toString(), denom: "uscrt" }],
            }, {
                gasLimit: 300000,
                ...extraArgs,
            });
            return {
                ret: tx,
                hash: () => tx.transactionHash,
            };
        },
        async nftData(tokenId, contract) {
            const data = (await provider.query.compute.queryContract({
                contract_address: contract,
                query: { contract_info: {} },
            })).contract_info;
            const royalty_info = (await provider.query.compute.queryContract({
                contract_address: contract,
                query: { royalty_info: { token_id: tokenId.toString() } },
            })).royalty_info.royalty_info;
            const decimal_places_in_rates = royalty_info.decimal_places_in_rates;
            const max_percentage = Number(`1${"0".repeat(decimal_places_in_rates)}`);
            const rate = royalty_info.royalties[0].rate;
            const royalty = (rate / max_percentage) * 10000;
            const nft_info = (await provider.query.compute.queryContract({
                contract_address: contract,
                query: { nft_info: { token_id: tokenId.toString() } },
            })).nft_info;
            const tokenURI = nft_info?.extension?.media[0]?.url || "";
            return {
                name: data.name,
                symbol: data.symbol,
                metadata: tokenURI,
                royalty: BigInt(royalty),
            };
        },
        async readClaimed1155Event(txHash) {
            const eventId = "Claimed1155EventInfo";
            const tx = await provider.query.getTx(txHash);
            if (!tx) {
                throw new Error("Tx not found");
            }
            const log = tx.jsonLog
                ?.at(0)
                ?.events.find((item) => item.type === "wasm")
                ?.attributes.find((item) => item.key === eventId) ??
                (0, ton_1.raise)("Log not found");
            const { amount, nft_contract, source_chain, transaction_hash, token_id } = JSON.parse(log.value);
            return {
                amount: BigInt(amount),
                nft_contract,
                source_chain,
                token_id,
                transaction_hash,
            };
        },
        async readClaimed721Event(txHash) {
            const eventId = "Claimed721EventInfo";
            const tx = await provider.query.getTx(txHash);
            if (!tx) {
                throw new Error("Tx not found");
            }
            const log = tx.jsonLog
                ?.at(0)
                ?.events.find((item) => item.type === "wasm")
                ?.attributes.find((item) => item.key === eventId) ??
                (0, ton_1.raise)("Log not found");
            const { nft_contract, source_chain, transaction_hash, token_id } = JSON.parse(log.value);
            return {
                nft_contract,
                source_chain,
                token_id,
                transaction_hash,
            };
        },
        async approveNft(signer, tokenId, contract, extraArgs) {
            const res = await signer.tx.compute.executeContract({
                sender: signer.address,
                contract_address: contract,
                msg: {
                    approve: {
                        spender: bridge,
                        token_id: tokenId,
                    },
                },
            }, {
                ...extraArgs,
            });
            return res;
        },
        async getBalance(signer, _) {
            const result = await signer.query.bank.balance({
                address: signer.address,
                denom: "uscrt",
            });
            return BigInt(result.balance?.amount ?? 0);
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, _) {
            const tx = await signer.tx.compute.executeContract({
                contract_address: bridge,
                msg: {
                    destination_chain: destinationChain,
                    destination_user_address: to,
                    source_nft_contract_address: sourceNft,
                    token_id: tokenId,
                },
                code_hash: bridgeCodeHash,
                sender: signer.address,
            }, {
                ..._,
                gasLimit: 200000,
            });
            return { tx, hash: () => tx.transactionHash };
        },
        async lockSft(signer, sourceNft, destinationChain, to, tokenId, amt, extraArgs) {
            const tx = await signer.tx.compute.executeContract({
                contract_address: bridge,
                msg: {
                    destination_chain: destinationChain,
                    destination_user_address: to,
                    source_nft_contract_address: sourceNft,
                    collection_code_info: {},
                    token_id: tokenId,
                    token_amount: amt.toString(),
                },
                code_hash: bridgeCodeHash,
                sender: signer.address,
            }, {
                gasLimit: 200000,
                ...extraArgs,
            });
            return {
                tx,
                hash() {
                    return tx.transactionHash;
                },
            };
        },
    };
}
exports.secretHandler = secretHandler;
function encodeSecp256k1Signature(pubkey, signature) {
    if (signature.length !== 64) {
        throw new Error("Signature must be 64 bytes long. Cosmos SDK uses a 2x32 byte fixed length encoding for the secp256k1 signature integers r and s.");
    }
    return {
        pub_key: encodeSecp256k1Pubkey(pubkey),
        signature: (0, secretjs_1.toBase64)(signature),
    };
}
exports.encodeSecp256k1Signature = encodeSecp256k1Signature;
function encodeSecp256k1Pubkey(pubkey) {
    if (pubkey.length !== 33 || (pubkey[0] !== 0x02 && pubkey[0] !== 0x03)) {
        throw new Error("Public key must be compressed secp256k1, i.e. 33 bytes starting with 0x02 or 0x03");
    }
    return {
        type: "tendermint/PubKeySecp256k1",
        value: (0, secretjs_1.toBase64)(pubkey),
    };
}
exports.encodeSecp256k1Pubkey = encodeSecp256k1Pubkey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvc2VjcmV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUF1QztBQUN2Qyx1Q0FBa0Q7QUFFbEQsZ0NBQStCO0FBRy9CLFNBQWdCLGFBQWEsQ0FBQyxFQUM1QixNQUFNLEVBQ04sUUFBUSxFQUNSLE9BQU8sRUFDUCxjQUFjLEdBQ0E7SUFDZCxPQUFPO1FBQ0wsV0FBVztZQUNULE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVM7WUFDL0MsTUFBTSxRQUFRLEdBQUc7Z0JBQ2YsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUUsU0FBUzt3QkFDZixVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFOzRCQUN6QixPQUFPO2dDQUNMLFNBQVMsRUFBRSx3QkFBd0IsQ0FDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxFQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FDbEQsQ0FBQyxTQUFTO2dDQUNYLGNBQWMsRUFBRSxxQkFBcUIsQ0FDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUNwQyxDQUFDLEtBQUs7NkJBQ1IsQ0FBQzt3QkFDSixDQUFDLENBQUM7cUJBQ0g7aUJBQ0Y7YUFDRixDQUFDO1lBRUYsTUFBTSxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQ2hEO2dCQUNFLGdCQUFnQixFQUFFLE1B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