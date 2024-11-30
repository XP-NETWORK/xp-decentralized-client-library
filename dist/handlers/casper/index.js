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
                amount: data.amount.toString(),
                destination_chain_arg: data.destination_chain,
                destination_user_address_arg: data.destinationUserAddress,
                fee_arg: data.fee,
                lock_tx_chain_arg: data.lockTxChain,
                metadata_arg: data.metadata,
                name_arg: data.name,
                nft_type_arg: data.nft_type,
                royalty_arg: data.royaltyPercentage,
                royalty_receiver_arg: data.royaltyReceiver,
                source_chain_arg: data.source_chain,
                source_nft_contract_address_arg: data.source_nft_contract_address,
                symbol_arg: data.symbol,
                token_amount_arg: data.amount,
                token_id_arg: data.token_id.toString(),
                transaction_hash_arg: data.transaction_hash,
            });
            return crypto_1.default.createHash("sha256").update(bytes).digest("hex");
        },
        async claimNft(signer, claimData, _, extraArgs) {
            const rt_args = casper_js_sdk_1.RuntimeArgs.fromMap({
                bridge_contract: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(bridge)),
                token_id_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.token_id.toString()),
                source_chain_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.source_chain),
                destination_chain_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.destination_chain),
                destination_user_address_arg: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(claimData.destinationUserAddress)),
                source_nft_contract_address_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.source_chain),
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
                amount: casper_js_sdk_1.CLValueBuilder.u512(claimData.amount.toString()),
            });
            const n = new casper_js_sdk_1.Contracts.Contract(cc);
            const deploy = n.install(Buffer.from(claim_wasm_1.CLAIM_WASM, "hex"), rt_args, extraArgs?.amount || "50000000000", casper_js_sdk_1.CLPublicKey.fromHex(await signer.getActivePublicKey()), network, []);
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
                    return this.claimNft(signer, claimData, _, extraArgs);
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
                amount: casper_js_sdk_1.CLValueBuilder.u512(extraArgs?.amount || "110000000000"),
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
        console.log("waiting_dict", waiting_dict);
        ret = true;
    }
    catch (ex) {
        console.log("waiting_dict", ex);
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
        data = (await nftContract.queryContractDictionary("metadata_cep78", tokenId)).toJSON();
        if (data?.token_uri) {
            data = data?.token_uri;
        }
        console.log("metadata_cep78", data);
    }
    catch (ex) {
        try {
            data = (await nftContract.queryContractDictionary("metadata_nft721", tokenId)).toJSON();
            if (data?.token_uri) {
                data = data?.token_uri;
            }
            console.log("metadata_nft721", data.toJSON());
        }
        catch (ex) {
            try {
                data = (await nftContract.queryContractDictionary("metadata_raw", tokenId)).toJSON();
                if (data?.token_uri) {
                    data = data?.token_uri;
                }
                console.log("metadata_raw", data.toJSON());
            }
            catch (ex) {
                try {
                    data = (await nftContract.queryContractDictionary("metadata_custom_validated", tokenId)).toJSON();
                    if (data?.token_uri) {
                        data = data?.token_uri;
                    }
                    console.log("metadata_custom_validated", data.toJSON());
                }
                catch (ex) { }
            }
        }
    }
    if (data) {
        if (typeof data === "object") {
            const pinResponse = await pinata_1.pinata.upload.json(data.toJSON());
            const metadata = `https://xpnetwork.infura-ipfs.io/ipfs/ ${pinResponse.IpfsHash}`;
            console.log({ metadata });
            return metadata;
        }
        return data;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvY2FzcGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlFQUFpRTtBQUNqRSxvREFBNEI7QUFDNUIsZ0VBQXNEO0FBQ3RELG1FQVVnQztBQUNoQyxpREFhdUI7QUFFdkIsNENBQXlDO0FBQ3pDLDZDQUEwQztBQUMxQyw2Q0FBeUM7QUFDekMsMkNBQXdDO0FBQ3hDLDZDQUEwQztBQUcxQyxTQUFnQixhQUFhLENBQUMsRUFDNUIsR0FBRyxFQUNILFVBQVUsRUFDVixPQUFPLEVBQ1AsTUFBTSxFQUNOLE9BQU8sRUFDUCxTQUFTLEdBQ0s7SUFDZCxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ2QsR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDeEIsQ0FBQztJQUNELE1BQU0sRUFBRSxHQUFHLElBQUksNEJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxNQUFNLEVBQUUsR0FBRyxJQUFJLHlCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLEVBQUUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFM0IsNERBQTREO0lBQzVELEtBQUssVUFBVSxvQkFBb0IsQ0FBQyxNQUFXLEVBQUUsTUFBeUI7UUFDeEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNsRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQywwQkFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUMvQyxPQUFPLENBQ1IsQ0FBQztRQUVGLE1BQU0sWUFBWSxHQUFHLDBCQUFVLENBQUMsWUFBWSxDQUMxQyxNQUFNLEVBQ04sZ0JBQWdCLENBQUMsU0FBUyxFQUMxQiwyQkFBVyxDQUFDLE9BQU8sQ0FB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