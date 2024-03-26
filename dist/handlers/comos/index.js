"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosmosHandler = void 0;
const cosmwasm_stargate_1 = require("@cosmjs/cosmwasm-stargate");
const cosmos_client_1 = require("@xp/cosmos-client");
function cosmosHandler({ provider, rpc, bridge, storage, }) {
    const bc = new cosmos_client_1.Bridge.BridgeQueryClient(provider, bridge);
    return {
        async approveNft(signer, tokenId, contract, extraArgs) {
            const cosmSigner = await cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpc, signer);
            const nft = new cosmos_client_1.CosmNft.CosmosNftClient(cosmSigner, (await signer.getAccounts())[0].address, contract);
            const approved = await nft.approve({
                spender: bridge,
                tokenId: tokenId,
            }, extraArgs?.fee, extraArgs?.memo, extraArgs?.funds);
            return approved;
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
                            signature: e.signature,
                            signer_address: e.signer,
                        };
                    }),
                },
            }, extraArgs?.fee, extraArgs?.memo, [
                {
                    amount: claimData.fee.toString(),
                    denom: "uatom",
                },
            ]);
            return claim;
        },
        getStorageContract() {
            return storage;
        },
        transform(input) {
            return {
                destination_chain: input.destinationChain,
                destination_user_address: input.destinationUserAddress,
                fee: parseInt(input.fee),
                name: input.name,
                symbol: input.symbol,
                metadata: input.metadata,
                royalty: parseInt(input.royalty),
                nft_type: input.nftType,
                royalty_receiver: input.royaltyReceiver,
                source_chain: input.sourceChain,
                source_nft_contract_address: input.sourceNftContractAddress,
                token_amount: parseInt(input.tokenAmount),
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
                e.type === "wasm" &&
                    e.attributes.find((e) => e.key === "LockedEventInfo");
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
        async lockNft(signer, sourceNft, destinationChain, to, tokenId) {
            const cosmSigner = await cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpc, signer);
            const bc = new cosmos_client_1.Bridge.BridgeClient(cosmSigner, (await signer.getAccounts())[0].address, bridge);
            const lock = await bc.lock721({
                data: {
                    destination_chain: destinationChain,
                    collection_code_id: 0,
                    destination_user_address: to,
                    token_id: tokenId.toString(),
                    source_nft_contract_address: sourceNft,
                },
            });
            return {
                hash() {
                    return lock.transactionHash;
                },
                tx: lock,
            };
        },
        async nftData(tokenId, contract) {
            const nft = new cosmos_client_1.CosmNft.CosmosNftQueryClient(provider, contract);
            const data = await nft.nftInfo({ tokenId });
            const collection = await nft.contractInfo();
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
        },
        async mintNft(signer, ma, gasArgs) {
            const cosmSigner = await cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpc, signer);
            const nft = new cosmos_client_1.CosmNft.CosmosNftClient(cosmSigner, (await signer.getAccounts())[0].address, ma.contract);
            const mint = await nft.mint({
                extension: {
                    royalty_payment_address: ma.royalty_payment_address,
                    royalty_percentage: ma.royalty_percentage,
                },
                owner: ma.owner ?? (await signer.getAccounts())[0].address,
                tokenId: ma.token_id,
                tokenUri: ma.token_uri,
            }, gasArgs?.fee, gasArgs?.memo, gasArgs?.funds);
            return mint;
        },
        deployCollection(_signer, _data) {
            throw new Error("Unimplemtented");
        },
    };
}
exports.cosmosHandler = cosmosHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvY29tb3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUVBQWtFO0FBRWxFLHFEQUFvRDtBQUdwRCxTQUFnQixhQUFhLENBQUMsRUFDNUIsUUFBUSxFQUNSLEdBQUcsRUFDSCxNQUFNLEVBQ04sT0FBTyxHQUNPO0lBQ2QsTUFBTSxFQUFFLEdBQUcsSUFBSSxzQkFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRCxPQUFPO1FBQ0wsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTO1lBQ25ELE1BQU0sVUFBVSxHQUFHLE1BQU0seUNBQXFCLENBQUMsaUJBQWlCLENBQzlELEdBQUcsRUFDSCxNQUFNLENBQ1AsQ0FBQztZQUNGLE1BQU0sR0FBRyxHQUFHLElBQUksdUJBQU8sQ0FBQyxlQUFlLENBQ3JDLFVBQVUsRUFDVixDQUFDLE1BQU0sTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUN2QyxRQUFRLENBQ1QsQ0FBQztZQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FDaEM7Z0JBQ0UsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsT0FBTyxFQUFFLE9BQU87YUFDakIsRUFDRCxTQUFTLEVBQUUsR0FBRyxFQUNkLFNBQVMsRUFBRSxJQUFJLEVBQ2YsU0FBUyxFQUFFLEtBQUssQ0FDakIsQ0FBQztZQUNGLE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQztRQUNELEtBQUssQ0FBQyxpQkFBaUI7WUFDckIsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFD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