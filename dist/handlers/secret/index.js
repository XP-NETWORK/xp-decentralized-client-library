"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecp256k1Pubkey = exports.encodeSecp256k1Signature = exports.secretHandler = void 0;
const secretjs_1 = require("secretjs");
const ton_1 = require("../ton");
function secretHandler({ bridge, provider, storage, bridgeCodeHash, nftCodeId, }) {
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
            const code = da.codeId ?? nftCodeId;
            if (!code) {
                throw new Error("Code not found");
            }
            const msg = {
                name: da.name,
                symbol: da.symbol,
                owner: signer.address,
                destination_user_address: signer.address,
                entropy: "bruh",
                config: {
                    public_token_supply: true,
                },
            };
            const contract = await signer.tx.compute.instantiateContract({
                code_id: code,
                init_msg: msg,
                label: `snip721-${da.name}-${new Date().getUTCMilliseconds()}`,
                sender: signer.address,
            }, {
                gasLimit: 70000,
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
                        public_metadata: { token_uri: ma.uri },
                        token_id: ma.tokenId,
                        owner: signer.address,
                    },
                },
                sender: signer.address,
            }, {
                gasLimit: 60000,
                ...gasArgs,
            });
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
                tokenAmount: tokenAmount.toString(),
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
            console.log(royalty_info);
            const decimal_places_in_rates = royalty_info?.decimal_places_in_rates ?? 0;
            const max_percentage = Number(`1${"0".repeat(decimal_places_in_rates)}`);
            const rate = royalty_info?.royalties.at(0)?.rate ?? 0;
            const royalty = (rate / max_percentage) * 10000;
            const nft_info = (await provider.query.compute.queryContract({
                contract_address: contract,
                query: { nft_info: { token_id: tokenId.toString() } },
            })).nft_info;
            const tokenURI = nft_info?.extension?.media[0]?.url ||
                //@ts-ignore
                nft_info?.token_uri ||
                "";
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
                gasLimit: 50000,
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
            const codeHashResponse = await signer.query.compute.codeHashByContractAddress({
                contract_address: sourceNft,
            });
            const { contract_info } = await signer.query.compute.contractInfo({
                contract_address: sourceNft,
            });
            const lock = {
                lock721: {
                    data: {
                        destination_chain: destinationChain,
                        destination_user_address: to,
                        source_nft_contract_address: sourceNft,
                        token_id: tokenId.toString(),
                        collection_code_info: {
                            code_id: Number.parseInt(contract_info?.code_id ?? (0, ton_1.raise)("Code id not found")),
                            code_hash: codeHashResponse.code_hash ?? (0, ton_1.raise)("Code hash not found"),
                        },
                    },
                },
            };
            console.log(JSON.stringify(lock, null, 4));
            const tx = await signer.tx.compute.executeContract({
                contract_address: bridge,
                msg: lock,
                // code_hash: bridgeCodeHash,
                sender: signer.address,
            }, {
                gasLimit: 250000,
                ..._,
            });
            return { ret: tx, hash: () => tx.transactionHash };
        },
        async lockSft(signer, sourceNft, destinationChain, to, tokenId, amt, extraArgs) {
            const codeHashResponse = await signer.query.compute.codeHashByContractAddress({
                contract_address: sourceNft,
            });
            const { contract_info } = await signer.query.compute.contractInfo({
                contract_address: sourceNft,
            });
            const lock = {
                lock1155: {
                    data: {
                        collection_code_info: {
                            code_id: Number.parseInt(contract_info?.code_id ?? (0, ton_1.raise)("Code id not found")),
                            code_hash: codeHashResponse.code_hash ?? (0, ton_1.raise)("Code hash not found"),
                        },
                        destination_chain: destinationChain,
                        destination_user_address: to,
                        source_nft_contract_address: sourceNft,
                        token_amount: amt.toString(),
                        token_id: tokenId.toString(),
                    },
                },
            };
            const tx = await signer.tx.compute.executeContract({
                contract_address: bridge,
                msg: lock,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvc2VjcmV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrRDtBQUdsRCxnQ0FBK0I7QUFHL0IsU0FBZ0IsYUFBYSxDQUFDLEVBQzVCLE1BQU0sRUFDTixRQUFRLEVBQ1IsT0FBTyxFQUNQLGNBQWMsRUFDZCxTQUFTLEdBQ0s7SUFDZCxPQUFPO1FBQ0wsV0FBVztZQUNULE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVM7WUFDL0MsTUFBTSxRQUFRLEdBQUc7Z0JBQ2YsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUUsU0FBUzt3QkFDZixVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFOzRCQUN6QixPQUFPO2dDQUNMLFNBQVMsRUFBRSx3QkFBd0IsQ0FDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxFQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FDbEQsQ0FBQyxTQUFTO2dDQUNYLGNBQWMsRUFBRSxxQkFBcUIsQ0FDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUNwQyxDQUFDLEtBQUs7NkJBQ1IsQ0FBQzt3QkFDSixDQUFDLENBQUM7cUJBQ0g7aUJBQ0Y7YUFDRixDQUFDO1lBRUYsTUFBTSxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQ2hEO2dCQUNFLGdCQUFnQixFQUFFLE1BQU07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