"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretHandler = void 0;
const promises_1 = require("fs/promises");
const wallet_amino_1 = require("secretjs/dist/wallet_amino");
const ton_1 = require("../ton");
function secretHandler({ bridge, provider, storage, bridgeCodeHash, }) {
    return {
        getProvider() {
            return provider;
        },
        async claimNft(signer, claimData, extraArgs, sigs) {
            const claim721 = {
                claim721: {
                    data: {
                        claimData,
                        signatures: sigs.map((e) => {
                            return {
                                signature: (0, wallet_amino_1.encodeSecp256k1Signature)(Buffer.from(e.signer, "hex"), Buffer.from(e.signature.replace("0x", ""), "hex")).signature,
                                signer_address: (0, wallet_amino_1.encodeSecp256k1Pubkey)(Buffer.from(e.signer, "hex")).value,
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
            return tx;
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
        mintNft(signer, ma) {
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
                                signature: (0, wallet_amino_1.encodeSecp256k1Signature)(Buffer.from(e.signer, "hex"), Buffer.from(e.signature.replace("0x", ""), "hex")).signature,
                                signer_address: (0, wallet_amino_1.encodeSecp256k1Pubkey)(Buffer.from(e.signer, "hex")).value,
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
            return tx;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvc2VjcmV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUF1QztBQUN2Qyw2REFHb0M7QUFDcEMsZ0NBQStCO0FBRy9CLFNBQWdCLGFBQWEsQ0FBQyxFQUM1QixNQUFNLEVBQ04sUUFBUSxFQUNSLE9BQU8sRUFDUCxjQUFjLEdBQ0E7SUFDZCxPQUFPO1FBQ0wsV0FBVztZQUNULE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUk7WUFDL0MsTUFBTSxRQUFRLEdBQUc7Z0JBQ2YsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRTt3QkFDSixTQUFTO3dCQUNULFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7NEJBQ3pCLE9BQU87Z0NBQ0wsU0FBUyxFQUFFLElBQUEsdUNBQXdCLEVBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQ2xELENBQUMsU0FBUztnQ0FDWCxjQUFjLEVBQUUsSUFBQSxvQ0FBcUIsRUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUM3QixDQUFDLEtBQUs7NkJBQ1IsQ0FBQzt3QkFDSixDQUFDLENBQUM7cUJBQ0g7aUJBQ0Y7YUFDRixDQUFDO1lBRUYsTUFBTSxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQ2hEO2dCQUNFLGdCQUFnQixFQUFFLE1B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