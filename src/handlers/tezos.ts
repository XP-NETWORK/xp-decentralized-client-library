import { hash } from "@stablelib/blake2b";
import {
  SendParams,
  Signer,
  TezosToolkit,
  TransactionOperation,
} from "@taquito/taquito";
import { Tzip16Module, bytes2Char, tzip16 } from "@taquito/tzip16";

import {
  b58cdecode,
  b58cencode,
  prefix,
  validateAddress,
} from "@taquito/utils";
import { NFTContractType } from "../contractsTypes/tezosContractTypes/NFT.types";
import {
  address,
  mutez,
  nat,
  tas,
} from "../contractsTypes/tezosContractTypes/type-aliases";
import { TSingularNftChain } from "./chain";

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
  [tokenId: bigint, contract: string],
  Partial<SendParams>,
  TransactionOperation
>;

export type TezosParams = {
  Tezos: TezosToolkit;
  bridge: string;
};

export function tezosHandler({ Tezos, bridge }: TezosParams): TezosHandler {
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
    async claimNft(signer, data, ex, sigs) {
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
          ...ex,
          amount: data.fee.toNumber(),
          mutez: true,
          fee: data.fee.toNumber(),
        });
      return tx;
    },
    async lockNft(signer, sourceNft, destinationChain, to, tokenId, ex) {
      Tezos.setSignerProvider(signer);
      const bridgeInstance = await Tezos.contract.at(bridge);
      const tx = await bridgeInstance.methods
        .lock_nft(tas.nat(tokenId.toString()), destinationChain, to, {
          addr: tas.address(sourceNft),
        })
        .send({ ...ex });

      return tx;
    },
    async nftData(_, _a, tokenId, contract) {
      const tokenMd = await getNftTokenMetaData(contract, tokenId);
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
        const metaDataOrURL = await getNftTokenMetaData(contract, tokenId);
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
