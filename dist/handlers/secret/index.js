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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvc2VjcmV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFtRTtBQUduRSxnQ0FBK0I7QUFVL0IsU0FBZ0IsYUFBYSxDQUFDLEVBQzVCLE1BQU0sRUFDTixRQUFRLEVBQ1IsT0FBTyxFQUNQLGNBQWMsRUFDZCxTQUFTLEVBQ1QsVUFBVSxHQUNJO0lBQ2QsS0FBSyxVQUFVLFNBQVMsQ0FDdEIsUUFBZ0IsRUFDaEIsS0FBYSxFQUNiLEVBQTZDO1FBRTdDLE1BQU0sWUFBWSxHQUFhLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1lBQ3hFLGdCQUFnQixFQUFFLFFBQVE7WUFDMUIsS0FBSyxFQUFFLEVBQUUsYUFBYSxFQUFFLEVBQUUsRUFBRTtTQUM3QixDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1lBQ3ZELElBQUksRUFBRTtnQkFDSixNQUFNLEVBQUU7b0JBQ04sT0FBTyxFQUFFLEtBQUs7b0JBQ2QsV0FBVyxFQUFFLEVBQUUsQ0FBQyxVQUFVO2lCQUMzQjthQUNGO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsSUFBSSxFQUFFO2FBQzVCO1lBQ0QsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDLENBQTJCLENBQUM7UUFDOUIsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQzNCLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtB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