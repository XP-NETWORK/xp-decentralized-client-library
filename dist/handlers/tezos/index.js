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
function tezosHandler({ Tezos, bridge, storage, tzktApi, }) {
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
        const tokenMetaData = await (await nftContract.storage()).token_metadata.get(type_aliases_1.tas.nat(tokenId.toString()));
        const metaDataInHex = tokenMetaData.token_info.get("");
        return (0, tzip16_1.bytes2Char)(metaDataInHex);
    };
    return {
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
        async getClaimData(txHash) {
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
            transaction_hash: transactionHash, } = data;
            const fee = await storage.chainFee(destinationChain);
            const royaltyReceiver = await storage.chainRoyalty(destinationChain);
            const nft = await this.nftData(tokenId, sourceNftContractAddress, {});
            return {
                tokenId,
                destinationChain,
                destinationUserAddress,
                tokenAmount,
                nftType,
                sourceChain,
                transactionHash,
                sourceNftContractAddress,
                fee: fee.toString(),
                royaltyReceiver,
                name: nft.name,
                symbol: nft.symbol,
                royalty: nft.royalty.toString(),
                metadata: nft.metadata,
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
        async deployCollection(signer, da, ga) {
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
            }, { fee: data.fee.toNumber(), ...extraArgs });
            return {
                hash: () => txHash,
                ret: txHash,
            };
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, extraArgs) {
            const hash = await withBridge(signer, (bridgeInstance) => {
                return bridgeInstance.methods.lock_nft(type_aliases_1.tas.nat(tokenId.toString()), destinationChain, to, {
                    addr: type_aliases_1.tas.address(sourceNft),
                });
            }, extraArgs);
            return {
                tx: hash,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdGV6b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEM7QUFFMUMsNENBQW1FO0FBQ25FLG1EQUFxQztBQUNyQywyQ0FBd0Q7QUFFeEQsMENBTXdCO0FBR3hCLDBFQUFxRTtBQUVyRSw4Q0FXMEI7QUFDMUIsa0RBQTBCO0FBQzFCLGtFQUE4RDtBQUM5RCxnQ0FBK0I7QUFHL0IsU0FBZ0IsWUFBWSxDQUFDLEVBQzNCLEtBQUssRUFDTCxNQUFNLEVBQ04sT0FBTyxFQUNQLE9BQU8sR0FDTTtJQUNiLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMvQixLQUFLLFVBQVUsWUFBWSxDQUN6QixNQUFtQixFQUNuQixRQUFnQixFQUNoQixFQUU4QyxFQUM5QyxNQUE0QjtRQUU1QixJQUFJLGVBQWUsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUM5QixLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVwRCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUIsTUFBTSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3hCLE9BQVEsRUFBMkIsQ0FBQyxJQUFJLENBQUM7UUFDM0MsQ0FBQztRQUNELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxNQUFNLFNBQVMsR0FBRyxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEs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