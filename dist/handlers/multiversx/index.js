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
const types_1 = require("./types");
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
            metaData: atob(response.uris[1] || response.uris[0]),
            royalties: response.royalties ?? 0,
        };
    };
    return {
        validateNftData(data) {
            if (data.name.length > 50 || data.name.length < 3) {
                throw new Error("Name must be between 3 and 50 characters");
            }
            if (data.symbol.length > 10 || data.symbol.length < 3) {
                throw new Error("Symbol must be between 3 and 10 characters");
            }
            return Promise.resolve(true);
        },
        identifier,
        validateAddress(address) {
            try {
                out_1.Address.newFromBech32(address);
                return Promise.resolve(true);
            }
            catch {
                return Promise.resolve(false);
            }
        },
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
        async claimSft(signer, claimData, sigs) {
            const userAddress = out_1.Address.fromString(await signer.getAddress());
            const userAccount = new out_1.Account(userAddress);
            const userOnNetwork = await provider.getAccount(userAddress);
            userAccount.update(userOnNetwork);
            const imgUri = (await (0, utils_1.fetchHttpOrIpfs)(claimData.metadata)).image;
            const claimDataArgs = new out_1.Struct(types_1.StructClaimDataType, [
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
                sigs.map((item) => {
                    return {
                        public_key: new out_1.AddressValue(new out_1.Address(Buffer.from(item.signerAddress, "hex"))),
                        sig: new out_1.BytesValue(Buffer.from(item.signature.replace("0x", ""), "hex")),
                    };
                }),
            ];
            const transaction = multiversXBridgeContract.methods
                .claimNft1155(data)
                .withSender(out_1.Address.fromString(await signer.getAddress()))
                .withChainID(chainId)
                .withGasLimit(600000000)
                .withValue(new out_1.BigUIntValue(BigInt("50000000000000000") + BigInt(claimData.fee)))
                .buildTransaction();
            transaction.setNonce(userAccount.getNonceThenIncrement());
            const signed = await signer.signTransaction(transaction);
            const hash = await provider.sendTransaction(signed);
            return { hash: () => hash, ret: hash };
        },
        async lockSft(signer, sourceNft, destinationChain, to, tokenId, amt, metaDataUri) {
            const ba = new out_1.Address(bridge);
            const userAddress = out_1.Address.fromString(await signer.getAddress());
            const userAccount = new out_1.Account(userAddress);
            const userOnNetwork = await provider.getAccount(userAddress);
            userAccount.update(userOnNetwork);
            const collectionIdentifiers = `@${Buffer.from(sourceNft).toString("hex")}`;
            const nonce = `@${new primitives_1.Nonce(Number(tokenId)).hex()}`;
            const quantity = `@${new primitives_1.Nonce(Number(amt)).hex()}`;
            const destination_address = `@${ba.hex()}`;
            const method = `@${Buffer.from("lock1155").toString("hex")}`;
            const token_id = `@${Buffer.from(`${sourceNft}-0${tokenId}`).toString("hex")}`;
            const destination_chain = `@${Buffer.from(destinationChain).toString("hex")}`;
            const destination_user_address = `@${Buffer.from(to).toString("hex")}`;
            const source_nft_contract_address = collectionIdentifiers;
            const metadata_uri = `@${Buffer.from(metaDataUri).toString("hex")}`;
            const tx3 = new out_1.Transaction({
                data: new out_1.TransactionPayload(`ESDTNFTTransfer${collectionIdentifiers}${nonce}${quantity}${destination_address}${method}${token_id}${destination_chain}${destination_user_address}${source_nft_contract_address}${quantity}${nonce}${metadata_uri}`),
                gasLimit: 600000000,
                sender: out_1.Address.fromString(await signer.getAddress()),
                receiver: out_1.Address.fromString(await signer.getAddress()),
                chainID: chainId,
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
        async readClaimed721Event(hash) {
            await waitForTransaction(hash);
            const response = (await axios_1.default.get(`${gatewayURL.replace("gateway", "api")}/transactions/${hash}?withScResults=true`)).data;
            const event = response.logs.events.find(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (e) => Buffer.from(e.topics[0], "base64").toString("utf-8") === "Claimed721");
            return {
                transaction_hash: Buffer.from(event.topics[3], "base64").toString("utf-8"),
                nft_contract: Buffer.from(event.topics[4], "base64").toString("utf-8"),
                lock_tx_chain: Buffer.from(event.topics[1], "base64").toString("utf-8"),
                source_chain: Buffer.from(event.topics[2], "base64").toString("hex"),
                token_id: Buffer.from(event.topics[5], "base64").toString("hex"),
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
            console.log(`HyperBlock Nonce: ${transactionOnNetworkMultisig.hyperblockNonce} ${tx.hyperblockNonce}`);
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
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metaDataUri) {
            const ba = new out_1.Address(bridge);
            const userAddress = out_1.Address.fromString(await signer.getAddress());
            const userAccount = new out_1.Account(userAddress);
            const userOnNetwork = await provider.getAccount(userAddress);
            userAccount.update(userOnNetwork);
            const collectionIdentifiers = `@${Buffer.from(sourceNft).toString("hex")}`;
            const nonce = `@${new primitives_1.Nonce(Number(tokenId)).hex()}`;
            const quantity = "@" + "01";
            const destination_address = `@${ba.hex()}`;
            const method = `@${Buffer.from("lock721").toString("hex")}`;
            const token_id = `@${Buffer.from(`${sourceNft}-0${tokenId}`).toString("hex")}`;
            const destination_chain = `@${Buffer.from(destinationChain).toString("hex")}`;
            const destination_user_address = `@${Buffer.from(to).toString("hex")}`;
            const source_nft_contract_address = collectionIdentifiers;
            const metadata_uri = `@${Buffer.from(metaDataUri).toString("hex")}`;
            const tx3 = new out_1.Transaction({
                data: new out_1.TransactionPayload(`ESDTNFTTransfer${collectionIdentifiers}${nonce}${quantity}${destination_address}${method}${token_id}${destination_chain}${destination_user_address}${source_nft_contract_address}${nonce}${metadata_uri}`),
                gasLimit: 600000000,
                sender: out_1.Address.fromString(await signer.getAddress()),
                receiver: out_1.Address.fromString(await signer.getAddress()),
                chainID: chainId,
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
            const claimDataArgs = new out_1.Struct(types_1.StructClaimDataType, [
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
                .withChainID(chainId)
                .withGasLimit(600000000)
                .withValue(new out_1.BigUIntValue(BigInt("50000000000000000") + BigInt(claimData.fee)))
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
        async getTransactionStatus(txHash) {
            return (await waitForTransaction(txHash)).isSuccessful()
                ? "success"
                : "failed";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvbXVsdGl2ZXJzeC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtREFJOEI7QUFDOUIsa0RBa0JrQztBQUNsQywrREFBMkU7QUFDM0UsaUZBQXlFO0FBRXpFLGtEQUEwQjtBQUMxQixnRUFBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9DQUEyQztBQUMzQyxtQ0FLaUI7QUFFakIsU0FBZ0IsaUJBQWlCLENBQUMsRUFDaEMsUUFBUSxFQUNSLFVBQVUsRUFDVixNQUFNLEVBQ04sT0FBTyxFQUNQLE9BQU8sRUFDUCxVQUFVLEdBQ1E7SUFDbEIsTUFBTSxXQUFXLEdBQUcsaUJBQVcsQ0FBQyxNQUFNLENBQUMsZ0NBQW1CLENBQUMsQ0FBQztJQUM1RCxNQUFNLHdCQUF3QixHQUFHLElBQUksbUJBQWEsQ0FBQztRQUNqRCxPQUFPLEVBQUUsYUFBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDbkMsR0FBRyxFQUFFLFdBQVc7S0FDakIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxJQUFJLEdBQUcsSUFBSSx3QkFBa0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFFLE1BQU0sU0FBUyxHQUFHLElBQUksNkJBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxrQ0FBdUIsQ0FBQztRQUMvQyxHQUFHLEVBQUUsV0FBVztLQUNqQixDQUFDLENBQUM7SUFDSCxNQUFNLFNBQVMsR0FBRyxJQUFJLDJCQUFxQixFQUFFLENBQUM7SUFDOUMsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRTVCLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxFQUFFLElBQVksRUFBRSxFQUFFO1FBQ2hELElBQUksTUFBTSxHQUFHLE1BQU0sUUFB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