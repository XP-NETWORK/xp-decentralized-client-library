"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hederaHandler = void 0;
const ethers_1 = require("ethers");
const ContractProxy__factory_1 = require("../../contractsTypes/Hedera/ContractProxy__factory");
const IHRC__factory_1 = require("../../contractsTypes/Hedera/IHRC__factory");
const evm_1 = require("../../contractsTypes/evm");
const evm_2 = require("../evm");
function hederaHandler({ provider, royaltySalePrice, royaltyProxy, storage, identifier, bridge, }) {
    const proxy = ContractProxy__factory_1.ContractProxy__factory.connect(royaltyProxy, provider);
    const web3Helper = (0, evm_2.evmHandler)({
        provider,
        bridge,
        royaltySalePrice,
        storage,
        identifier,
    });
    return {
        ...web3Helper,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaGVkZXJhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUEwQztBQUMxQywrRkFBNEY7QUFDNUYsNkVBQTBFO0FBQzFFLGtEQUFrRTtBQUNsRSxnQ0FBb0M7QUFHcEMsU0FBZ0IsYUFBYSxDQUFDLEVBQzVCLFFBQVEsRUFDUixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLE9BQU8sRUFDUCxVQUFVLEVBQ1YsTUFBTSxHQUNRO0lBQ2QsTUFBTSxLQUFLLEdBQUcsK0NBQXNCLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRSxNQUFNLFVBQVUsR0FBRyxJQUFBLGdCQUFVLEVBQUM7UUFDNUIsUUFBUTtRQUNSLE1BQU07UUFDTixnQkFBZ0I7UUFDaEIsT0FBTztRQUNQLFVBQVU7S0FDWCxDQUFDLENBQUM7SUFDSCxPQUFPO1FBQ0wsR0FBRyxVQUFVO1FBQ2IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVM7WUFDdkMsTUFBTSxJQUFJLEdBQUcsNkJBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5RCxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QixNQUFNLElBQUksR0FBRyxNQUFNLEtBQUs7aUJBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUM7aUJBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRTtnQkFDckMsS0FBSyxFQUFFLGVBQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUM5QixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsR0FBRyxTQUFTO2FBQ2IsQ0FBQyxDQUFDO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNs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