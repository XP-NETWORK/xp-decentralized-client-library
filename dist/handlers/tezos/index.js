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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStrOrAddr = exports.tezosHandler = void 0;
const blake2b_1 = require("@stablelib/blake2b");
const tzip16_1 = require("@taquito/tzip16");
const api = __importStar(require("@tzkt/sdk-api"));
const sdk_api_1 = require("@tzkt/sdk-api");
const utils_1 = require("@taquito/utils");
const type_aliases_1 = require("../../contractsTypes/tezos/type-aliases");
const taquito_1 = require("@taquito/taquito");
const axios_1 = __importDefault(require("axios"));
const NFT_code_1 = require("../../contractsTypes/tezos/NFT.code");
const ton_1 = require("../ton");
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
    const http = axios_1.default.create();
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
        async approveNft(signer, tokenId, contract, extraArgs) {
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
                transactionHash: claimData?.transactionId?.toString() ?? "",
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
            const tokenMd = await getNftTokenMetaData(contract, BigInt(tokenId));
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
                    const metaData = await http
                        .get(tokenMd)
                        .then((res) => res.data);
                    symbol = metaData.symbol ?? symbol;
                }
                symbol = JSON.parse(tokenMd).symbol ?? symbol;
            }
            catch (e) {
                console.log("error getting symbol Tezos", e);
            }
            let royalty = 0n;
            try {
                const metaDataOrURL = await getNftTokenMetaData(contract, BigInt(tokenId));
                const isUrl = URLCanParse(metaDataOrURL);
                let metaData;
                if (isUrl) {
                    metaData = (await http.get(metaDataOrURL)).data;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdGV6b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEM7QUFFMUMsNENBQW1FO0FBQ25FLG1EQUFxQztBQUNyQywyQ0FBd0Q7QUFFeEQsMENBTXdCO0FBR3hCLDBFQUFnRjtBQUVoRiw4Q0FXMEI7QUFDMUIsa0RBQTBCO0FBQzFCLGtFQUE4RDtBQUM5RCxnQ0FBK0I7QUFHL0IsU0FBZ0IsWUFBWSxDQUFDLEVBQzNCLEtBQUssRUFDTCxNQUFNLEVBQ04sT0FBTyxFQUNQLE9BQU8sRUFDUCxVQUFVLEdBQ0c7SUFDYixHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDL0IsS0FBSyxVQUFVLFlBQVksQ0FDekIsTUFBbUIsRUFDbkIsUUFBZ0IsRUFDaEIsRUFFOEMsRUFDOUMsTUFBNEI7UUFFNUIsSUFBSSxlQUFlLElBQUksTUFBTSxFQUFFLENBQUM7WUFDOUIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWhDLE1BQU0sU0FBUyxHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFcEQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN4QixPQUFRLEVBQTJCLENBQUMsSUFBSSxDQUFDO1FBQzNDLENBQUM7UUFDRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUs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