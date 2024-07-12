import { EventLog, Signer, ethers } from "ethers";
import { ContractProxy__factory } from "../../contractsTypes/Hedera/ContractProxy__factory";
import { HederaBridge__factory } from "../../contractsTypes/Hedera/HederaBridge__factory";
import { IHRC__factory } from "../../contractsTypes/Hedera/IHRC__factory";
import {
  Bridge__factory,
  ERC721Royalty__factory,
} from "../../contractsTypes/evm";
import { evmHandler } from "../evm";
import { raise } from "../ton";
import { THederaHandler, THederaParams } from "./types";

export function hederaHandler({
  provider,
  royaltySalePrice,
  royaltyProxy,
  storage,
  identifier,
  bridge,
}: THederaParams): THederaHandler {
  const proxy = ContractProxy__factory.connect(royaltyProxy, provider);
  const web3Helper = evmHandler({
    provider,
    bridge,
    royaltySalePrice,
    storage,
    identifier,
  });
  let hsdk: typeof import("@hashgraph/sdk") | undefined = undefined;
  return {
    injectSDK(sdk) {
      hsdk = sdk;
    },
    async mintNft(signer, mintArgs, extraArgs) {
      const ihrc = IHRC__factory.connect(mintArgs.contract, signer);
      await ihrc.associate();
      const mint = await proxy
        .connect(signer)
        .mint(mintArgs.contract, mintArgs.uri, {
          value: ethers.parseEther("10"),
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
      if (!receipt) raise("Transaction not found");
      const intf = HederaBridge__factory.createInterface();
      const log = receipt.logs.find((e) =>
        e.topics.includes(intf.getEvent("Claimed").topicHash),
      );
      if (!log) raise("Log not found");
      const claimed = intf.parseLog({
        data: log.data,
        topics: log.topics as string[],
      });
      if (!claimed) raise("Failed to parse Log");
      return {
        nft_contract: claimed.args.nftContract,
        source_chain: claimed.args.sourceChain,
        token_id: claimed.args.emittedTokenId,
        transaction_hash: claimed.args.transactionHash,
      };
    },
    async claimNft(wallet, claimData, sigs, extraArgs) {
      if (!isEvmSigner(wallet)) {
        if (!hsdk) throw new Error("HSDK Not Injected");
        // throw new Error("unimplemented");
        const tx = await new hsdk.ContractExecuteTransaction()
          .setContractId(hsdk.ContractId.fromString(bridge))
          .setGas(1_500_000)
          .setFunction(
            "claimNFT721",
            new hsdk.ContractFunctionParameters().addStringArray(
              sigs.map((e) => e.signature),
            ),
          )
          .freezeWithSigner(wallet);

        const response = await tx.executeWithSigner(wallet);

        return {
          ret: response,
          hash() {
            return response.transactionHash.toString();
          },
        };
      }
      const contract = Bridge__factory.connect(bridge, wallet);
      const ret = await contract.claimNFT721(
        claimData,
        sigs.map((e) => e.signature),
        {
          value: BigInt(claimData.fee) * BigInt(1e10),
          ...extraArgs,
        },
      );
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
      return ERC721Royalty__factory.connect(contract, signer).approve(
        bridge,
        tid,
        {
          ...extra,
        },
      );
    },
    async deployCollection(signer, da, ga) {
      const rif = proxy.connect(signer);
      const deploy = await rif.deployNft(da.name, da.symbol, {
        ...ga,
        value: ethers.parseEther("10"),
      });
      const receipt = await deploy.wait();
      const ev = receipt?.logs.find((e) => {
        if (e instanceof EventLog) {
          const a = e.eventName === "NftCollectionCreated";
          return a;
        }
        return false;
      });
      const address = (ev as EventLog).args[0];
      return address;
    },
    async lockNft(signer, sourceNft, destinationChain, to, tokenId, extraArgs) {
      if (!isEvmSigner(signer)) {
        throw new Error("unimplemented");
      }
      const contract = Bridge__factory.connect(bridge, signer);
      const tx = await contract.lock721(
        tokenId.toString(),
        destinationChain,
        to,
        sourceNft,
        {
          ...extraArgs,
        },
      );
      return {
        ret: tx,
        hash() {
          return tx.hash;
        },
      };
    },
    async nftData(tokenId, contract, overrides) {
      const nft = ERC721Royalty__factory.connect(contract, provider);

      const name = await retryFn(
        () => nft.name({ ...overrides }),
        `Trying to fetch name() for ${contract}`,
      );

      const symbol = await retryFn(
        () => nft.symbol(),
        `Trying to fetch symbol() for ${contract}`,
      );
      const rif = ContractProxy__factory.connect(royaltyProxy, provider);

      const tokenInfo = await retryFn(
        () => rif.royaltyInfo.staticCall(tokenId, royaltySalePrice),
        `Trying to fetch royaltyInfo() for ${contract}`,
      );

      const metadata = await retryFn(
        () => nft.tokenURI(tokenId),
        `Trying to fetch tokenURI() for ${contract}`,
      );

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

const retryFn = async <T>(
  func: () => Promise<T>,
  ctx: string,
  retries = 3,
): Promise<T | undefined> => {
  if (retries === 0) {
    return undefined;
  }
  try {
    return await func();
  } catch (e) {
    return await retryFn(func, ctx, retries - 1);
  }
};

export function isEvmSigner(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  signer: any,
): signer is Signer {
  return !("accountToSign" in signer);
}
