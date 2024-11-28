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
            const { royalties, metaData } = await getNonFungibleToken(collection, Number.parseInt(nonce));
            return {
                name: nftDetails.name,
                symbol: nftDetails.ticker.split("-")[0],
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
            const txo = await provider.getTransaction(txHash, true);
            let event = [];
            for (const contractEvent of txo.logs.events) {
                if (contractEvent.topics[0].toString() === "Locked") {
                    event = [contractEvent];
                }
                if (event.length)
                    break;
            }
            if (!event.length) {
                for (const subTx of txo.contractResults.items) {
                    try {
                        event = subTx.logs.events.filter((e) => {
                            return e.topics[0].toString() === "Locked";
                        });
                        if (event.length)
                            break;
                    }
                    catch (ex) { }
                }
            }
            const parsed = event[0];
            const tokenId = Number.parseInt(parsed.topics[1].hex(), 16).toString() === "NaN"
                ? "0"
                : Number.parseInt(parsed.topics[1].hex(), 16).toString();
            const destinationChain = parsed.topics[2].toString();
            const destinationUserAddress = Buffer.from(parsed.topics[3].hex(), "hex").toString();
            const sourceNftContractAddress = parsed.topics[4].toString();
            const tokenAmount = parsed.topics[5].valueOf()[0].toString();
            const nftType = parsed.topics[6].toString();
            const sourceChain = parsed.topics[7].toString();
            const metadataUri = parsed.topics[8].toString();
            return {
                destinationChain,
                destinationUserAddress,
                tokenAmount,
                tokenId,
                nftType: nftType,
                sourceNftContractAddress: sourceNftContractAddress,
                sourceChain,
                transactionHash: txHash,
                metaDataUri: metadataUri,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvbXVsdGl2ZXJzeC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtREFBMEQ7QUFDMUQsa0RBaUJrQztBQUNsQywrREFHK0M7QUFDL0MsaUZBQXlFO0FBRXpFLGtEQUEwQjtBQUMxQixnRUFBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9DQUEyQztBQUMzQyxtQ0FLaUI7QUFFakIsU0FBZ0IsaUJBQWlCLENBQUMsRUFDaEMsUUFBUSxFQUNSLFVBQVUsRUFDVixNQUFNLEVBQ04sT0FBTyxFQUNQLE9BQU8sRUFDUCxVQUFVLEdBQ1E7SUFDbEIsTUFBTSxXQUFXLEdBQUcsaUJBQVcsQ0FBQyxNQUFNLENBQUMsZ0NBQW1CLENBQUMsQ0FBQztJQUM1RCxNQUFNLHdCQUF3QixHQUFHLElBQUksbUJBQWEsQ0FBQztRQUNqRCxPQUFPLEVBQUUsYUFBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDbkMsR0FBRyxFQUFFLFdBQVc7S0FDakIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxJQUFJLEdBQUcsSUFBSSx3QkFBa0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFFLE1BQU0sU0FBUyxHQUFHLElBQUksNkJBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0MsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRTVCLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxFQUFFLElBQVksRUFBRSxFQUFFO1FBQ2hELElBQUksTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxF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