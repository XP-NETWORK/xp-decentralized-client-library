"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosmWasmHandler = void 0;
const cosmwasm_stargate_1 = require("@cosmjs/cosmwasm-stargate");
const cosmos_client_1 = require("@xp/cosmos-client");
async function cosmWasmHandler({ rpc, bridge, denom, nftCodeId, storage, chainId, }) {
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
                tx: lock,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvY29zbXdhc20vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUVBR21DO0FBRW5DLHFEQUFvRDtBQUk3QyxLQUFLLFVBQVUsZUFBZSxDQUFDLEVBQ3BDLEdBQUcsRUFDSCxNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxPQUFPLEVBQ1AsT0FBTyxHQUNTO0lBQ2hCLE1BQU0sUUFBUSxHQUFHLE1BQU0sa0NBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFbkQsS0FBSyxVQUFVLE9BQU8sQ0FDcEIsT0FBZSxFQUNmLFFBQWdCLEVBQ2hCLE1BQXFDO1FBRXJDLE1BQU0sR0FBRyxHQUFHLElBQUksdUJBQU8sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDakUsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUM1QyxNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM1QyxNQUFNLGVBQWUsR0FBRyxNQUFNLEdBQUc7YUFDOUIsU0FBUyxDQUFDO1lBQ1QsR0FBRyxFQUFFO2dCQUNILGVBQWUsRUFBRSxFQUFFO2FBQ3BCO1NBQ0YsQ0FBQzthQUNELEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixJQUFJLGVBQWUsRUFBRSxDQUFDO1lBQ3BCLE1BQU0sT0FBTyxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQztnQkFDbEMsR0FBRyxFQUFFO29CQUNILFlBQVksRUFBRTt3QkFDWixVQUFVLEVBQUUsT0FBTzt3QkFDbkIsUUFBUSxFQUFFLE9BQU87cUJBQ2xCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsT0FBTztnQkFDTCxRQUFRLEVB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