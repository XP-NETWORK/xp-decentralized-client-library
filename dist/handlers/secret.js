"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretHandler = void 0;
const wallet_amino_1 = require("secretjs/dist/wallet_amino");
const ton_1 = require("./ton");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcmV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhbmRsZXJzL3NlY3JldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2REFHb0M7QUFHcEMsK0JBQThCO0FBbUM5QixTQUFnQixhQUFhLENBQUMsRUFDNUIsTUFBTSxFQUNOLFFBQVEsRUFDUixPQUFPLEVBQ1AsY0FBYyxHQUNBO0lBQ2QsT0FBTztRQUNMLFdBQVc7WUFDVCxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO1FBQ0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJO1lBQy9DLE1BQU0sUUFBUSxHQUFHO2dCQUNmLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUU7d0JBQ0osU0FBUzt3QkFDVCxVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFOzRCQUN6QixPQUFPO2dDQUNMLFNBQVMsRUFBRSxJQUFBLHVDQUF3QixFQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUNsRCxDQUFDLFNBQVM7Z0NBQ1gsY0FBYyxFQUFFLElBQUEsb0NBQXFCLEVBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FDN0IsQ0FBQyxLQUFLOzZCQUNSLENBQUM7d0JBQ0osQ0FBQyxDQUFDO3FCQUNIO2lCQUNGO2FBQ0YsQ0FBQztZQUVGLE1BQU0sRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUNoRDtnQkFDRSxnQkFBZ0IsRUFBRSxNQUFNO2dCQUN4QixHQUFHLEVBQUUs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