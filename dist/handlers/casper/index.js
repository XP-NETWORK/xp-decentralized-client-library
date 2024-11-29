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
    bc.setContractHash(`hash-${bridge}`);
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
                .filter((e) => e.event.name === "LockedEvent")
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
                bridge_contract: casper_js_sdk_1.CLValueBuilder.byteArray(Buffer.from(bridge, "hex")),
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
            const deploy = n.install(Buffer.from(claim_wasm_1.CLAIM_WASM, "hex"), rt_args, extraArgs?.amount || "250000000000", casper_js_sdk_1.CLPublicKey.fromHex(await signer.getActivePublicKey()), network, []);
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
            const cep78Client = new casper_cep78_js_client_1.CEP78Client(proxy_url + rpc, network);
            cep78Client.setContractHash(`hash-${bridge}`);
            const bn = await cep78Client.contractClient.queryContractData([
                "validators_count",
            ]);
            return Number(bn);
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metaDataUri, extraArgs) {
            const nft_storage_exists = await checkStorage(proxy_url + rpc, network, bridge, sourceNft);
            const rt_args = casper_js_sdk_1.RuntimeArgs.fromMap({
                bridge_contract: casper_js_sdk_1.CLValueBuilder.byteArray(Buffer.from(bridge, "hex")),
                token_id_arg: casper_js_sdk_1.CLValueBuilder.string(tokenId),
                destination_chain_arg: casper_js_sdk_1.CLValueBuilder.string(destinationChain),
                destination_user_address_arg: casper_js_sdk_1.CLValueBuilder.string(to),
                source_nft_contract_address_arg: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(sourceNft)),
                metadata_arg: casper_js_sdk_1.CLValueBuilder.string(metaDataUri),
                amount: casper_js_sdk_1.CLValueBuilder.u512(extraArgs?.amount || 250000000000n),
            });
            const n = new casper_js_sdk_1.Contracts.Contract(cc);
            const deploy = n.install(Buffer.from(lock_wasm_1.LOCK_WASM, "hex"), rt_args, extraArgs?.amount || "250000000000", casper_js_sdk_1.CLPublicKey.fromHex(await signer.getActivePublicKey()), network, []);
            if (isBrowser()) {
                const hash = await signWithCasperWallet(signer, deploy);
                if (!nft_storage_exists) {
                    while (true) {
                        await new Promise((r) => setTimeout(r, 1000));
                        if (await checkStorage(proxy_url + rpc, network, bridge, sourceNft)) {
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
            nft.setContractHash(`hash-${ma.contract}`);
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
            cep78Client.setContractHash(`hash-${contract}`);
            const deploy = cep78Client.approve({
                operator: new casper_js_sdk_1.CLByteArray(Buffer.from(bridge, "hex")),
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
async function checkStorage(nodeAddress, network, bridge, sourceNft) {
    const cep78Client = new casper_cep78_js_client_1.CEP78Client(nodeAddress, network);
    cep78Client.setContractHash(`hash-${bridge}`);
    const serializer = (0, serializer_1.Serializer)();
    const bytes = serializer.storageKey({
        source_nft_contract_address: sourceNft,
    });
    const dic_key = crypto_1.default.createHash("sha256").update(bytes).digest("hex");
    const duplicate_storage_dict = await cep78Client.contractClient
        .queryContractDictionary("duplicate_storage_dict", dic_key)
        .catch(() => false)
        .then(() => true);
    if (duplicate_storage_dict)
        return true;
    const original_storage_dict = await cep78Client.contractClient
        .queryContractDictionary("original_storage_dict", dic_key)
        .catch(() => false)
        .then(() => true);
    return original_storage_dict;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvY2FzcGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlFQUFpRTtBQUNqRSxvREFBNEI7QUFDNUIsZ0VBQXNEO0FBQ3RELG1FQVVnQztBQUNoQyxpREFhdUI7QUFDdkIsNkNBQTBDO0FBQzFDLDZDQUF5QztBQUN6QywyQ0FBd0M7QUFDeEMsNkNBQTBDO0FBRzFDLFNBQWdCLGFBQWEsQ0FBQyxFQUM1QixHQUFHLEVBQ0gsVUFBVSxFQUNWLE9BQU8sRUFDUCxNQUFNLEVBQ04sT0FBTyxFQUNQLFNBQVMsR0FDSztJQUNkLElBQUksU0FBUyxFQUFFLENBQUM7UUFDZCxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUN4QixDQUFDO0lBQ0QsTUFBTSxFQUFFLEdBQUcsSUFBSSw0QkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sRUFBRSxHQUFHLElBQUkseUJBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxRQUFRLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFFckMsNERBQTREO0lBQzVELEtBQUssVUFBVSxvQkFBb0IsQ0FBQyxNQUFXLEVBQUUsTUFBeUI7UUFDeEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNsRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQywwQkFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUMvQyxPQUFPLENBQ1IsQ0FBQztRQUVGLE1BQU0sWUFBWSxHQUFHLDBCQUFVLENBQUMsWUFBWSxDQUMxQyxNQUFNLEVBQ04sZ0JBQWdCLENBQUMsU0FBUyxFQUMxQiwyQkFBVyxDQUFDLE9BQU8sQ0FBQyxP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