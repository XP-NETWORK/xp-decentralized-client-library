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
             } = data;
            const fee = await storage.chainFee(destinationChain);
            const royaltyReceiver = await storage.chainRoyalty(destinationChain);
            let nft = {
                metadata: "",
                name: "",
                royalty: 0n,
                symbol: "",
            };
            if ((0, utils_1.validateAddress)(sourceNftContractAddress) === 3) {
                nft = await this.nftData(tokenId, sourceNftContractAddress, {});
            }
            return {
                tokenId,
                destinationChain,
                destinationUserAddress,
                tokenAmount,
                nftType,
                sourceChain,
                transactionHash: claimData?.transactionId?.toString() ?? "",
                sourceNftContractAddress,
                fee: fee.toString(),
                royaltyReceiver,
                name: nft.name,
                symbol: nft.symbol,
                royalty: nft.royalty.toString(),
                metadata: nft.metadata,
                lockTxChain: identifier,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdGV6b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEM7QUFFMUMsNENBQW1FO0FBQ25FLG1EQUFxQztBQUNyQywyQ0FBd0Q7QUFFeEQsMENBTXdCO0FBR3hCLDBFQUFxRTtBQUVyRSw4Q0FXMEI7QUFDMUIsa0RBQTBCO0FBQzFCLGtFQUE4RDtBQUM5RCxnQ0FBK0I7QUFJL0IsU0FBZ0IsWUFBWSxDQUFDLEVBQzNCLEtBQUssRUFDTCxNQUFNLEVBQ04sT0FBTyxFQUNQLE9BQU8sRUFDUCxVQUFVLEdBQ0c7SUFDYixHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDL0IsS0FBSyxVQUFVLFlBQVksQ0FDekIsTUFBbUIsRUFDbkIsUUFBZ0IsRUFDaEIsRUFFOEMsRUFDOUMsTUFBNEI7UUFFNUIsSUFBSSxlQUFlLElBQUksTUFBTSxFQUFFLENBQUM7WUFDOUIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWhDLE1BQU0sU0FBUyxHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFcEQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN4QixPQUFRLEVBQTJCLENBQUMsSUFBSSxDQUFDO1FBQzNDLENBQUM7UUFDRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVsRCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFMUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUTthQUMvQixRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3RDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV0QyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZO2dCQUFFLE1BQU0sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUNyRSxDQUFDO2FBQU0sQ0FBQztZQUNOLGtEQUFrRDtZQUNsRCxNQUFNLEdBQUcsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2hELENBQUM7UUFDRCxNQUFNLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDeEIsT0FBUSxFQUFpQyxDQUFDLE1BQU0sQ0FBQztJQUNuRCxDQUFDO0lBRUQsS0FBSyxVQUFVLHdCQUF3QixDQUNyQyxNQUFtQixFQUNuQixlQUF5QztRQUV6QyxJQUFJLGVBQWUsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUM5QixLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNsRSxNQUFNLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUMvQixPQUFPLFNBQVMsQ0FBQyxlQUFlLElBQUksSUFBQSxXQUFLLEVBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUNELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUUxRCxNQUFNLEVBQUUsR0FBRyxNQUFNLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVsQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4QixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDdkMsQ0FBQztJQUVELEtBQUssVUFBVSx3QkFBd0IsQ0FDckMsTUFBbUIsRUFDbkIsUUFBZ0IsRUFDaEIsRUFFb0QsRUFDcEQsTUFBNEI7UUFFNUIsSUFBSSxlQUFlLElBQUksTUFBTSxFQUFFLENBQUM7WUFDOUIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWhDLE1BQU0sU0FBUyxHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFcEQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN4QixPQUFRLEVBQTJCLENBQUMsSUFBSSxDQUFDO1FBQzNDLENBQUM7UUFDRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVsRCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFMUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUTthQUMvQixRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3RDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV0QyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZO2dCQUFFLE1BQU0sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUNyRSxDQUFDO2FBQU0sQ0FBQztZQUNOLGtEQUFrRDtZQUNsRCxNQUFNLEdBQUcsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2hELENBQUM7UUFDRCxNQUFNLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDeEIsT0FBUSxFQUFpQyxDQUFDLE1BQU0sQ0FBQztJQUNuRCxDQUFDO0lBQ0QsWUFBWTtJQUNaLFNBQVMsVUFBVSxDQUNqQixNQUFtQixFQUNuQixFQUU4QyxFQUM5QyxNQUE0QjtRQUU1QixPQUFPLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsU0FBUyxVQUFVLENBQUMsTUFBbUI7UUFDckMsSUFBSSxlQUFlLElBQUksTUFBTSxFQUFFLENBQUM7WUFDOUIsT0FBTyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDaEMsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxNQUFNLElBQUksR0FBRyxlQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDNUIsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLEVBQUUsUUFBZ0IsRUFBRSxPQUFlLEVBQUUsRUFBRTtRQUN0RSxNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFrQixRQUFRLENBQUMsQ0FBQztRQUV2RSxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQzFCLE1BQU0sV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUM1QixDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsa0JBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2RCxPQUFPLElBQUEsbUJBQVUsRUFBQyxhQUFhLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUM7SUFDRixPQUFPO1FBQ0wsa0JBQWtCO1lBQ2hCLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0QsU0FBUyxDQUFDLEtBQUs7WUFDYixPQUFPO2dCQUNMLFlBQVksRUFBRSxrQkFBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUM7Z0JBQ3ZELFVBQVUsRUFBRSxLQUFLLENBQUMsZ0JBQWdCO2dCQUNsQyxHQUFHLEVBQUUsa0JBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDekIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO2dCQUN4QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdkIsT0FBTyxFQUFFLGtCQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQy9CLGdCQUFnQixFQUFFLGtCQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7Z0JBQ3BELFlBQVksRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDL0IsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLHdCQUF3QjtnQkFDM0QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO2dCQUNwQixZQUFZLEVBQUUsa0JBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztnQkFDeEMsUUFBUSxFQUFFLGtCQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQ2hDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxlQUFlO2dCQUN2QyxhQUFhLEVBQUUsS0FBSyxDQUFDLFdBQVc7YUFDakMsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3hCLE9BQU8sTUFBTSxDQUNYLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQ2pFLENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLGlCQUFpQjtZQUNyQixNQUFNLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFxQixNQUFNLENBQUMsQ0FBQztZQUMvRCxNQUFNLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuQyxPQUFPLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3QyxDQUFDO1FBQ0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTO1lBQ25ELE1BQU0sS0FBSyxHQUFHLE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sTUFBTSxZQUFZLENBQ3ZCLE1BQU0sRUFDTixRQUFRLEVBQ1IsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUNYLFFBQVEsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ2hDO29CQUNFLFlBQVksRUFBRTt3QkFDWixLQUFLO3dCQUNMLFFBQVEsRUFBRSxNQUFNO3dCQUNoQixRQUFRLEVBQUUsT0FBTztxQkFDbEI7aUJBQ0Y7YUFDRixDQUFDLEVBQ0osU0FBUyxDQUNWLENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNO1lBQ3ZCLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLDhCQUE4QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdELE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFBLFdBQUssRUFBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBQSxpQ0FBdUIsRUFBQztnQkFDdkMsUUFBUSxFQUFFO29CQUNSLEVBQUUsRUFBRSxNQUFNO2lCQUNYO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFL0QsTUFBTSxJQUFJLEdBQUcsU0FBUyxFQUFFLE9BQU8sSUFBSSxJQUFBLFdBQUssRUFBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sd0JBQXdCLEdBQUcsSUFBQSx3QkFBZ0IsRUFDL0MsSUFBSSxDQUFDLGtCQUFrQixDQUN4QixDQUFDO1lBQ0YsTUFBTSxFQUNKLFFBQVEsRUFBRSxPQUFPLEVBQUUsaUNBQWlDO1lBQ3BELFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSw4Q0FBOEM7WUFDNUUsWUFBWSxFQUFFLHNCQUFzQixFQUFFLDBDQUEwQztZQUNoRixZQUFZLEVBQUUsV0FBVyxFQUFFLG9EQUFvRDtZQUMvRSxRQUFRLEVBQUUsT0FBTyxFQUFFLG9DQUFvQztZQUN2RCxZQUFZLEVBQUUsV0FBVyxFQUFFLHNCQUFzQjtjQUNsRCxHQUFHLElBQUksQ0FBQztZQUNULE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sZUFBZSxHQUFHLE1BQU0sT0FBTyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksR0FBRyxHQUFhO2dCQUNsQixRQUFRLEVBQUUsRUFBRTtnQkFDWixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsRUFBRTtnQkFDWCxNQUFNLEVBQUUsRUFBRTthQUNYLENBQUM7WUFDRixJQUFJLElBQUEsdUJBQWUsRUFBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUNwRCxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNsRSxDQUFDO1lBQ0QsT0FBTztnQkFDTCxPQUFPO2dCQUNQLGdCQUFnQjtnQkFDaEIsc0JBQXNCO2dCQUN0QixXQUFXO2dCQUNYLE9BQU87Z0JBQ1AsV0FBVztnQkFDWCxlQUFlLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUMzRCx3QkFBd0I7Z0JBQ3hCLEdBQUcsRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUNuQixlQUFlO2dCQUNmLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtnQkFDZCxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07Z0JBQ2xCLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDL0IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO2dCQUN0QixXQUFXLEVBQUUsVUFBVTthQUN4QixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxPQUFPO1lBQy9CLE1BQU0sS0FBSyxHQUFHLE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sTUFBTSxZQUFZLENBQ3ZCLE1BQU0sRUFDTixFQUFFLENBQUMsUUFBUSxFQUNYLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FDWCxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDcEI7b0JBQ0UsR0FBRyxFQUFFLGtCQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDZixFQUFFLEVBQUUsa0JBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO29CQUN0QixRQUFRLEVBQUUsa0JBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDeEMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxHQUFHO2lCQUNsQjthQUNGLENBQUMsRUFDSixPQUFPLENBQ1IsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQ25DLE1BQU0sUUFBUSxHQUFHLElBQUksc0JBQVksRUFBaUIsQ0FBQztZQUNuRCxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxrQkFBRyxDQUFDLEtBQUssQ0FBQyxJQUFBLGtCQUFVLEVBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUQsUUFBUSxDQUFDLEdBQUcsQ0FDVixNQUFNLEVBQ04sa0JBQUcsQ0FBQyxLQUFLLENBQ1AsSUFBQSxrQkFBVSxFQUFDO3NCQUNDLEVBQUUsQ0FBQyxJQUFJOzZCQUNBLEVBQUUsQ0FBQyxXQUFXOzs7Ozs7Ozs7O1FBVW5DLENBQUMsQ0FDQSxDQUNGLENBQUM7WUFFRixNQUFNLEtBQUssR0FBRyxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV2QyxPQUFPLE1BQU0sd0JBQXdCLENBQUMsTUFBTSxFQUFFO2dCQUM1QyxJQUFJLEVBQUUsa0JBQU8sQ0FBQyxJQUFJO2dCQUNsQixPQUFPLEVBQUU7b0JBQ1AsS0FBSyxFQUFFLEtBQUs7b0JBQ1osY0FBYyxFQUFFLElBQUksc0JBQVksRUFBRTtvQkFDbEMsa0JBQWtCLEVBQUUsSUFBSSxzQkFBWSxFQUFFO29CQUN0QyxTQUFTLEVBQUUsSUFBSSxzQkFBWSxFQUFFO29CQUM3QixNQUFNLEVBQUUsSUFBSSxzQkFBWSxFQUFFO29CQUMxQixRQUFRLEVBQUUsUUFBUTtpQkFDbkI7Z0JBQ0QsUUFBUSxFQUFFLEVBQUUsRUFBRSxRQUFRO2FBQ3ZCLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVM7WUFDMUMsTUFBTSxXQUFXLEdBQ2YsSUFBQSx1QkFBZSxFQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUxRCxNQUFNLHdCQUF3QixHQUFHLFdBQVc7Z0JBQzFDLENBQUMsQ0FBQztvQkFDRSxJQUFJLEVBQUUsa0JBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDO2lCQUNwRDtnQkFDSCxDQUFDLENBQUM7b0JBQ0UsR0FBRyxFQUFFLElBQUksQ0FBQywyQkFBMkI7aUJBQ3RDLENBQUM7WUFFTixNQUFNLE1BQU0sR0FBRyxNQUFNLHdCQUF3QixDQUMzQyxNQUFNLEVBQ04sTUFBTSxFQUNOLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQ2pCLE9BQU8sY0FBYyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7b0JBQzVDLDZEQUE2RDtvQkFDN0QsWUFBWTtvQkFDWixJQUFJLEVBQUU7d0JBQ0osWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO3dCQUMvQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7d0JBQzNCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRzt3QkFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7d0JBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTt3QkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7d0JBQ3ZCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTzt3QkFDckIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjt3QkFDdkMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO3dCQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07d0JBQ25CLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTt3QkFDL0IsUUFBUSxFQUFFLGtCQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7d0JBQ2hDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7d0JBQ3ZDLDJCQUEyQixFQUFFLHdCQUF3Qjt3QkFDckQsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO3FCQUNsQztvQkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNuQixNQUFNLElBQUksR0FBRyxrQkFBRyxDQUFDLE9BQU8sQ0FDdEIsSUFBQSxrQkFBVSxFQUNSLElBQUEsY0FBSSxFQUNGLElBQUksVUFBVSxDQUFDLElBQUEsa0JBQVUsRUFBQyxDQUFDLENBQUMsYUFBYSxFQUFFLGNBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUN4RCxFQUFFLENBQ0gsRUFDRCxjQUFNLENBQUMsR0FBRyxDQUNYLENBQ0YsQ0FBQzt3QkFDRixPQUFPOzRCQUNMLElBQUk7NEJBQ0osR0FBRyxFQUFFLGtCQUFHLENBQUMsU0FBUyxDQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FDN0Q7NEJBQ0QsTUFBTSxFQUFFLGtCQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7eUJBQ2pDLENBQUM7b0JBQ0osQ0FBQyxDQUFDO2lCQUNILENBQUMsQ0FBQztZQUNMLENBQUMsRUFDRCxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsRUFBRSxHQUFHLFNBQVMsRUFBRSxDQUNwRCxDQUFDO1lBRUYsT0FBTztnQkFDTCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTTtnQkFDbEIsR0FBRyxFQUFFLE1BQU07YUFDWixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQ1gsTUFBTSxFQUNOLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsRUFBRSxFQUNGLE9BQU8sRUFDUCxXQUFXLEVBQ1gsU0FBUztZQUVULE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFekIsTUFBTSxJQUFJLEdBQUcsTUFBTSx3QkFBd0IsQ0FDekMsTUFBTSxFQUNOLE1BQU0sRUFDTixDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUNqQixPQUFPLGNBQWMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO29CQUMzQyxRQUFRLEVBQUUsa0JBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNyQyxVQUFVLEVBQUUsZ0JBQWdCO29CQUM1QixZQUFZLEVBQUUsRUFBRTtvQkFDaEIsa0JBQWtCLEVBQUU7d0JBQ2xCLElBQUksRUFBRSxrQkFBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7cUJBQzdCO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsRUFDRCxTQUFTLENBQ1YsQ0FBQztZQUVGLE9BQU87Z0JBQ0wsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsSUFBSTtvQkFDRixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSTtZQUM1QixNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzRCxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBQSxXQUFLLEVBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNoRCxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsaUNBQXVCLEVBQUM7Z0JBQ3ZDLFFBQVEsRUFBRTtvQkFDUixFQUFFLEVBQUUsTUFBTTtpQkFDWDthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sSUFBSSxHQUFHLFNBQVMsRUFBRSxPQUFPLElBQUksSUFBQSxXQUFLLEVBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNoRSxPQUFPO2dCQUNMLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDL0IsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQzlCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMvQixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7YUFDbEMsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFRO1lBQzdCLE1BQU0sT0FBTyxHQUFHLE1BQU0sbUJBQW1CLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQztZQUNwQixJQUFJLENBQUM7Z0JBQ0gsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLHFCQUFZLEVBQUUsQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFNLENBQUMsQ0FBQztnQkFDOUQsTUFBTSxFQUFFLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNoQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQztZQUMzQyxDQUFDO1lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDMUMsQ0FBQztZQUNELElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQztZQUN0QixJQUFJLENBQUM7Z0JBQ0gsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLEtBQUssRUFBRSxDQUFDO29CQUNWLE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUk7eUJBQzdDLEdBQUcsQ0FBQyxPQUFPLENBQUM7eUJBQ1osSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNCLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQztnQkFDckMsQ0FBQztnQkFDRCxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDO1lBQ2hELENBQUM7WUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0MsQ0FBQztZQUNELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUM7Z0JBQ0gsTUFBTSxhQUFhLEdBQUcsTUFBTSxtQkFBbUIsQ0FDN0MsUUFBUSxFQUNSLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FDaEIsQ0FBQztnQkFDRixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3pDLElBQUksUUFPSCxDQUFDO2dCQUVGLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ1YsUUFBUSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNsRCxDQUFDO3FCQUFNLENBQUM7b0JBQ04sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7Z0JBQ0QsTUFBTSx1QkFBdUIsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDNUQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUMzQixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUMxQyxDQUFDO2dCQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUNwRCxDQUFDO1lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUNELE9BQU87Z0JBQ0wsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLElBQUk7Z0JBQ0osTUFBTTtnQkFDTixPQUFPO2FBQ1IsQ0FBQztRQUNKLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQW5kRCxvQ0FtZEM7QUFFRCxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQVcsRUFBVyxFQUFFO0lBQzNDLElBQUksQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNYLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVLLE1BQU0sZ0JBQWdCLEdBQUcsQ0FDOUIsSUFBd0MsRUFDaEMsRUFBRTtJQUNWLElBQUksS0FBSyxJQUFJLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbkMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ25CLENBQUMsQ0FBQztBQUxXLFFBQUEsZ0JBQWdCLG9CQUszQiJ9