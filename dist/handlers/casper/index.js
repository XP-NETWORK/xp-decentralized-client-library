"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.casperHandler = void 0;
const ces_js_parser_1 = require("@make-software/ces-js-parser");
const casper_cep78_js_client_1 = require("casper-cep78-js-client");
const casper_js_sdk_1 = require("casper-js-sdk");
const claim_wasm_1 = require("./claim.wasm");
const get_deploy_1 = require("./get-deploy");
const lock_wasm_1 = require("./lock.wasm");
function casperHandler({ rpc, identifier, network, bridge, storage, }) {
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
                royalty_arg: casper_js_sdk_1.CLValueBuilder.u512(claimData.royaltyPercentage),
                royalty_receiver_arg: casper_js_sdk_1.CLValueBuilder.byteArray(convertHashStrToHashBuff(claimData.royaltyReceiver)),
                metadata_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.metadata),
                transaction_hash_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.transaction_hash),
                token_amount_arg: casper_js_sdk_1.CLValueBuilder.u512(claimData.amount),
                nft_type_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.nft_type),
                fee_arg: casper_js_sdk_1.CLValueBuilder.u512(claimData.fee),
                lock_tx_chain_arg: casper_js_sdk_1.CLValueBuilder.string(claimData.lockTxChain),
                amount: casper_js_sdk_1.CLValueBuilder.u512(claimData.amount),
            });
            const n = new casper_js_sdk_1.Contracts.Contract(cc);
            const deploy = n.install(Buffer.from(claim_wasm_1.CLAIM_WASM, "hex"), rt_args, extraArgs?.amount || "250000000000", casper_js_sdk_1.CLPublicKey.fromFormattedString(await signer.getActivePublicKey()), network, []);
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
            const bc = new casper_js_sdk_1.Contracts.Contract(cc);
            bc.setContractHash(bridge);
            const bn = await bc.queryContractData(["validator_count"]);
            return bn.value().toNumber();
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metaDataUri, extraArgs) {
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
            const deploy = n.install(Buffer.from(lock_wasm_1.LOCK_WASM, "hex"), rt_args, extraArgs?.amount || "250000000000", casper_js_sdk_1.CLPublicKey.fromFormattedString(await signer.getActivePublicKey()), network, []);
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
        async mintNft(signer, ma) {
            const nft = new casper_cep78_js_client_1.CEP78Client(rpc, network);
            nft.setContractHash(ma.contract);
            const deploy = nft.mint({
                meta: {
                    uri: ma.uri,
                },
                owner: ma.owner,
                collectionName: ma.collectionName,
            }, {
                useSessionCode: false,
            }, "1000000000", casper_js_sdk_1.CLPublicKey.fromFormattedString(await signer.getActivePublicKey()));
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
                casper_js_sdk_1.CLAccountHash.fromFormattedString(hex);
                return Promise.resolve(true);
            }
            catch (e) {
                return Promise.resolve(false);
            }
        },
        transform(input) {
            unimplemented("Transform", input);
        },
        async approveNft(signer, tokenId, contract, _) {
            const cep78Client = new casper_cep78_js_client_1.CEP78Client(rpc, network);
            cep78Client.setContractHash(contract);
            const deploy = cep78Client.approve({
                operator: new casper_js_sdk_1.CLByteArray(Buffer.from(bridge.split("-")[1], "hex")),
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
function unimplemented(msg, ...args) {
    throw new Error(`Unimplemented: ${msg}. ${JSON.stringify(args)}`);
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvY2FzcGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdFQUFzRDtBQUN0RCxtRUFVZ0M7QUFDaEMsaURBYXVCO0FBQ3ZCLDZDQUEwQztBQUMxQyw2Q0FBeUM7QUFDekMsMkNBQXdDO0FBR3hDLFNBQWdCLGFBQWEsQ0FBQyxFQUM1QixHQUFHLEVBQ0gsVUFBVSxFQUNWLE9BQU8sRUFDUCxNQUFNLEVBQ04sT0FBTyxHQUNPO0lBQ2QsTUFBTSxFQUFFLEdBQUcsSUFBSSw0QkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sRUFBRSxHQUFHLElBQUkseUJBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxRQUFRLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFFckMsNERBQTREO0lBQzVELEtBQUssVUFBVSxvQkFBb0IsQ0FBQyxNQUFXLEVBQUUsTUFBeUI7UUFDeEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNsRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQywwQkFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUMvQyxPQUFPLENBQ1IsQ0FBQztRQUVGLE1BQU0sWUFBWSxHQUFHLDBCQUFVLENBQUMsWUFBWSxDQUMxQyxNQUFNLEVBQ04sZ0JBQWdCLENBQUMsU0FBUyxFQUMxQiwyQkFBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FDN0IsQ0FBQztRQUVGLE1BQU0sR0FBRyxHQUFHLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN2RCxPQUFPLENB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