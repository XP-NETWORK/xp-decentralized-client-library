import { JsonRpcProvider, Wallet } from "ethers";
import { ChainFactory, ChainFactoryConfigs } from "./factory";

(async () => {
  const fc = ChainFactory(ChainFactoryConfigs.TestNet());
  const terra = await fc.inner("TERRA");

  let storage = terra.getStorageContract();

  const wallet = new Wallet(
    "0x0e979ae1299df55645e68808754c93c067e35834195c420945d062858bea2965",
    new JsonRpcProvider("https://sepolia.optimism.io"),
  );

  storage = storage.connect(wallet);

  //   const fee = await storage.changeChainFee("TERRA", 10000);
  //   console.log(`Set chain fee for terra at ${fee.hash}`);
  const royalty = await storage.changeChainRoyaltyReceiver(
    "TERRA",
    "terra196dcgy98spe3v6pwv0j6sf09lc7cv0ucdt5hdf",
  );
  console.log(`Set chain royalty receiver for terra at ${royalty.hash}`);
})();
