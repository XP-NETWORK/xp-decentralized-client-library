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
            console.log("INJECTED", sdk);
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
                const accountUpdateTx = await new hsdk.AccountUpdateTransaction()
                    .setAccountId(wallet.getAccountId())
                    .setMaxAutomaticTokenAssociations(1)
                    .freezeWithSigner(wallet);
                const txResponse = await accountUpdateTx.executeWithSigner(wallet);
                const res = await txResponse.getReceiptWithSigner(wallet);
                if (res.status.toString() !== "SUCCESS") {
                    throw new Error(`Error·in·token·association:·${res.status.toString()}`);
                }
                await new Promise((r) => setTimeout(r, 5000));
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
                    .setGas(15000000)
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
    return !("hederaClient" || "hashconnect" in signer);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaGVkZXJhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUErQztBQUMvQyxtQ0FBa0Q7QUFDbEQsK0ZBQTRGO0FBQzVGLDZGQUEwRjtBQUMxRiw2RUFBMEU7QUFDMUUsa0RBSWtDO0FBQ2xDLGdDQUFvQztBQUNwQyxnQ0FBK0I7QUFHL0IsTUFBTSxZQUFZLEdBQUcsSUFBSSxlQUFTLENBQUMsNkNBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFOUQsU0FBZ0IsYUFBYSxDQUFDLEVBQzVCLFFBQVEsRUFDUixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLE9BQU8sRUFDUCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGdCQUFnQixHQUNGO0lBQ2QsTUFBTSxLQUFLLEdBQUcsK0NBQXNCLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRSxNQUFNLFVBQVUsR0FBRyxJQUFBLGdCQUFVLEVBQUM7UUFDNUIsUUFBUTtRQUNSLE1BQU07UUFDTixnQkFBZ0I7UUFDaEIsT0FBTztRQUNQLFVBQVU7S0FDWCxDQUFDLENBQUM7SUFDSCxJQUFJLElBQUksR0FBZ0QsU0FBUyxDQUFDO0lBQ2xFLE9BQU87UUFDTCxTQUFTLENBQUMsR0FBRztZQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLElBQUksR0FBRyxHQUFHLENBQUM7UUFDYixDQUFDO1FBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVM7WUFDdkMsTUFBTSxJQUFJLEdBQUcsNkJBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5RCxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QixNQUFNLElBQUksR0FBRyxN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