import { hash } from "@stablelib/blake2b";

import { Tzip16Module, bytes2Char, tzip16 } from "@taquito/tzip16";
import * as api from "@tzkt/sdk-api";
import { eventsGetContractEvents } from "@tzkt/sdk-api";

import {
  b58cdecode,
  b58cencode,
  char2Bytes,
  prefix,
  validateAddress,
} from "@taquito/utils";
import { BridgeContractType } from "../../contractsTypes/tezos/Bridge.types";
import { NFTContractType } from "../../contractsTypes/tezos/NFT.types";
import { bytes, tas } from "../../contractsTypes/tezos/type-aliases";

import {
  ContractAbstraction,
  ContractMethod,
  ContractMethodObject,
  ContractProvider,
  MichelsonMap,
  OriginateParams,
  SendParams,
  TransactionOperation,
  TransactionWalletOperation,
  Wallet,
} from "@taquito/taquito";
import axios from "axios";
import { NFTCode } from "../../contractsTypes/tezos/NFT.code";
import { raise } from "../ton";
import { TNFTData } from "../types";
import { TTezosHandler, TTezosParams, TezosSigner } from "./types";

export function tezosHandler({
  Tezos,
  bridge,
  storage,
  tzktApi,
  identifier,
}: TTezosParams): TTezosHandler {
  api.defaults.baseUrl = tzktApi;
  async function withContract(
    sender: TezosSigner,
    contract: string,
    cb: (
      contract: ContractAbstraction<ContractProvider | Wallet>,
    ) => ContractMethod<ContractProvider | Wallet>,
    params?: Partial<SendParams>,
  ) {
    if ("publicKeyHash" in sender) {
      Tezos.setSignerProvider(sender);

      const contractI = await Tezos.contract.at(contract);

      const res = cb(contractI);
      const tx = await res.send(params);
      await tx.confirmation();
      return (tx as TransactionOperation).hash;
    }
    Tezos.setWalletProvider(sender);
    const contractI = await Tezos.wallet.at(contract);

    const res = cb(contractI);

    const estim = await Tezos.estimate
      .transfer(res.toTransferParams(params))
      .catch(() => ({ storageLimit: 0 }));

    if (params) {
      if (!params.storageLimit) params.storageLimit = estim.storageLimit;
    } else {
      // biome-ignore lint/style/noParameterAssign: cope
      params = { storageLimit: estim.storageLimit };
    }
    const tx = await res.send(params);
    await tx.confirmation();
    return (tx as TransactionWalletOperation).opHash;
  }

  async function originateWithTezosSigner(
    sender: TezosSigner,
    originateParams: OriginateParams<unknown>,
  ) {
    if ("publicKeyHash" in sender) {
      Tezos.setSignerProvider(sender);
      const contractI = await Tezos.contract.originate(originateParams);
      await contractI.confirmation();
      return contractI.contractAddress ?? raise("Unreachable");
    }
    Tezos.setWalletProvider(sender);
    const contractI = Tezos.wallet.originate(originateParams);

    const tx = await contractI.send();

    await tx.confirmation();
    return (await tx.contract()).address;
  }

  async function withContractMethodObject(
    sender: TezosSigner,
    contract: string,
    cb: (
      contract: ContractAbstraction<ContractProvider | Wallet>,
    ) => ContractMethodObject<ContractProvider | Wallet>,
    params?: Partial<SendParams>,
  ) {
    if ("publicKeyHash" in sender) {
      Tezos.setSignerProvider(sender);

      const contractI = await Tezos.contract.at(contract);

      const res = cb(contractI);
      const tx = await res.send(params);
      await tx.confirmation();
      return (tx as TransactionOperation).hash;
    }
    Tezos.setWalletProvider(sender);
    const contractI = await Tezos.wallet.at(contract);

    const res = cb(contractI);

    const estim = await Tezos.estimate
      .transfer(res.toTransferParams(params))
      .catch(() => ({ storageLimit: 0 }));

    if (params) {
      if (!params.storageLimit) params.storageLimit = estim.storageLimit;
    } else {
      // biome-ignore lint/style/noParameterAssign: cope
      params = { storageLimit: estim.storageLimit };
    }
    const tx = await res.send(params);
    await tx.confirmation();
    return (tx as TransactionWalletOperation).opHash;
  }
  //@ts-ignore
  function withBridge(
    sender: TezosSigner,
    cb: (
      bridge: ContractAbstraction<ContractProvider | Wallet>,
    ) => ContractMethod<ContractProvider | Wallet>,
    params?: Partial<SendParams>,
  ) {
    return withContract(sender, bridge, cb, params);
  }

  function getAddress(sender: TezosSigner) {
    if ("publicKeyHash" in sender) {
      return sender.publicKeyHash();
    }
    return sender.getPKH();
  }

  const http = axios.create();
  const getNftTokenMetaData = async (contract: string, tokenId: bigint) => {
    const nftContract = await Tezos.contract.at<NFTContractType>(contract);

    const tokenMetaData = await (
      await nftContract.storage()
    ).tokens.token_metadata.get(tas.nat(tokenId.toString()));
    const metaDataInHex = tokenMetaData.token_info.get("");
    return bytes2Char(metaDataInHex);
  };
  return {
    getStorageContract() {
      return storage;
    },
    getProvider() {
      return Tezos;
    },
    transform(input) {
      return {
        dest_address: tas.address(input.destinationUserAddress),
        dest_chain: input.destinationChain,
        fee: tas.mutez(input.fee),
        metadata: input.metadata,
        name: input.name,
        nft_type: input.nftType,
        royalty: tas.nat(input.royalty),
        royalty_receiver: tas.address(input.royaltyReceiver),
        source_chain: input.sourceChain,
        source_nft_contract_address: input.sourceNftContractAddress,
        symbol: input.symbol,
        token_amount: tas.nat(input.tokenAmount),
        token_id: tas.nat(input.tokenId),
        transaction_hash: input.transactionHash,
        lock_tx_chain: input.lockTxChain,
      };
    },
    async getBalance(signer, _) {
      return BigInt(
        (await Tezos.tz.getBalance(await getAddress(signer))).toString(),
      );
    },
    async getValidatorCount() {
      const bc = await Tezos.contract.at<BridgeContractType>(bridge);
      const storage = await bc.storage();
      return storage.validators_count.toNumber();
    },
    async approveNft(signer, tokenId, contract, extraArgs) {
      const owner = await getAddress(signer);
      return await withContract(
        signer,
        contract,
        (contract) =>
          contract.methods.update_operators([
            {
              add_operator: {
                owner,
                operator: bridge,
                token_id: tokenId,
              },
            },
          ]),
        extraArgs,
      );
    },
    async getClaimData(txHash) {
      const txs = await api.operationsGetTransactionByHash(txHash);
      const tx = txs[0] ?? raise("No such txn found");
      const op = await eventsGetContractEvents({
        contract: {
          eq: bridge,
        },
      });
      const claimData = op.find((e) => e.timestamp === tx.timestamp);

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
      } = data;
      const fee = await storage.chainFee(destinationChain);
      const royaltyReceiver = await storage.chainRoyalty(destinationChain);
      let nft: TNFTData = {
        metadata: "",
        name: "",
        royalty: 0n,
        symbol: "",
      };
      if (validateAddress(sourceNftContractAddress) === 3) {
        nft = await this.nftData(tokenId, sourceNftContractAddress, {});
      }
      return {
        tokenId,
        destinationChain,
        destinationUserAddress,
        tokenAmount,
        nftType,
        sourceChain,
        transactionHash: claimData?.transactionId?.toString() ?? "",
        sourceNftContractAddress,
        fee: fee.toString(),
        royaltyReceiver,
        name: nft.name,
        symbol: nft.symbol,
        royalty: nft.royalty.toString(),
        metadata: nft.metadata,
        lockTxChain: identifier,
      };
    },
    async mintNft(signer, ma, gasArgs) {
      const owner = await getAddress(signer);
      return await withContract(
        signer,
        ma.contract,
        (contract) =>
          contract.methods.mint([
            {
              amt: tas.nat(1),
              to: tas.address(owner),
              token_id: tas.nat(ma.tokenId.toString()),
              token_uri: ma.uri,
            },
          ]),
        gasArgs,
      );
    },
    async deployNftCollection(signer, da, ga) {
      const metadata = new MichelsonMap<string, bytes>();
      metadata.set("", tas.bytes(char2Bytes("tezos-storage:data")));
      metadata.set(
        "data",
        tas.bytes(
          char2Bytes(`{
            "name":"${da.name}",
            "description":"${da.description}",
            "version":"0.0.1",
            "license":{"name":"MIT"},
            "source":{
              "tools":["Ligo"],
              "location":"https://github.com/ligolang/contract-catalogue/tree/main/lib/fa2"
            },
            "interfaces":["TZIP-012"],
            "errors": [],
            "views": []
      }`),
        ),
      );

      const owner = await getAddress(signer);

      return await originateWithTezosSigner(signer, {
        code: NFTCode.code,
        storage: {
          admin: owner,
          token_metadata: new MichelsonMap(),
          token_total_supply: new MichelsonMap(),
          operators: new MichelsonMap(),
          ledger: new MichelsonMap(),
          metadata: metadata,
        },
        gasLimit: ga?.gasLimit,
      });
    },
    async claimNft(signer, data, sigs, extraArgs) {
      const isTezosAddr =
        validateAddress(data.source_nft_contract_address) === 3;

      const sourceNftContractAddress = isTezosAddr
        ? {
            addr: tas.address(data.source_nft_contract_address),
          }
        : {
            str: data.source_nft_contract_address,
          };

      const txHash = await withContractMethodObject(
        signer,
        bridge,
        (bridgeInstance) => {
          return bridgeInstance.methodsObject.claim_nft({
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
              lock_tx_chain: data.lock_tx_chain,
            },
            sigs: sigs.map((e) => {
              const addr = tas.address(
                b58cencode(
                  hash(
                    new Uint8Array(b58cdecode(e.signerAddress, prefix.edpk)),
                    20,
                  ),
                  prefix.tz1,
                ),
              );
              return {
                addr,
                sig: tas.signature(
                  Buffer.from(e.signature.replace("0x", ""), "hex").toString(),
                ),
                signer: tas.key(e.signerAddress),
              };
            }),
          });
        },
        { amount: data.fee.toNumber() / 1e6, ...extraArgs },
      );

      return {
        hash: () => txHash,
        ret: txHash,
      };
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
      console.log(metaDataUri);

      const hash = await withContractMethodObject(
        signer,
        bridge,
        (bridgeInstance) => {
          return bridgeInstance.methodsObject.lock_nft({
            token_id: tas.nat(tokenId.toString()),
            dest_chain: destinationChain,
            dest_address: to,
            source_nft_address: {
              addr: tas.address(sourceNft),
            },
            metadata_uri: metaDataUri,
          });
        },
        extraArgs,
      );

      return {
        ret: hash,
        hash() {
          return hash;
        },
      };
    },
    async readClaimed721Event(hash) {
      const txs = await api.operationsGetTransactionByHash(hash);
      const tx = txs[0] ?? raise("No such txn found");
      const op = await eventsGetContractEvents({
        contract: {
          eq: bridge,
        },
      });
      const claimData = op.find((e) => e.timestamp === tx.timestamp);
      const data = claimData?.payload ?? raise("No claim data found");
      return {
        nft_contract: data.nft_contract,
        transaction_hash: data.tx_hash,
        token_id: data.token_id,
        source_chain: data.source_chain,
        lock_tx_chain: data.lock_tx_chain,
      };
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
          const metaData: { symbol?: string } = await http
            .get(tokenMd)
            .then((res) => res.data);
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
          metaData = (await http.get(metaDataOrURL)).data;
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
