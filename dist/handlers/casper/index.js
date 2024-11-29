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
            ctr.setContractHash(contract);
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
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            return event;
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
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metaDataUri, extraArgs) {
            const nft_storage_exists = await checkStorage(bc, sourceNft.replace("hash-", ""));
            const rt_args = casper_js_sdk_1.RuntimeArgs.fromMap({
                bridge_contract: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(bridge)),
                token_id_arg: casper_js_sdk_1.CLValueBuilder.string(tokenId),
                destination_chain_arg: casper_js_sdk_1.CLValueBuilder.string(destinationChain),
                destination_user_address_arg: casper_js_sdk_1.CLValueBuilder.string(to),
                source_nft_contract_address_arg: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(sourceNft)),
                metadata_arg: casper_js_sdk_1.CLValueBuilder.string(metaDataUri),
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
                    return this.lockNft(signer, sourceNft, destinationChain, to, tokenId, metaDataUri, extraArgs);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvY2FzcGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlFQUFpRTtBQUNqRSxvREFBNEI7QUFDNUIsZ0VBQXNEO0FBQ3RELG1FQVVnQztBQUNoQyxpREFhdUI7QUFDdkIsNkNBQTBDO0FBQzFDLDZDQUF5QztBQUN6QywyQ0FBd0M7QUFDeEMsNkNBQTBDO0FBRzFDLFNBQWdCLGFBQWEsQ0FBQyxFQUM1QixHQUFHLEVBQ0gsVUFBVSxFQUNWLE9BQU8sRUFDUCxNQUFNLEVBQ04sT0FBTyxFQUNQLFNBQVMsR0FDSztJQUNkLElBQUksU0FBUyxFQUFFLENBQUM7UUFDZCxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUN4QixDQUFDO0lBQ0QsTUFBTSxFQUFFLEdBQUcsSUFBSSw0QkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sRUFBRSxHQUFHLElBQUkseUJBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUUzQiw0REFBNEQ7SUFDNUQsS0FBSyxVQUFVLG9CQUFvQixDQUFDLE1BQVcsRUFBRSxNQUF5QjtRQUN4RSxNQUFNLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ2xELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLDBCQUFVLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQy9DLE9BQU8sQ0FDUixDQUFDO1FBRUYsTUFBTSxZQUFZLEdBQUcsMEJBQVUsQ0FBQyxZQUFZLENBQzFDLE1BQU0sRUFDTixnQkFBZ0IsQ0FBQyxTQUFTLEVBQzFCLDJCQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxD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