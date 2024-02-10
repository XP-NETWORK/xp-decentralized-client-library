import { Address, Dictionary, Sender, beginCell, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";
import { BridgeStorage } from "../contractsTypes";
import {
  Bridge,
  ClaimData,
  SignerAndSignature,
  loadLockedEvent,
} from "../contractsTypes/contracts/tonBridge";
import { NftCollection } from "../contractsTypes/contracts/tonNftCollection";
import { NftItem } from "../contractsTypes/contracts/tonNftContract";
import { TSingularNftChain } from "./chain";
export type TonHandler = TSingularNftChain<
  Sender,
  ClaimData,
  unknown,
  undefined
>;

export type TonParams = {
  client: TonClient;
  bridgeAddress: string;
  storage: BridgeStorage;
};

export function raise(message: string): never {
  throw new Error(message);
}

export function tonHandler({
  client,
  bridgeAddress,
  storage,
}: TonParams): TonHandler {
  const bridge = client.open(
    Bridge.fromAddress(Address.parseFriendly(bridgeAddress).address),
  );
  return {
    getBalance(signer) {
      return client.getBalance(
        signer.address ?? raise("No Address present in signer"),
      );
    },
    async claimNft(signer, claimData, _, sig) {
      const sigs: SignerAndSignature[] = sig.map((e) => {
        return {
          $$type: "SignerAndSignature",
          key: BigInt(`0x${e.signer}`),
          signature: beginCell()
            .storeBuffer(Buffer.from(e.signature.replace("0x", ""), "hex"))
            .endCell(),
        };
      });
      let dictA = Dictionary.empty<bigint, SignerAndSignature>();
      sigs.forEach((item, index) => {
        dictA = dictA.set(BigInt(index), item);
      });
      await bridge.send(
        signer,
        {
          value: toNano(claimData.data3.fee),
        },
        {
          $$type: "ClaimNFT721",
          data: claimData,
          signatures: dictA,
          len: BigInt(sigs.length),
        },
      );
    },
    async getClaimData(txHash) {
      const tx = await client.getTransaction(bridge.address, "", txHash);
      if (!tx) {
        throw new Error("Transaction not found");
      }
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
            return sourceNftContractAddress.asSlice().loadAddress().toString();
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
      throw new Error("No locked event found");
    },
    async lockNft(signer, sourceNft, destinationChain, to, tokenId, _) {
      if (!signer.address) {
        throw new Error("No Address present in signer");
      }
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
      while (!foundTx && retries < 5) {
        await new Promise<undefined>((e) => setTimeout(e, 2000));
        const tx = (
          await client.getTransactions(signer.address, { limit: 1 })
        )[0];
        for (let i = 0; i < tx.outMessages.size; i++) {
          const msg = tx.outMessages.get(i);
          if (!msg) {
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
            hash = tx.hash().toString("hex");
          }
        }
        retries++;
      }

      return {
        hash() {
          return hash;
        },
      };
    },
    async approveNft(_signer, _tokenId, _contract) {},
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
        await (await fetch(await getCollectionMetaData())).json()
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
