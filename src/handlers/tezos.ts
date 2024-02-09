import { hash } from "@stablelib/blake2b";
import {
  SendParams,
  Signer,
  TezosToolkit,
  TransactionOperation,
} from "@taquito/taquito";
import { Tzip16Module, bytes2Char, tzip16 } from "@taquito/tzip16";
import { eventsGetContractEvents } from "@tzkt/sdk-api";

import {
  b58cdecode,
  b58cencode,
  prefix,
  validateAddress,
} from "@taquito/utils";
import { BridgeStorage } from "../contractsTypes";
import { NFTContractType } from "../contractsTypes/tezosContractTypes/NFT.types";
import {
  address,
  mutez,
  nat,
  tas,
} from "../contractsTypes/tezosContractTypes/type-aliases";
import { TSingularNftChain } from "./chain";
import { raise } from "./ton";

export type TezosClaimArgs = {
  token_id: nat;
  source_chain: string;
  dest_chain: string;
  dest_address: address;
  source_nft_contract_address: string;
  name: string;
  symbol: string;
  royalty: nat;
  royalty_receiver: address;
  metadata: string;
  transaction_hash: string;
  token_amount: nat;
  nft_type: string;
  fee: mutez;
};

export type TezosHandler = TSingularNftChain<
  Signer,
  TezosClaimArgs,
  Partial<SendParams>,
  TransactionOperation
>;

export type TezosParams = {
  Tezos: TezosToolkit;
  bridge: string;
  storage: BridgeStorage;
};

export function tezosHandler({
  Tezos,
  bridge,
  storage,
}: TezosParams): TezosHandler {
  const getNftTokenMetaData = async (contract: string, tokenId: bigint) => {
    const nftContract = await Tezos.contract.at<NFTContractType>(contract);

    const tokenMetaData = await (
      await nftContract.storage()
    ).token_metadata.get(tas.nat(tokenId.toString()));
    const metaDataInHex = tokenMetaData.token_info.get("");
    return bytes2Char(metaDataInHex);
  };
  return {
    async getBalance(signer, _) {
      return BigInt(
        (await Tezos.tz.getBalance(await signer.publicKeyHash())).toString(),
      );
    },
    async approveNft(signer, tokenId, contract, extraArgs) {
      const nftContract = await Tezos.contract.at<NFTContractType>(contract);
      const tx = await nftContract.methods
        .add_operator(
          (await signer.publicKeyHash()) as address,
          bridge as address,
          tas.nat(tokenId.toString()),
        )
        .send({ ...extraArgs });
      return tx;
    },
    async getClaimData(txHash) {
      const op = await eventsGetContractEvents({
        contract: {
          eq: bridge,
        },
      });
      const claimData = op.find((e) => e.timestamp === txHash);

      const data = claimData?.payload ?? raise("No claim data found");
      const sourceNftContractAddress = extractStrOrAddr(
        data.source_nft_address,
      );
      const {
        token_id: tokenId, // Unique ID for the NFT transfer
        dest_chain: destinationChain, // Chain to where the NFT is being transferred
        dest_address: destinationUserAddress, // User's address in the destination chain
        token_amount: tokenAmount, // amount of nfts to be transfered ( 1 in 721 case )
        nft_type: nftType, // Sigular or multiple ( 721 / 1155)
        source_chain: sourceChain, // Source chain of NFT
        transaction_hash: transactionHash,
      } = data;
      const fee = await storage.chainFee(destinationChain);
      const royaltyReceiver = await storage.chainRoyalty(destinationChain);
      const nft = await this.nftData(tokenId, sourceNftContractAddress, {});
      return {
        tokenId,
        destinationChain,
        destinationUserAddress,
        tokenAmount,
        nftType,
        sourceChain,
        transactionHash,
        sourceNftContractAddress,
        fee: fee.toString(),
        royaltyReceiver,
        name: nft.name,
        symbol: nft.symbol,
        royalty: nft.royalty.toString(),
        metadata: nft.metadata,
      };
    },
    async claimNft(signer, data, extraArgs, sigs) {
      const isTezosAddr =
        validateAddress(data.source_nft_contract_address) === 3;

      const sourceNftContractAddress = isTezosAddr
        ? {
            addr: tas.address(data.source_nft_contract_address),
          }
        : {
            str: data.source_nft_contract_address,
          };
      const bridgeInstance = await Tezos.contract.at(bridge);
      Tezos.setSignerProvider(signer);

      const tx = await bridgeInstance.methodsObject
        .claim_nft({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          data: {
            dest_address: data.dest_address,
            dest_chain: data.dest_chain,
            fee: data.fee,
            metadata: data.metadata,
            name: data.name,
            nft_type: data.nft_type,
            royalty: data.royalty,
            royalty_receiver: data.royalty_receiver,
            source_chain: data.source_chain,
            symbol: data.symbol,
            token_amount: data.token_amount,
            token_id: tas.nat(data.token_id),
            transaction_hash: data.transaction_hash,
            source_nft_contract_address: sourceNftContractAddress,
          },
          sigs: sigs.map((e) => {
            const addr = tas.address(
              b58cencode(
                hash(new Uint8Array(b58cdecode(e.signer, prefix.edpk)), 20),
                prefix.tz1,
              ),
            );
            return {
              addr,
              sig: tas.signature(
                Buffer.from(e.signature.replace("0x", ""), "hex").toString(),
              ),
              signer: tas.key(e.signer),
            };
          }),
        })
        .send({
          ...extraArgs,
          amount: data.fee.toNumber(),
          mutez: true,
          fee: data.fee.toNumber(),
        });
      return tx;
    },
    async lockNft(signer, sourceNft, destinationChain, to, tokenId, extraArgs) {
      Tezos.setSignerProvider(signer);
      const bridgeInstance = await Tezos.contract.at(bridge);
      const tx = await bridgeInstance.methods
        .lock_nft(tas.nat(tokenId.toString()), destinationChain, to, {
          addr: tas.address(sourceNft),
        })
        .send({ ...extraArgs });

      return tx;
    },
    async nftData(tokenId, contract) {
      const tokenMd = await getNftTokenMetaData(contract, BigInt(tokenId));
      let name = "NTEZOS";
      try {
        Tezos.addExtension(new Tzip16Module());
        const nftContract = await Tezos.contract.at(contract, tzip16);
        const md = nftContract.tzip16();
        name = (await md.metadataName()) ?? name;
      } catch (e) {
        console.log("error getting name Tezos");
      }
      let symbol = "NTEZOS";
      try {
        const isUrl = URLCanParse(tokenMd);
        if (isUrl) {
          const metaData: { symbol?: string } = await fetch(tokenMd).then(
            (res) => res.json(),
          );
          symbol = metaData.symbol ?? symbol;
        }
        symbol = JSON.parse(tokenMd).symbol ?? symbol;
      } catch (e) {
        console.log("error getting symbol Tezos", e);
      }
      let royalty = 0n;
      try {
        const metaDataOrURL = await getNftTokenMetaData(
          contract,
          BigInt(tokenId),
        );
        const isUrl = URLCanParse(metaDataOrURL);
        let metaData: {
          royalties: {
            decimals: number;
            shares: {
              [key: string]: number;
            };
          };
        };

        if (isUrl) {
          metaData = await fetch(metaDataOrURL).then((res) => res.json());
        } else {
          metaData = JSON.parse(metaDataOrURL);
        }
        const decimal_places_in_rates = metaData.royalties.decimals;
        const max_percentage = Number(
          `1${"0".repeat(decimal_places_in_rates)}`,
        );
        const rate = Object.values(metaData.royalties.shares)[0];
        royalty = BigInt((rate / max_percentage) * 10000);
      } catch (e) {
        console.log("Error getting royalty Tezos");
      }
      return {
        metadata: tokenMd,
        name,
        symbol,
        royalty,
      };
    },
  };
}

const URLCanParse = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export const extractStrOrAddr = (
  addr: { str: string } | { addr: string },
): string => {
  if ("str" in addr) return addr.str;
  return addr.addr;
};
