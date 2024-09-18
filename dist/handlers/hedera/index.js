"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEvmSigner = exports.hederaHandler = void 0;
const abi_1 = require("@ethersproject/abi");
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const ContractProxy__factory_1 = require("../../contractsTypes/Hedera/ContractProxy__factory");
const HederaBridge__factory_1 = require("../../contractsTypes/Hedera/HederaBridge__factory");
const IHRC__factory_1 = require("../../contractsTypes/Hedera/IHRC__factory");
const evm_1 = require("../../contractsTypes/evm");
const evm_2 = require("../evm");
const ton_1 = require("../ton");
const abiInterface = new abi_1.Interface(HederaBridge__factory_1.HederaBridge__factory.abi);
function hederaHandler({ provider, royaltySalePrice, royaltyProxy, storage, identifier, bridge, bridgeContractId, mirrorNodeApi, }) {
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
        identifier,
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
        decodeLockedEvent: web3Helper.decodeLockedEvent,
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
                lock_tx_chain: claimed.args.lockTxChain,
            };
        },
        async associateTokens(wallet) {
            if (!isEvmSigner(wallet)) {
                if (!hsdk)
                    throw new Error("HSDK Not Injected");
                let autoAssociatedTokenCount = 0;
                try {
                    autoAssociatedTokenCount = (await axios_1.default.get(`${mirrorNodeApi}/v1/accounts/${wallet
                        .getAccountId()
                        .toString()}`)).data.max_automatic_token_associations;
                }
                catch (ex) {
                    console.log("Error fetching associated token accounts", ex);
                }
                console.log("autoAssociatedTokenCount", autoAssociatedTokenCount + 1);
                const accountUpdateTx = await new hsdk.AccountUpdateTransaction()
                    .setAccountId(wallet.getAccountId())
                    .setMaxAutomaticTokenAssociations(autoAssociatedTokenCount + 1)
                    .freezeWithSigner(wallet);
                const txResponse = await accountUpdateTx.executeWithSigner(wallet);
                const res = await txResponse.getReceiptWithSigner(wallet);
                if (res.status.toString() !== "SUCCESS") {
                    throw new Error(`Error·in·token·association:·${res.status.toString()}`);
                }
                return res;
            }
            throw new Error("unimplemented");
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
                const costOfTokenCreation = hsdk.Hbar.fromString("50", hsdk.HbarUnit.Hbar).toBigNumber();
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
        async deployNftCollection(signer, da, ga) {
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
        async lockNft(signer, sourceNft, destinationChain, to, tokenId, metaDataUri, extraArgs) {
            if (!isEvmSigner(signer)) {
                if (!hsdk)
                    throw new Error("HSDK Not Injected");
                const functionCallAsUint8Array = encodeFunctionParameters("lock721", [
                    tokenId.toString(),
                    destinationChain,
                    to,
                    sourceNft,
                    metaDataUri,
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
            const tx = await contract.lock721(tokenId.toString(), destinationChain, to, sourceNft, metaDataUri, {
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
    return !("hederaClient" in signer || "hashconnect" in signer);
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
        lockTxChain: data.lockTxChain,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaGVkZXJhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDRDQUErQztBQUMvQyxrREFBMEI7QUFDMUIsbUNBQWtEO0FBQ2xELCtGQUE0RjtBQUM1Riw2RkFBMEY7QUFDMUYsNkVBQTBFO0FBQzFFLGtEQUlrQztBQUNsQyxnQ0FBb0M7QUFDcEMsZ0NBQStCO0FBRy9CLE1BQU0sWUFBWSxHQUFHLElBQUksZUFBUyxDQUFDLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRTlELFNBQWdCLGFBQWEsQ0FBQyxFQUM1QixRQUFRLEVBQ1IsZ0JBQWdCLEVBQ2hCLFlBQVksRUFDWixPQUFPLEVBQ1AsVUFBVSxFQUNWLE1BQU0sRUFDTixnQkFBZ0IsRUFDaEIsYUFBYSxHQUNDO0lBQ2QsTUFBTSxLQUFLLEdBQUcsK0NBQXNCLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRSxNQUFNLFVBQVUsR0FBRyxJQUFBLGdCQUFVLEVBQUM7UUFDNUIsUUFBUTtRQUNSLE1BQU07UUFDTixnQkFBZ0I7UUFDaEIsT0FBTztRQUNQLFVBQVU7S0FDWCxDQUFDLENBQUM7SUFDSCxJQUFJLElBQUksR0FBZ0QsU0FBUyxDQUFDO0lBQ2xFLE9BQU87UUFDTCxVQUFVO1FBQ1YsU0FBUyxDQUFDLEdBQUc7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM3QixJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTO1lBQ3ZDLE1BQU0sSUFBSSxHQUFHLDZCQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDOUQsTUFBTSxJQUFJLENBQUMs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