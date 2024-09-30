"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecp256k1Pubkey = exports.encodeSecp256k1Signature = exports.secretHandler = void 0;
const secretjs_1 = require("secretjs");
const ton_1 = require("../ton");
function secretHandler({ bridge, provider, storage, bridgeCodeHash, nftCodeId, identifier, }) {
    return {
        identifier,
        getProvider() {
            return provider;
        },
        async nftList(owner, viewingKey, contract, codeHash) {
            const { token_list } = await provider.query.snip721.GetOwnedTokens({
                auth: {
                    viewer: {
                        address: owner,
                        viewing_key: viewingKey,
                    },
                },
                contract: {
                    address: contract,
                    codeHash: codeHash || "",
                },
                owner: owner,
            });
            if (token_list.tokens.length === 0) {
                return [];
            }
            const response = [];
            await Promise.all(token_list.tokens.map(async (token) => {
                const tokenInfo = await provider.query.snip721.GetTokenInfo({
                    contract: {
                        address: contract,
                        codeHash: codeHash || "",
                    },
                    auth: {
                        viewer: {
                            address: owner,
                            viewing_key: viewingKey,
                        },
                    },
                    token_id: token,
                });
                response.push({
                    collectionIdent: contract,
                    uri: tokenInfo.all_nft_info.info?.token_uri || "",
                    tokenId: token,
                    native: {
                        contract: contract,
                        contractHash: codeHash || "",
                        tokenId: token,
                        viewingKey,
                        metadata: tokenInfo.all_nft_info.info?.token_uri || "",
                    },
                });
            }));
            return response;
        },
        async setViewingKey(signer, contract, vk) {
            const tx = await signer.tx.snip721.setViewingKey({
                contract_address: contract,
                msg: {
                    set_viewing_key: {
                        key: vk,
                    },
                },
                sender: signer.address,
            }, {
                gasLimit: 300000,
                // ...extraArgs,
            });
            return tx;
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
        async deployNftCollection(signer, da, ga) {
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
                        owner: ma.owner,
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
                lock_tx_chain: input.lockTxChain,
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
        async decodeLockedEvent(txHash) {
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
            return {
                destinationChain,
                destinationUserAddress,
                sourceNftContractAddress,
                tokenId,
                tokenAmount: tokenAmount.toString(),
                nftType,
                sourceChain,
                transactionHash: txHash,
                lockTxChain: identifier,
                metaDataUri: "",
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
            const { amount, nft_contract, source_chain, transaction_hash, token_id, lock_tx_chain, } = JSON.parse(log.value);
            return {
                amount: BigInt(amount),
                nft_contract,
                source_chain,
                token_id,
                transaction_hash,
                lock_tx_chain,
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
            const { nft_contract, source_chain, transaction_hash, token_id, lock_tx_chain, } = JSON.parse(log.value);
            return {
                nft_contract,
                source_chain,
                token_id,
                transaction_hash,
                lock_tx_chain,
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
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metaDataUri, _) {
            console.log(metaDataUri);
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
                        metadata_uri: metaDataUri,
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
        async lockSft(signer, sourceNft, destinationChain, to, tokenId, amt, metaDataUri, extraArgs) {
            console.log(metaDataUri);
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
                        metadata_uri: metaDataUri,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvc2VjcmV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrRDtBQUdsRCxnQ0FBK0I7QUFHL0IsU0FBZ0IsYUFBYSxDQUFDLEVBQzVCLE1BQU0sRUFDTixRQUFRLEVBQ1IsT0FBTyxFQUNQLGNBQWMsRUFDZCxTQUFTLEVBQ1QsVUFBVSxHQUNJO0lBQ2QsT0FBTztRQUNMLFVBQVU7UUFDVixXQUFXO1lBQ1QsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUTtZQUNqRCxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7Z0JBQ2pFLElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUU7d0JBQ04sT0FBTyxFQUFFLEtBQUs7d0JBQ2QsV0FBVyxFQUFFLFVBQVU7cUJBQ3hCO2lCQUNGO2dCQUNELFFBQVEsRUFBRTtvQkFDUixPQUFPLEVBQUUsUUFBUTtvQkFDakIsUUFBUSxFQUFFLFFBQVEsSUFBSSxFQUFFO2lCQUN6QjtnQkFDRCxLQUFLLEVBQUUsS0FBSzthQUNiLENBQUMsQ0FBQztZQUNILElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ25DLE9BQU8sRUFBRSxDQUFDO1lBQ1osQ0FBQztZQUNELE1BQU0sUUFBUSxHQUtSLEVBQUUsQ0FBQztZQUNULE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDZixVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3BDLE1BQU0sU0FBUyxHQUFHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxD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