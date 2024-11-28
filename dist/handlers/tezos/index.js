"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStrOrAddr = exports.tezosHandler = void 0;
const blake2b_1 = require("@stablelib/blake2b");
const taquito_1 = require("@taquito/taquito");
const tzip16_1 = require("@taquito/tzip16");
const utils_1 = require("@taquito/utils");
const api = __importStar(require("@tzkt/sdk-api"));
const sdk_api_1 = require("@tzkt/sdk-api");
const NFT_code_1 = require("../../contractsTypes/tezos/NFT.code");
const type_aliases_1 = require("../../contractsTypes/tezos/type-aliases");
const ton_1 = require("../ton");
const index_1 = require("../utils/index");
function tezosHandler({ Tezos, bridge, storage, tzktApi, identifier, }) {
    api.defaults.baseUrl = tzktApi;
    async function withContract(sender, contract, cb, params) {
        if ("publicKeyHash" in sender) {
            Tezos.setSignerProvider(sender);
            const contractI = await Tezos.contract.at(contract);
            const res = cb(contractI);
            const tx = await res.send(params);
            await tx.confirmation();
            return tx.hash;
        }
        Tezos.setWalletProvider(sender);
        const contractI = await Tezos.wallet.at(contract);
        const res = cb(contractI);
        const estim = await Tezos.estimate
            .transfer(res.toTransferParams(params))
            .catch(() => ({ storageLimit: 0 }));
        if (params) {
            if (!params.storageLimit)
                params.storageLimit = estim.storageLimit;
        }
        else {
            // biome-ignore lint/style/noParameterAssign: cope
            params = { storageLimit: estim.storageLimit };
        }
        const tx = await res.send(params);
        await tx.confirmation();
        return tx.opHash;
    }
    async function originateWithTezosSigner(sender, originateParams) {
        if ("publicKeyHash" in sender) {
            Tezos.setSignerProvider(sender);
            const contractI = await Tezos.contract.originate(originateParams);
            await contractI.confirmation();
            return contractI.contractAddress ?? (0, ton_1.raise)("Unreachable");
        }
        Tezos.setWalletProvider(sender);
        const contractI = Tezos.wallet.originate(originateParams);
        const tx = await contractI.send();
        await tx.confirmation();
        return (await tx.contract()).address;
    }
    async function withContractMethodObject(sender, contract, cb, params) {
        if ("publicKeyHash" in sender) {
            Tezos.setSignerProvider(sender);
            const contractI = await Tezos.contract.at(contract);
            const res = cb(contractI);
            const tx = await res.send(params);
            await tx.confirmation();
            return tx.hash;
        }
        Tezos.setWalletProvider(sender);
        const contractI = await Tezos.wallet.at(contract);
        const res = cb(contractI);
        const estim = await Tezos.estimate
            .transfer(res.toTransferParams(params))
            .catch(() => ({ storageLimit: 0 }));
        if (params) {
            if (!params.storageLimit)
                params.storageLimit = estim.storageLimit;
        }
        else {
            // biome-ignore lint/style/noParameterAssign: cope
            params = { storageLimit: estim.storageLimit };
        }
        const tx = await res.send(params);
        await tx.confirmation();
        return tx.opHash;
    }
    //@ts-ignore
    function withBridge(sender, cb, params) {
        return withContract(sender, bridge, cb, params);
    }
    function getAddress(sender) {
        if ("publicKeyHash" in sender) {
            return sender.publicKeyHash();
        }
        return sender.getPKH();
    }
    const getNftTokenMetaData = async (contract, tokenId) => {
        const nftContract = await Tezos.contract.at(contract);
        let tokenMetaData;
        try {
            tokenMetaData = await (await nftContract.storage()).tokens.token_metadata.get(type_aliases_1.tas.nat(tokenId.toString()));
        }
        catch (ex) {
            tokenMetaData = await (await nftContract.storage()).token_metadata.get(type_aliases_1.tas.nat(tokenId.toString()));
        }
        const metaDataInHex = tokenMetaData.token_info.get("");
        return (0, tzip16_1.bytes2Char)(metaDataInHex);
    };
    return {
        identifier,
        getStorageContract() {
            return storage;
        },
        validateAddress(address) {
            return Promise.resolve((0, utils_1.validateAddress)(address) === 3);
        },
        getProvider() {
            return Tezos;
        },
        transform(input) {
            return {
                dest_address: type_aliases_1.tas.address(input.destinationUserAddress),
                dest_chain: input.destinationChain,
                fee: type_aliases_1.tas.mutez(input.fee),
                metadata: input.metadata,
                name: input.name,
                nft_type: input.nftType,
                royalty: type_aliases_1.tas.nat(input.royalty),
                royalty_receiver: type_aliases_1.tas.address(input.royaltyReceiver),
                source_chain: input.sourceChain,
                source_nft_contract_address: input.sourceNftContractAddress,
                symbol: input.symbol,
                token_amount: type_aliases_1.tas.nat(input.tokenAmount),
                token_id: type_aliases_1.tas.nat(input.tokenId),
                transaction_hash: input.transactionHash,
                lock_tx_chain: input.lockTxChain,
            };
        },
        async getBalance(signer, _) {
            return BigInt((await Tezos.tz.getBalance(await getAddress(signer))).toString());
        },
        async getValidatorCount() {
            const bc = await Tezos.contract.at(bridge);
            const storage = await bc.storage();
            return storage.validators_count.toNumber();
        },
        async approveNft(signer, tokenId, contract, _nftType, extraArgs) {
            const owner = await getAddress(signer);
            return await withContract(signer, contract, (contract) => contract.methods.update_operators([
                {
                    add_operator: {
                        owner,
                        operator: bridge,
                        token_id: tokenId,
                    },
                },
            ]), extraArgs);
        },
        async decodeLockedEvent(txHash) {
            const txs = await api.operationsGetTransactionByHash(txHash);
            const tx = txs[0] ?? (0, ton_1.raise)("No such txn found");
            const op = await (0, sdk_api_1.eventsGetContractEvents)({
                contract: {
                    eq: bridge,
                },
            });
            const claimData = op.find((e) => e.timestamp === tx.timestamp);
            const data = claimData?.payload ?? (0, ton_1.raise)("No claim data found");
            const sourceNftContractAddress = (0, exports.extractStrOrAddr)(data.source_nft_address);
            const { token_id: tokenId, // Unique ID for the NFT transfer
            dest_chain: destinationChain, // Chain to where the NFT is being transferred
            dest_address: destinationUserAddress, // User's address in the destination chain
            token_amount: tokenAmount, // amount of nfts to be transfered ( 1 in 721 case )
            nft_type: nftType, // Sigular or multiple ( 721 / 1155)
            source_chain: sourceChain, // Source chain of NFT
            metadata_uri, } = data;
            return {
                tokenId,
                destinationChain,
                destinationUserAddress,
                tokenAmount,
                nftType,
                sourceChain,
                transactionHash: txHash,
                sourceNftContractAddress,
                lockTxChain: identifier,
                metaDataUri: metadata_uri,
            };
        },
        async mintNft(signer, ma, gasArgs) {
            const owner = await getAddress(signer);
            return await withContract(signer, ma.contract, (contract) => contract.methods.mint([
                {
                    amt: type_aliases_1.tas.nat(1),
                    to: type_aliases_1.tas.address(owner),
                    token_id: type_aliases_1.tas.nat(ma.tokenId.toString()),
                    token_uri: ma.uri,
                },
            ]), gasArgs);
        },
        async deployNftCollection(signer, da, ga) {
            const metadata = new taquito_1.MichelsonMap();
            metadata.set("", type_aliases_1.tas.bytes((0, utils_1.char2Bytes)("tezos-storage:data")));
            metadata.set("data", type_aliases_1.tas.bytes((0, utils_1.char2Bytes)(`{
            "name":"${da.name}",
            "description":"${da.description}",
            "version":"0.0.1",
            "license":{"name":"MIT"},
            "source":{
              "tools":["Ligo"],
              "location":"https://github.com/ligolang/contract-catalogue/tree/main/lib/fa2"
            },
            "interfaces":["TZIP-012"],
            "errors": [],
            "views": []
      }`)));
            const owner = await getAddress(signer);
            return await originateWithTezosSigner(signer, {
                code: NFT_code_1.NFTCode.code,
                storage: {
                    admin: owner,
                    token_metadata: new taquito_1.MichelsonMap(),
                    token_total_supply: new taquito_1.MichelsonMap(),
                    operators: new taquito_1.MichelsonMap(),
                    ledger: new taquito_1.MichelsonMap(),
                    metadata: metadata,
                },
                gasLimit: ga?.gasLimit,
            });
        },
        async claimNft(signer, data, sigs, extraArgs) {
            const isTezosAddr = (0, utils_1.validateAddress)(data.source_nft_contract_address) === 3;
            const sourceNftContractAddress = isTezosAddr
                ? {
                    addr: type_aliases_1.tas.address(data.source_nft_contract_address),
                }
                : {
                    str: data.source_nft_contract_address,
                };
            const txHash = await withContractMethodObject(signer, bridge, (bridgeInstance) => {
                return bridgeInstance.methodsObject.claim_nft({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    data: {
                        dest_address: data.dest_address,
                        dest_chain: data.dest_chain,
                        fee: data.fee,
                        metadata: data.metadata,
                        name: data.name,
                        nft_type: data.nft_type,
                        royalty: data.royalty,
                        royalty_receiver: data.royalty_receiver,
                        source_chain: data.source_chain,
                        symbol: data.symbol,
                        token_amount: data.token_amount,
                        token_id: type_aliases_1.tas.nat(data.token_id),
                        transaction_hash: data.transaction_hash,
                        source_nft_contract_address: sourceNftContractAddress,
                        lock_tx_chain: data.lock_tx_chain,
                    },
                    sigs: sigs.map((e) => {
                        const addr = type_aliases_1.tas.address((0, utils_1.b58cencode)((0, blake2b_1.hash)(new Uint8Array((0, utils_1.b58cdecode)(e.signerAddress, utils_1.prefix.edpk)), 20), utils_1.prefix.tz1));
                        return {
                            addr,
                            sig: type_aliases_1.tas.signature(Buffer.from(e.signature.replace("0x", ""), "hex").toString()),
                            signer: type_aliases_1.tas.key(e.signerAddress),
                        };
                    }),
                });
            }, { amount: data.fee.toNumber() / 1e6, ...extraArgs });
            return {
                hash: () => txHash,
                ret: txHash,
            };
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metaDataUri, extraArgs) {
            console.log(metaDataUri);
            const hash = await withContractMethodObject(signer, bridge, (bridgeInstance) => {
                return bridgeInstance.methodsObject.lock_nft({
                    token_id: type_aliases_1.tas.nat(tokenId.toString()),
                    dest_chain: destinationChain,
                    dest_address: to,
                    source_nft_address: {
                        addr: type_aliases_1.tas.address(sourceNft),
                    },
                    metadata_uri: metaDataUri,
                });
            }, extraArgs);
            return {
                ret: hash,
                hash() {
                    return hash;
                },
            };
        },
        async readClaimed721Event(hash) {
            const txs = await api.operationsGetTransactionByHash(hash);
            const tx = txs[0] ?? (0, ton_1.raise)("No such txn found");
            const op = await (0, sdk_api_1.eventsGetContractEvents)({
                contract: {
                    eq: bridge,
                },
            });
            const claimData = op.find((e) => e.timestamp === tx.timestamp);
            const data = claimData?.payload ?? (0, ton_1.raise)("No claim data found");
            return {
                nft_contract: data.nft_contract,
                transaction_hash: data.tx_hash,
                token_id: data.token_id,
                source_chain: data.source_chain,
                lock_tx_chain: data.lock_tx_chain,
            };
        },
        async nftData(tokenId, contract) {
            let tokenMd = await getNftTokenMetaData(contract, BigInt(tokenId));
            tokenMd = tokenMd.substring(tokenMd.indexOf("https://"));
            let name = "NTEZOS";
            try {
                Tezos.addExtension(new tzip16_1.Tzip16Module());
                const nftContract = await Tezos.contract.at(contract, tzip16_1.tzip16);
                const md = nftContract.tzip16();
                name = (await md.metadataName()) ?? name;
            }
            catch (e) {
                console.log("error getting name Tezos");
            }
            let symbol = "NTEZOS";
            try {
                const isUrl = URLCanParse(tokenMd);
                if (isUrl) {
                    const metaData = await (0, index_1.fetchHttpOrIpfs)(tokenMd);
                    symbol = metaData.symbol ?? symbol;
                }
                symbol = JSON.parse(tokenMd).symbol ?? symbol;
            }
            catch (e) {
                console.log("error getting symbol Tezos", e);
            }
            let royalty = 0n;
            try {
                const metaDataOrURL = tokenMd;
                const isUrl = URLCanParse(metaDataOrURL);
                let metaData;
                if (isUrl) {
                    metaData = await (0, index_1.fetchHttpOrIpfs)(metaDataOrURL);
                }
                else {
                    metaData = JSON.parse(metaDataOrURL);
                }
                const decimal_places_in_rates = metaData.royalties.decimals;
                const max_percentage = Number(`1${"0".repeat(decimal_places_in_rates)}`);
                const rate = Object.values(metaData.royalties.shares)[0];
                royalty = BigInt((rate / max_percentage) * 10000);
            }
            catch (e) {
                console.log("Error getting royalty Tezos");
            }
            return {
                metadata: tokenMd,
                name,
                symbol,
                royalty,
            };
        },
    };
}
exports.tezosHandler = tezosHandler;
const URLCanParse = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch (_) {
        return false;
    }
};
const extractStrOrAddr = (addr) => {
    if ("str" in addr)
        return addr.str;
    return addr.addr;
};
exports.extractStrOrAddr = extractStrOrAddr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdGV6b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEM7QUFFMUMsOENBVzBCO0FBQzFCLDRDQUFtRTtBQUNuRSwwQ0FNd0I7QUFDeEIsbURBQXFDO0FBQ3JDLDJDQUF3RDtBQUV4RCxrRUFBOEQ7QUFFOUQsMEVBS2lEO0FBQ2pELGdDQUErQjtBQUMvQiwwQ0FBaUQ7QUFHakQsU0FBZ0IsWUFBWSxDQUFDLEVBQzNCLEtBQUssRUFDTCxNQUFNLEVBQ04sT0FBTyxFQUNQLE9BQU8sRUFDUCxVQUFVLEdBQ0c7SUFDYixHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDL0IsS0FBSyxVQUFVLFlBQVksQ0FDekIsTUFBbUIsRUFDbkIsUUFBZ0IsRUFDaEIsRUFFOEMsRUFDOUMsTUFBNEI7UUFFNUIsSUFBSSxlQUFlLElBQUksTUFBTSxFQUFFLENBQUM7WUFDOUIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWhDLE1BQU0sU0FBUyxHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFcEQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN4QixPQUFRLEVBQTJCLENBQUMsSUFBSSxDQUFDO1FBQzNDLENBQUM7UUFDRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FB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