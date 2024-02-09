"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStrOrAddr = exports.tezosHandler = void 0;
const blake2b_1 = require("@stablelib/blake2b");
const tzip16_1 = require("@taquito/tzip16");
const sdk_api_1 = require("@tzkt/sdk-api");
const utils_1 = require("@taquito/utils");
const type_aliases_1 = require("../contractsTypes/tezosContractTypes/type-aliases");
const ton_1 = require("./ton");
function tezosHandler({ Tezos, bridge, storage, }) {
    const getNftTokenMetaData = async (contract, tokenId) => {
        const nftContract = await Tezos.contract.at(contract);
        const tokenMetaData = await (await nftContract.storage()).token_metadata.get(type_aliases_1.tas.nat(tokenId.toString()));
        const metaDataInHex = tokenMetaData.token_info.get("");
        return (0, tzip16_1.bytes2Char)(metaDataInHex);
    };
    return {
        async getBalance(signer, _) {
            return BigInt((await Tezos.tz.getBalance(await signer.publicKeyHash())).toString());
        },
        async approveNft(signer, tokenId, contract, extraArgs) {
            const nftContract = await Tezos.contract.at(contract);
            const tx = await nftContract.methods
                .add_operator((await signer.publicKeyHash()), bridge, type_aliases_1.tas.nat(tokenId.toString()))
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
        async claimNft(signer, data, extraArgs, sigs) {
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
                    const addr = type_aliases_1.tas.address((0, utils_1.b58cencode)((0, blake2b_1.hash)(new Uint8Array((0, utils_1.b58cdecode)(e.signer, utils_1.prefix.edpk)), 20), utils_1.prefix.tz1));
                    return {
                        addr,
                        sig: type_aliases_1.tas.signature(Buffer.from(e.signature.replace("0x", ""), "hex").toString()),
                        signer: type_aliases_1.tas.key(e.signer),
                    };
                }),
            })
                .send({
                ...extraArgs,
                amount: data.fee.toNumber(),
                mutez: true,
                fee: data.fee.toNumber(),
            });
            return tx;
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, extraArgs) {
            Tezos.setSignerProvider(signer);
            const bridgeInstance = await Tezos.contract.at(bridge);
            const tx = await bridgeInstance.methods
                .lock_nft(type_aliases_1.tas.nat(tokenId.toString()), destinationChain, to, {
                addr: type_aliases_1.tas.address(sourceNft),
            })
                .send({ ...extraArgs });
            return tx;
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
                    const metaData = await fetch(tokenMd).then((res) => res.json());
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
                    metaData = await fetch(metaDataOrURL).then((res) => res.json());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV6b3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFuZGxlcnMvdGV6b3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0RBQTBDO0FBTzFDLDRDQUFtRTtBQUNuRSwyQ0FBd0Q7QUFFeEQsMENBS3dCO0FBR3hCLG9GQUsyRDtBQUUzRCwrQkFBOEI7QUFnQzlCLFNBQWdCLFlBQVksQ0FBQyxFQUMzQixLQUFLLEVBQ0wsTUFBTSxFQUNOLE9BQU8sR0FDSztJQUNaLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxFQUFFLFFBQWdCLEVBQUUsT0FBZSxFQUFFLEVBQUU7UUFDdEUsTUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBa0IsUUFBUSxDQUFDLENBQUM7UUFFdkUsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUMxQixNQUFNLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FDNUIsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLGtCQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkQsT0FBTyxJQUFBLG1CQUFVLEVBQUMsYUFBYSxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDO0lBQ0YsT0FBTztRQUNMLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEIsT0FBTyxNQUFNLENBQ1gsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FDckUsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVM7WUFDbkQsTUFB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