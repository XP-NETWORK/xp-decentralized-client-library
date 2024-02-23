"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStrOrAddr = exports.tezosHandler = void 0;
const blake2b_1 = require("@stablelib/blake2b");
const tzip16_1 = require("@taquito/tzip16");
const sdk_api_1 = require("@tzkt/sdk-api");
const utils_1 = require("@taquito/utils");
const type_aliases_1 = require("../../contractsTypes/tezos/type-aliases");
const ton_1 = require("../ton");
function tezosHandler({ Tezos, bridge, storage, }) {
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
        async mintNft(signer, ma) {
            Tezos.setSignerProvider(signer);
            const contract = await Tezos.contract.at(ma.contract);
            const tx = contract.methods
                .mint([
                {
                    amt: type_aliases_1.tas.nat(1),
                    to: type_aliases_1.tas.address(await signer.publicKeyHash()),
                    token_id: type_aliases_1.tas.nat(ma.tokenId),
                    token_uri: ma.uri,
                },
            ])
                .send();
            return tx;
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
            return {
                tx,
                hash() {
                    return tx.hash;
                },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvdGV6b3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0RBQTBDO0FBRTFDLDRDQUFtRTtBQUNuRSwyQ0FBd0Q7QUFFeEQsMENBS3dCO0FBR3hCLDBFQUF1RTtBQUV2RSxnQ0FBK0I7QUFHL0IsU0FBZ0IsWUFBWSxDQUFDLEVBQzNCLEtBQUssRUFDTCxNQUFNLEVBQ04sT0FBTyxHQUNNO0lBQ2IsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLEVBQUUsUUFBZ0IsRUFBRSxPQUFlLEVBQUUsRUFBRTtRQUN0RSxNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFrQixRQUFRLENBQUMsQ0FBQztRQUV2RSxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQzFCLE1BQU0sV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUM1QixDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsa0JBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2RCxPQUFPLElBQUEsbUJBQVUsRUFBQyxhQUFhLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUM7SUFDRixPQUFPO1FBQ0wsa0JBQWtCO1lBQ2hCLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0QsU0FBUyxDQUFDLEtBQUs7WUFDYixPQUFPO2dCQUNMLFlBQVksRUFBRSxrQkFBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUM7Z0JBQ3ZELFVBQVUsRUFBRSxLQUFLLENBQUMsZ0JBQWdCO2dCQUNsQyxHQUFHLEVBQUUsa0JBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDekIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO2dCQUN4QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdkIsT0FBTyxFQUFFLGtCQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQy9CLGdCQUFnQixFQUFFLGtCQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7Z0JBQ3BELFlBQVksRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDL0IsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLHdCQUF3QjtnQkFDM0QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO2dCQUNwQixZQUFZLEVBQUUsa0JBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztnQkFDeEMsUUFBUSxFQUFFLGtCQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQ2hDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxlQUFlO2FBQ3hDLENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN4QixPQUFPLE1BQU0sQ0FDWCxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUNyRSxDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxpQkFBaUI7WUFDckIsTUFBTSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBcUIsTUFBTSxDQUFDLENBQUM7WUFDL0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkMsT0FBTyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0MsQ0FBQztRQUNELEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUztZQUNuRCxNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFrQixRQUFRLENBQUMsQ0FBQztZQUN2RSxNQUFNLEVBQUUsR0FBRyxNQUFNLFdBQVcsQ0FBQyxPQUFPO2lCQUNqQyxZQUFZLENBQ1gsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBWSxFQUN6QyxNQUFpQixFQUNqQixrQkFBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FDNUI7aUJBQ0EsSUFBSSxDQUFDLEVBQUUsR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQzFCLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUNELEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTTtZQUN2QixNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsaUNBQXVCLEVBQUM7Z0JBQ3ZDLFFBQVEsRUFBRTtvQkFDUixFQUFFLEVBQUUsTUFBTTtpQkFDWDthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssTUFBTSxDQUFDLENBQUM7WUFFekQsTUFBTSxJQUFJLEdBQUcsU0FBUyxFQUFFLE9BQU8sSUFBSSxJQUFBLFdBQUssRUFBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sd0JBQXdCLEdBQUcsSUFBQSx3QkFBZ0IsRUFDL0MsSUFBSSxDQUFDLGtCQUFrQixDQUN4QixDQUFDO1lBQ0YsTUFBTSxFQUNKLFFBQVEsRUFBRSxPQUFPLEVBQUUsaUNBQWlDO1lBQ3BELFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSw4Q0FBOEM7WUFDNUUsWUFBWSxFQUFFLHNCQUFzQixFQUFFLDBDQUEwQztZQUNoRixZQUFZLEVBQUUsV0FBVyxFQUFFLG9EQUFvRDtZQUMvRSxRQUFRLEVBQUUsT0FBTyxFQUFFLG9DQUFvQztZQUN2RCxZQUFZLEVBQUUsV0FBVyxFQUFFLHNCQUFzQjtZQUNqRCxnQkFBZ0IsRUFBRSxlQUFlLEdBQ2xDLEdBQUcsSUFBSSxDQUFDO1lBQ1QsTUFBTSxHQUFHLEdBQUcsTUFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDckQsTUFBTSxlQUFlLEdBQUcsTUFBTSxPQUFPLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDckUsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0RSxPQUFPO2dCQUNMLE9BQU87Z0JBQ1AsZ0JBQWdCO2dCQUNoQixzQkFBc0I7Z0JBQ3RCLFdBQVc7Z0JBQ1gsT0FBTztnQkFDUCxXQUFXO2dCQUNYLGVBQWU7Z0JBQ2Ysd0JBQXdCO2dCQUN4QixHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRTtnQkFDbkIsZUFBZTtnQkFDZixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO2dCQUNsQixPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7Z0JBQy9CLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUTthQUN2QixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDdEIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQWtCLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2RSxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsT0FBTztpQkFDeEIsSUFBSSxDQUFDO2dCQUNKO29CQUNFLEdBQUcsRUFBRSxrQkFBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsRUFBRSxFQUFFLGtCQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUM3QyxRQUFRLEVBQUUsa0JBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQztvQkFDN0IsU0FBUyxFQUFFLEVBQUUsQ0FBQyxHQUFHO2lCQUNsQjthQUNGLENBQUM7aUJBQ0QsSUFBSSxFQUFFLENBQUM7WUFDVixPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFDRCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUk7WUFDMUMsTUFBTSxXQUFXLEdBQ2YsSUFBQSx1QkFBZSxFQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUxRCxNQUFNLHdCQUF3QixHQUFHLFdBQVc7Z0JBQzFDLENBQUMsQ0FBQztvQkFDRSxJQUFJLEVBQUUsa0JBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDO2lCQUNwRDtnQkFDSCxDQUFDLENBQUM7b0JBQ0UsR0FBRyxFQUFFLElBQUksQ0FBQywyQkFBMkI7aUJBQ3RDLENBQUM7WUFDTixNQUFNLGNBQWMsR0FBRyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVoQyxNQUFNLEVBQUUsR0FBRyxNQUFNLGNBQWMsQ0FBQyxhQUFhO2lCQUMxQyxTQUFTLENBQUM7Z0JBQ1QsNkRBQTZEO2dCQUM3RCxZQUFZO2dCQUNaLElBQUksRUFBRTtvQkFDSixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7b0JBQy9CLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtvQkFDM0IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO29CQUNiLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO29CQUNyQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO29CQUN2QyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7b0JBQy9CLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtvQkFDbkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO29CQUMvQixRQUFRLEVBQUUsa0JBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDaEMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtvQkFDdkMsMkJBQTJCLEVBQUUsd0JBQXdCO2lCQUN0RDtnQkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNuQixNQUFNLElBQUksR0FBRyxrQkFBRyxDQUFDLE9BQU8sQ0FDdEIsSUFBQSxrQkFBVSxFQUNSLElBQUEsY0FBSSxFQUFDLElBQUksVUFBVSxDQUFDLElBQUEsa0JBQVUsRUFBQyxDQUFDLENBQUMsTUFBTSxFQUFFLGNBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUMzRCxjQUFNLENBQUMsR0FBRyxDQUNYLENBQ0YsQ0FBQztvQkFDRixPQUFPO3dCQUNMLElBQUk7d0JBQ0osR0FBRyxFQUFFLGtCQUFHLENBQUMsU0FBUyxDQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FDN0Q7d0JBQ0QsTUFBTSxFQUFFLGtCQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7cUJBQzFCLENBQUM7Z0JBQ0osQ0FBQyxDQUFDO2FBQ0gsQ0FBQztpQkFDRCxJQUFJLENBQUM7Z0JBQ0osR0FBRyxTQUFTO2dCQUNaLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRTtnQkFDM0IsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO2FBQ3pCLENBQUMsQ0FBQztZQUNMLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVM7WUFDdkUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sY0FBYyxHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsTUFBTSxFQUFFLEdBQUcsTUFBTSxjQUFjLENBQUMsT0FBTztpQkFDcEMsUUFBUSxDQUFDLGtCQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsRUFBRTtnQkFDM0QsSUFBSSxFQUFFLGtCQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUM3QixDQUFDO2lCQUNELElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUUxQixPQUFPO2dCQUNMLEVBQUU7Z0JBQ0YsSUFBSTtvQkFDRixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLENBQUM7YUFDRixDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVE7WUFDN0IsTUFBTSxPQUFPLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckUsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDO1lBQ3BCLElBQUksQ0FBQztnQkFDSCxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUkscUJBQVksRUFBRSxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sV0FBVyxHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLGVBQU0sQ0FBQyxDQUFDO2dCQUM5RCxNQUFNLEVBQUUsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2hDLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDO1lBQzNDLENBQUM7WUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUMxQyxDQUFDO1lBQ0QsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLElBQUksQ0FBQztnQkFDSCxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25DLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ1YsTUFBTSxRQUFRLEdBQXdCLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDN0QsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FDcEIsQ0FBQztvQkFDRixNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUM7Z0JBQ3JDLENBQUM7Z0JBQ0QsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQztZQUNoRCxDQUFDO1lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFDRCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDO2dCQUNILE1BQU0sYUFBYSxHQUFHLE1BQU0sbUJBQW1CLENBQzdDLFFBQVEsRUFDUixNQUFNLENBQUMsT0FBTyxDQUFDLENBQ2hCLENBQUM7Z0JBQ0YsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLFFBT0gsQ0FBQztnQkFFRixJQUFJLEtBQUssRUFBRSxDQUFDO29CQUNWLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUNsRSxDQUFDO3FCQUFNLENBQUM7b0JBQ04sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7Z0JBQ0QsTUFBTSx1QkFBdUIsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDNUQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUMzQixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUMxQyxDQUFDO2dCQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUNwRCxDQUFDO1lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUNELE9BQU87Z0JBQ0wsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLElBQUk7Z0JBQ0osTUFBTTtnQkFDTixPQUFPO2FBQ1IsQ0FBQztRQUNKLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQTVQRCxvQ0E0UEM7QUFFRCxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQVcsRUFBVyxFQUFFO0lBQzNDLElBQUksQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNYLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVLLE1BQU0sZ0JBQWdCLEdBQUcsQ0FDOUIsSUFBd0MsRUFDaEMsRUFBRTtJQUNWLElBQUksS0FBSyxJQUFJLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbkMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ25CLENBQUMsQ0FBQztBQUxXLFFBQUEsZ0JBQWdCLG9CQUszQiJ9