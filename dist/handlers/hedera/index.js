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
function hederaHandler({ provider, royaltySalePrice, royaltyProxy, storage, identifier, bridge, }) {
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
                const tx = new hsdk.ContractExecuteTransaction()
                    .setContractId(hsdk.ContractId.fromString("0.0.4392930"))
                    .setGas(5000000)
                    .setPayableAmount(hsdk.Hbar.fromTinybars(claimData.fee.toString()).toBigNumber())
                    .setFunctionParameters(functionCallAsUint8Array)
                    .freezeWithSigner(wallet);
                const response = await (await tx).executeWithSigner(wallet);
                return {
                    ret: response,
                    hash() {
                        return response.transactionHash.toString();
                    },
                };
            }
            const contract = evm_1.Bridge__factory.connect(bridge, wallet);
            const ret = await contract.claimNFT721(claimData, sigs.map((e) => e.signature), {
                value: BigInt(claimData.fee) * BigInt(1e10),
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
                throw new Error("unimplemented");
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
                throw new Error("unimplemented");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaGVkZXJhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUErQztBQUMvQyxtQ0FBa0Q7QUFDbEQsK0ZBQTRGO0FBQzVGLDZGQUEwRjtBQUMxRiw2RUFBMEU7QUFDMUUsa0RBSWtDO0FBQ2xDLGdDQUFvQztBQUNwQyxnQ0FBK0I7QUFHL0IsTUFBTSxZQUFZLEdBQUcsSUFBSSxlQUFTLENBQUMsNkNBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFOUQsU0FBZ0IsYUFBYSxDQUFDLEVBQzVCLFFBQVEsRUFDUixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLE9BQU8sRUFDUCxVQUFVLEVBQ1YsTUFBTSxHQUNRO0lBQ2QsTUFBTSxLQUFLLEdBQUcsK0NBQXNCLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRSxNQUFNLFVBQVUsR0FBRyxJQUFBLGdCQUFVLEVBQUM7UUFDNUIsUUFBUTtRQUNSLE1BQU07UUFDTixnQkFBZ0I7UUFDaEIsT0FBTztRQUNQLFVBQVU7S0FDWCxDQUFDLENBQUM7SUFDSCxJQUFJLElBQUksR0FBZ0QsU0FBUyxDQUFDO0lBQ2xFLE9BQU87UUFDTCxTQUFTLENBQUMsR0FBRztZQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEIsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUztZQUN2QyxNQUFNLElBQUksR0FBRyw2QkFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzlELE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSztpQkFDckIsT0FBTyxD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