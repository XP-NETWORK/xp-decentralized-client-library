"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiversxHandler = void 0;
const out_1 = require("@multiversx/sdk-core/out");
const primitives_1 = require("@multiversx/sdk-network-providers/out/primitives");
const axios_1 = __importDefault(require("axios"));
const abi_1 = require("../../contractsTypes/evm/abi");
const ton_1 = require("../ton");
function multiversxHandler({ provider, gatewayURL, bridge, storage, chainId, }) {
    const abiRegistry = out_1.AbiRegistry.create(abi_1.multiversXBridgeABI);
    const multiversXBridgeContract = new out_1.SmartContract({
        address: out_1.Address.fromString(bridge),
        abi: abiRegistry,
    });
    const http = axios_1.default.create();
    const waitForTransaction = async (hash) => {
        let status = await provider.getTransactionStatus(hash);
        while (status.isPending()) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            status = await provider.getTransactionStatus(hash);
        }
        return status;
    };
    const getNonFungibleToken = async (collection, nonce) => {
        const nonceAsHex = new primitives_1.Nonce(nonce).hex();
        const response = (await (await http.get(`${gatewayURL.replace("gateway", "api")}/nfts/${collection}-${nonceAsHex}`)).data).data;
        return {
            metaData: atob(response.uris[1]),
            royalties: response.royalties,
        };
    };
    return {
        async nftData(nonce, collection) {
            const nftDetails = await provider.getDefinitionOfTokenCollection(collection);
            const { royalties, metaData } = await getNonFungibleToken(collection, parseInt(nonce));
            return {
                name: nftDetails.name,
                symbol: nftDetails.ticker,
                metadata: metaData,
                royalty: BigInt(royalties),
            };
        },
        async deployCollection(signer, da, ga) {
            const builtInSC = "erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u";
            const args = [
                out_1.BytesValue.fromUTF8(da.name),
                out_1.BytesValue.fromUTF8(da.ticker),
            ];
            const data = new out_1.ContractCallPayloadBuilder()
                .setFunction(new out_1.ContractFunction("issueNonFungible"))
                .setArgs(args)
                .build();
            const payment = out_1.TokenTransfer.egldFromAmount("0.05");
            const tx = new out_1.Transaction({
                data,
                gasLimit: ga?.gasLimit ?? 60000000,
                receiver: new out_1.Address(builtInSC.trim()),
                sender: signer.getAddress(),
                value: payment,
                chainID: chainId,
            });
            const signed = await signer.sign(tx.serializeForSigning());
            tx.applySignature(signed);
            await provider.sendTransaction(tx);
            const watcher = new out_1.TransactionWatcher(provider);
            const transactionOnNetwork = await watcher.awaitCompleted(tx);
            const result = transactionOnNetwork.contractResults.items.find((e) => e.data.startsWith("@"));
            const tickerh = result?.data.split("@")[2] ?? (0, ton_1.raise)("failed to find ticker");
            return Buffer.from(tickerh, "hex").toString("utf-8");
        },
        getProvider() {
            return provider;
        },
        async getValidatorCount() {
            const query = multiversXBridgeContract.createQuery({
                func: "validatorsCount",
            });
            const queryResponse = await provider.queryContract(query);
            const validatorsCountDefinition = multiversXBridgeContract.getEndpoint("validatorsCount");
            const { firstValue } = new out_1.ResultsParser().parseQueryResponse(queryResponse, validatorsCountDefinition);
            const count = (firstValue ?? (0, ton_1.raise)("Failed to get count")).valueOf();
            return Number(count);
        },
        getStorageContract() {
            return storage;
        },
        async mintNft(signer, ma) {
            const args = [
                out_1.BytesValue.fromUTF8(ma.ticker),
                new out_1.BigUIntValue(1),
                out_1.BytesValue.fromUTF8(ma.name),
                new out_1.BigUIntValue(Number(ma.royalties) * 100 || 0),
                out_1.BytesValue.fromUTF8(ma.hash || ""),
                out_1.BytesValue.fromUTF8(ma.attrs || ""),
            ];
            for (const uri of ma.uris) {
                args.push(out_1.BytesValue.fromUTF8(uri));
            }
            const data = new out_1.ContractCallPayloadBuilder()
                .setFunction(new out_1.ContractFunction("ESDTNFTCreate"))
                .setArgs(args)
                .build();
            const tx = new out_1.Transaction({
                data,
                gasLimit: 3000000 +
                    data.length() * 1500 +
                    (ma.attrs?.length || 0 + (ma.hash?.length ?? 0) || 0) * 50000,
                receiver: signer.getAddress(),
                sender: signer.getAddress(),
                value: 0,
                chainID: chainId,
            });
            const signed = await signer.sign(tx.serializeForSigning());
            tx.applySignature(signed);
            const hash = await provider.sendTransaction(tx);
            return hash;
        },
        transform(input) {
            return {
                attrs: input.metadata,
                destinationChain: input.destinationChain,
                destinationUserAddress: input.destinationUserAddress,
                fee: input.fee,
                metadata: input.metadata,
                name: input.name,
                nftType: input.nftType,
                royalty: input.royalty,
                royaltyReceiver: input.royaltyReceiver,
                sourceChain: input.sourceChain,
                sourceNftContractAddress: input.sourceNftContractAddress,
                symbol: input.symbol,
                tokenAmount: input.tokenAmount,
                tokenId: input.tokenId,
                transactionHash: input.transactionHash,
            };
        },
        async approveNft(_signer, _tokenId, _contract) {
            return Promise.resolve("Not Required for MultiversX");
        },
        async getClaimData(txHash) {
            await waitForTransaction(txHash);
            const response = (await axios_1.default.get(`${gatewayURL.replace("gateway", "api")}/transactions/${txHash}`)).data;
            const lockEvent = response.results.logs.find((e) => e.identifier === "lock721" || e.identifier === "lock1155");
            const completed = response.results.logs.find((e) => e.identifier === "completedTxEvent");
            if (!lockEvent || !completed) {
                throw new Error("Invalid Lock Transaction");
            }
            const decodedLogs = decodeBase64Array(lockEvent.topics);
            const tokenId = String(decodedLogs[1].charCodeAt(0));
            const destinationChain = decodedLogs[2];
            const destinationUserAddress = decodedLogs[3];
            const sourceNftContractAddress = decodedLogs[4];
            const tokenAmount = String(decodedLogs[5].charCodeAt(0));
            const nftType = decodedLogs[6];
            const sourceChain = decodedLogs[7];
            const fee = await storage.chainFee(destinationChain);
            const royaltyReceiver = await storage.chainRoyalty(destinationChain);
            const metadata = await this.nftData(tokenId, sourceNftContractAddress, undefined);
            return {
                destinationChain,
                destinationUserAddress,
                tokenAmount,
                tokenId,
                nftType,
                sourceNftContractAddress,
                sourceChain,
                transactionHash: txHash,
                fee: fee.toString(),
                royaltyReceiver,
                metadata: metadata.metadata,
                name: metadata.name,
                symbol: metadata.symbol,
                royalty: metadata.royalty.toString(),
            };
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
            return {
                tx: txHash,
                hash() {
                    return txHash;
                },
            };
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
                .withValue(new out_1.BigUIntValue(claimData.fee))
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
const decodeBase64Array = (encodedArray) => {
    return encodedArray.map((encodedString) => {
        return Buffer.from(encodedString, "base64").toString("utf-8");
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvbXVsdGl2ZXJzeC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREF3QmtDO0FBRWxDLGlGQUF5RTtBQUV6RSxrREFBMEI7QUFDMUIsc0RBQW1FO0FBQ25FLGdDQUErQjtBQUcvQixTQUFnQixpQkFBaUIsQ0FBQyxFQUNoQyxRQUFRLEVBQ1IsVUFBVSxFQUNWLE1BQU0sRUFDTixPQUFPLEVBQ1AsT0FBTyxHQUNXO0lBQ2xCLE1BQU0sV0FBVyxHQUFHLGlCQUFXLENBQUMsTUFBTSxDQUFDLHlCQUFtQixDQUFDLENBQUM7SUFDNUQsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLG1CQUFhLENBQUM7UUFDakQsT0FBTyxFQUFFLGFBQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ25DLEdBQUcsRUFBRSxXQUFXO0tBQ2pCLENBQUMsQ0FBQztJQUNILE1BQU0sSUFBSSxHQUFHLGVBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUU1QixNQUFNLGtCQUFrQixHQUFHLEtBQUssRUFBRSxJQUFZLEVBQUUsRUFBRTtRQUNoRCxJQUFJLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxPQUFPLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO1lBQzFCLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxRCxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsQ0FBQztJQUVGLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxFQUMvQixVQUFrQixFQUNsQixLQUFh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