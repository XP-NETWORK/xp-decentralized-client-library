"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const factory_1 = require("./factory");
(async () => {
    const fc = (0, factory_1.ChainFactory)(factory_1.ChainFactoryConfigs.TestNet());
    const terra = await fc.inner("TERRA");
    let storage = terra.getStorageContract();
    const wallet = new ethers_1.Wallet("0x0e979ae1299df55645e68808754c93c067e35834195c420945d062858bea2965", new ethers_1.JsonRpcProvider("https://sepolia.optimism.io"));
    storage = storage.connect(wallet);
    //   const fee = await storage.changeChainFee("TERRA", 10000);
    //   console.log(`Set chain fee for terra at ${fee.hash}`);
    const royalty = await storage.changeChainRoyaltyReceiver("TERRA", "terra196dcgy98spe3v6pwv0j6sf09lc7cv0ucdt5hdf");
    console.log(`Set chain royalty receiver for terra at ${royalty.hash}`);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWlEO0FBQ2pELHVDQUE4RDtBQUU5RCxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1YsTUFBTSxFQUFFLEdBQUcsSUFBQSxzQkFBWSxFQUFDLDZCQUFtQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDdkQsTUFBTSxLQUFLLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXRDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBRXpDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUN2QixvRUFBb0UsRUFDcEUsSUFBSSx3QkFBZSxDQUFDLDZCQUE2QixDQUFDLENBQ25ELENBQUM7SUFFRixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVsQyw4REFBOEQ7SUFDOUQsMkRBQTJEO0lBQzNELE1BQU0sT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLDBCQUEwQixDQUN0RCxPQUFPLEVBQ1AsOENBQThDLENBQy9DLENBQUM7SUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN6RSxDQUFDLENBQUMsRUFBRSxDQUFDIn0=