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
        async approveNft(signer, tokenId, contract, extraArgs) {
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
                royalty: parseInt(input.royalty),
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
        async getClaimData(txHash) {
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
            const fee = await storage.chainFee(destinationChain);
            const royaltyReceiver = await storage.chainRoyalty(destinationChain);
            let nft = {
                metadata: "",
                name: "",
                royalty: 0n,
                symbol: "",
            };
            try {
                await provider.getAccount(sourceNftContractAddress);
                nft = await nftData(tokenId, sourceNftContractAddress, {});
            }
            catch (e) { }
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
                lockTxChain: identifier,
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
        async deployCollection(signer, data, gasArgs) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvY29zbXdhc20vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUVBR21DO0FBRW5DLHFEQUFvRDtBQUk3QyxLQUFLLFVBQVUsZUFBZSxDQUFDLEVBQ3BDLEdBQUcsRUFDSCxNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxPQUFPLEVBQ1AsT0FBTyxFQUNQLFVBQVUsR0FDTTtJQUNoQixNQUFNLFFBQVEsR0FBRyxNQUFNLGtDQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRW5ELEtBQUssVUFBVSxPQUFPLENBQ3BCLE9BQWUsRUFDZixRQUFnQixFQUNoQixNQUFxQztRQUVyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDNUMsTUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDNUMsTUFBTSxlQUFlLEdBQUcsTUFBTSxHQUFHO2FBQzlCLFNBQVMsQ0FBQztZQUNULEdBQUcsRUFBRTtnQkFDSCxlQUFlLEVBQUUsRUFBRTthQUNwQjtTQUNGLENBQUM7YUFDRCxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsSUFBSSxlQUFlLEVBQUUsQ0FBQztZQUNwQixNQUFNLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUM7Z0JBQ2xDLEdBQUcsRUFBRTtvQkFDSCxZQUFZLEVBQUU7d0JBQ1osVUFBVSxFQUFFLE9BQU87d0JBQ25CLFFBQVEsRUFBRSxPQUFPO3FCQUNsQjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILE9BQU87Z0JB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