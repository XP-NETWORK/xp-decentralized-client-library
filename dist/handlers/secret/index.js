"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecp256k1Pubkey = exports.encodeSecp256k1Signature = exports.secretHandler = void 0;
const secretjs_1 = require("secretjs");
const ton_1 = require("../ton");
function secretHandler({ bridge, provider, storage, bridgeCodeHash, nftCodeId, identifier, }) {
    async function fetchNfts(contract, owner, ea) {
        const contractInfo = await provider.query.compute.queryContract({
            contract_address: contract,
            query: { contract_info: {} },
        });
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
                    name: contractInfo.contract_info.name || "",
                    symbol: contractInfo.contract_info.symbol || "",
                    tokenId: token,
                    viewingKey: ea.viewingKey,
                    metadata: tokenInfo.all_nft_info.info?.token_uri ||
                        tokenInfo?.all_nft_info?.info?.extension,
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
            const contractInfo = await provider.query.compute.queryContract({
                contract_address: contract,
                query: { token_id_public_info: { token_id: token.token_id } },
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
                    name: contractInfo.token_id_public_info.token_id_info.name,
                    symbol: contractInfo.token_id_public_info.token_id_info.symbol,
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
                royalty: Number.parseInt(input.royalty),
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
        async approveNft(signer, tokenId, contract, nftType, extraArgs) {
            if (nftType === "sft") {
                const res = await signer.tx.compute.executeContract({
                    sender: signer.address,
                    contract_address: contract,
                    msg: {
                        give_permission: {
                            allowed_address: bridge,
                            token_id: tokenId,
                            view_balance: true,
                        },
                    },
                }, {
                    waitForCommit: true,
                    gasLimit: 50000,
                });
                return res;
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvc2VjcmV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUF3RTtBQU14RSxnQ0FBK0I7QUFVL0IsU0FBZ0IsYUFBYSxDQUFDLEVBQzVCLE1BQU0sRUFDTixRQUFRLEVBQ1IsT0FBTyxFQUNQLGNBQWMsRUFDZCxTQUFTLEVBQ1QsVUFBVSxHQUNJO0lBQ2QsS0FBSyxVQUFVLFNBQVMsQ0FDdEIsUUFBZ0IsRUFDaEIsS0FBYSxFQUNiLEVBQTZDO1FBRTdDLE1BQU0sWUFBWSxHQUFhLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1lBQ3hFLGdCQUFnQixFQUFFLFFBQVE7WUFDMUIsS0FBSyxFQUFFLEVBQUUsYUFBYSxFQUFFLEVBQUUsRUFBRTtTQUM3QixDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1lBQ3ZELElBQUksRUFBRTtnQkFDSixNQUFNLEVBQUU7b0JBQ04sT0FBTyxFQUFFLEtBQUs7b0JBQ2QsV0FBVyxFQUFFLEVBQUUsQ0FBQyxVQUFVO2lCQUMzQjthQUNGO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsSUFBSSxFQUFFO2FBQzVCO1lBQ0QsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDLENBQTJCLENBQUM7UUFDOUIsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQzNCLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtB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