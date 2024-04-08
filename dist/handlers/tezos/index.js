"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStrOrAddr = exports.tezosHandler = void 0;
const blake2b_1 = require("@stablelib/blake2b");
const tzip16_1 = require("@taquito/tzip16");
const sdk_api_1 = require("@tzkt/sdk-api");
const utils_1 = require("@taquito/utils");
const type_aliases_1 = require("../../contractsTypes/tezos/type-aliases");
const taquito_1 = require("@taquito/taquito");
const axios_1 = __importDefault(require("axios"));
const NFT_code_1 = require("../../contractsTypes/tezos/NFT.code");
const ton_1 = require("../ton");
function tezosHandler({ Tezos, bridge, storage, }) {
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
            return BigInt((await Tezos.tz.getBalance(await signer.publicKeyHash())).toString());
        },
        async getValidatorCount() {
            const bc = await Tezos.contract.at(bridge);
            const storage = await bc.storage();
            return storage.validators_count.toNumber();
        },
        async approveNft(signer, tokenId, contract, extraArgs) {
            Tezos.setSignerProvider(signer);
            const nftContract = await Tezos.contract.at(contract);
            const tx = await nftContract.methodsObject
                .update_operators([
                {
                    add_operator: {
                        owner: (await signer.publicKeyHash()),
                        operator: bridge,
                        token_id: type_aliases_1.tas.nat(tokenId.toString()),
                    },
                },
            ])
                .send({ ...extraArgs });
            return tx;
        },
        async getClaimData(txHash) {
            const op = await (0, sdk_api_1.eventsGetContractEvents)({
                contract: {
                    eq: bridge,
                },
            });
            const claimData = op.find((e) => e.timestamp === txHash);
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
            Tezos.setSignerProvider(signer);
            const contract = await Tezos.contract.at(ma.contract);
            const tx = await contract.methods
                .mint([
                {
                    amt: type_aliases_1.tas.nat(1),
                    to: type_aliases_1.tas.address(await signer.publicKeyHash()),
                    token_id: type_aliases_1.tas.nat(ma.tokenId.toString()),
                    token_uri: ma.uri,
                },
            ])
                .send(gasArgs);
            return tx;
        },
        async deployCollection(signer, da, ga) {
            Tezos.setSignerProvider(signer);
            const metadata = new taquito_1.MichelsonMap();
            metadata.set("", type_aliases_1.tas.bytes((0, utils_1.char2Bytes)("tezos-storage:data")));
            metadata.set("data", type_aliases_1.tas.bytes((0, utils_1.char2Bytes)(`{
      "name":"${da.name}",
      "description":"${da.description}",
      "version":"0.0.1",
      "license":{"name":"MIT"},
      "source":{
        "tools":["Ligo"],
        "location":"https://github.com/ligolang/contract-catalogue/tree/main/lib/fa2"},
      "interfaces":["TZIP-012"],
      "errors": [],
      "views": []
      }`)));
            const tx = await Tezos.contract.originate({
                code: NFT_code_1.NFTCode.code,
                storage: {
                    admin: await signer.publicKeyHash(),
                    token_metadata: new taquito_1.MichelsonMap(),
                    token_total_supply: new taquito_1.MichelsonMap(),
                    operators: new taquito_1.MichelsonMap(),
                    ledger: new taquito_1.MichelsonMap(),
                    metadata: metadata,
                },
                gasLimit: ga?.gasLimit,
            });
            await tx.confirmation();
            return tx.contractAddress ?? (0, ton_1.raise)("No contract address found");
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
            const bridgeInstance = await Tezos.contract.at(bridge);
            Tezos.setSignerProvider(signer);
            const tx = await bridgeInstance.methodsObject
                .claim_nft({
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
            })
                .send({
                ...extraArgs,
                amount: data.fee.toNumber(),
                mutez: true,
                fee: data.fee.toNumber(),
            });
            return {
                hash: () => tx.hash,
                ret: tx,
            };
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, extraArgs) {
            Tezos.setSignerProvider(signer);
            const bridgeInstance = await Tezos.contract.at(bridge);
            const tx = await bridgeInstance.methods
                .lock_nft(type_aliases_1.tas.nat(tokenId.toString()), destinationChain, to, {
                addr: type_aliases_1.tas.address(sourceNft),
            })
                .send({ ...extraArgs });
            return {
                tx,
                hash() {
                    return tx.hash;
                },
            };
        },
        async readClaimed721Event(hash) {
            const op = await (0, sdk_api_1.eventsGetContractEvents)({
                contract: {
                    eq: bridge,
                },
            });
            const claimData = op.find((e) => e.timestamp === hash);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdGV6b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQTBDO0FBRTFDLDRDQUFtRTtBQUNuRSwyQ0FBd0Q7QUFFeEQsMENBTXdCO0FBR3hCLDBFQUE4RTtBQUU5RSw4Q0FBZ0Q7QUFDaEQsa0RBQTBCO0FBQzFCLGtFQUE4RDtBQUM5RCxnQ0FBK0I7QUFHL0IsU0FBZ0IsWUFBWSxDQUFDLEVBQzNCLEtBQUssRUFDTCxNQUFNLEVBQ04sT0FBTyxHQUNNO0lBQ2IsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxFQUFFLFFBQWdCLEVBQUUsT0FBZSxFQUFFLEVBQUU7UUFDdEUsTUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBa0IsUUFBUSxDQUFDLENBQUM7UUFFdkUsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUMxQixNQUFNLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FDNUIsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLGtCQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkQsT0FBTyxJQUFBLG1CQUFVLEVBQUMsYUFBYSxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDO0lBQ0YsT0FBTztRQUNMLGtCQUFrQjtZQUNoQixPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBQ0QsV0FBVztZQUNULE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNELFNBQVMsQ0FBQyxLQUFLO1lBQ2IsT0FBTztnQkFDTCxZQUFZLEVBQUUsa0JBQUcsQ0FBQyxPQUFP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