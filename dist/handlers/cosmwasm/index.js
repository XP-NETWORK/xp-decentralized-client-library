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
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, extraArgs) {
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