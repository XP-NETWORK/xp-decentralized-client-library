"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignerToSigner = exports.multiversxHandler = void 0;
const sdk_core_1 = require("@multiversx/sdk-core");
const out_1 = require("@multiversx/sdk-core/out");
const out_2 = require("@multiversx/sdk-network-providers/out");
const primitives_1 = require("@multiversx/sdk-network-providers/out/primitives");
const axios_1 = __importDefault(require("axios"));
const multiversx_1 = require("../../contractsTypes/multiversx");
const ton_1 = require("../ton");
function multiversxHandler({ provider, gatewayURL, bridge, storage, chainId, identifier, }) {
    const abiRegistry = out_1.AbiRegistry.create(multiversx_1.multiversXBridgeABI);
    const multiversXBridgeContract = new out_1.SmartContract({
        address: out_1.Address.fromString(bridge),
        abi: abiRegistry,
    });
    const apin = new out_2.ApiNetworkProvider(gatewayURL.replace("gateway", "api"));
    const txWatcher = new sdk_core_1.TransactionWatcher(apin);
    const eventsParser = new sdk_core_1.TransactionEventsParser({
        abi: abiRegistry,
    });
    const converter = new out_1.TransactionsConverter();
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
        const response = await (await http.get(`${gatewayURL.replace("gateway", "api")}/nfts/${collection}-${nonceAsHex}`)).data;
        return {
            metaData: atob(response.uris[0]),
            royalties: response.royalties ?? 0,
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
            const account = await provider.getAccount(out_1.Address.fromString(await signer.getAddress()));
            let nonce = account.nonce;
            const tx = new out_1.Transaction({
                data,
                gasLimit: ga?.gasLimit ?? 60000000,
                receiver: new out_1.Address(builtInSC.trim()),
                sender: out_1.Address.fromString(await signer.getAddress()),
                value: payment,
                chainID: chainId,
                nonce: nonce++,
            });
            const signed = await signer.signTransaction(tx);
            const hash = await provider.sendTransaction(signed);
            while (!(await provider.getTransactionStatus(hash)).isSuccessful()) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            const transactionOnNetwork = await provider.getTransaction(hash, true);
            const result = transactionOnNetwork.contractResults.items.find((e) => e.data.startsWith("@"));
            const tickerh = result?.data.split("@")[2] ?? (0, ton_1.raise)("failed to find ticker");
            const ssra = [
                out_1.BytesValue.fromHex(tickerh),
                out_1.BytesValue.fromHex(out_1.Address.fromString(await signer.getAddress()).hex()),
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
                sender: out_1.Address.fromString(await signer.getAddress()),
                chainID: chainId,
                nonce: nonce++,
            });
            const ssrSigned = await signer.signTransaction(ssrTx);
            const ssrHash = await provider.sendTransaction(ssrSigned);
            while (!(await provider.getTransactionStatus(ssrHash)).isExecuted()) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            return Buffer.from(tickerh, "hex").toString("utf-8");
        },
        getProvider() {
            return provider;
        },
        async readClaimed721Event(hash) {
            await waitForTransaction(hash);
            const response = (await axios_1.default.get(`${gatewayURL.replace("gateway", "api")}/transactions/${hash}`)).data;
            const event = response.results
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                .flatMap((e) => e.logs?.events)
                .find(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (e) => e.identifier === "callBack" &&
                Buffer.from(e.topics[0], "base64").toString("utf-8") ===
                    "Claimed721");
            return {
                transaction_hash: Buffer.from(event.topics[2], "base64").toString("utf-8"),
                nft_contract: Buffer.from(event.topics[3], "base64").toString("utf-8"),
                source_chain: Buffer.from(event.topics[1], "base64").toString("utf-8"),
                token_id: Buffer.from(event.topics[4], "base64").toString("hex"),
                lock_tx_chain: Buffer.from(event.topics[5], "base64").toString("hex"),
            };
        },
        async readClaimed1155Event(hash) {
            await waitForTransaction(hash);
            const response = (await axios_1.default.get(`${gatewayURL.replace("gateway", "api")}/transactions/${hash}`)).data;
            const event = response.results
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                .flatMap((e) => e.logs?.events)
                .find(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (e) => e.identifier === "callBack" &&
                Buffer.from(e.topics[0], "base64").toString("utf-8") ===
                    "Claimed1155");
            return {
                transaction_hash: Buffer.from(event.topics[2], "base64").toString("utf-8"),
                nft_contract: Buffer.from(event.topics[3], "base64").toString("utf-8"),
                source_chain: Buffer.from(event.topics[1], "base64").toString("utf-8"),
                token_id: Buffer.from(event.topics[4], "base64").toString("hex"),
                amount: BigInt(Buffer.from(event.topics[5], "base64").toString("hex")),
                lock_tx_chain: Buffer.from(event.topics[6], "base64").toString("hex"),
            };
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
            const account = await provider.getAccount(out_1.Address.fromString(await signer.getAddress()));
            const tx = new out_1.Transaction({
                data,
                gasLimit: gasArgs?.gasLimit ??
                    3000000 +
                        data.length() * 1500 +
                        (ma.attrs?.length || 0 + (ma.hash?.length ?? 0) || 0) * 50000,
                receiver: out_1.Address.fromString(await signer.getAddress()),
                sender: out_1.Address.fromString(await signer.getAddress()),
                value: gasArgs?.value ?? 0,
                chainID: chainId,
                nonce: account.nonce++,
            });
            const signed = await signer.signTransaction(tx);
            const hash = await provider.sendTransaction(signed);
            await waitForTransaction(hash);
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
                lockTxChain: input.lockTxChain,
            };
        },
        async approveNft(_signer, _tokenId, _contract) {
            return Promise.resolve("Not Required for MultiversX");
        },
        async getClaimData(txHash) {
            await txWatcher.awaitCompleted(txHash);
            const transactionOnNetworkMultisig = await provider.getTransaction(txHash, true);
            const tx = await apin.getTransaction(transactionOnNetworkMultisig.contractResults.items[0].hash);
            console.log(`HyperBlock Nonce: ${tx.hyperblockNonce}`);
            const transactionOutcomeMultisig = converter.transactionOnNetworkToOutcome(tx);
            const [event] = (0, sdk_core_1.findEventsByFirstTopic)(transactionOutcomeMultisig, "Locked");
            const parsed = eventsParser.parseEvent({ event });
            const destinationChain = parsed.destination_chain.toString("utf-8");
            const sourceChain = parsed.chain.toString("utf-8");
            const tokenId = parsed.token_id.toString();
            const tokenAmount = parsed.token_amount.toString();
            const fee = await storage.chainFee(destinationChain);
            const royaltyReceiver = await storage.chainRoyalty(destinationChain);
            let metadata = {
                metadata: "",
                name: "",
                royalty: 0n,
                symbol: "",
            };
            if (sourceChain === "MULTIVERSX") {
                metadata = await this.nftData(tokenId, parsed.source_nft_contract_address);
            }
            return {
                destinationChain,
                destinationUserAddress: parsed.destination_user_address.toString("utf-8"),
                tokenAmount,
                tokenId,
                nftType: parsed.nft_type.toString("utf-8"),
                sourceNftContractAddress: parsed.source_nft_contract_address,
                sourceChain,
                transactionHash: txHash,
                fee: fee.toString(),
                royaltyReceiver,
                metadata: metadata.metadata,
                name: metadata.name,
                symbol: metadata.symbol,
                royalty: metadata.royalty.toString(),
                lockTxChain: identifier,
            };
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId) {
            const ba = new out_1.Address(bridge);
            const userAddress = out_1.Address.fromString(await signer.getAddress());
            const userAccount = new out_1.Account(userAddress);
            const userOnNetwork = await provider.getAccount(userAddress);
            userAccount.update(userOnNetwork);
            const collectionIdentifiers = `@${Buffer.from(sourceNft).toString("hex")}`;
            const nonce = new primitives_1.Nonce(Number(tokenId)).hex();
            const noncec = `@${nonce}`;
            const quantity = "@" + "01";
            const destination_address = `@${ba.hex()}`;
            const method = `@${Buffer.from("lock721").toString("hex")}`;
            const token_id = `@${Buffer.from(`${sourceNft}-0${tokenId}`).toString("hex")}`;
            const destination_chain = `@${Buffer.from(destinationChain).toString("hex")}`;
            const destination_user_address = `@${Buffer.from(to).toString("hex")}`;
            const source_nft_contract_address = collectionIdentifiers;
            const tx3 = new out_1.Transaction({
                data: new out_1.TransactionPayload(`ESDTNFTTransfer${collectionIdentifiers}${noncec}${quantity}${destination_address}${method}${token_id}${destination_chain}${destination_user_address}${source_nft_contract_address}${noncec}`),
                gasLimit: 600000000,
                sender: out_1.Address.fromString(await signer.getAddress()),
                receiver: out_1.Address.fromString(await signer.getAddress()),
                chainID: "D",
            });
            tx3.setNonce(userAccount.getNonceThenIncrement());
            const signed = await signer.signTransaction(tx3);
            const txHash = await provider.sendTransaction(signed);
            return {
                ret: txHash,
                hash() {
                    return txHash;
                },
            };
        },
        async claimNft(signer, claimData, sig) {
            const userAddress = out_1.Address.fromString(await signer.getAddress());
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
                new out_1.FieldDefinition("lock_tx_chain", "Chain identifier on which nft was locked", new out_1.BytesType()),
            ]);
            const claimDataArgs = new out_1.Struct(structClaimData, [
                new out_1.Field(new out_1.BytesValue(Buffer.from(new primitives_1.Nonce(Number(claimData.tokenId)).hex(), "hex")), "token_id"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.sourceChain)), "source_chain"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.destinationChain)), "destination_chain"),
                new out_1.Field(new out_1.AddressValue(new out_1.Address(claimData.destinationUserAddress)), "destination_user_address"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.sourceNftContractAddress)), "source_nft_contract_address"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.name)), "name"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.symbol)), "symbol"),
                new out_1.Field(new out_1.BigUIntValue(Number(claimData.royalty)), "royalty"),
                new out_1.Field(new out_1.AddressValue(new out_1.Address(claimData.royaltyReceiver)), "royalty_receiver"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.metadata)), "attrs"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.transactionHash)), "transaction_hash"),
                new out_1.Field(new out_1.BigUIntValue(claimData.tokenAmount), "token_amount"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.nftType)), "nft_type"),
                new out_1.Field(new out_1.BigUIntValue(claimData.fee), "fee"),
                new out_1.Field(new out_1.BytesValue(Buffer.from(claimData.lockTxChain)), "lock_tx_chain"),
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
                .withSender(out_1.Address.fromString(await signer.getAddress()))
                .withChainID("D")
                .withGasLimit(600000000)
                .withValue(new out_1.BigUIntValue("50000000000000000"))
                .buildTransaction();
            transaction.setNonce(userAccount.getNonceThenIncrement());
            const signed = await signer.signTransaction(transaction);
            const hash = await provider.sendTransaction(signed);
            return { hash: () => hash, ret: hash };
        },
        async getBalance(signer, _) {
            const bal = BigInt((await provider.getAccount(out_1.Address.fromString(await signer.getAddress()))).balance.toString());
            return bal;
        },
    };
}
exports.multiversxHandler = multiversxHandler;
function userSignerToSigner(us) {
    return {
        async getAddress() {
            return us.getAddress().toString();
        },
        async signTransaction(transaction) {
            const signature = await us.sign(transaction.serializeForSigning());
            transaction.applySignature(signature);
            return transaction;
        },
    };
}
exports.userSignerToSigner = userSignerToSigner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvbXVsdGl2ZXJzeC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtREFJOEI7QUFDOUIsa0RBd0JrQztBQUNsQywrREFBMkU7QUFDM0UsaUZBQXlFO0FBRXpFLGtEQUEwQjtBQUMxQixnRUFBc0U7QUFDdEUsZ0NBQStCO0FBUS9CLFNBQWdCLGlCQUFpQixDQUFDLEVBQ2hDLFFBQVEsRUFDUixVQUFVLEVBQ1YsTUFBTSxFQUNOLE9BQU8sRUFDUCxPQUFPLEVBQ1AsVUFBVSxHQUNRO0lBQ2xCLE1BQU0sV0FBVyxHQUFHLGlCQUFXLENBQUMsTUFBTSxDQUFDLGdDQUFtQixDQUFDLENBQUM7SUFDNUQsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLG1CQUFhLENBQUM7UUFDakQsT0FBTyxFQUFFLGFBQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ25DLEdBQUcsRUFBRSxXQUFXO0tBQ2pCLENBQUMsQ0FBQztJQUNILE1BQU0sSUFBSSxHQUFHLElBQUksd0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMxRSxNQUFNLFNBQVMsR0FBRyxJQUFJLDZCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRS9DLE1BQU0sWUFBWSxHQUFHLElBQUksa0NBQXVCLENBQUM7UUFDL0MsR0FBRyxFQUFFLFdBQVc7S0FDakIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxTQUFTLEdBQUcsSUFBSSwyQkFBcUIsRUFBRSxDQUFDO0lBQzlDLE1BQU0sSUFBSSxHQUFHLGVBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUU1QixNQUFNLGtCQUFrQixHQUFHLEtBQUssRUFBRSxJQUFZLEVBQUUsRUFBRTtRQUNoRCxJQUFJLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENB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