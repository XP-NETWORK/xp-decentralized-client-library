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
                        await new Promise((r) => setTimeout(r, 1000));
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