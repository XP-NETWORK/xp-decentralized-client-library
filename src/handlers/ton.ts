import { Address, Dictionary, Sender, beginCell, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";
import {
  Bridge,
  ClaimData,
  SignerAndSignature,
} from "../contractsTypes/contracts/tonBridge";
import { NftCollection } from "../contractsTypes/contracts/tonNftCollection";
import { NftItem } from "../contractsTypes/contracts/tonNftContract";
import { TSingularNftChain } from "./chain";
export type TonHandler = TSingularNftChain<
  Sender,
  ClaimData,
  [tokenId: string, contract: string],
  unknown,
  undefined
>;

export type TonParams = {
  client: TonClient;
  bridgeAddress: string;
};

export function raise(message: string): never {
  throw new Error(message);
}

export function tonHandler({ client, bridgeAddress }: TonParams): TonHandler {
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
    async lockNft(signer, sourceNft, destinationChain, to, tokenId, _) {
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
    },
    async nftData(_signer, _, _tokenId, contract) {
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
