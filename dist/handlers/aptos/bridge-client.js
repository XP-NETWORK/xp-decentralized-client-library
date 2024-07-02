"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeClient = void 0;
const crypto_1 = require("crypto");
const aptos_1 = require("aptos");
const constants_1 = require("./constants");
class BridgeClient {
    constructor(client, address) {
        this.aptosClient = client;
        this.address = address;
    }
    async fundAccounts(accounts) {
        await Promise.all(accounts.map((account) => this.aptosClient.fundAccount({
            accountAddress: account.accountAddress,
            amount: 100,
            options: { checkSuccess: true },
        })));
    }
    async initialize(adminAccount, validators, seed, selfChain) {
        const transaction = await this.aptosClient.transaction.build.simple({
            sender: adminAccount.accountAddress,
            data: {
                function: `${this.address}::${constants_1.BRIDGE_MODULE}::${constants_1.BRIDGE_FUNCTIONS.Initialize}`,
                functionArguments: [validators, seed, selfChain],
            },
        });
        return this.aptosClient.signAndSubmitTransaction({
            signer: adminAccount,
            transaction,
        });
    }
    async addValidator(adminAccount, validator, signatures, public_keys) {
        const transaction = await this.aptosClient.transaction.build.simple({
            sender: adminAccount.accountAddress,
            data: {
                function: `${this.address}::${constants_1.BRIDGE_MODULE}::${constants_1.BRIDGE_FUNCTIONS.AddValidator}`,
                functionArguments: [validator, signatures, public_keys],
            },
        });
        return this.aptosClient.signAndSubmitTransaction({
            signer: adminAccount,
            transaction,
        });
    }
    async lock721(owner, collection, name, destination_chain, token_id, source_nft_contract_address) {
        const transaction = await this.aptosClient.transaction.build.simple({
            sender: owner.accountAddress,
            data: {
                function: `${this.address}::${constants_1.BRIDGE_MODULE}::${constants_1.BRIDGE_FUNCTIONS.Lock721}`,
                functionArguments: [
                    collection,
                    name,
                    destination_chain,
                    token_id,
                    source_nft_contract_address,
                ],
            },
        });
        return this.aptosClient.signAndSubmitTransaction({
            signer: owner,
            transaction,
        });
    }
    async lock1155(owner, collection, name, amount, destination_chain, token_id, source_nft_contract_address) {
        const transaction = await this.aptosClient.transaction.build.simple({
            sender: owner.accountAddress,
            data: {
                function: `${this.address}::${constants_1.BRIDGE_MODULE}::${constants_1.BRIDGE_FUNCTIONS.Lock1155}`,
                functionArguments: [
                    collection,
                    name,
                    amount,
                    destination_chain,
                    token_id,
                    source_nft_contract_address,
                ],
            },
        });
        return this.aptosClient.signAndSubmitTransaction({
            signer: owner,
            transaction,
        });
    }
    async claim721(sender, { collection, description, symbol, uri, royaltyPointsNumerator, royaltyPointsDenominator, royaltyPayeeAddress, fee, sourceChain, sourceNftContractAddress, destinationChain, transactionHash, tokenId, nftType, metadata, }, signatures, publicKeys) {
        const transaction = await this.aptosClient.transaction.build.simple({
            sender: sender.accountAddress,
            data: {
                function: `${this.address}::${constants_1.BRIDGE_MODULE}::${constants_1.BRIDGE_FUNCTIONS.Claim721}`,
                functionArguments: [
                    collection,
                    description,
                    uri,
                    royaltyPointsNumerator,
                    royaltyPointsDenominator,
                    royaltyPayeeAddress.toString(),
                    fee,
                    signatures,
                    publicKeys,
                    destinationChain,
                    sourceChain,
                    sourceNftContractAddress,
                    tokenId,
                    transactionHash,
                    nftType,
                    metadata,
                    symbol,
                    // amount,
                    // iconUri,
                    // projectUri,
                ],
            },
        });
        return this.aptosClient.signAndSubmitTransaction({
            signer: sender,
            transaction,
        });
    }
    async claim1155(sender, { collection, description, symbol, amount, uri, iconUri, projectUri, royaltyPointsNumerator, royaltyPointsDenominator, royaltyPayeeAddress, fee, sourceChain, sourceNftContractAddress, destinationChain, transactionHash, tokenId, nftType, metadata, }, signatures, publicKeys) {
        const transaction = await this.aptosClient.transaction.build.simple({
            sender: sender.accountAddress,
            data: {
                function: `${this.address}::${constants_1.BRIDGE_MODULE}::${constants_1.BRIDGE_FUNCTIONS.Claim1155}`,
                functionArguments: [
                    collection,
                    description,
                    uri,
                    royaltyPointsNumerator,
                    royaltyPointsDenominator,
                    royaltyPayeeAddress.toString(),
                    fee,
                    signatures,
                    publicKeys,
                    destinationChain,
                    sourceChain,
                    sourceNftContractAddress,
                    tokenId,
                    transactionHash,
                    nftType,
                    metadata,
                    symbol,
                    amount,
                    iconUri,
                    projectUri,
                ],
            },
        });
        return this.aptosClient.signAndSubmitTransaction({
            signer: sender,
            transaction,
        });
    }
    async claimValidatorRewards(adminAccount, to, validator, signatures, public_keys) {
        const transaction = await this.aptosClient.transaction.build.simple({
            sender: adminAccount.accountAddress,
            data: {
                function: `${this.address}::${constants_1.BRIDGE_MODULE}::${constants_1.BRIDGE_FUNCTIONS.ClaimValidatorRewards}`,
                functionArguments: [to.toString(), validator, signatures, public_keys],
            },
        });
        return this.aptosClient.signAndSubmitTransaction({
            signer: adminAccount,
            transaction,
        });
    }
    async mintNft721(owner, collection_name, collection_description, collection_uri, nft_name, nft_description, nft_uri) {
        const transaction = await this.aptosClient.transaction.build.simple({
            sender: owner.accountAddress,
            data: {
                function: `${this.address}::${constants_1.MINT_MODULE}::${constants_1.MINT_FUNCTIONS.MINT_TO}`,
                functionArguments: [
                    collection_name,
                    collection_description,
                    collection_uri,
                    nft_name,
                    nft_description,
                    nft_uri,
                ],
            },
        });
        return this.aptosClient.signAndSubmitTransaction({
            signer: owner,
            transaction,
        });
    }
    async mintNft1155(owner, collection_name, collection_description, collection_uri, nft_name, nft_description, nft_uri, token_symbol, amount, icon_uri, project_uri) {
        const transaction = await this.aptosClient.transaction.build.simple({
            sender: owner.accountAddress,
            data: {
                function: `${this.address}::${constants_1.MINT_MODULE}::${constants_1.MINT_FUNCTIONS.MINT_1155_TO}`,
                functionArguments: [
                    collection_name,
                    collection_description,
                    collection_uri,
                    nft_name,
                    nft_description,
                    nft_uri,
                    token_symbol,
                    amount,
                    icon_uri,
                    project_uri,
                ],
            },
        });
        return this.aptosClient.signAndSubmitTransaction({
            signer: owner,
            transaction,
        });
    }
    async userOwnsNft(owner, collection, name) {
        const payload = {
            function: `${this.address}::${constants_1.BRIDGE_MODULE}::${constants_1.BRIDGE_FUNCTIONS.OwnsNFT}`,
            // type_arguments: ["0x1::aptos_coin::AptosCoin"],
            functionArguments: [owner.toString(), collection, name],
        };
        return this.aptosClient.view({ payload });
    }
    async getBridgeData() {
        const resources = await this.aptosClient.getAccountResources({
            accountAddress: this.address,
        });
        const bridgeResource = resources.find((r) => r.type === `0x${this.address}::aptos_nft_bridge::Bridge`);
        return bridgeResource?.data;
    }
    generateRandomSeed(length) {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    convertToHexString(str) {
        return `0x${Buffer.from(str).toString("hex")}`;
    }
    generateClaimDataHash(claimData, user) {
        const serializer = new aptos_1.BCS.Serializer();
        serializer.serializeStr(claimData.tokenId);
        serializer.serializeBytes(claimData.sourceChain);
        serializer.serializeBytes(claimData.destinationChain);
        serializer.serializeFixedBytes(new aptos_1.HexString(user.accountAddress.toString()).toUint8Array());
        serializer.serializeBytes(claimData.sourceNftContractAddress);
        serializer.serializeStr(claimData.collection);
        serializer.serializeU64(claimData.royaltyPointsNumerator);
        serializer.serializeU64(claimData.royaltyPointsDenominator);
        serializer.serializeFixedBytes(new aptos_1.HexString(user.accountAddress.toString()).toUint8Array());
        serializer.serializeStr(claimData.metadata);
        serializer.serializeBytes(claimData.transactionHash);
        serializer.serializeU256(claimData.amount);
        serializer.serializeBytes(claimData.nftType);
        serializer.serializeU64(claimData.fee);
        serializer.serializeStr(claimData.symbol);
        return (0, crypto_1.createHash)("SHA256").update(serializer.getBytes()).digest();
    }
}
exports.BridgeClient = BridgeClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZGdlLWNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oYW5kbGVycy9hcHRvcy9icmlkZ2UtY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFvQztBQVFwQyxpQ0FBdUM7QUFDdkMsMkNBS3FCO0FBNkRyQixNQUFhLFlBQVk7SUFJdkIsWUFBWSxNQUFhLEVBQUUsT0FBZTtRQUN4QyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUEwQjtRQUMzQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2YsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO1lBQzNCLGNBQWMsRUFBRSxPQUFPLENBQUMsY0FBYztZQUN0QyxNQUFNLEVBQUUsR0FBRztZQUNYLE9BQU8sRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUU7U0FDaEMsQ0FBQyxDQUNILENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUNkLFlBQTRCLEVBQzVCLFVBQXdCLEVBQ3hCLElBQWdCLEVBQ2hCLFNBQXFCO1FBRXJCLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNsRSxNQUFNLEVBQUUsWUFBWSxDQUFDLGNBQWM7WUFDbkMsSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLEtBQUsseUJBQWEsS0FBSyw0QkFBZ0IsQ0FBQyxVQUFVLEVBQUU7Z0JBQzdFLGlCQUFpQixFQUFFLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUM7YUFDakQ7U0FDRixD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