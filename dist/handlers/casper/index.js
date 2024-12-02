"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.casperHandler = void 0;
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
const crypto_1 = __importDefault(require("crypto"));
const ces_js_parser_1 = require("@make-software/ces-js-parser");
const casper_cep78_js_client_1 = require("casper-cep78-js-client");
const casper_js_sdk_1 = require("casper-js-sdk");
const pinata_1 = require("../utils/pinata");
const claim_wasm_1 = require("./claim.wasm");
const get_deploy_1 = require("./get-deploy");
const lock_wasm_1 = require("./lock.wasm");
const serializer_1 = require("./serializer");
const COLLECTION_DEPLOY_PLUS_CLAIM_AMOUNT = "600000000000";
function casperHandler({ rpc, identifier, network, bridge, storage, proxy_url, }) {
    if (proxy_url) {
        rpc = proxy_url + rpc;
    }
    const cc = new casper_js_sdk_1.CasperClient(rpc);
    const bc = new casper_js_sdk_1.Contracts.Contract(cc);
    bc.setContractHash(bridge);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async function signWithCasperWallet(sender, deploy) {
        const address = await sender.getActivePublicKey();
        const signedDeployJson = await sender.sign(JSON.stringify(casper_js_sdk_1.DeployUtil.deployToJson(deploy)), address);
        const signedDeploy = casper_js_sdk_1.DeployUtil.setSignature(deploy, signedDeployJson.signature, casper_js_sdk_1.CLPublicKey.fromHex(address));
        const res = await cc.putDeploy(signedDeploy).catch((e) => {
            console.log(e, "e in signWithCasperWallet");
            return "";
        });
        res && (await (0, get_deploy_1.getDeploy)(cc, res));
        return res;
    }
    return {
        async getBalance(signer) {
            const pubk = await signer.getActivePublicKey();
            const balance = await cc.nodeClient.queryBalance(casper_js_sdk_1.PurseIdentifier.MainPurseUnderPublicKey, pubk);
            return balance.toBigInt();
        },
        async submitSignature(signer, hash, sigs) {
            const clSignerAndSignature = sigs.map(({ signature, signerAddress }) => {
                const signerClValue = casper_js_sdk_1.CLValueBuilder.publicKey(Buffer.from(signerAddress, "hex"), casper_js_sdk_1.CLPublicKeyTag.ED25519);
                const signatureClValue = casper_js_sdk_1.CLValueBuilder.byteArray(Buffer.from(signature.replace("0x", ""), "hex"));
                return casper_js_sdk_1.CLValueBuilder.tuple2([signerClValue, signatureClValue]);
            });
            const clSignerAndSignatureList = casper_js_sdk_1.CLValueBuilder.list(clSignerAndSignature);
            const rt_args = casper_js_sdk_1.RuntimeArgs.fromMap({
                data_hash_arg: casper_js_sdk_1.CLValueBuilder.byteArray(Buffer.from(hash, "hex")),
                data_type_arg: casper_js_sdk_1.CLValueBuilder.u8(0),
                signatures_arg: clSignerAndSignatureList,
            });
            const extraCost = 10000000000 * clSignerAndSignatureList.data.length;
            const deploy = bc.callEntrypoint("submit_signatures", rt_args, casper_js_sdk_1.CLPublicKey.fromHex(await signer.getActivePublicKey()), network, (15000000000 + extraCost).toString(), []);
            if (isBrowser()) {
                return await signWithCasperWallet(signer, deploy);
            }
            const signed = await signer.sign(casper_js_sdk_1.DeployUtil.deployToJson(deploy), await signer.getActivePublicKey());
            const txHash = await casper_js_sdk_1.DeployUtil.deployFromJson(signed).unwrap().send(rpc);
            return txHash;
        },
        async deployNftCollection(signer, da, ga) {
            const cc = new casper_cep78_js_client_1.CEP78Client(rpc, network);
            const deploy = cc.install({
                collectionName: da.name,
                collectionSymbol: da.symbol,
                identifierMode: casper_cep78_js_client_1.NFTIdentifierMode.Ordinal,
                metadataMutability: casper_cep78_js_client_1.MetadataMutability.Immutable,
                nftKind: casper_cep78_js_client_1.NFTKind.Digital,
                nftMetadataKind: casper_cep78_js_client_1.NFTMetadataKind.Raw,
                ownershipMode: casper_cep78_js_client_1.NFTOwnershipMode.Transferable,
                totalTokenSupply: "1000000",
                allowMinting: true,
                burnMode: casper_cep78_js_client_1.BurnMode.NonBurnable,
                whitelistMode: casper_cep78_js_client_1.WhitelistMode.Unlocked,
                mintingMode: casper_cep78_js_client_1.MintingMode.Installer,
            }, ga?.amount || "600000000000", casper_js_sdk_1.CLPublicKey.fromHex(await signer.getActivePublicKey()));
            if (isBrowser()) {
                return signWithCasperWallet(signer, deploy);
            }
            const signed = await signer.sign(casper_js_sdk_1.DeployUtil.deployToJson(deploy), await signer.getActivePublicKey());
            return casper_js_sdk_1.DeployUtil.deployFromJson(signed).unwrap().send(rpc);
        },
        async nftData(tokenId, contract) {
            const ctr = new casper_js_sdk_1.Contracts.Contract(cc);
            ctr.setContractHash(`hash-${contract}`);
            const cn = await ctr.queryContractData(["collection_name"]);
            const cs = await ctr.queryContractData(["collection_symbol"]);
            const md = ((await ctr
                .queryContractDictionary("metadata_raw", tokenId)
                .catch(() => {
                console.log(`Failed to get raw metadata for ${contract} - ${tokenId}`);
                return undefined;
            })) ||
                (await ctr
                    .queryContractDictionary("metadata_custom_validated", tokenId)
                    .catch(() => {
                    console.log(`Failed to get custom validated metadata for ${contract} - ${tokenId}`);
                    throw new Error(`Failed to get metadata for ${contract} - ${tokenId}`);
                })));
            return {
                metadata: md.data,
                name: cn,
                royalty: 0n,
                symbol: cs,
            };
        },
        identifier,
        getProvider() {
            return cc;
        },
        async decodeLockedEvent(txHash) {
            const deploy = await (0, get_deploy_1.getDeploy)(cc, txHash);
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const args = deploy.deploy.session.ModuleBytes.args;
            const bc = args.find((e) => e[0] === "bridge_contract");
            const ch = bc[1].bytes;
            const parser = await ces_js_parser_1.Parser.create(cc.nodeClient, [ch]);
            const events = parser.parseExecutionResult(
            //@ts-ignore
            deploy.execution_results[0].result);
            const event = events
                .filter((ev) => ev.error === null)
                .filter((e) => e.event.name === "Locked")
                .at(0);
            const data = event?.event?.data;
            return {
                tokenAmount: data?.token_amount?.data?.toString(),
                sourceChain: data?.source_chain?.data,
                sourceNftContractAddress: data?.source_nft_contract_address?.data,
                tokenId: data?.token_id?.data,
                destinationChain: data?.destination_chain?.data,
                destinationUserAddress: data?.destination_user_address?.data,
                nftType: data?.nft_type?.data,
                transactionHash: txHash,
                lockTxChain: identifier,
                metaDataUri: data?.metadata_uri?.data,
            };
        },
        hashClaimData(data) {
            const serializer = (0, serializer_1.Serializer)();
            const bytes = serializer.claimNft({
                amount: COLLECTION_DEPLOY_PLUS_CLAIM_AMOUNT,
                destination_chain_arg: data.destination_chain,
                destination_user_address_arg: data.destinationUserAddress,
                fee_arg: data.fee.toString(),
                lock_tx_chain_arg: data.lockTxChain,
                metadata_arg: data.metadata,
                name_arg: data.name,
                nft_type_arg: data.nft_type,
                royalty_arg: data.royaltyPercentage.toString(),
                royalty_receiver_arg: data.royaltyReceiver,
                source_chain_arg: data.source_chain,
                source_nft_contract_address_arg: data.source_chain === "CASPER"
                    ? `contract-${data.source_nft_contract_address}`
                    : data.source_nft_contract_address,
                symbol_arg: data.symbol,
                token_amount_arg: data.amount.toString(),
                token_id_arg: data.token_id.toString(),
                transaction_hash_arg: data.transaction_hash,
            });
            return crypto_1.default.createHash("sha256").update(bytes).digest("hex");
        },
        async claimNft(signer, claimData, sigs, extraArgs) {
            const dataHash = this.hashClaimData(claimData);
            if (!(await checkSignatureStatus(bc, dataHash))) {
                await this.submitSignature(signer, dataHash, sigs);
            }
            if (await checkSignatureStatus(bc, dataHash)) {
                const rt_args = casper_js_sdk_1.RuntimeArgs.fromMap({
                    bridge_contract: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(bridge)),
                    token_id_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.token_id.toString()),
                    source_chain_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.source_chain),
                    destination_chain_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.destination_chain),
                    destination_user_address_arg: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(claimData.destinationUserAddress)),
                    source_nft_contract_address_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.source_chain === "CASPER"
                        ? `contract-${claimData.source_nft_contract_address}`
                        : claimData.source_nft_contract_address),
                    name_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.name),
                    symbol_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.symbol),
                    royalty_arg: casper_js_sdk_1.CLValueBuilder.u512(claimData.royaltyPercentage.toString()),
                    royalty_receiver_arg: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(claimData.royaltyReceiver)),
                    metadata_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.metadata),
                    transaction_hash_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.transaction_hash),
                    token_amount_arg: casper_js_sdk_1.CLValueBuilder.u512(claimData.amount.toString()),
                    nft_type_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.nft_type),
                    fee_arg: casper_js_sdk_1.CLValueBuilder.u512(claimData.fee.toString()),
                    lock_tx_chain_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.lockTxChain),
                    amount: casper_js_sdk_1.CLValueBuilder.u512(COLLECTION_DEPLOY_PLUS_CLAIM_AMOUNT),
                });
                const n = new casper_js_sdk_1.Contracts.Contract(cc);
                const deploy = n.install(Buffer.from(claim_wasm_1.CLAIM_WASM, "hex"), rt_args, extraArgs?.amount || "30000000000", casper_js_sdk_1.CLPublicKey.fromHex(await signer.getActivePublicKey()), network, []);
                if (isBrowser()) {
                    const hash = await signWithCasperWallet(signer, deploy);
                    const is_waiting = await checkWaiting(bc, claimData.source_nft_contract_address.replace("hash-", ""), claimData.source_chain);
                    if (is_waiting) {
                        while (true) {
                            await new Promise((r) => setTimeout(r, 5 * 1000));
                            if (await checkCollection(bc, claimData.source_nft_contract_address.replace("hash-", ""), claimData.source_chain)) {
                                break;
                            }
                        }
                        return this.claimNft(signer, claimData, sigs, extraArgs);
                    }
                    return {
                        hash() {
                            return hash;
                        },
                        ret: hash,
                    };
                }
                const signed = await signer.sign(casper_js_sdk_1.DeployUtil.deployToJson(deploy), await signer.getActivePublicKey());
                const hash = await casper_js_sdk_1.DeployUtil.deployFromJson(signed).unwrap().send(rpc);
                return {
                    hash() {
                        return hash;
                    },
                    ret: hash,
                };
            }
            throw new Error("Failed");
        },
        async getValidatorCount() {
            const bn = await bc.queryContractData(["validators_count"]);
            return Number(bn);
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, _metaDataUri, extraArgs) {
            const cc = new casper_js_sdk_1.CasperClient(rpc);
            const nftContract = new casper_js_sdk_1.Contracts.Contract(cc);
            nftContract.setContractHash(sourceNft);
            const metadata = await getMetaData(nftContract, tokenId);
            const nft_storage_exists = await checkStorage(bc, sourceNft.replace("hash-", ""));
            const rt_args = casper_js_sdk_1.RuntimeArgs.fromMap({
                bridge_contract: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(bridge)),
                token_id_arg: casper_js_sdk_1.CLValueBuilder.string(tokenId),
                destination_chain_arg: casper_js_sdk_1.CLValueBuilder.string(destinationChain),
                destination_user_address_arg: casper_js_sdk_1.CLValueBuilder.string(to),
                source_nft_contract_address_arg: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(sourceNft)),
                metadata_arg: casper_js_sdk_1.CLValueBuilder.string(metadata),
                amount: casper_js_sdk_1.CLValueBuilder.u512(extraArgs?.amount || "150000000000"),
            });
            const n = new casper_js_sdk_1.Contracts.Contract(cc);
            const deploy = n.install(Buffer.from(lock_wasm_1.LOCK_WASM, "hex"), rt_args, extraArgs?.amount || "30000000000", casper_js_sdk_1.CLPublicKey.fromHex(await signer.getActivePublicKey()), network, []);
            if (isBrowser()) {
                const hash = await signWithCasperWallet(signer, deploy);
                if (!nft_storage_exists) {
                    while (true) {
                        await new Promise((r) => setTimeout(r, 5 * 1000));
                        if (await checkStorage(bc, sourceNft.replace("hash-", ""))) {
                            break;
                        }
                    }
                    return this.lockNft(signer, sourceNft, destinationChain, to, tokenId, metadata, extraArgs);
                }
                return {
                    hash() {
                        return hash;
                    },
                    ret: hash,
                };
            }
            const signed = await signer.sign(casper_js_sdk_1.DeployUtil.deployToJson(deploy), await signer.getActivePublicKey());
            const hash = await casper_js_sdk_1.DeployUtil.deployFromJson(signed).unwrap().send(rpc);
            return {
                hash() {
                    return hash;
                },
                ret: hash,
            };
        },
        async mintNft(signer, ma) {
            const nft = new casper_cep78_js_client_1.CEP78Client(rpc, network);
            nft.setContractHash(ma.contract);
            const deploy = nft.mint({
                meta: {
                    uri: ma.uri,
                },
                owner: new casper_js_sdk_1.CLAccountHash(Buffer.from(ma.owner.replace("account-hash-", ""), "hex")),
                collectionName: ma.collectionName,
            }, {
                useSessionCode: false,
            }, "1000000000", casper_js_sdk_1.CLPublicKey.fromHex(await signer.getActivePublicKey()));
            if (isBrowser()) {
                return signWithCasperWallet(signer, deploy);
            }
            const signed = await signer.sign(casper_js_sdk_1.DeployUtil.deployToJson(deploy), await signer.getActivePublicKey());
            return casper_js_sdk_1.DeployUtil.deployFromJson(signed).unwrap().send(rpc);
        },
        getStorageContract() {
            return storage;
        },
        validateAddress(hex) {
            try {
                new casper_js_sdk_1.CLAccountHash(convertHashStrToHashBuff(hex));
                return Promise.resolve(true);
            }
            catch (e) {
                return Promise.resolve(false);
            }
        },
        transform(input) {
            return {
                destination_chain: input.destinationChain,
                amount: BigInt(1),
                nft_type: input.nftType,
                royaltyPercentage: BigInt(input.royalty),
                source_chain: input.sourceChain,
                source_nft_contract_address: input.sourceNftContractAddress,
                token_id: BigInt(input.tokenId),
                transaction_hash: input.transactionHash,
                uri: input.metadata,
                tokenId: input.tokenId,
                sourceChain: input.sourceChain,
                destinationChain: input.destinationChain,
                destinationUserAddress: input.destinationUserAddress,
                sourceNftContractAddress: input.sourceNftContractAddress,
                name: input.name,
                symbol: input.symbol,
                royalty: input.royalty,
                royaltyReceiver: input.royaltyReceiver,
                metadata: input.metadata,
                transactionHash: input.transactionHash,
                tokenAmount: input.tokenAmount,
                nftType: input.nftType,
                fee: BigInt(input.fee),
                lockTxChain: input.lockTxChain,
                imgUri: input.imgUri,
            };
        },
        async approveNft(signer, tokenId, contract, _) {
            const cep78Client = new casper_cep78_js_client_1.CEP78Client(rpc, network);
            cep78Client.setContractHash(contract);
            const deploy = cep78Client.approve({
                operator: new casper_js_sdk_1.CLByteArray(convertHashStrToHashBuff(bridge)),
                // tokenHash: tokenHash,
                tokenId: tokenId,
            }, "2000000000", casper_js_sdk_1.CLPublicKey.fromHex(await signer.getActivePublicKey()));
            if (isBrowser()) {
                return signWithCasperWallet(signer, deploy);
            }
            const signed = await signer.sign(casper_js_sdk_1.DeployUtil.deployToJson(deploy), await signer.getActivePublicKey());
            const dep = cc.deployFromJson(signed).unwrap();
            return await cc.putDeploy(dep);
        },
    };
}
exports.casperHandler = casperHandler;
function isBrowser() {
    //@ts-ignore
    return window !== undefined;
}
function convertHashStrToHashBuff(sourceNft) {
    let src = sourceNft;
    if (sourceNft.startsWith("hash-")) {
        src = sourceNft.slice(5);
    }
    return Uint8Array.from(Buffer.from(src, "hex"));
}
async function checkStorage(bc, sourceNft) {
    const serializer = (0, serializer_1.Serializer)();
    const bytes = serializer.storageKey({
        source_nft_contract_address: sourceNft,
    });
    const dic_key = crypto_1.default.createHash("sha256").update(bytes).digest("hex");
    let ret = false;
    try {
        const duplicate_storage_dict = await bc.queryContractDictionary("duplicate_storage_dict", dic_key);
        console.log("duplicate_storage_dict", duplicate_storage_dict);
        ret = true;
    }
    catch (ex) {
        console.log("duplicate_storage_dict", ex);
    }
    try {
        const original_storage_dict = await bc.queryContractDictionary("original_storage_dict", dic_key);
        console.log("original_storage_dict", original_storage_dict);
        ret = true;
    }
    catch (ex) {
        console.log("original_storage_dict", ex);
    }
    return ret;
}
async function checkCollection(bc, sourceNft, sourceChain) {
    const serializer = (0, serializer_1.Serializer)();
    const bytes = serializer.collectionKey({
        source_nft_contract_address: sourceNft,
        source_chain: sourceChain,
    });
    const dic_key = crypto_1.default.createHash("sha256").update(bytes).digest("hex");
    let ret = false;
    try {
        const original_to_duplicate_dict = await bc.queryContractDictionary("original_to_duplicate_dict", dic_key);
        console.log("original_to_duplicate_dict", original_to_duplicate_dict);
        ret = true;
    }
    catch (ex) {
        console.log("original_to_duplicate_dict", ex);
    }
    return ret;
}
async function checkWaiting(bc, sourceNft, sourceChain) {
    const serializer = (0, serializer_1.Serializer)();
    const bytes = serializer.collectionKey({
        source_nft_contract_address: sourceNft,
        source_chain: sourceChain,
    });
    const dic_key = crypto_1.default.createHash("sha256").update(bytes).digest("hex");
    let ret = false;
    try {
        const waiting_dict = await bc.queryContractDictionary("waiting_dict", dic_key);
        console.log("waiting_dict", waiting_dict.data[0].data);
        ret = waiting_dict.data[0].data;
    }
    catch (ex) {
        console.log("waiting_dict", ex);
    }
    return ret;
}
async function checkSignatureStatus(bc, dataHash) {
    let ret = false;
    try {
        const ss = await bc.queryContractDictionary("submitted_signatures_dict", dataHash);
        const done = ss.data[1].data[0].data[0].data;
        console.log("DONE", done); // DONE
        const canDo = ss.data[1].data[0].data[1].data;
        console.log("CAN DO", canDo); // CAN DO
        ret = canDo;
    }
    catch (ex) {
        console.log("submitted_signatures_dict", ex);
    }
    return ret;
}
async function getMetaData(nftContract, tokenId) {
    // CEP78 = 0, --> metadata_cep78
    // NFT721 = 1, --> metadata_nft721
    // Raw = 2, --> metadata_raw
    // CustomValidated = 3 --> metadata_custom_validated
    let data;
    try {
        data = JSON.parse((await nftContract.queryContractDictionary("metadata_cep78", tokenId)).toJSON());
        if (data?.token_uri) {
            data = data?.token_uri;
        }
        console.log("metadata_cep78", data);
    }
    catch (ex) {
        try {
            data = JSON.parse((await nftContract.queryContractDictionary("metadata_nft721", tokenId)).toJSON());
            if (data?.token_uri) {
                data = data?.token_uri;
            }
            console.log("metadata_nft721", data);
        }
        catch (ex) {
            try {
                data = JSON.parse((await nftContract.queryContractDictionary("metadata_raw", tokenId)).toJSON());
                if (data?.token_uri) {
                    data = data?.token_uri;
                }
                console.log("metadata_raw", data);
            }
            catch (ex) {
                try {
                    data = JSON.parse((await nftContract.queryContractDictionary("metadata_custom_validated", tokenId)).toJSON());
                    if (data?.token_uri) {
                        data = data?.token_uri;
                    }
                    console.log("metadata_custom_validated", data);
                }
                catch (ex) { }
            }
        }
    }
    if (data) {
        if (typeof data === "object") {
            const pinResponse = await pinata_1.pinata.upload.json(data);
            const metadata = `https://xpnetwork.infura-ipfs.io/ipfs/${pinResponse.IpfsHash}`;
            console.log({ metadata });
            return metadata;
        }
        return data;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvY2FzcGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlFQUFpRTtBQUNqRSxvREFBNEI7QUFDNUIsZ0VBQXNEO0FBQ3RELG1FQVVnQztBQUNoQyxpREFhdUI7QUFFdkIsNENBQXlDO0FBQ3pDLDZDQUEwQztBQUMxQyw2Q0FBeUM7QUFDekMsMkNBQXdDO0FBQ3hDLDZDQUEwQztBQUcxQyxNQUFNLG1DQUFtQyxHQUFHLGNBQWMsQ0FBQztBQUUzRCxTQUFnQixhQUFhLENBQUMsRUFDNUIsR0FBRyxFQUNILFVBQVUsRUFDVixPQUFPLEVBQ1AsTUFBTSxFQUNOLE9BQU8sRUFDUCxTQUFTLEdBQ0s7SUFDZCxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ2QsR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDeEIsQ0FBQztJQUNELE1BQU0sRUFBRSxHQUFHLElBQUksNEJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxNQUFNLEVBQUUsR0FBRyxJQUFJLHlCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLEVBQUUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFM0IsNERBQTREO0lBQzVELEtBQUssVUFBVSxvQkFBb0IsQ0FBQyxNQUFXLEVBQUUsTUFBeUI7UUFDeEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNsRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQywwQkFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUMvQyxPQUFPLENBQ1IsQ0FBQztRQUVGLE1BQU0sWUFBWSxHQUFHLDBCQUFVLENBQUMsWUFBWSxDQUMxQyxNQUFNLEVBQ04sZ0JBQWdCLENB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