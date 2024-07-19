"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEvmSigner = exports.hederaHandler = void 0;
const abi_1 = require("@ethersproject/abi");
const ethers_1 = require("ethers");
const ContractProxy__factory_1 = require("../../contractsTypes/Hedera/ContractProxy__factory");
const HederaBridge__factory_1 = require("../../contractsTypes/Hedera/HederaBridge__factory");
const IHRC__factory_1 = require("../../contractsTypes/Hedera/IHRC__factory");
const evm_1 = require("../../contractsTypes/evm");
const evm_2 = require("../evm");
const ton_1 = require("../ton");
const abiInterface = new abi_1.Interface(HederaBridge__factory_1.HederaBridge__factory.abi);
function hederaHandler({ provider, royaltySalePrice, royaltyProxy, storage, identifier, bridge, bridgeContractId, }) {
    const proxy = ContractProxy__factory_1.ContractProxy__factory.connect(royaltyProxy, provider);
    const web3Helper = (0, evm_2.evmHandler)({
        provider,
        bridge,
        royaltySalePrice,
        storage,
        identifier,
    });
    let hsdk = undefined;
    return {
        injectSDK(sdk) {
            console.log("INJECTED");
            hsdk = sdk;
        },
        async mintNft(signer, mintArgs, extraArgs) {
            const ihrc = IHRC__factory_1.IHRC__factory.connect(mintArgs.contract, signer);
            await ihrc.associate();
            const mint = await proxy
                .connect(signer)
                .mint(mintArgs.contract, mintArgs.uri, {
                value: ethers_1.ethers.parseEther("10"),
                gasLimit: 15000000,
                ...extraArgs,
            });
            console.log(mint);
            return mint;
        },
        getClaimData: web3Helper.getClaimData,
        getProvider: web3Helper.getProvider,
        transform: web3Helper.transform,
        getValidatorCount: web3Helper.getValidatorCount,
        getStorageContract: web3Helper.getStorageContract,
        async readClaimed721Event(hash) {
            const receipt = await provider.getTransactionReceipt(hash);
            if (!receipt)
                (0, ton_1.raise)("Transaction not found");
            const intf = HederaBridge__factory_1.HederaBridge__factory.createInterface();
            const log = receipt.logs.find((e) => e.topics.includes(intf.getEvent("Claimed").topicHash));
            if (!log)
                (0, ton_1.raise)("Log not found");
            const claimed = intf.parseLog({
                data: log.data,
                topics: log.topics,
            });
            if (!claimed)
                (0, ton_1.raise)("Failed to parse Log");
            return {
                nft_contract: claimed.args.nftContract,
                source_chain: claimed.args.sourceChain,
                token_id: claimed.args.emittedTokenId,
                transaction_hash: claimed.args.transactionHash,
            };
        },
        async claimNft(wallet, claimData, sigs, extraArgs) {
            if (!isEvmSigner(wallet)) {
                if (!hsdk)
                    throw new Error("HSDK Not Injected");
                const paramClaimData = [];
                const data = orderClaimData(claimData);
                Object.keys(data).map((key) => {
                    paramClaimData.push(data[key].toString());
                });
                const functionCallAsUint8Array = encodeFunctionParameters("claimNFT721", [paramClaimData, sigs.map((e) => e.signature)]);
                const fee = hsdk.Hbar.fromTinybars(claimData.fee.toString()).toBigNumber();
                const costOfTokenCreation = hsdk.Hbar.fromString("20", hsdk.HbarUnit.Hbar).toBigNumber();
                const tx = await new hsdk.ContractExecuteTransaction()
                    .setContractId(hsdk.ContractId.fromString(bridgeContractId))
                    .setGas(5000000)
                    .setPayableAmount(fee.plus(costOfTokenCreation))
                    .setFunctionParameters(functionCallAsUint8Array)
                    .freezeWithSigner(wallet);
                const response = await tx.executeWithSigner(wallet);
                const receipt = await response.getReceiptWithSigner(wallet);
                if (receipt.status.toString() !== "SUCCESS") {
                    throw new Error(receipt.status.toString());
                }
                return {
                    ret: response.toJSON(),
                    hash() {
                        return response.toJSON().transactionHash;
                    },
                };
            }
            const contract = evm_1.Bridge__factory.connect(bridge, wallet);
            const ret = await contract.claimNFT721(claimData, sigs.map((e) => e.signature), {
                value: BigInt(claimData.fee) * BigInt(1e10) + BigInt(20e18),
                ...extraArgs,
            });
            return {
                ret: ret,
                hash: () => ret.hash,
            };
        },
        getBalance(signer) {
            if (!isEvmSigner(signer)) {
                throw new Error("unimplemented");
            }
            return provider.getBalance(signer);
        },
        async approveNft(signer, tid, contract, extra) {
            if (!isEvmSigner(signer)) {
                // throw new Error("unimplemented");
                if (!hsdk)
                    throw new Error("HSDK Not Injected");
                console.log("hedera approve", tid, contract);
                const transaction = await new hsdk.ContractExecuteTransaction()
                    .setContractId(hsdk.ContractId.fromEvmAddress(0, 0, contract))
                    .setGas(1000000)
                    .setMaxTransactionFee(new hsdk.Hbar(10))
                    //.setPayableAmount(new hashSDK.Hbar(5))
                    .setFunction("approve", new hsdk.ContractFunctionParameters()
                    .addAddress(bridge)
                    .addUint256(Number(tid)))
                    .freezeWithSigner(signer);
                const response = await transaction.executeWithSigner(signer);
                const receipt = await response.getReceiptWithSigner(signer);
                if (receipt.status.toString() !== "SUCCESS") {
                    throw new Error(receipt.status.toString());
                }
                return response.toJSON();
            }
            return evm_1.ERC721Royalty__factory.connect(contract, signer).approve(bridge, tid, {
                ...extra,
            });
        },
        async deployCollection(signer, da, ga) {
            const rif = proxy.connect(signer);
            const deploy = await rif.deployNft(da.name, da.symbol, {
                ...ga,
                value: ethers_1.ethers.parseEther("10"),
            });
            const receipt = await deploy.wait();
            const ev = receipt?.logs.find((e) => {
                if (e instanceof ethers_1.EventLog) {
                    const a = e.eventName === "NftCollectionCreated";
                    return a;
                }
                return false;
            });
            const address = ev.args[0];
            return address;
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, extraArgs) {
            if (!isEvmSigner(signer)) {
                if (!hsdk)
                    throw new Error("HSDK Not Injected");
                const functionCallAsUint8Array = encodeFunctionParameters("lock721", [
                    tokenId.toString(),
                    destinationChain,
                    to,
                    sourceNft,
                ]);
                const tx = await new hsdk.ContractExecuteTransaction()
                    .setContractId(hsdk.ContractId.fromString(bridgeContractId))
                    .setGas(5000000)
                    .setFunctionParameters(functionCallAsUint8Array)
                    .freezeWithSigner(signer);
                const response = await tx.executeWithSigner(signer);
                const receipt = await response.getReceiptWithSigner(signer);
                if (receipt.status.toString() !== "SUCCESS") {
                    throw new Error(receipt.status.toString());
                }
                return {
                    ret: response.toJSON(),
                    hash() {
                        return response.toJSON().transactionHash;
                    },
                };
            }
            const contract = evm_1.Bridge__factory.connect(bridge, signer);
            const tx = await contract.lock721(tokenId.toString(), destinationChain, to, sourceNft, {
                ...extraArgs,
            });
            return {
                ret: tx,
                hash() {
                    return tx.hash;
                },
            };
        },
        async nftData(tokenId, contract, overrides) {
            const nft = evm_1.ERC721Royalty__factory.connect(contract, provider);
            const name = await retryFn(() => nft.name({ ...overrides }), `Trying to fetch name() for ${contract}`);
            const symbol = await retryFn(() => nft.symbol(), `Trying to fetch symbol() for ${contract}`);
            const rif = ContractProxy__factory_1.ContractProxy__factory.connect(royaltyProxy, provider);
            const tokenInfo = await retryFn(() => rif.royaltyInfo.staticCall(tokenId, royaltySalePrice), `Trying to fetch royaltyInfo() for ${contract}`);
            const metadata = await retryFn(() => nft.tokenURI(tokenId), `Trying to fetch tokenURI() for ${contract}`);
            const rinfo = tokenInfo?.[1].tokenInfo[7][0];
            // If undefined, set royalty as zero.
            const royalty = rinfo?.numerator ?? 0n;
            return {
                name: name || "XP Wrapped Nft",
                symbol: symbol || "XPNFT",
                royalty: royalty,
                metadata: metadata || "",
            };
        },
    };
}
exports.hederaHandler = hederaHandler;
const retryFn = async (func, ctx, retries = 3) => {
    if (retries === 0) {
        return undefined;
    }
    try {
        return await func();
    }
    catch (e) {
        return await retryFn(func, ctx, retries - 1);
    }
};
function isEvmSigner(
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
signer) {
    return !("hederaClient" in signer);
}
exports.isEvmSigner = isEvmSigner;
const encodeFunctionParameters = (functionName, parameterArray) => {
    // build the call parameters using ethers.js
    // .slice(2) to remove leading '0x'
    const functionCallAsHexString = abiInterface
        .encodeFunctionData(functionName, parameterArray)
        .slice(2);
    // convert to a Uint8Array
    return Buffer.from(functionCallAsHexString, "hex");
};
const orderClaimData = (data) => {
    return {
        tokenId: data.tokenId,
        sourceChain: data.sourceChain,
        destinationChain: data.destinationChain,
        destinationUserAddress: data.destinationUserAddress,
        sourceNftContractAddress: data.sourceNftContractAddress,
        name: data.name,
        symbol: data.symbol,
        royalty: data.royalty,
        royaltyReceiver: data.royaltyReceiver,
        metadata: data.metadata,
        transactionHash: data.transactionHash,
        tokenAmount: data.tokenAmount,
        nftType: data.nftType,
        fee: data.fee,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaGVkZXJhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUErQztBQUMvQyxtQ0FBa0Q7QUFDbEQsK0ZBQTRGO0FBQzVGLDZGQUEwRjtBQUMxRiw2RUFBMEU7QUFDMUUsa0RBSWtDO0FBQ2xDLGdDQUFvQztBQUNwQyxnQ0FBK0I7QUFHL0IsTUFBTSxZQUFZLEdBQUcsSUFBSSxlQUFTLENBQUMsNkNBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFOUQsU0FBZ0IsYUFBYSxDQUFDLEVBQzVCLFFBQVEsRUFDUixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLE9BQU8sRUFDUCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGdCQUFnQixHQUNGO0lBQ2QsTUFBTSxLQUFLLEdBQUcsK0NBQXNCLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRSxNQUFNLFVBQVUsR0FBRyxJQUFBLGdCQUFVLEVBQUM7UUFDNUIsUUFBUTtRQUNSLE1BQU07UUFDTixnQkFBZ0I7UUFDaEIsT0FBTztRQUNQLFVBQVU7S0FDWCxDQUFDLENBQUM7SUFDSCxJQUFJLElBQUksR0FBZ0QsU0FBUyxDQUFDO0lBQ2xFLE9BQU87UUFDTCxTQUFTLENBQUMsR0FBRztZQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEIsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUztZQUN2QyxNQUFNLElBQUksR0FBRyw2QkFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzlELE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSztp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