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
const utils_1 = require("../utils");
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
        identifier,
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
        async deployNftCollection(signer, da, ga) {
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
                imgUri: input.imgUri || "",
            };
        },
        async approveNft(_signer, _tokenId, _contract) {
            return Promise.resolve("Not Required for MultiversX");
        },
        async decodeLockedEvent(txHash) {
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
            return {
                destinationChain,
                destinationUserAddress: parsed.destination_user_address.toString("utf-8"),
                tokenAmount,
                tokenId,
                nftType: parsed.nft_type.toString("utf-8"),
                sourceNftContractAddress: parsed.source_nft_contract_address,
                sourceChain,
                transactionHash: txHash,
                metaDataUri: "",
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
            const imgUri = (await (0, utils_1.fetchHttpOrIpfs)(claimData.metadata)).image;
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
                new out_1.FieldDefinition("img_uri", "uri of the image", new out_1.BytesType()),
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
                new out_1.Field(new out_1.BytesValue(Buffer.from(imgUri)), "img_uri"),
            ]);
            const data = [
                claimDataArgs,
                sig.map((item) => {
                    return {
                        public_key: new out_1.AddressValue(new out_1.Address(Buffer.from(item.signerAddress, "hex"))),
                        sig: new out_1.BytesValue(Buffer.from(item.signature.replace("0x", ""), "hex")),
                    };
                }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvbXVsdGl2ZXJzeC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtREFJOEI7QUFDOUIsa0RBdUJrQztBQUNsQywrREFBMkU7QUFDM0UsaUZBQXlFO0FBRXpFLGtEQUEwQjtBQUMxQixnRUFBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9DQUEyQztBQU8zQyxTQUFnQixpQkFBaUIsQ0FBQyxFQUNoQyxRQUFRLEVBQ1IsVUFBVSxFQUNWLE1BQU0sRUFDTixPQUFPLEVBQ1AsT0FBTyxFQUNQLFVBQVUsR0FDUTtJQUNsQixNQUFNLFdBQVcsR0FBRyxpQkFBVyxDQUFDLE1BQU0sQ0FBQyxnQ0FBbUIsQ0FBQyxDQUFDO0lBQzVELE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxtQkFBYSxDQUFDO1FBQ2pELE9BQU8sRUFBRSxhQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNuQyxHQUFHLEVBQUUsV0FBVztLQUNqQixDQUFDLENBQUM7SUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLHdCQUFrQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUUsTUFBTSxTQUFTLEdBQUcsSUFBSSw2QkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUvQyxNQUFNLFlBQVksR0FBRyxJQUFJLGtDQUF1QixDQUFDO1FBQy9DLEdBQUcsRUFBRSxXQUFXO0tBQ2pCLENBQUMsQ0FBQztJQUNILE1BQU0sU0FBUyxHQUFHLElBQUksMkJBQXFCLEVBQUUsQ0FBQztJQUM5QyxNQUFNLElBQUksR0FBRyxlQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFNUIsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLEVBQUUsSUFBWSxFQUFFLEVBQUU7UUFDaEQsSUFBSSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsb0JBQW9C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