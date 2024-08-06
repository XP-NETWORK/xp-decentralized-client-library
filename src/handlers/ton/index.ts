import { Address, Dictionary, beginCell, toNano } from "@ton/core";

import axios from "axios";
import {
  Bridge,
  SignerAndSignature,
  loadClaimedEvent,
  loadLockedEvent,
  storeLock721,
} from "../../contractsTypes/ton/tonBridge";
import { NftCollection } from "../../contractsTypes/ton/tonNftCollection";

import { NftItem } from "../../contractsTypes/ton/tonNftContract";
import { TNFTData } from "../types";
import { TestnetNftCollection } from "./nftc";
import { buildJettonContent } from "./tep64";
import { TTonHandler, TTonParams } from "./types";

export function raise(message: string): never {
  throw new Error(message);
}

export function tonHandler({
  client,
  bridgeAddress,
  storage,
  identifier,
}: TTonParams): TTonHandler {
  const http = axios.create();

  async function fetchHttpOrIpfs(uri: string) {
    const url = new URL(uri);
    if (url.protocol === "http:" || url.protocol === "https:") {
      const response = await http.get(uri);
      return response.data;
    }
    if (url.protocol === "ipfs:") {
      const response = await http.get(
        `https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`,
      );
      return response.data;
    }
    throw new Error("Unsupported protocol");
  }

  const bridge = client.open(
    Bridge.fromAddress(Address.parseFriendly(bridgeAddress).address),
  );

  async function getLastBridgeTxHashInBase64() {
    try {
      const txns = await client.getTransactions(bridge.address, { limit: 1 });
      return txns[0].hash().toString("base64");
    } catch (ex) {
      return "null";
    }
  }

  return {
    getStorageContract() {
      return storage;
    },
    getProvider() {
      return client;
    },
    getBalance(signer) {
      return client.getBalance(
        signer.address ?? raise("No Address present in signer"),
      );
    },
    async claimNft(signer, claimData, sig, _) {
      if (!signer.address) raise("No Address present in signer");
      const sigs: SignerAndSignature[] = sig.map((e) => {
        return {
          $$type: "SignerAndSignature",
          key: BigInt(`0x${e.signerAddress}`),
          signature: beginCell()
            .storeBuffer(Buffer.from(e.signature.replace("0x", ""), "hex"))
            .endCell(),
        };
      });
      let dictA = Dictionary.empty<bigint, SignerAndSignature>();
      sigs.forEach((item, index) => {
        dictA = dictA.set(BigInt(index), item);
      });
      const lastBridgeTxHash = await getLastBridgeTxHashInBase64();
      await bridge.send(
        signer,
        {
          value: claimData.data3.fee,
        },
        {
          $$type: "ClaimNFT721",
          data: claimData,
          signatures: dictA,
          len: BigInt(sigs.length),
        },
      );
      let foundTx = false;
      let hash = "";
      let retries = 0;
      while (!foundTx && retries < 20) {
        await new Promise((e) => setTimeout(e, 4000));
        const tx = (
          await client.getTransactions(bridge.address, { limit: 1 })
        )[0];
        if (tx.hash().toString("base64") === lastBridgeTxHash) {
          await new Promise((e) => setTimeout(e, 10000));
          retries++;
          continue;
        }
        hash = tx.hash().toString("base64");
        foundTx = true;
      }
      return {
        ret: undefined,
        hash() {
          return hash;
        },
      };
    },
    async readClaimed721Event(bridgeTxHash) {
      const txs = await client.getTransactions(bridge.address, {
        hash: bridgeTxHash,
        limit: 10,
      });
      if (!txs.length) raise("Transaction not found");
      for (const tx of txs) {
        const om = tx.outMessages;
        for (let i = 0; i < tx.outMessagesCount; i++) {
          const msg = om.get(i) ?? raise("Unreachable");
          if (msg.body.asSlice().loadUint(32) === 663924102) {
            const {
              newlyDeployCollection,
              tokenId,
              sourceChain,
              transactionHash,
              lockTxChain,
            } = loadClaimedEvent(msg.body.asSlice());
            return {
              nft_contract: newlyDeployCollection.toString(),
              source_chain: sourceChain,
              token_id: tokenId.toString(),
              transaction_hash: transactionHash,
              lock_tx_chain: lockTxChain,
            };
          }
        }
      }

      throw new Error("Claimed event not found");
    },
    async deployCollection(signer, da) {
      const nft = client.open(
        await TestnetNftCollection.fromInit(
          da.owner_address,
          buildJettonContent(da.collection_meta),
          da.royalty_params,
        ),
      );

      await nft.send(
        signer,
        {
          value: toNano("0.5"),
        },
        {
          $$type: "Deploy",
          queryId: 3424n,
        },
      );
      while (!(await client.isContractDeployed(nft.address))) {
        await new Promise((e) => setTimeout(e, 2000));
      }
      return nft.address.toString();
    },
    async getClaimData(txHash) {
      const txs = await client.getTransactions(bridge.address, {
        hash: txHash,
        limit: 15,
      });
      if (!txs.length) {
        throw new Error("Transaction not found");
      }
      for (const tx of txs) {
        for (let i = 0; i < tx.outMessages.size; i++) {
          const msg = tx.outMessages.get(i) ?? raise("Unreachable");
          const hash = txHash;
          if (msg.body.asSlice().loadUint(32) !== 4205190074) {
            continue;
          }
          const {
            tokenId, // Unique ID for the NFT transfer
            destinationChain, // Chain to where the NFT is being transferred
            destinationUserAddress, // User's address in the destination chain
            sourceNftContractAddress, // Address of the NFT contract in the source chain
            tokenAmount, // amount of nfts to be transfered ( 1 in 721 case )
            nftType, // Sigular or multiple ( 721 / 1155)
            sourceChain, // Source chain of NFT
          } = loadLockedEvent(msg.body.asSlice());

          const fee = await storage.chainFee(
            destinationChain.asSlice().loadStringRefTail(),
          );
          const royaltyReceiver = await storage.chainRoyalty(
            destinationChain.asSlice().loadStringRefTail(),
          );

          const getSourceNftContractAddress = () => {
            try {
              return sourceNftContractAddress
                .asSlice()
                .loadAddress()
                .toString();
            } catch (e) {
              return sourceNftContractAddress.asSlice().loadStringTail();
            }
          };

          let nft: TNFTData = {
            metadata: "",
            name: "",
            royalty: 0n,
            symbol: "",
          };

          try {
            nft = await this.nftData(
              tokenId.toString(),
              getSourceNftContractAddress(),
              undefined,
            );
          } catch (_) {}

          return {
            destinationChain: destinationChain.asSlice().loadStringRefTail(),
            destinationUserAddress: destinationUserAddress
              .asSlice()
              .loadStringRefTail(),
            sourceNftContractAddress: getSourceNftContractAddress(),
            tokenId: tokenId.toString(),
            tokenAmount: tokenAmount.toString(),
            nftType: nftType.toString(),
            sourceChain: sourceChain.toString(),
            fee: fee.toString(),
            royaltyReceiver: royaltyReceiver.toString(),
            metadata: nft.metadata,
            name: nft.name,
            symbol: nft.symbol,
            royalty: nft.royalty.toString(),
            transactionHash: hash,
            lockTxChain: identifier,
          };
        }
      }

      throw new Error("No locked event found");
    },
    transform(input) {
      let destinationAddress: Address;
      try {
        destinationAddress = Address.parseFriendly(
          input.destinationUserAddress,
        ).address;
      } catch (e) {
        destinationAddress = Address.parseFriendly(
          input.royaltyReceiver,
        ).address;
      }
      let sourceNftContractAddress_ = beginCell()
        .storeSlice(
          beginCell()
            .storeStringTail(input.sourceNftContractAddress)
            .endCell()
            .asSlice(),
        )
        .endCell();
      try {
        sourceNftContractAddress_ = beginCell()
          .storeSlice(
            beginCell()
              .storeAddress(
                Address.parseFriendly(input.sourceNftContractAddress).address,
              )
              .endCell()
              .asSlice(),
          )
          .endCell();
      } catch (e) {
        console.log("Not Native TON Address");
      }
      return {
        $$type: "ClaimData",
        data1: {
          $$type: "ClaimData1",
          destinationChain: input.destinationChain,
          destinationUserAddress: destinationAddress,
          sourceChain: input.sourceChain,
          tokenAmount: BigInt(input.tokenAmount),
          tokenId: BigInt(input.tokenId),
        },
        data2: {
          $$type: "ClaimData2",
          name: input.name,
          nftType: input.nftType,
          symbol: input.symbol,
        },
        data3: {
          $$type: "ClaimData3",
          fee: BigInt(input.fee),
          metadata: beginCell()
            .storeInt(1, 8)
            .storeStringTail(input.metadata)
            .endCell(),
          royaltyReceiver: Address.parseFriendly(input.royaltyReceiver).address,
          sourceNftContractAddress: sourceNftContractAddress_,
        },
        data4: {
          $$type: "ClaimData4",
          newContent: buildJettonContent({
            name: input.name,
            symbol: input.symbol,
            description: "",
          }),
          royalty: {
            $$type: "RoyaltyParams",
            denominator: 10000n,
            destination: Address.parseFriendly(input.royaltyReceiver).address,
            numerator: BigInt(input.royalty),
          },
          transactionHash: input.transactionHash,
          lockTxChain: input.lockTxChain,
        },
      };
    },
    async getValidatorCount() {
      return Number((await bridge.getValidatorsCount()) ?? 0);
    },
    async lockNft(
      signer,
      sourceNft,
      destinationChain,
      to,
      tokenId,
      metaDataUri,
      _,
    ) {
      if (!signer.address) {
        throw new Error("No Address present in signer");
      }
      const lastBridgeTxHash = await getLastBridgeTxHashInBase64();

      const collection = client.open(
        NftCollection.fromAddress(Address.parse(sourceNft)),
      );
      const nftItemAddress = await collection.getGetNftAddressByIndex(tokenId);
      if (!nftItemAddress) raise("NFT Does not exist.");
      const nftItem = client.open(NftItem.fromAddress(nftItemAddress));
      const nftItemData = await nftItem.getGetNftData();
      const exists = nftItemData.is_initialized;
      if (!exists) raise("NFT Is not initialized.");

      const locked = beginCell();

      storeLock721({
        $$type: "Lock721",
        destinationChain: beginCell()
          .storeStringRefTail(destinationChain)
          .endCell(),
        destinationUserAddress: beginCell().storeStringRefTail(to).endCell(),
        sourceNftContractAddress: Address.parse(sourceNft),
        tokenId: tokenId,
        metaDataUri: beginCell().storeStringRefTail(metaDataUri).endCell(),
      })(locked);

      await nftItem.send(
        signer,
        {
          value: toNano("1.5"),
          bounce: true,
        },
        {
          $$type: "Transfer",
          forward_payload: beginCell()
            .storeInt(tokenId, 256)
            .storeAddress(Address.parse(sourceNft))
            .storeRef(beginCell().storeStringRefTail(destinationChain))
            .storeRef(beginCell().storeStringRefTail(to))
            .storeRef(beginCell().storeStringRefTail(metaDataUri))
            .endCell(),
          custom_payload: null,
          forward_amount: toNano("1.0"),
          new_owner: bridge.address,
          query_id: 42069n,
          response_destination: bridge.address,
        },
      );

      //  let foundTx = false;
      //  let hash = "";
      //  let retries = 0;
      //  while (!foundTx && retries < 20) {
      //    await new Promise((e) => setTimeout(e, 4000));
      //    const tx = (
      //      await client.getTransactions(bridge.address, { limit: 1 })
      //    )[0];
      //    if (tx.hash().toString("base64") === lastBridgeTxHash) {
      //      await new Promise((e) => setTimeout(e, 10000));
      //      retries++;
      //      continue;
      //    }
      //    hash = tx.hash().toString("base64");
      //    foundTx = true;
      //  }

      let foundTx = false;
      let hash = "";
      let retries = 0;
      while (!foundTx && retries < 10) {
        await new Promise((e) => setTimeout(e, 2000));
        const latestTx = (
          await client.getTransactions(bridge.address, { limit: 1 })
        )[0];
        if (latestTx.hash().toString("base64") === lastBridgeTxHash) {
          await new Promise((e) => setTimeout(e, 10000));
          retries++;
          continue;
        }
        const txs = await client.getTransactions(bridge.address, { limit: 2 });
        for (const tx of txs) {
          for (let i = 0; i < tx.outMessages.size; i++) {
            const msg = tx.outMessages.get(i) ?? raise("Unreachable");
            if (tx.hash().toString("base64") === lastBridgeTxHash) {
              await new Promise((e) => setTimeout(e, 10000));
              continue;
            }
            if (msg.body.asSlice().loadUint(32) !== 4205190074) {
              continue;
            }
            const log = loadLockedEvent(msg.body.asSlice());
            const log_dest_chain = log.destinationChain
              .asSlice()
              .loadStringRefTail();
            const log_dest_ua = log.destinationUserAddress
              .asSlice()
              .loadStringRefTail();
            if (destinationChain === log_dest_chain && to === log_dest_ua) {
              foundTx = true;
              hash = tx.hash().toString("base64");
            }
          }
        }
        retries++;
      }

      return {
        ret: undefined,
        hash() {
          return hash;
        },
      };
    },
    async approveNft(_signer, _tokenId, _contract) {},
    async mintNft(signer, ma) {
      const contract = Address.parse(ma.contract);
      const prevHash = (await client.getTransactions(contract, { limit: 1 }))[0]
        .hash()
        .toString("base64");
      const nft = client.open(TestnetNftCollection.fromAddress(contract));
      await nft.send(
        signer,
        {
          value: toNano("0.4"),
        },
        {
          $$type: "Mint",
          content: beginCell().storeInt(1, 8).storeStringTail(ma.uri).endCell(),
          owner: ma.owner,
          token_id: ma.token_id,
        },
      );
      let foundTx = false;
      while (!foundTx) {
        await new Promise((e) => setTimeout(e, 2000));
        const tx = (await client.getTransactions(contract, { limit: 1 }))[0];
        if (tx.hash().toString("base64") === prevHash) {
          await new Promise((e) => setTimeout(e, 10000));
          continue;
        }
        foundTx = true;
      }
      return;
    },
    async nftData(tokenId, contract, _overrides) {
      const collection = client.open(
        NftCollection.fromAddress(Address.parse(contract)),
      );
      const royaltyParams = await collection.getRoyaltyParams().catch((_) => {
        return {
          $$type: "RoyaltyParams" as const,
          numerator: 0n,
          denominator: 0n,
          destination: bridge.address,
        };
      });
      const denom = 10000 / Number(royaltyParams.denominator);
      const royalty = Number(royaltyParams.numerator) * denom;
      const collection_md_slice = (
        await collection.getGetCollectionData()
      ).collection_content.asSlice();
      collection_md_slice.loadInt(8);
      const collection_md_uri = collection_md_slice.loadStringTail();

      const collection_md = await fetchHttpOrIpfs(collection_md_uri).catch(
        (_) => {
          return {
            name: "TTON",
            symbol: "TTON",
          };
        },
      );

      const nftItem = client.open(
        NftItem.fromAddress(
          (await collection.getGetNftAddressByIndex(BigInt(tokenId))) ??
            raise("NFT Does not exist."),
        ),
      );
      const nftData = await nftItem.getGetNftData();
      const content = nftData.individual_content.asSlice();
      const firstBit = content.preloadBits(8).toString();
      if (firstBit === "01" || firstBit === "00") {
        content.loadBits(8);
      }
      const uri = content.loadStringTail();
      const nft_uri: string = uri.includes("://")
        ? uri
        : `${collection_md_uri.substring(
            0,
            collection_md_uri.lastIndexOf("/") + 1,
          )}${uri}`;
      const md = await fetchHttpOrIpfs(nft_uri).catch((_) => {
        return {
          name: undefined,
        };
      });
      return {
        metadata: nft_uri,
        symbol: collection_md.name ?? "TTON",
        name: md.name ?? collection_md.name ?? "TTON",
        royalty: BigInt(royalty),
      };
    },
  };
}
