"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosmWasmHandler = void 0;
const cosmwasm_stargate_1 = require("@cosmjs/cosmwasm-stargate");
const cosmos_client_1 = require("@xp/cosmos-client");
async function cosmWasmHandler({ rpc, bridge, denom, nftCodeId, storage, chainId, identifier, }) {
    const provider = await cosmwasm_stargate_1.CosmWasmClient.connect(rpc);
    async function nftData(tokenId, contract, _extra) {
        const nft = new cosmos_client_1.CosmNft.CosmosNftQueryClient(provider, contract);
        const data = await nft.nftInfo({ tokenId });
        const collection = await nft.contractInfo();
        const check_royalties = await nft
            .extension({
            msg: {
                check_royalties: {},
            },
        })
            .catch(() => false);
        if (check_royalties) {
            const royalty = await nft.extension({
                msg: {
                    royalty_info: {
                        sale_price: "10000",
                        token_id: tokenId,
                    },
                },
            });
            return {
                metadata: data.token_uri ?? "",
                name: collection.name,
                symbol: collection.symbol,
                royalty: royalty.royalty_amount,
            };
        }
        return {
            metadata: data.token_uri ?? "",
            name: collection.name,
            symbol: collection.symbol,
            royalty: 1n,
        };
    }
    const bc = new cosmos_client_1.Bridge.BridgeQueryClient(provider, bridge);
    return {
        identifier,
        async validateAddress(address) {
            try {
                await provider.getAccount(address);
                return true;
            }
            catch {
                return false;
            }
        },
        async approveNft(signer, tokenId, contract, _nftType, extraArgs) {
            const cosmSigner = await cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpc, signer);
            const nft = new cosmos_client_1.CosmNft.CosmosNftClient(cosmSigner, (await signer.getAccounts())[0].address, contract);
            const approved = await nft.approve({
                spender: bridge,
                tokenId: tokenId,
            }, extraArgs?.fee ?? {
                amount: [
                    {
                        amount: "50000",
                        denom: denom,
                    },
                ],
                gas: "2500000",
            }, extraArgs?.memo, extraArgs?.funds);
            return approved;
        },
        async readClaimed721Event(hash) {
            const tx = await provider.getTx(hash);
            if (!tx)
                throw new Error(`Failed to find tx hash on ${chainId}: ${hash}`);
            const attributes = tx.events.flatMap((e) => {
                if (e.type === "wasm")
                    return e.attributes;
                return [];
            });
            const attribute = attributes.find((e) => e.key === "ClaimedEventInfo");
            if (!attribute)
                throw new Error(`No ClaimedEventInfo attribute found in tx: ${tx.hash}`);
            const data = JSON.parse(attribute.value);
            return {
                nft_contract: data.contract,
                source_chain: data.source_chain,
                transaction_hash: data.transaction_hash,
                token_id: data.token_id,
                lock_tx_chain: data.lock_tx_chain,
            };
        },
        getProvider() {
            return provider;
        },
        async getValidatorCount() {
            return (await bc.getValidatorsCount()).count;
        },
        async getBalance(signer) {
            const account = (await signer.getAccounts())[0];
            return BigInt((await provider.getBalance(account.address, "uatom")).amount);
        },
        async claimNft(signer, claimData, sig, extraArgs) {
            const cosmSigner = await cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpc, signer);
            const bc = new cosmos_client_1.Bridge.BridgeClient(cosmSigner, (await signer.getAccounts())[0].address, bridge);
            const claim = await bc.claim721({
                data: {
                    data: claimData,
                    signatures: sig.map((e) => {
                        return {
                            signature: Buffer.from(e.signature.replace("0x", ""), "hex").toString("base64"),
                            signer_address: Buffer.from(e.signerAddress, "hex").toString("base64"),
                        };
                    }),
                },
            }, extraArgs?.fee ?? {
                amount: [
                    {
                        amount: "50000",
                        denom: denom,
                    },
                ],
                gas: "2500000",
            }, extraArgs?.memo, [
                {
                    amount: claimData.fee.toString(),
                    denom: denom,
                },
            ]);
            return {
                ret: claim,
                hash() {
                    return claim.transactionHash;
                },
            };
        },
        getStorageContract() {
            return storage;
        },
        transform(input) {
            return {
                destination_chain: input.destinationChain,
                destination_user_address: input.destinationUserAddress,
                // biome-ignore lint/suspicious/noExplicitAny: broken cosmwasm types
                fee: input.fee,
                name: input.name,
                symbol: input.symbol,
                metadata: input.metadata,
                royalty: Number.parseInt(input.royalty),
                nft_type: input.nftType,
                royalty_receiver: input.royaltyReceiver,
                source_chain: input.sourceChain,
                source_nft_contract_address: input.sourceNftContractAddress,
                // biome-ignore lint/suspicious/noExplicitAny: broken cosmwasm types
                token_amount: input.tokenAmount,
                token_id: input.tokenId,
                transaction_hash: input.transactionHash,
            };
        },
        async decodeLockedEvent(txHash) {
            const tx = await provider.getTx(txHash);
            if (!tx) {
                throw new Error("Transaction not found");
            }
            const e = tx.events.find((e) => {
                return (e.type === "wasm" &&
                    e.attributes.find((e) => e.key === "LockedEventInfo"));
            });
            if (!e) {
                throw new Error("Event not found");
            }
            const data = e.attributes.find((e) => e.key === "LockedEventInfo");
            if (!data) {
                throw new Error("Data not found");
            }
            const { token_id: tokenId, // Unique ID for the NFT transfer
            destination_chain: destinationChain, // Chain to where the NFT is being transferred
            destination_user_address: destinationUserAddress, // User's address in the destination chain
            source_nft_contract_address: sourceNftContractAddress, // Address of the NFT contract in the source chain
            token_amount: tokenAmount, // amount of nfts to be transfered ( 1 in 721 case )
            nft_type: nftType, // Sigular or multiple ( 721 / 1155)
            source_chain: sourceChain, // Source chain of NFT
             } = JSON.parse(data.value);
            return {
                destinationChain,
                destinationUserAddress,
                sourceNftContractAddress,
                tokenId,
                tokenAmount,
                nftType,
                sourceChain,
                transactionHash: txHash,
                lockTxChain: identifier,
                metaDataUri: "",
            };
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metaDataUri, extraArgs) {
            console.log(metaDataUri);
            const cosmSigner = await cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpc, signer);
            const bc = new cosmos_client_1.Bridge.BridgeClient(cosmSigner, (await signer.getAccounts())[0].address, bridge);
            const lockCollectionId = await cosmSigner.getContractCodeHistory(sourceNft);
            const lock = await bc.lock721({
                data: {
                    destination_chain: destinationChain,
                    collection_code_id: lockCollectionId[lockCollectionId.length - 1].codeId,
                    destination_user_address: to,
                    token_id: tokenId.toString(),
                    source_nft_contract_address: sourceNft,
                },
            }, extraArgs?.fee ?? {
                amount: [
                    {
                        amount: "50000",
                        denom: denom,
                    },
                ],
                gas: "2500000",
            }, extraArgs?.memo);
            return {
                hash() {
                    return lock.transactionHash;
                },
                ret: lock,
            };
        },
        nftData: nftData,
        async mintNft(signer, ma, gasArgs) {
            const cosmSigner = await cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpc, signer);
            const nft = new cosmos_client_1.CosmNft.CosmosNftClient(cosmSigner, (await signer.getAccounts())[0].address, ma.contract);
            const mint = await nft.mint({
                owner: ma.owner ?? (await signer.getAccounts())[0].address,
                tokenId: ma.token_id,
                tokenUri: ma.token_uri,
                // biome-ignore lint/suspicious/noExplicitAny:
            }, gasArgs?.fee ?? {
                amount: [
                    {
                        amount: "50000",
                        denom: denom,
                    },
                ],
                gas: "150000",
            }, gasArgs?.memo, gasArgs?.funds);
            return mint;
        },
        async deployNftCollection(signer, data, gasArgs) {
            const sender = (await signer.getAccounts())[0];
            const client = await cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpc, signer);
            const msg = {
                name: data.name,
                symbol: data.symbol,
                minter: sender.address,
            };
            const inst = await client.instantiate(sender.address, data.codeId ?? nftCodeId, msg, `${data.name}-${Math.random() * 1000}`, gasArgs?.fee ?? {
                amount: [
                    {
                        amount: "50000",
                        denom: denom,
                    },
                ],
                gas: "2500000",
            }, {
                funds: gasArgs?.funds,
                memo: gasArgs?.memo,
            });
            return inst.contractAddress;
        },
    };
}
exports.cosmWasmHandler = cosmWasmHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvY29zbXdhc20vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUVBR21DO0FBRW5DLHFEQUFvRDtBQU83QyxLQUFLLFVBQVUsZUFBZSxDQUFDLEVBQ3BDLEdBQUcsRUFDSCxNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxPQUFPLEVBQ1AsT0FBTyxFQUNQLFVBQVUsR0FDTTtJQUNoQixNQUFNLFFBQVEsR0FBRyxNQUFNLGtDQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRW5ELEtBQUssVUFBVSxPQUFPLENBQ3BCLE9BQWUsRUFDZixRQUFnQixFQUNoQixNQUFxQztRQUVyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDNUMsTUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDNUMsTUFBTSxlQUFlLEdBQUcsTUFBTSxHQUFHO2FBQzlCLFNBQVMsQ0FBQztZQUNULEdBQUcsRUFBRTtnQkFDSCxlQUFlLEVBQUUsRUFBRTthQUNwQjtTQUNGLENBQUM7YUFDRCxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsSUFBSSxlQUFlLEVBQUUsQ0FBQztZQUNwQixNQUFNLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUM7Z0JBQ2xDLEdBQUcsRUFBRTtvQkFDSCxZQUFZLEVBQUU7d0JBQ1osVUFBVSxFQUFFLE9BQU87d0JBQ25CLFFBQVEsRUFBRSxPQUFPO3FCQUNsQjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILE9BQU87Z0JB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