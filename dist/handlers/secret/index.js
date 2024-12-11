"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecp256k1Pubkey = exports.encodeSecp256k1Signature = exports.secretHandler = void 0;
const secretjs_1 = require("secretjs");
const ton_1 = require("../ton");
const utils_1 = require("../utils");
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
            metadata_uri: metaDataUri, // metadata uri of NFT
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
                metaDataUri,
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
            let metadata = metaDataUri;
            const nft_info = (await signer.query.compute.queryContract({
                contract_address: sourceNft,
                query: { nft_info: { token_id: tokenId.toString() } },
            })).nft_info;
            if (nft_info.token_uri) {
                metadata = nft_info.token_uri;
            }
            else {
                const data = {
                    ...nft_info.extension,
                    image: nft_info.extension?.media?.[0]?.url || "",
                };
                const pinResponse = await utils_1.pinata.upload.json(data);
                metadata = `https://xpnetwork.infura-ipfs.io/ipfs/${pinResponse.IpfsHash}`;
                console.log({ metadata });
            }
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
                        metadata_uri: metadata,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvc2VjcmV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUF3RTtBQU94RSxnQ0FBK0I7QUFFL0Isb0NBQWtDO0FBU2xDLFNBQWdCLGFBQWEsQ0FBQyxFQUM1QixNQUFNLEVBQ04sUUFBUSxFQUNSLE9BQU8sRUFDUCxjQUFjLEVBQ2QsU0FBUyxFQUNULFVBQVUsR0FDSTtJQUNkLEtBQUssVUFBVSxTQUFTLENBQ3RCLFFBQWdCLEVBQ2hCLEtBQWEsRUFDYixFQUE2QztRQUU3QyxNQUFNLFlBQVksR0FBYSxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUN4RSxnQkFBZ0IsRUFBRSxRQUFRO1lBQzFCLEtBQUssRUFBRSxFQUFFLGFBQWEsRUFBRSxFQUFFLEVBQUU7U0FDN0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUN2RCxJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFO29CQUNOLE9BQU8sRUFBRSxLQUFLO29CQUNkLFdBQVcsRUFBRSxFQUFFLENBQUMsVUFBVTtpQkFDM0I7YUFDRjtZQUNELFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsUUFBUTtnQkFDakIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLElBQUksRUFBRTthQUM1QjtZQUNELEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUEyQixDQUFDO1FBQzlCLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQ0QsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQztRQUMzQixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ25DLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUNELE1BQU0sUUFBUSxHQUF5QyxFQUFFLENBQUM7UUFDMUQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNmLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNwQyxNQUFNLFNBQVMsR0FBRyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztnQkFDMUQsUUFBUSxFQUFFO29CQUNSLE9BQU8sRUFBRSxRQUFRO29CQUNqQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsSUFBSSxFQUFFO2lCQUM1QjtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osTUFBTSxFQUFFO3dCQUNOLE9BQU8sRUFBRSxLQUFLO3dCQUNkLFdBQVcsRUFBRSxFQUFFLENBQUMsVUFBVTtxQkFDM0I7aUJBQ0Y7Z0JBQ0QsUUFBUSxFQUFFLEtBQUs7YUFDaEIsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDWixlQUFlLEVBQUUsUUFBUTtnQkFDekIsR0FBRyxFQUFFLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsSUFBSSxFQUFFO2dCQUNqRCxPQUFPLEVBQUUsS0FBSztnQkFDZCxJQUFJLEVBQUUsS0FBSztnQkFDWCxNQUFNLEVBQUU7b0JBQ04sUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFlBQVksRUFBRSxFQUFFLENBQUMsUUFBUSxJQUFJLEVBQUU7b0JBQy9CLElBQUksRUFBRSxZQUFZLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxFQUFFO29CQUMzQyxNQUFNLEVBQUUsWUFBWSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksRUFBRTtvQkFDL0MsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVO29CQUN6QixRQUFRLEVBQ04sU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUzt3QkFDdEMsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsU0FBUztpQkFDM0M7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FDSCxDQUFDO1FBQ0YsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELEtBQUssVUFBVSxTQUFTLENBQ3RCLFFBQWdCLEVBQ2hCLEtBQWEsRUFDYixFQUE2QztRQUU3QyxNQUFNLEdBQUcsR0FBRyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUN2RCxJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFO29CQUNOLE9BQU8sRUFBRSxLQUFLO29CQUNkLFdBQVcsRUFBRSxFQUFFLENBQUMsVUFBVTtpQkFDM0I7YUFDRjtZQUNELFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsUUFBUTthQUNsQjtZQUNELEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO1FBQ0gsWUFBWTtRQUNaLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDbEMsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBQ0QsTUFBTSxRQUFRLEdBQXlDLEVBQUUsQ0FBQztRQUMxRCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2YsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ25DLE1BQU0sU0FBUyxHQUFHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUM7Z0JBQ2xFLFFBQVEsRUFBRTtvQkFDUixPQUFPLEVBQUUsUUFBUTtvQkFDakIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxRQUFRLElBQUksRUFBRTtpQkFDN0I7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLE1BQU0sRUFBRTt3QkFDTixPQUFPLEVBQUUsS0FBSzt3QkFDZCxXQUFXLEVBQUUsRUFBRSxDQUFDLFVBQVU7cUJBQzNCO2lCQUNGO2dCQUNELFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTthQUN6QixDQUFDLENBQUM7WUFFSCxNQUFNLFlBQVksR0FDaEIsTUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7Z0JBQ3pDLGdCQUFnQixFQUFFLFFBQVE7Z0JBQzFCLEtBQUssRUFBRSxFQUFFLG9CQUFvQixFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRTthQUM5RCxDQUFDLENBQUM7WUFFTCxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNaLGVBQWUsRUFBRSxRQUFRO2dCQUN6QixHQUFHLEVBQ0QsU0FBUyxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxlQUFlO3FCQUMxRCxTQUFTLElBQUksRUFBRTtnQkFDcEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxRQUFRO2dCQUN2QixJQUFJLEVBQUUsS0FBSztnQkFDWCxNQUFNLEVBQUU7b0JBQ04sUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFlBQVksRUFBRSxFQUFFLENBQUMsUUFBUSxJQUFJLEVBQUU7b0JBQy9CLE9BQU8sRUFBRSxLQUFLLENBQUMsUUFBUTtvQkFDdkIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO29CQUM1QixVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVU7b0JBQ3pCLElBQUksRUFBRSxZQUFZLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLElBQUk7b0JBQzFELE1BQU0sRUFBRSxZQUFZLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLE1BQU07b0JBQzlELFFBQVEsRUFDTixTQUFTLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLGVBQWU7eUJBQzFELFNBQVMsSUFBSSxFQUFFO2lCQUNyQjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUNILENBQUM7UUFDRixPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBQ0QsT0FBTztRQUNMLFVBQVU7UUFDVixXQUFXO1lBQ1QsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQztRQUNELGVBQWUsQ0FBQyxPQUFPO1lBQ3JCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFBLDBCQUFlLEVBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxHQUF5QyxNQUFNLFNBQVMsQ0FDaEUsUUFBUSxFQUNSLEtBQUssRUFDTCxFQUFFLENBQ0gsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEIsTUFBTSxJQUFJLEdBQXlDLE1BQU0sU0FBUyxDQUNoRSxRQUFRLEVBQ1IsS0FBSyxFQUNMLEVBQUUsQ0FDSCxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNsQixPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQ0QsaUVBQWlFO1FBQ2pFLG1DQUFtQztRQUNuQyw0QkFBNEI7UUFDNUIsTUFBTTtRQUNOLGdDQUFnQztRQUNoQywwQ0FBMEM7UUFDMUMsaUJBQWlCO1FBQ2pCLE1BQU07UUFDTix1QkFBdUI7UUFDdkIsK0NBQStDO1FBQy9DLHNFQUFzRTtRQUN0RSxzQkFBc0I7UUFDdEIsK0JBQStCO1FBQy9CLHlDQUF5QztRQUN6QyxhQUFhO1FBQ2Isa0JBQWtCO1FBQ2xCLHNCQUFzQjtRQUN0Qiw4QkFBOEI7UUFDOUIsMENBQTBDO1FBQzFDLGVBQWU7UUFDZixhQUFhO1FBQ2IsMkJBQTJCO1FBQzNCLFlBQVk7UUFFWix3QkFBd0I7UUFDeEIscUNBQXFDO1FBQ3JDLDZEQUE2RDtRQUM3RCwwQkFBMEI7UUFDMUIsdUJBQXVCO1FBQ3ZCLG9CQUFvQjtRQUNwQixnQ0FBZ0M7UUFDaEMsNkNBQTZDO1FBQzdDLDRCQUE0QjtRQUM1Qix1Q0FBdUM7UUFDdkMsb0VBQW9FO1FBQ3BFLGFBQWE7UUFDYixZQUFZO1FBQ1osVUFBVTtRQUNWLE9BQU87UUFDUCxxQkFBcUI7UUFDckIsS0FBSztRQUNMLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUM5QztnQkFDRSxnQkFBZ0IsRUFBRSxRQUFRO2dCQUMxQixHQUFHLEVBQUU7b0JBQ0gsZUFBZSxFQUFFO3dCQUNmLEdBQUcsRUFBRSxFQUFFO3FCQUNSO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxNQUFNLENBQUMsT0FBTzthQUN2QixFQUNEO2dCQUNFLFFBQVEsRUFBRSxNQUFPO2dCQUNqQixnQkFBZ0I7YUFDakIsQ0FDRixDQUFDO1lBQ0YsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBQ0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTO1lBQy9DLE1BQU0sUUFBUSxHQUFHO2dCQUNmLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLFNBQVM7d0JBQ2YsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTs0QkFDekIsT0FBTztnQ0FDTCxTQUFTLEVBQUUsd0JBQXdCLENBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQ2xELENBQUMsU0FBUztnQ0FDWCxjQUFjLEVBQUUscUJBQXFCLENBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FDcEMsQ0FBQyxLQUFLOzZCQUNSLENBQUM7d0JBQ0osQ0FBQyxDQUFDO3FCQUNIO2lCQUNGO2FBQ0YsQ0FBQztZQUVGLE1BQU0sRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUNoRDtnQkFDRSxnQkFBZ0IsRUFBRSxNQUFNO2dCQUN4QixHQUFHLEVBQUUsUUFBUTtnQkFDYixTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dCQUN0QixVQUFVLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQzthQUNuRSxFQUNEO2dCQUNFLFFBQVEsRUFBRSxNQUFPO2dCQUNqQixHQUFHLFNBQVM7YUFDYixDQUNGLENBQUM7WUFDRixPQUFPO2dCQUNMLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsZUFBZTtnQkFDOUIsR0FBRyxFQUFFLEVBQUU7YUFDUixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUM7WUFDcEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsTUFBTSxHQUFHLEdBQUc7Z0JBQ1YsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJO2dCQUNiLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTTtnQkFDakIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dCQUNyQix3QkFBd0IsRUFBRSxNQUFNLENBQUMsT0FBTztnQkFDeEMsWUFBWSxFQUFFLEVBQUU7Z0JBQ2hCLGlCQUFpQixFQUFFLEVBQUU7Z0JBQ3JCLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFlBQVksRUFBRSxHQUFHO2dCQUNqQixPQUFPLEVBQUUsQ0FBQztnQkFDVixhQUFhLEVBQUUsRUFBRTtnQkFDakIsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osZ0JBQWdCLEVBQUUsRUFBRTtnQkFDcEIsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLE9BQU87Z0JBQ2hDLDJCQUEyQixFQUFFLEVBQUU7Z0JBQy9CLE9BQU8sRUFBRSxNQUFNO2dCQUNmLE1BQU0sRUFBRTtvQkFDTixtQkFBbUIsRUFBRSxJQUFJO2lCQUMxQjthQUNGLENBQUM7WUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUMxRDtnQkFDRSxPQUFPLEVBQUUsSUFBSTtnQkFDYixRQUFRLEVBQUUsR0FBRztnQkFDYixLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtnQkFDOUQsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPO2FBQ3ZCLEVBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsR0FBRyxFQUFFO2FBQ04sQ0FDRixDQUFDO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FDN0MsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEtBQUssa0JBQWtCLENBQ2xFLEVBQUUsS0FBSyxDQUFDO1lBQ1QsT0FBTyxlQUFlLElBQUksSUFBQSxXQUFLLEVBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBQ0QsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsT0FBTztZQUN6QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2pDO2dCQUNFLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxlQUFlO2dCQUNwQyxHQUFHLEVBQUU7b0JBQ0gsUUFBUSxFQUFFO3dCQUNSLGVBQWUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFO3dCQUN0QyxRQUFRLEVBQUUsRUFBRSxDQUFDLE9BQU87d0JBQ3BCLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSztxQkFDaEI7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPO2FBQ3ZCLEVBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsR0FBRyxPQUFPO2FBQ1gsQ0FDRixDQUFDO1lBQ0YsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsU0FBUyxDQUFDLEtBQUs7WUFDYixPQUFPO2dCQUNMLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7Z0JBQ3pDLHdCQUF3QixFQUFFLEtBQUssQ0FBQyxzQkFBc0I7Z0JBQ3RELEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztnQkFDZCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtnQkFDcEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO2dCQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUN2QyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU87Z0JBQ3ZCLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxlQUFlO2dCQUN2QyxZQUFZLEVBQUUsS0FBSyxDQUFDLFdBQVc7Z0JBQy9CLDJCQUEyQixFQUFFLEtBQUssQ0FBQyx3QkFBd0I7Z0JBQzNELFlBQVksRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDL0IsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPO2dCQUN2QixnQkFBZ0IsRUFBRSxLQUFLLENBQUMsZUFBZTtnQkFDdkMsYUFBYSxFQUFFLEtBQUssQ0FBQyxXQUFXO2FBQ2pDLENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLGlCQUFpQjtZQUNyQixNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO2dCQUN0RCxnQkFBZ0IsRUFBRSxNQUFNO2dCQUN4QixTQUFTLEVBQUUsY0FBYztnQkFDekIsS0FBSyxFQUFFO29CQUNMLG9CQUFvQixFQUFFLEVBQUU7aUJBQ3pCO2FBQ0YsQ0FBQyxDQUFvRCxDQUFDO1lBQ3ZELE9BQU8sR0FBRyxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQztRQUM1QyxDQUFDO1FBQ0Qsa0JBQWtCO1lBQ2hCLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTTtZQUM1QixNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQztZQUNsQyxNQUFNLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDUixNQUFNLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7WUFDRCxNQUFNLEdBQUcsR0FDUCxFQUFFLENBQUMsT0FBTztnQkFDUixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQztnQkFDN0MsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLE9BQU8sQ0FBQztnQkFDbkQsSUFBQSxXQUFLLEVBQUMsZUFBZSxDQUFDLENBQUM7WUFFekIsTUFBTSxFQUNKLFFBQVEsRUFBRSxPQUFPLEVBQUUsaUNBQWlDO1lBQ3BELGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLDhDQUE4QztZQUNuRix3QkFBd0IsRUFBRSxzQkFBc0IsRUFBRSwwQ0FBMEM7WUFDNUYsMkJBQTJCLEVBQUUsd0JBQXdCLEVBQUUsa0RBQWtEO1lBQ3pHLFlBQVksRUFBRSxXQUFXLEVBQUUsb0RBQW9EO1lBQy9FLFFBQVEsRUFBRSxPQUFPLEVBQUUsb0NBQW9DO1lBQ3ZELFlBQVksRUFBRSxXQUFXLEVBQUUsc0JBQXNCO1lBQ2pELFlBQVksRUFBRSxXQUFXLEVBQUUsc0JBQXNCO2NBQ2xELEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsT0FBTztnQkFDTCxnQkFBZ0I7Z0JBQ2hCLHNCQUFzQjtnQkFDdEIsd0JBQXdCO2dCQUN4QixPQUFPO2dCQUNQLFdBQVcsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFO2dCQUNuQyxPQUFPO2dCQUNQLFdBQVc7Z0JBQ1gsZUFBZSxFQUFFLE1BQU07Z0JBQ3ZCLFdBQVcsRUFBRSxVQUFVO2dCQUN2QixXQUFXO2FBQ1osQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVM7WUFDL0MsTUFBTSxTQUFTLEdBQUc7Z0JBQ2hCLFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLFNBQVM7d0JBQ2YsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTs0QkFDekIsT0FBTztnQ0FDTCxTQUFTLEVBQUUsd0JBQXdCLENBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQ2xELENBQUMsU0FBUztnQ0FDWCxjQUFjLEVBQUUscUJBQXFCLENBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FDcEMsQ0FBQyxLQUFLOzZCQUNSLENBQUM7d0JBQ0osQ0FBQyxDQUFDO3FCQUNIO2lCQUNGO2FBQ0YsQ0FBQztZQUVGLE1BQU0sRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUNoRDtnQkFDRSxnQkFBZ0IsRUFBRSxNQUFNO2dCQUN4QixHQUFHLEVBQUUsU0FBUztnQkFDZCxTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dCQUN0QixVQUFVLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQzthQUNuRSxFQUNEO2dCQUNFLFFBQVEsRUFBRSxNQUFPO2dCQUNqQixHQUFHLFNBQVM7YUFDYixDQUNGLENBQUM7WUFFRixPQUFPO2dCQUNMLEdBQUcsRUFBRSxFQUFFO2dCQUNQLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsZUFBZTthQUMvQixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVE7WUFDN0IsTUFBTSxJQUFJLEdBQ1IsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztnQkFDMUMsZ0JBQWdCLEVBQUUsUUFBUTtnQkFDMUIsS0FBSyxFQUFFLEVBQUUsYUFBYSxFQUFFLEVBQUUsRUFBRTthQUM3QixDQUFDLENBQ0gsQ0FBQyxhQUFhLENBQUM7WUFFaEIsTUFBTSxZQUFZLEdBQ2hCLENBQUMsTUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7Z0JBQzFDLGdCQUFnQixFQUFFLFFBQVE7Z0JBQzFCLEtBQUssRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRTthQUMxRCxDQUFDLENBUUgsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDMUIsTUFBTSx1QkFBdUIsR0FDM0IsWUFBWSxFQUFFLHVCQUF1QixJQUFJLENBQUMsQ0FBQztZQUM3QyxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sSUFBSSxHQUFHLFlBQVksRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUM7WUFDdEQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBRWhELE1BQU0sUUFBUSxHQUNaLENBQUMsTUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7Z0JBQzFDLGdCQUFnQixFQUFFLFFBQVE7Z0JBQzFCLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRTthQUN0RCxDQUFDLENBT0gsQ0FBQyxRQUFRLENBQUM7WUFDWCxNQUFNLFFBQVEsR0FDWixRQUFRLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHO2dCQUNsQyxZQUFZO2dCQUNaLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixFQUFFLENBQUM7WUFFTCxPQUFPO2dCQUNMLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUN6QixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNO1lBQy9CLE1BQU0sT0FBTyxHQUFHLHNCQUFzQixDQUFDO1lBQ3ZDLE1BQU0sRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUNELE1BQU0sR0FBRyxHQUNQLEVBQUUsQ0FBQyxPQUFPO2dCQUNSLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDUCxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDO2dCQUM3QyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssT0FBTyxDQUFDO2dCQUNuRCxJQUFBLFdBQUssRUFBQyxlQUFlLENBQUMsQ0FBQztZQUV6QixNQUFNLEVBQ0osTUFBTSxFQUNOLFlBQVksRUFDWixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLFFBQVEsRUFDUixhQUFhLEdBQ2QsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUxQixPQUFPO2dCQUNMLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUN0QixZQUFZO2dCQUNaLFlBQVk7Z0JBQ1osUUFBUTtnQkFDUixnQkFBZ0I7Z0JBQ2hCLGFBQWE7YUFDZCxDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNO1lBQzlCLE1BQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDO1lBQ3RDLE1BQU0sRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUNELE1BQU0sR0FBRyxHQUNQLEVBQUUsQ0FBQyxPQUFPO2dCQUNSLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDUCxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDO2dCQUM3QyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssT0FBTyxDQUFDO2dCQUNuRCxJQUFBLFdBQUssRUFBQyxlQUFlLENBQUMsQ0FBQztZQUV6QixNQUFNLEVBQ0osWUFBWSxFQUNaLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsUUFBUSxFQUNSLGFBQWEsR0FDZCxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFCLE9BQU87Z0JBQ0wsWUFBWTtnQkFDWixZQUFZO2dCQUNaLFFBQVE7Z0JBQ1IsZ0JBQWdCO2dCQUNoQixhQUFhO2FBQ2QsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTO1lBQzVELElBQUksT0FBTyxLQUFLLEtBQUssRUFBRSxDQUFDO2dCQUN0QixNQUFNLEdBQUcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FDakQ7b0JBQ0UsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPO29CQUN0QixnQkFBZ0IsRUFBRSxRQUFRO29CQUMxQixHQUFHLEVBQUU7d0JBQ0gsZUFBZSxFQUFFOzRCQUNmLGVBQWUsRUFBRSxNQUFNOzRCQUN2QixRQUFRLEVBQUUsT0FBTzs0QkFDakIsWUFBWSxFQUFFLElBQUk7eUJBQ25CO3FCQUNGO2lCQUNGLEVBQ0Q7b0JBQ0UsYUFBYSxFQUFFLElBQUk7b0JBQ25CLFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUNGLENBQUM7Z0JBQ0YsT0FBTyxHQUFHLENBQUM7WUFDYixDQUFDO1lBQ0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQ2pEO2dCQUNFLE1BQU0sRUFBRSxNQUFNLENBQUMsT0FBTztnQkFDdEIsZ0JBQWdCLEVBQUUsUUFBUTtnQkFDMUIsR0FBRyxFQUFFO29CQUNILE9BQU8sRUFBRTt3QkFDUCxPQUFPLEVBQUUsTUFBTTt3QkFDZixRQUFRLEVBQUUsT0FBTztxQkFDbEI7aUJBQ0Y7YUFDRixFQUNEO2dCQUNFLFFBQVEsRUFBRSxLQUFLO2dCQUNmLEdBQUcsU0FBUzthQUNiLENBQ0YsQ0FBQztZQUNGLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQzdDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTztnQkFDdkIsS0FBSyxFQUFFLE9BQU87YUFDZixDQUFDLENBQUM7WUFDSCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FDWCxNQUFNLEVBQ04sU0FBUyxFQUNULGdCQUFnQixFQUNoQixFQUFFLEVBQ0YsT0FBTyxFQUNQLFdBQVcsRUFDWCxDQUFDO1lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6QixJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUM7WUFDM0IsTUFBTSxRQUFRLEdBQ1osQ0FBQyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztnQkFDeEMsZ0JBQWdCLEVBQUUsU0FBUztnQkFDM0IsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFO2FBQ3RELENBQUMsQ0FHSCxDQUFDLFFBQVEsQ0FBQztZQUNYLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUN2QixRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUNoQyxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sTUFBTSxJQUFJLEdBQUc7b0JBQ1gsR0FBRyxRQUFRLENBQUMsU0FBUztvQkFDckIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLEVBQUU7aUJBQ2pELENBQUM7Z0JBQ0YsTUFBTSxXQUFXLEdBQUcsTUFBTSxjQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkQsUUFBUSxHQUFHLHlDQUF5QyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLENBQUM7WUFFRCxNQUFNLGdCQUFnQixHQUNwQixNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDO2dCQUNuRCxnQkFBZ0IsRUFBRSxTQUFTO2FBQzVCLENBQUMsQ0FBQztZQUNMLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztnQkFDaEUsZ0JBQWdCLEVBQUUsU0FBUzthQUM1QixDQUFDLENBQUM7WUFDSCxNQUFNLElBQUksR0FBWTtnQkFDcEIsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRTt3QkFDSixpQkFBaUIsRUFBRSxnQkFBZ0I7d0JBQ25DLHdCQUF3QixFQUFFLEVBQUU7d0JBQzVCLDJCQUEyQixFQUFFLFNBQVM7d0JBQ3RDLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO3dCQUM1QixZQUFZLEVBQUUsUUFBUTt3QkFDdEIsb0JBQW9CLEVBQUU7NEJBQ3BCLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUN0QixhQUFhLEVBQUUsT0FBTyxJQUFJLElBQUEsV0FBSyxFQUFDLG1CQUFtQixDQUFDLENBQ3JEOzRCQUNELFNBQVMsRUFDUCxnQkFBZ0IsQ0FBQyxTQUFTLElBQUksSUFBQSxXQUFLLEVBQUMscUJBQXFCLENBQUM7eUJBQzdEO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQztZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsTUFBTSxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQ2hEO2dCQUNFLGdCQUFnQixFQUFFLE1BQU07Z0JBQ3hCLEdBQUcsRUFBRSxJQUFJO2dCQUNULDZCQUE2QjtnQkFDN0IsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPO2FBQ3ZCLEVBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLE1BQU87Z0JBQ2pCLEdBQUcsQ0FBQzthQUNMLENBQ0YsQ0FBQztZQUNGLE9BQU8sRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDckQsQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQ1gsTUFBTSxFQUNOLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsRUFBRSxFQUNGLE9BQU8sRUFDUCxHQUFHLEVBQ0gsV0FBVyxFQUNYLFNBQVM7WUFFVCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sZ0JBQWdCLEdBQ3BCLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUM7Z0JBQ25ELGdCQUFnQixFQUFFLFNBQVM7YUFDNUIsQ0FBQyxDQUFDO1lBQ0wsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO2dCQUNoRSxnQkFBZ0IsRUFBRSxTQUFTO2FBQzVCLENBQUMsQ0FBQztZQUNILE1BQU0sSUFBSSxHQUFhO2dCQUNyQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFO3dCQUNKLG9CQUFvQixFQUFFOzRCQUNwQixPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FDdEIsYUFBYSxFQUFFLE9BQU8sSUFBSSxJQUFBLFdBQUssRUFBQyxtQkFBbUIsQ0FBQyxDQUNyRDs0QkFDRCxTQUFTLEVBQ1AsZ0JBQWdCLENBQUMsU0FBUyxJQUFJLElBQUEsV0FBSyxFQUFDLHFCQUFxQixDQUFDO3lCQUM3RDt3QkFDRCxZQUFZLEVBQUUsV0FBVzt3QkFDekIsaUJBQWlCLEVBQUUsZ0JBQWdCO3dCQUNuQyx3QkFBd0IsRUFBRSxFQUFFO3dCQUM1QiwyQkFBMkIsRUFBRSxTQUFTO3dCQUN0QyxZQUFZLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRTt3QkFDNUIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7cUJBQzdCO2lCQUNGO2FBQ0YsQ0FBQztZQUNGLE1BQU0sRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUNoRDtnQkFDRSxnQkFBZ0IsRUFBRSxNQUFNO2dCQUN4QixHQUFHLEVBQUUsSUFBSTtnQkFDVCxTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPO2FBQ3ZCLEVBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLE1BQU87Z0JBQ2pCLEdBQUcsU0FBUzthQUNiLENBQ0YsQ0FBQztZQUNGLE9BQU87Z0JBQ0wsR0FBRyxFQUFFLEVBQUU7Z0JBQ1AsSUFBSTtvQkFDRixPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQzVCLENBQUM7YUFDRixDQUFDO1FBQ0osQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBaHRCRCxzQ0FndEJDO0FBRUQsU0FBZ0Isd0JBQXdCLENBQ3RDLE1BQWtCLEVBQ2xCLFNBQXFCO0lBRXJCLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxFQUFFLEVBQUUsQ0FBQztRQUM1QixNQUFNLElBQUksS0FBSyxDQUNiLGtJQUFrSSxDQUNuSSxDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLEVBQUUscUJBQXFCLENBQUMsTUFBTSxDQUFDO1FBQ3RDLFNBQVMsRUFBRSxJQUFBLG1CQUFRLEVBQUMsU0FBUyxDQUFDO0tBQy9CLENBQUM7QUFDSixDQUFDO0FBZEQsNERBY0M7QUFFRCxTQUFnQixxQkFBcUIsQ0FBQyxNQUFrQjtJQUN0RCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN2RSxNQUFNLElBQUksS0FBSyxDQUNiLG1GQUFtRixDQUNwRixDQUFDO0lBQ0osQ0FBQztJQUNELE9BQU87UUFDTCxJQUFJLEVBQUUsNEJBQTRCO1FBQ2xDLEtBQUssRUFBRSxJQUFBLG1CQUFRLEVBQUMsTUFBTSxDQUFDO0tBQ3hCLENBQUM7QUFDSixDQUFDO0FBVkQsc0RBVUMifQ==