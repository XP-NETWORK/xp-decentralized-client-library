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
            const account = await provider.getAccount(signer.getAddress());
            let nonce = account.nonce;
            const tx = new out_1.Transaction({
                data,
                gasLimit: ga?.gasLimit ?? 60000000,
                receiver: new out_1.Address(builtInSC.trim()),
                sender: signer.getAddress(),
                value: payment,
                chainID: chainId,
                nonce: nonce++,
            });
            const signed = await signer.sign(tx.serializeForSigning());
            tx.applySignature(signed);
            const hash = await provider.sendTransaction(tx);
            while (!(await provider.getTransactionStatus(hash)).isSuccessful()) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            const transactionOnNetwork = await provider.getTransaction(hash, true);
            const result = transactionOnNetwork.contractResults.items.find((e) => e.data.startsWith("@"));
            const tickerh = result?.data.split("@")[2] ?? (0, ton_1.raise)("failed to find ticker");
            const ssra = [
                out_1.BytesValue.fromHex(tickerh),
                out_1.BytesValue.fromHex(signer.getAddress().hex()),
                out_1.BytesValue.fromHex("45534454526f6c654e4654437265617465"),
            ];
            const ssr = new out_1.ContractCallPayloadBuilder()
                .setFunction(new out_1.ContractFunction("setSpecialRole"))
                .setArgs(ssra)
                .build();
            const ssrTx = new out_1.Transaction({
                data: ssr,
                gasLimit: ga?.gasLimit ?? 60000000,
                receiver: new out_1.Address(builtInSC.trim()),
                sender: signer.getAddress(),
                chainID: chainId,
                nonce: nonce++,
            });
            const ssrSigned = await signer.sign(ssrTx.serializeForSigning());
            ssrTx.applySignature(ssrSigned);
            const ssrHash = await provider.sendTransaction(ssrTx);
            while (!(await provider.getTransactionStatus(ssrHash)).isExecuted()) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
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
        async mintNft(signer, ma, gasArgs) {
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
            const account = await provider.getAccount(signer.getAddress());
            const tx = new out_1.Transaction({
                data,
                gasLimit: gasArgs?.gasLimit ??
                    3000000 +
                        data.length() * 1500 +
                        (ma.attrs?.length || 0 + (ma.hash?.length ?? 0) || 0) * 50000,
                receiver: signer.getAddress(),
                sender: signer.getAddress(),
                value: gasArgs?.value ?? 0,
                chainID: chainId,
                nonce: account.nonce++,
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
        async claimNft(signer, claimData, sig) {
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
                        public_key: new out_1.AddressValue(new out_1.Address(Buffer.from(item.signerAddress, "hex"))),
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
const decodeBase64Array = (encodedArray) => {
    return encodedArray.map((encodedString) => {
        return Buffer.from(encodedString, "base64").toString("utf-8");
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvbXVsdGl2ZXJzeC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREF1QmtDO0FBRWxDLGlGQUF5RTtBQUV6RSxrREFBMEI7QUFDMUIsc0RBQW1FO0FBQ25FLGdDQUErQjtBQUcvQixTQUFnQixpQkFBaUIsQ0FBQyxFQUNoQyxRQUFRLEVBQ1IsVUFBVSxFQUNWLE1BQU0sRUFDTixPQUFPLEVBQ1AsT0FBTyxHQUNXO0lBQ2xCLE1BQU0sV0FBVyxHQUFHLGlCQUFXLENBQUMsTUFBTSxDQUFDLHlCQUFtQixDQUFDLENBQUM7SUFDNUQsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLG1CQUFhLENBQUM7UUFDakQsT0FBTyxFQUFFLGFBQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ25DLEdBQUcsRUFBRSxXQUFXO0tBQ2pCLENBQUMsQ0FBQztJQUNILE1BQU0sSUFBSSxHQUFHLGVBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUU1QixNQUFNLGtCQUFrQixHQUFHLEtBQUssRUFBRSxJQUFZLEVBQUUsRUFBRTtRQUNoRCxJQUFJLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxPQUFPLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO1lBQzFCLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxRCxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsQ0FBQztJQUVGLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxFQUMvQixVQUFrQixFQUNsQixLQUFh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