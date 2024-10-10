"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecp256k1Pubkey = exports.encodeSecp256k1Signature = exports.secretHandler = void 0;
const secretjs_1 = require("secretjs");
const ton_1 = require("../ton");
function secretHandler({ bridge, provider, storage, bridgeCodeHash, nftCodeId, identifier, }) {
    async function fetchNfts(contract, owner, ea) {
        const res = (await provider.query.snip721.GetOwnedTokens({
            auth: {
                viewer: {
                    address: owner,
                    viewing_key: ea.viewingKey,
                },
            },
            contract: {
                address: contract,
                codeHash: ea.codeHash || "",
            },
            owner: owner,
        }));
        if (typeof res === "string") {
            throw new Error(res);
        }
        const { token_list } = res;
        if (token_list.tokens.length === 0) {
            return [];
        }
        const response = [];
        await Promise.all(token_list.tokens.map(async (token) => {
            const tokenInfo = await provider.query.snip721.GetTokenInfo({
                contract: {
                    address: contract,
                    codeHash: ea.codeHash || "",
                },
                auth: {
                    viewer: {
                        address: owner,
                        viewing_key: ea.viewingKey,
                    },
                },
                token_id: token,
            });
            response.push({
                collectionIdent: contract,
                uri: tokenInfo.all_nft_info.info?.token_uri || "",
                tokenId: token,
                type: "NFT",
                native: {
                    contract: contract,
                    contractHash: ea.codeHash || "",
                    tokenId: token,
                    viewingKey: ea.viewingKey,
                    metadata: tokenInfo.all_nft_info.info?.token_uri || "",
                },
            });
        }));
        return response;
    }
    async function fetchSfts(contract, owner, ea) {
        const res = await provider.query.snip1155.getAllBalances({
            auth: {
                viewer: {
                    address: owner,
                    viewing_key: ea.viewingKey,
                },
            },
            contract: {
                address: contract,
            },
            owner: owner,
        });
        //@ts-ignore
        if (res.all_balances.length === 0) {
            return [];
        }
        const response = [];
        await Promise.all(res.all_balances.map(async (token) => {
            const tokenInfo = await provider.query.snip1155.getPrivateTokenInfo({
                contract: {
                    address: contract,
                    code_hash: ea.codeHash || "",
                },
                auth: {
                    viewer: {
                        address: owner,
                        viewing_key: ea.viewingKey,
                    },
                },
                token_id: token.token_id,
            });
            response.push({
                collectionIdent: contract,
                uri: tokenInfo.token_id_private_info.token_id_info.public_metadata
                    .token_uri || "",
                tokenId: token.token_id,
                type: "SFT",
                native: {
                    contract: contract,
                    contractHash: ea.codeHash || "",
                    tokenId: token.token_id,
                    amount: Number(token.amount),
                    viewingKey: ea.viewingKey,
                    metadata: tokenInfo.token_id_private_info.token_id_info.public_metadata
                        .token_uri || "",
                },
            });
        }));
        return response;
    }
    return {
        identifier,
        getProvider() {
            return provider;
        },
        validateAddress(address) {
            return Promise.resolve((0, secretjs_1.validateAddress)(address).isValid);
        },
        async nftList(owner, contract, ea) {
            const nfts = await fetchNfts(contract, owner, ea).catch(() => []);
            const sfts = await fetchSfts(contract, owner, ea).catch(() => []);
            return [...nfts, ...sfts];
        },
        //   const res = (await provider.query.snip1155.getAllBalances();
        //   if (typeof res === "string") {
        //     throw new Error(res);
        //   }
        //   const { token_list } = res;
        //   if (token_list.tokens.length === 0) {
        //     return [];
        //   }
        //   await Promise.all(
        //     token_list.tokens.map(async (token) => {
        //       const tokenInfo = await provider.query.snip721.GetTokenInfo({
        //         contract: {
        //           address: contract,
        //           codeHash: ea.codeHash || "",
        //         },
        //         auth: {
        //           viewer: {
        //             address: owner,
        //             viewing_key: ea.viewingKey,
        //           },
        //         },
        //         token_id: token,
        //       });
        //       response.push({
        //         collectionIdent: contract,
        //         uri: tokenInfo.all_nft_info.info?.token_uri || "",
        //         tokenId: token,
        //         type: "nft",
        //         native: {
        //           contract: contract,
        //           contractHash: ea.codeHash || "",
        //           tokenId: token,
        //           viewingKey: ea.viewingKey,
        //           metadata: tokenInfo.all_nft_info.info?.token_uri || "",
        //         },
        //       });
        //     }),
        //   );
        //   return response;
        // },
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
                source_chain: "",
                destination_chain: "",
                token_id: "0",
                token_amount: "1",
                royalty: 0,
                lock_tx_chain: "",
                metadata: "",
                transaction_hash: "",
                royalty_receiver: signer.address,
                source_nft_contract_address: "",
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
            console.log(contract);
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
        async approveNft(signer, tokenId, contract, _nftType, extraArgs) {
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
                ret: tx,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvc2VjcmV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFtRTtBQUduRSxnQ0FBK0I7QUFJL0IsU0FBZ0IsYUFBYSxDQUFDLEVBQzVCLE1BQU0sRUFDTixRQUFRLEVBQ1IsT0FBTyxFQUNQLGNBQWMsRUFDZCxTQUFTLEVBQ1QsVUFBVSxHQUNJO0lBQ2QsS0FBSyxVQUFVLFNBQVMsQ0FDdEIsUUFBZ0IsRUFDaEIsS0FBYSxFQUNiLEVBQTZDO1FBRTdDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7WUFDdkQsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRTtvQkFDTixPQUFPLEVBQUUsS0FBSztvQkFDZCxXQUFXLEVBQUUsRUFBRSxDQUFDLFVBQVU7aUJBQzNCO2FBQ0Y7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxJQUFJLEVBQUU7YUFDNUI7WUFDRCxLQUFLLEVBQUUsS0FBSztTQUNiLENBQUMsQ0FBMkIsQ0FBQztRQUM5QixJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDM0IsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNuQyxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFDRCxNQUFNLFFBQVEsR0FBeUMsRUFBRSxDQUFDO1FBQzFELE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDZixVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFL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