"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiversxHandler = void 0;
const out_1 = require("@multiversx/sdk-core/out");
const primitives_1 = require("@multiversx/sdk-network-providers/out/primitives");
const abi_1 = require("../contractsTypes/abi");
function multiversxHandler({ provider, gatewayURL, bridge, }) {
    const abiRegistry = out_1.AbiRegistry.create(abi_1.multiversXBridgeABI);
    const multiversXBridgeContract = new out_1.SmartContract({
        address: out_1.Address.fromString(bridge),
        abi: abiRegistry,
    });
    const getNonFungibleToken = async (collection, nonce) => {
        const nonceAsHex = new primitives_1.Nonce(nonce).hex();
        const response = (await (await fetch(`${gatewayURL.replace("gateway", "api")}/nfts/${collection}-${nonceAsHex}`)).json()).data;
        return {
            metaData: atob(response.uris[1]),
            royalties: response.royalties,
        };
    };
    return {
        async nftData(_, _a, nonce, collection) {
            const nftDetails = await provider.getDefinitionOfTokenCollection(collection);
            const { royalties, metaData } = await getNonFungibleToken(collection, nonce);
            return {
                name: nftDetails.name,
                symbol: nftDetails.ticker,
                metadata: metaData,
                royalty: BigInt(royalties),
            };
        },
        async approveNft(_signer, _tokenId, _contract, _ex) {
            return Promise.resolve("Not Required for MultiversX");
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, _) {
            const ba = new out_1.Address(bridge);
            const userAddress = new out_1.Address(signer.getAddress().bech32());
            const userAccount = new out_1.Account(userAddress);
            const userOnNetwork = await provider.getAccount(userAddress);
            userAccount.update(userOnNetwork);
            const collectionIdentifiers = `@${Buffer.from(sourceNft).toString("hex")}`;
            const noncec = `@${tokenId}`;
            const quantity = "@" + "01";
            const destination_address = `@${ba.hex()}`;
            const method = `@${Buffer.from("lock721").toString("hex")}`;
            const token_id = `@${Buffer.from(tokenId.toString()).toString("hex")}`;
            const destination_chain = `@${Buffer.from(destinationChain).toString("hex")}`;
            const destination_user_address = `@${Buffer.from(to).toString("hex")}`;
            const source_nft_contract_address = collectionIdentifiers;
            const tx3 = new out_1.Transaction({
                data: new out_1.TransactionPayload(`ESDTNFTTransfer${collectionIdentifiers}${noncec}${quantity}${destination_address}${method}${token_id}${destination_chain}${destination_user_address}${source_nft_contract_address}${noncec}`),
                gasLimit: 600000000,
                sender: signer.getAddress(),
                receiver: signer.getAddress(),
                chainID: "D",
            });
            tx3.setNonce(userAccount.getNonceThenIncrement());
            const serializedTransaction = tx3.serializeForSigning();
            const transactionSignature = await signer.sign(serializedTransaction);
            tx3.applySignature(transactionSignature);
            const txHash = await provider.sendTransaction(tx3);
            return txHash;
        },
        async claimNft(signer, claimData, _, sig) {
            const userAddress = new out_1.Address(signer.getAddress().bech32());
            const userAccount = new out_1.Account(userAddress);
            const userOnNetwork = await provider.getAccount(userAddress);
            userAccount.update(userOnNetwork);
            const structClaimData = new out_1.StructType("ClaimData", [
                new out_1.FieldDefinition("token_id", "name of the nft", new out_1.BytesType()),
                new out_1.FieldDefinition("source_chain", "attributes of the nft", new out_1.BytesType()),
                new out_1.FieldDefinition("destination_chain", "attributes of the nft", new out_1.BytesType()),
                new out_1.FieldDefinition("destination_user_address", "attributes of the nft", new out_1.AddressType()),
                new out_1.FieldDefinition("source_nft_contract_address", "attributes of the nft", new out_1.BytesType()),
                new out_1.FieldDefinition("name", "attributes of the nft", new out_1.BytesType()),
                new out_1.FieldDefinition("symbol", "attributes of the nft", new out_1.BytesType()),
                new out_1.FieldDefinition("royalty", "attributes of the nft", new out_1.BigUIntType()),
                new out_1.FieldDefinition("royalty_receiver", "attributes of the nft", new out_1.AddressType()),
                new out_1.FieldDefinition("attrs", "attributes of the nft", new out_1.BytesType()),
                new out_1.FieldDefinition("transaction_hash", "attributes of the nft", new out_1.BytesType()),
                new out_1.FieldDefinition("token_amount", "attributes of the nft", new out_1.BigUIntType()),
                new out_1.FieldDefinition("nft_type", "attributes of the nft", new out_1.BytesType()),
                new out_1.FieldDefinition("fee", "attributes of the nft", new out_1.BigUIntType()),
            ]);
            const claimDataArgs = new out_1.Struct(structClaimData, [
                new out_1.Field(new out_1.BytesValue(Buffer.from(new primitives_1.Nonce(Number(claimData.tokenId)).hex(), "hex")), "token_id"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.sourceChain)), "source_chain"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.destinationChain)), "destination_chain"),
                new out_1.Field(new out_1.AddressValue(new out_1.Address(claimData.destinationUserAddress)), "destination_user_address"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.sourceNftContractAddress)), "source_nft_contract_address"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.name)), "name"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(`N${claimData.sourceChain.toUpperCase()}`)), "symbol"),
                new out_1.Field(new out_1.BigUIntValue(Number(claimData.royalty)), "royalty"),
                new out_1.Field(new out_1.AddressValue(new out_1.Address(claimData.royaltyReceiver)), "royalty_receiver"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.metadata)), "attrs"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.transactionHash)), "transaction_hash"),
                new out_1.Field(new out_1.BigUIntValue(claimData.tokenAmount), "token_amount"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.nftType)), "nft_type"),
                new out_1.Field(new out_1.BigUIntValue(claimData.fee), "fee"),
            ]);
            const data = [
                claimDataArgs,
                sig.map((item) => {
                    return {
                        public_key: new out_1.AddressValue(new out_1.Address(Buffer.from(item.signer, "hex"))),
                        sig: new out_1.BytesValue(Buffer.from(item.signature.replace("0x", ""), "hex")),
                    };
                }),
                out_1.VariadicValue.fromItems(new out_1.BytesValue(Buffer.from(claimData.metadata, "utf-8")), new out_1.BytesValue(Buffer.from(claimData.metadata, "utf-8"))),
            ];
            const transaction = multiversXBridgeContract.methods
                .claimNft721(data)
                .withSender(signer.getAddress())
                .withChainID("D")
                .withGasLimit(600000000)
                .withValue(new out_1.BigUIntValue("50000000000000000"))
                .buildTransaction();
            transaction.setNonce(userAccount.getNonceThenIncrement());
            transaction.applySignature(await signer.sign(transaction.serializeForSigning()));
            const hash = await provider.sendTransaction(transaction);
            return hash;
        },
        async getBalance(signer, _) {
            const bal = BigInt((await provider.getAccount(signer.getAddress())).balance.toString());
            return bal;
        },
    };
}
exports.multiversxHandler = multiversxHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGl2ZXJzeC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9tdWx0aXZlcnN4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtEQWtCa0M7QUFFbEMsaUZBQXlFO0FBSXpFLCtDQUE0RDtBQXVDNUQsU0FBZ0IsaUJBQWlCLENBQUMsRUFDaEMsUUFBUSxFQUNSLFVBQVUsRUFDVixNQUFNLEdBQ1c7SUFDakIsTUFBTSxXQUFXLEdBQUcsaUJBQVcsQ0FBQyxNQUFNLENBQUMseUJBQW1CLENBQUMsQ0FBQztJQUM1RCxNQUFNLHdCQUF3QixHQUFHLElBQUksbUJBQWEsQ0FBQztRQUNqRCxPQUFPLEVBQUUsYUFBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDbkMsR0FBRyxFQUFFLFdBQVc7S0FDakIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLEVBQy9CLFVBQWtCLEVBQ2xCLEtBQWEsRUFDcUMsRUFBRTtRQUNwRCxNQUFNLFVBQVUsR0FBRyxJQUFJLGtCQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUMsTUFBTSxRQUFRLEdBQUcsQ0FDZixNQUFNLENBQ0osTUFBTSxLQUFLLENBQ1QsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUNuQixTQUFTLEVBQ1QsS0FBSyxDQUNOLFNBQVMsVUFBVSxJQUFJLFVBQVUsRUFBRSxDQUNyQyxDQUNGLENBQUMsSUFBSSxFQUFFLENBQ1QsQ0FBQyxJQUFJLENBQUM7UUFDUCxPQUFPO1lBQ0wsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztTQUM5QixDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBQ0YsT0FBTztRQUNMLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVTtZ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