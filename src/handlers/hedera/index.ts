import { Interface } from "@ethersproject/abi";
import axios from "axios";
import { EventLog, Signer, ethers } from "ethers";
import { ContractProxy__factory } from "../../contractsTypes/Hedera/ContractProxy__factory";
import { HederaBridge__factory } from "../../contractsTypes/Hedera/HederaBridge__factory";
import { IHRC__factory } from "../../contractsTypes/Hedera/IHRC__factory";
import {
  Bridge,
  Bridge__factory,
  ERC721Royalty__factory,
} from "../../contractsTypes/evm";
import { evmHandler } from "../evm";
import { raise } from "../ton";
import { THederaHandler, THederaParams } from "./types";

const abiInterface = new Interface(HederaBridge__factory.abi);

export function hederaHandler({
  provider,
  royaltySalePrice,
  royaltyProxy,
  storage,
  identifier,
  bridge,
  bridgeContractId,
  mirrorNodeApi,
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
      console.log("INJECTED", sdk);
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
        lock_tx_chain: claimed.args.lockTxChain,
      };
    },
    async associateTokens(wallet) {
      if (!isEvmSigner(wallet)) {
        if (!hsdk) throw new Error("HSDK Not Injected");

        let autoAssociatedTokenCount = 0;

        try {
          autoAssociatedTokenCount = (
            await axios.get(
              `${mirrorNodeApi}/v1/accounts/${wallet
                .getAccountId()
                .toString()}`,
            )
          ).data.max_automatic_token_associations;
        } catch (ex) {
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
          throw new Error(
            `Error·in·token·association:·${res.status.toString()}`,
          );
        }

        return res;
      }
      throw new Error("unimplemented");
    },
    async claimNft(wallet, claimData, sigs, extraArgs) {
      if (!isEvmSigner(wallet)) {
        if (!hsdk) throw new Error("HSDK Not Injected");

        const paramClaimData: string[] = [];

        const data = orderClaimData(claimData);

        Object.keys(data).map((key: string) => {
          paramClaimData.push(data[key as keyof typeof data].toString());
        });

        const functionCallAsUint8Array = encodeFunctionParameters(
          "claimNFT721",
          [paramClaimData, sigs.map((e) => e.signature)],
        );

        const fee = hsdk.Hbar.fromTinybars(
          claimData.fee.toString(),
        ).toBigNumber();
        const costOfTokenCreation = hsdk.Hbar.fromString(
          "50",
          hsdk.HbarUnit.Hbar,
        ).toBigNumber();

        const tx = await new hsdk.ContractExecuteTransaction()
          .setContractId(hsdk.ContractId.fromString(bridgeContractId))
          .setGas(15_000_000)
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
      const contract = Bridge__factory.connect(bridge, wallet);
      const ret = await contract.claimNFT721(
        claimData,
        sigs.map((e) => e.signature),
        {
          value: BigInt(claimData.fee) * BigInt(1e10) + BigInt(20e18),
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
        // throw new Error("unimplemented");
        if (!hsdk) throw new Error("HSDK Not Injected");
        console.log("hedera approve", tid, contract);

        const transaction = await new hsdk.ContractExecuteTransaction()
          .setContractId(hsdk.ContractId.fromEvmAddress(0, 0, contract))
          .setGas(1_000_000)
          .setMaxTransactionFee(new hsdk.Hbar(10))
          //.setPayableAmount(new hashSDK.Hbar(5))
          .setFunction(
            "approve",
            new hsdk.ContractFunctionParameters()
              .addAddress(bridge)
              .addUint256(Number(tid)),
          )
          .freezeWithSigner(signer);

        const response = await transaction.executeWithSigner(signer);
        const receipt = await response.getReceiptWithSigner(signer);

        if (receipt.status.toString() !== "SUCCESS") {
          throw new Error(receipt.status.toString());
        }

        return response.toJSON();
      }
      return ERC721Royalty__factory.connect(contract, signer).approve(
        bridge,
        tid,
        {
          ...extra,
        },
      );
    },
    async deployNftCollection(signer, da, ga) {
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
    async lockNft(
      signer,
      sourceNft,
      destinationChain,
      to,
      tokenId,
      metaDataUri,
      extraArgs,
    ) {
      if (!isEvmSigner(signer)) {
        if (!hsdk) throw new Error("HSDK Not Injected");

        const functionCallAsUint8Array = encodeFunctionParameters("lock721", [
          tokenId.toString(),
          destinationChain,
          to,
          sourceNft,
          metaDataUri,
        ]);

        const tx = await new hsdk.ContractExecuteTransaction()
          .setContractId(hsdk.ContractId.fromString(bridgeContractId))
          .setGas(5_000_000)
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
      const contract = Bridge__factory.connect(bridge, signer);
      const tx = await contract.lock721(
        tokenId.toString(),
        destinationChain,
        to,
        sourceNft,
        metaDataUri,
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
  return !("hederaClient" in signer || "hashconnect" in signer);
}

const encodeFunctionParameters = (
  functionName: string,
  parameterArray: string[][] | string[],
) => {
  // build the call parameters using ethers.js
  // .slice(2) to remove leading '0x'
  const functionCallAsHexString = abiInterface
    .encodeFunctionData(functionName, parameterArray)
    .slice(2);
  // convert to a Uint8Array
  return Buffer.from(functionCallAsHexString, "hex");
};

const orderClaimData = (
  data: Bridge.ClaimDataStruct,
): Bridge.ClaimDataStruct => {
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
