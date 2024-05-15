import { Address, Dictionary, beginCell, toNano } from "@ton/core";

import axios from "axios";
import {
  Bridge,
  SignerAndSignature,
  loadClaimedEvent,
  loadLockedEvent,
} from "../../contractsTypes/ton/tonBridge";
import { NftCollection } from "../../contractsTypes/ton/tonNftCollection";
import { NftItem } from "../../contractsTypes/ton/tonNftContract";
import { ExampleNFTCollection } from "./nftc";
import { TTonHandler, TTonParams } from "./types";

export function raise(message: string): never {
  throw new Error(message);
}

export function tonHandler({
  client,
  bridgeAddress,
  storage,
}: TTonParams): TTonHandler {
  const http = axios.create();
  const bridge = client.open(
    Bridge.fromAddress(Address.parseFriendly(bridgeAddress).address),
  );

  async function getLastBridgeTxHashInBase64() {
    const txns = await client.getTransactions(bridge.address, { limit: 1 });
    return txns[0].hash().toString("base64");
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
      const tx = await client.getTransactions(bridge.address, {
        hash: bridgeTxHash,
        limit: 2,
      });
      if (!tx.length) raise("Transaction not found");
      const om = tx[1].outMessages;
      const size = om.size;
      for (let i = 0; i < size; i++) {
        const msg = om.get(i) ?? raise("Unreachable");
        if (msg.body.asSlice().loadUint(32) === 663924102) {
          const {
            newlyDeployCollection,
            tokenId,
            sourceChain,
            transactionHash,
          } = loadClaimedEvent(msg.body.asSlice());
          return {
            nft_contract: newlyDeployCollection.toString(),
            source_chain: sourceChain,
            token_id: tokenId.toString(),
            transaction_hash: transactionHash,
          };
        }
      }
      throw new Error("Claimed event not found");
    },
    async deployCollection(signer, da) {
      const nft = client.open(
        await ExampleNFTCollection.fromInit(
          da.owner_address,
          da.collection_content,
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

      return nft.address.toString();
    },
    async getClaimData(txHash) {
      const txs = await client.getTransactions(bridge.address, {
        hash: txHash,
        limit: 2,
      });
      if (!txs.length) {
        throw new Error("Transaction not found");
      }
      for (const tx of txs) {
        for (let i = 0; i < tx.outMessages.size; i++) {
          const msg = tx.outMessages.get(i);
          if (!msg) {
            continue;
          }
          const hash = txHash;
          if (msg.body.asSlice().loadUint(32) !== 3571773646) {
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

          const fee = await storage.chainFee(destinationChain);
          const royaltyReceiver = await storage.chainRoyalty(destinationChain);

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

          const { royalty, name, symbol, metadata } = await this.nftData(
            tokenId.toString(),
            getSourceNftContractAddress(),
            undefined,
          );

          return {
            destinationChain,
            destinationUserAddress: destinationUserAddress.toString(),
            sourceNftContractAddress: getSourceNftContractAddress(),
            tokenId: tokenId.toString(),
            tokenAmount: tokenAmount.toString(),
            nftType: nftType.toString(),
            sourceChain: sourceChain.toString(),
            fee: fee.toString(),
            royaltyReceiver: royaltyReceiver.toString(),
            metadata,
            name,
            symbol,
            royalty: royalty.toString(),
            transactionHash: hash,
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
          metadata: input.metadata,
          royaltyReceiver: Address.parseFriendly(input.royaltyReceiver).address,
          sourceNftContractAddress: sourceNftContractAddress_,
        },
        data4: {
          $$type: "ClaimData4",
          newContent: beginCell()
            .storeInt(0x01, 8)
            .storeStringRefTail(input.metadata)
            .endCell(),
          royalty: {
            $$type: "RoyaltyParams",
            denominator: 10000n,
            destination: Address.parseFriendly(input.royaltyReceiver).address,
            numerator: BigInt(input.royalty),
          },
          transactionHash: input.transactionHash,
        },
      };
    },
    async getValidatorCount() {
      return Number((await bridge.getValidatorsCount()) ?? 0);
    },
    async lockNft(signer, sourceNft, destinationChain, to, tokenId, _) {
      if (!signer.address) {
        throw new Error("No Address present in signer");
      }
      const lastBridgeTxHash = await getLastBridgeTxHashInBase64();
      await bridge.send(
        signer,
        {
          value: toNano("2"),
        },
        {
          $$type: "Lock721",
          destinationChain,
          destinationUserAddress: to,
          sourceNftContractAddress: Address.parseFriendly(sourceNft).address,
          tokenId: BigInt(tokenId),
        },
      );

      let foundTx = false;
      let hash = "";
      let retries = 0;
      while (!foundTx && retries < 10) {
        await new Promise((e) => setTimeout(e, 2000));
        const txs = await client.getTransactions(bridge.address, { limit: 2 });
        for (const tx of txs) {
          for (let i = 0; i < tx.outMessages.size; i++) {
            const msg = tx.outMessages.get(i) ?? raise("Unreachable");
            if (tx.hash().toString("base64") === lastBridgeTxHash) {
              await new Promise((e) => setTimeout(e, 10000));
              continue;
            }
            if (msg.body.asSlice().loadUint(32) !== 3571773646) {
              continue;
            }
            const log = loadLockedEvent(msg.body.asSlice());
            if (
              destinationChain === log.destinationChain &&
              to === log.destinationUserAddress
            ) {
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
      const nft = client.open(ExampleNFTCollection.fromAddress(ma.contract));
      await nft.send(
        signer,
        {
          value: toNano("0.1"),
        },
        "Mint",
      );
      return;
    },
    async nftData(_tokenId, contract, _overrides) {
      const nftItem = client.open(
        NftItem.fromAddress(Address.parseFriendly(contract).address),
      );

      const getCollectionMetaData = async () => {
        const nftData = await nftItem.getGetNftData();
        if (nftData.collection_address) {
          const nftCollection = client.open(
            NftCollection.fromAddress(nftData.collection_address),
          );
          const { collection_content } =
            await nftCollection.getGetCollectionData();
          const collectionContentSlice = collection_content.asSlice();
          collectionContentSlice.loadUint(8);
          const metaDataURL = collectionContentSlice.loadStringTail();
          console.log({ metaDataURL });
          return metaDataURL;
        }
        const individualContentSlice = nftData.individual_content.asSlice();
        individualContentSlice.loadBits(8);
        const metaDataURL = individualContentSlice.loadStringTail();
        return metaDataURL;
      };

      const nftData = await nftItem.getGetNftData();
      const individualContentSlice = nftData.individual_content.asSlice();
      individualContentSlice.loadBits(8);
      const metaDataURL = individualContentSlice.loadStringTail();

      const metaData = (
        await http.get<{ name: string }>(await getCollectionMetaData())
      ).data;

      let royalty = 0n;

      if (nftData.collection_address) {
        const nftCollection = client.open(
          NftCollection.fromAddress(nftData.collection_address),
        );
        const royaltyParams = await nftCollection.getRoyaltyParams();
        const royaltyInNum =
          royaltyParams.numerator / royaltyParams.denominator;
        const standardRoyalty = royaltyInNum * BigInt(10);
        royalty = standardRoyalty;
      }
      return {
        metadata: metaDataURL,
        symbol: "TTON",
        name: metaData.name,
        royalty,
      };
    },
  };
}
