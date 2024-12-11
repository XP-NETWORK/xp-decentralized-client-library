import { type StdSignature, toBase64, validateAddress } from "secretjs";
import type { Metadata } from "secretjs/dist/extensions/snip1155/types";
import type { Pubkey } from "secretjs/dist/wallet_amino";
import type {
  Lock721,
  Lock1155,
} from "../../contractsTypes/secret/secretBridge";
import { raise } from "../ton";
import type { TokenInfo } from "../types";
import { pinata } from "../utils";
import type {
  GetOwnedTokensResponse,
  TNftInfo,
  TSecretHandler,
  TSecretParams,
  TSftInfo,
} from "./types";

export function secretHandler({
  bridge,
  provider,
  storage,
  bridgeCodeHash,
  nftCodeId,
  identifier,
}: TSecretParams): TSecretHandler {
  async function fetchNfts(
    contract: string,
    owner: string,
    ea: { viewingKey: string; codeHash?: string },
  ) {
    const contractInfo: TNftInfo = await provider.query.compute.queryContract({
      contract_address: contract,
      query: { contract_info: {} },
    });

    const res = (await provider.query.snip721.GetOwnedTokens({
      auth: {
        viewer: {
          address: owner,
          viewing_key: ea.viewingKey,
        },
      },
      contract: {
        address: contract,
        codeHash: ea.codeHash || "",
      },
      owner: owner,
    })) as GetOwnedTokensResponse;
    if (typeof res === "string") {
      throw new Error(res);
    }
    const { token_list } = res;
    if (token_list.tokens.length === 0) {
      return [];
    }
    const response: TokenInfo<Record<string, unknown>>[] = [];
    await Promise.all(
      token_list.tokens.map(async (token) => {
        const tokenInfo = await provider.query.snip721.GetTokenInfo({
          contract: {
            address: contract,
            codeHash: ea.codeHash || "",
          },
          auth: {
            viewer: {
              address: owner,
              viewing_key: ea.viewingKey,
            },
          },
          token_id: token,
        });

        response.push({
          collectionIdent: contract,
          uri: tokenInfo.all_nft_info.info?.token_uri || "",
          tokenId: token,
          type: "NFT",
          native: {
            contract: contract,
            contractHash: ea.codeHash || "",
            name: contractInfo.contract_info.name || "",
            symbol: contractInfo.contract_info.symbol || "",
            tokenId: token,
            viewingKey: ea.viewingKey,
            metadata:
              tokenInfo.all_nft_info.info?.token_uri ||
              tokenInfo?.all_nft_info?.info?.extension,
          },
        });
      }),
    );
    return response;
  }

  async function fetchSfts(
    contract: string,
    owner: string,
    ea: { viewingKey: string; codeHash?: string },
  ) {
    const res = await provider.query.snip1155.getAllBalances({
      auth: {
        viewer: {
          address: owner,
          viewing_key: ea.viewingKey,
        },
      },
      contract: {
        address: contract,
      },
      owner: owner,
    });
    //@ts-ignore
    if (res.all_balances.length === 0) {
      return [];
    }
    const response: TokenInfo<Record<string, unknown>>[] = [];
    await Promise.all(
      res.all_balances.map(async (token) => {
        const tokenInfo = await provider.query.snip1155.getPrivateTokenInfo({
          contract: {
            address: contract,
            code_hash: ea.codeHash || "",
          },
          auth: {
            viewer: {
              address: owner,
              viewing_key: ea.viewingKey,
            },
          },
          token_id: token.token_id,
        });

        const contractInfo: TSftInfo =
          await provider.query.compute.queryContract({
            contract_address: contract,
            query: { token_id_public_info: { token_id: token.token_id } },
          });

        response.push({
          collectionIdent: contract,
          uri:
            tokenInfo.token_id_private_info.token_id_info.public_metadata
              .token_uri || "",
          tokenId: token.token_id,
          type: "SFT",
          native: {
            contract: contract,
            contractHash: ea.codeHash || "",
            tokenId: token.token_id,
            amount: Number(token.amount),
            viewingKey: ea.viewingKey,
            name: contractInfo.token_id_public_info.token_id_info.name,
            symbol: contractInfo.token_id_public_info.token_id_info.symbol,
            metadata:
              tokenInfo.token_id_private_info.token_id_info.public_metadata
                .token_uri || "",
          },
        });
      }),
    );
    return response;
  }
  return {
    identifier,
    getProvider() {
      return provider;
    },
    validateAddress(address) {
      return Promise.resolve(validateAddress(address).isValid);
    },
    async nftList(owner, contract, ea) {
      const nfts: TokenInfo<Record<string, unknown>>[] = await fetchNfts(
        contract,
        owner,
        ea,
      ).catch(() => []);
      const sfts: TokenInfo<Record<string, unknown>>[] = await fetchSfts(
        contract,
        owner,
        ea,
      ).catch(() => []);
      return [...nfts, ...sfts];
    },
    //   const res = (await provider.query.snip1155.getAllBalances();
    //   if (typeof res === "string") {
    //     throw new Error(res);
    //   }
    //   const { token_list } = res;
    //   if (token_list.tokens.length === 0) {
    //     return [];
    //   }
    //   await Promise.all(
    //     token_list.tokens.map(async (token) => {
    //       const tokenInfo = await provider.query.snip721.GetTokenInfo({
    //         contract: {
    //           address: contract,
    //           codeHash: ea.codeHash || "",
    //         },
    //         auth: {
    //           viewer: {
    //             address: owner,
    //             viewing_key: ea.viewingKey,
    //           },
    //         },
    //         token_id: token,
    //       });

    //       response.push({
    //         collectionIdent: contract,
    //         uri: tokenInfo.all_nft_info.info?.token_uri || "",
    //         tokenId: token,
    //         type: "nft",
    //         native: {
    //           contract: contract,
    //           contractHash: ea.codeHash || "",
    //           tokenId: token,
    //           viewingKey: ea.viewingKey,
    //           metadata: tokenInfo.all_nft_info.info?.token_uri || "",
    //         },
    //       });
    //     }),
    //   );
    //   return response;
    // },
    async setViewingKey(signer, contract, vk) {
      const tx = await signer.tx.snip721.setViewingKey(
        {
          contract_address: contract,
          msg: {
            set_viewing_key: {
              key: vk,
            },
          },
          sender: signer.address,
        },
        {
          gasLimit: 300_000,
          // ...extraArgs,
        },
      );
      return tx;
    },
    async claimNft(signer, claimData, sigs, extraArgs) {
      const claim721 = {
        claim721: {
          data: {
            data: claimData,
            signatures: sigs.map((e) => {
              return {
                signature: encodeSecp256k1Signature(
                  Buffer.from(e.signerAddress, "hex"),
                  Buffer.from(e.signature.replace("0x", ""), "hex"),
                ).signature,
                signer_address: encodeSecp256k1Pubkey(
                  Buffer.from(e.signerAddress, "hex"),
                ).value,
              };
            }),
          },
        },
      };

      const tx = await signer.tx.compute.executeContract(
        {
          contract_address: bridge,
          msg: claim721,
          code_hash: bridgeCodeHash,
          sender: signer.address,
          sent_funds: [{ amount: claimData.fee.toString(), denom: "uscrt" }],
        },
        {
          gasLimit: 300_000,
          ...extraArgs,
        },
      );
      return {
        hash: () => tx.transactionHash,
        ret: tx,
      };
    },
    async deployNftCollection(signer, da, ga) {
      const code = da.codeId ?? nftCodeId;
      if (!code) {
        throw new Error("Code not found");
      }
      const msg = {
        name: da.name,
        symbol: da.symbol,
        owner: signer.address,
        destination_user_address: signer.address,
        source_chain: "",
        destination_chain: "",
        token_id: "0",
        token_amount: "1",
        royalty: 0,
        lock_tx_chain: "",
        metadata: "",
        transaction_hash: "",
        royalty_receiver: signer.address,
        source_nft_contract_address: "",
        entropy: "bruh",
        config: {
          public_token_supply: true,
        },
      };
      const contract = await signer.tx.compute.instantiateContract(
        {
          code_id: code,
          init_msg: msg,
          label: `snip721-${da.name}-${new Date().getUTCMilliseconds()}`,
          sender: signer.address,
        },
        {
          gasLimit: 70000,
          ...ga,
        },
      );
      console.log(contract);
      const contractAddress = contract.arrayLog?.find(
        (log) => log.type === "message" && log.key === "contract_address",
      )?.value;
      return contractAddress ?? raise("Contract not found");
    },
    mintNft(signer, ma, gasArgs) {
      const mint = signer.tx.snip721.mint(
        {
          contract_address: ma.contractAddress,
          msg: {
            mint_nft: {
              public_metadata: { token_uri: ma.uri },
              token_id: ma.tokenId,
              owner: ma.owner,
            },
          },
          sender: signer.address,
        },
        {
          gasLimit: 60000,
          ...gasArgs,
        },
      );
      return mint;
    },
    transform(input) {
      return {
        destination_chain: input.destinationChain,
        destination_user_address: input.destinationUserAddress,
        fee: input.fee,
        name: input.name,
        symbol: input.symbol,
        metadata: input.metadata,
        royalty: Number.parseInt(input.royalty),
        nft_type: input.nftType,
        royalty_receiver: input.royaltyReceiver,
        source_chain: input.sourceChain,
        source_nft_contract_address: input.sourceNftContractAddress,
        token_amount: input.tokenAmount,
        token_id: input.tokenId,
        transaction_hash: input.transactionHash,
        lock_tx_chain: input.lockTxChain,
      };
    },
    async getValidatorCount() {
      const res = (await provider.query.compute.queryContract({
        contract_address: bridge,
        code_hash: bridgeCodeHash,
        query: {
          get_validators_count: {},
        },
      })) as { validator_count_response: { count: number } };
      return res.validator_count_response.count;
    },
    getStorageContract() {
      return storage;
    },
    async decodeLockedEvent(txHash) {
      const eventId = "LockedEventInfo";
      const tx = await provider.query.getTx(txHash);
      if (!tx) {
        throw new Error("Tx not found");
      }
      const log =
        tx.jsonLog
          ?.at(0)
          ?.events.find((item) => item.type === "wasm")
          ?.attributes.find((item) => item.key === eventId) ??
        raise("Log not found");

      const {
        token_id: tokenId, // Unique ID for the NFT transfer
        destination_chain: destinationChain, // Chain to where the NFT is being transferred
        destination_user_address: destinationUserAddress, // User's address in the destination chain
        source_nft_contract_address: sourceNftContractAddress, // Address of the NFT contract in the source chain
        token_amount: tokenAmount, // amount of nfts to be transfered ( 1 in 721 case )
        nft_type: nftType, // Sigular or multiple ( 721 / 1155)
        source_chain: sourceChain, // Source chain of NFT
        metadata_uri: metaDataUri, // metadata uri of NFT
      } = JSON.parse(log.value);
      return {
        destinationChain,
        destinationUserAddress,
        sourceNftContractAddress,
        tokenId,
        tokenAmount: tokenAmount.toString(),
        nftType,
        sourceChain,
        transactionHash: txHash,
        lockTxChain: identifier,
        metaDataUri,
      };
    },
    async claimSft(signer, claimData, sigs, extraArgs) {
      const claim1155 = {
        claim1155: {
          data: {
            data: claimData,
            signatures: sigs.map((e) => {
              return {
                signature: encodeSecp256k1Signature(
                  Buffer.from(e.signerAddress, "hex"),
                  Buffer.from(e.signature.replace("0x", ""), "hex"),
                ).signature,
                signer_address: encodeSecp256k1Pubkey(
                  Buffer.from(e.signerAddress, "hex"),
                ).value,
              };
            }),
          },
        },
      };

      const tx = await signer.tx.compute.executeContract(
        {
          contract_address: bridge,
          msg: claim1155,
          code_hash: bridgeCodeHash,
          sender: signer.address,
          sent_funds: [{ amount: claimData.fee.toString(), denom: "uscrt" }],
        },
        {
          gasLimit: 300_000,
          ...extraArgs,
        },
      );

      return {
        ret: tx,
        hash: () => tx.transactionHash,
      };
    },
    async nftData(tokenId, contract) {
      const data = (
        (await provider.query.compute.queryContract({
          contract_address: contract,
          query: { contract_info: {} },
        })) as { contract_info: { name: string; symbol: string } }
      ).contract_info;

      const royalty_info = (
        (await provider.query.compute.queryContract({
          contract_address: contract,
          query: { royalty_info: { token_id: tokenId.toString() } },
        })) as {
          royalty_info: {
            royalty_info: {
              decimal_places_in_rates: number;
              royalties: [{ recipient: string; rate: number }];
            };
          };
        }
      ).royalty_info.royalty_info;
      console.log(royalty_info);
      const decimal_places_in_rates =
        royalty_info?.decimal_places_in_rates ?? 0;
      const max_percentage = Number(`1${"0".repeat(decimal_places_in_rates)}`);
      const rate = royalty_info?.royalties.at(0)?.rate ?? 0;
      const royalty = (rate / max_percentage) * 10000;

      const nft_info = (
        (await provider.query.compute.queryContract({
          contract_address: contract,
          query: { nft_info: { token_id: tokenId.toString() } },
        })) as {
          nft_info: {
            extension: {
              media: [{ url: string }];
            };
          };
        }
      ).nft_info;
      const tokenURI =
        nft_info?.extension?.media[0]?.url ||
        //@ts-ignore
        nft_info?.token_uri ||
        "";

      return {
        name: data.name,
        symbol: data.symbol,
        metadata: tokenURI,
        royalty: BigInt(royalty),
      };
    },
    async readClaimed1155Event(txHash) {
      const eventId = "Claimed1155EventInfo";
      const tx = await provider.query.getTx(txHash);
      if (!tx) {
        throw new Error("Tx not found");
      }
      const log =
        tx.jsonLog
          ?.at(0)
          ?.events.find((item) => item.type === "wasm")
          ?.attributes.find((item) => item.key === eventId) ??
        raise("Log not found");

      const {
        amount,
        nft_contract,
        source_chain,
        transaction_hash,
        token_id,
        lock_tx_chain,
      } = JSON.parse(log.value);

      return {
        amount: BigInt(amount),
        nft_contract,
        source_chain,
        token_id,
        transaction_hash,
        lock_tx_chain,
      };
    },
    async readClaimed721Event(txHash) {
      const eventId = "Claimed721EventInfo";
      const tx = await provider.query.getTx(txHash);
      if (!tx) {
        throw new Error("Tx not found");
      }
      const log =
        tx.jsonLog
          ?.at(0)
          ?.events.find((item) => item.type === "wasm")
          ?.attributes.find((item) => item.key === eventId) ??
        raise("Log not found");

      const {
        nft_contract,
        source_chain,
        transaction_hash,
        token_id,
        lock_tx_chain,
      } = JSON.parse(log.value);

      return {
        nft_contract,
        source_chain,
        token_id,
        transaction_hash,
        lock_tx_chain,
      };
    },
    async approveNft(signer, tokenId, contract, nftType, extraArgs) {
      if (nftType === "sft") {
        const res = await signer.tx.compute.executeContract(
          {
            sender: signer.address,
            contract_address: contract,
            msg: {
              give_permission: {
                allowed_address: bridge,
                token_id: tokenId,
                view_balance: true,
              },
            },
          },
          {
            waitForCommit: true,
            gasLimit: 50000,
          },
        );
        return res;
      }
      const res = await signer.tx.compute.executeContract(
        {
          sender: signer.address,
          contract_address: contract,
          msg: {
            approve: {
              spender: bridge,
              token_id: tokenId,
            },
          },
        },
        {
          gasLimit: 50000,
          ...extraArgs,
        },
      );
      return res;
    },
    async getBalance(signer, _) {
      const result = await signer.query.bank.balance({
        address: signer.address,
        denom: "uscrt",
      });
      return BigInt(result.balance?.amount ?? 0);
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
      console.log(metaDataUri);
      let metadata = metaDataUri;
      const nft_info = (
        (await signer.query.compute.queryContract({
          contract_address: sourceNft,
          query: { nft_info: { token_id: tokenId.toString() } },
        })) as {
          nft_info: Metadata;
        }
      ).nft_info;
      if (nft_info.token_uri) {
        metadata = nft_info.token_uri;
      } else {
        const data = {
          ...nft_info.extension,
          image: nft_info.extension?.media?.[0]?.url || "",
        };
        const pinResponse = await pinata.upload.json(data);
        metadata = `https://xpnetwork.infura-ipfs.io/ipfs/${pinResponse.IpfsHash}`;
        console.log({ metadata });
      }

      const codeHashResponse =
        await signer.query.compute.codeHashByContractAddress({
          contract_address: sourceNft,
        });
      const { contract_info } = await signer.query.compute.contractInfo({
        contract_address: sourceNft,
      });
      const lock: Lock721 = {
        lock721: {
          data: {
            destination_chain: destinationChain,
            destination_user_address: to,
            source_nft_contract_address: sourceNft,
            token_id: tokenId.toString(),
            metadata_uri: metadata,
            collection_code_info: {
              code_id: Number.parseInt(
                contract_info?.code_id ?? raise("Code id not found"),
              ),
              code_hash:
                codeHashResponse.code_hash ?? raise("Code hash not found"),
            },
          },
        },
      };
      console.log(JSON.stringify(lock, null, 4));
      const tx = await signer.tx.compute.executeContract(
        {
          contract_address: bridge,
          msg: lock,
          // code_hash: bridgeCodeHash,
          sender: signer.address,
        },
        {
          gasLimit: 250_000,
          ..._,
        },
      );
      return { ret: tx, hash: () => tx.transactionHash };
    },
    async lockSft(
      signer,
      sourceNft,
      destinationChain,
      to,
      tokenId,
      amt,
      metaDataUri,
      extraArgs,
    ) {
      console.log(metaDataUri);
      const codeHashResponse =
        await signer.query.compute.codeHashByContractAddress({
          contract_address: sourceNft,
        });
      const { contract_info } = await signer.query.compute.contractInfo({
        contract_address: sourceNft,
      });
      const lock: Lock1155 = {
        lock1155: {
          data: {
            collection_code_info: {
              code_id: Number.parseInt(
                contract_info?.code_id ?? raise("Code id not found"),
              ),
              code_hash:
                codeHashResponse.code_hash ?? raise("Code hash not found"),
            },
            metadata_uri: metaDataUri,
            destination_chain: destinationChain,
            destination_user_address: to,
            source_nft_contract_address: sourceNft,
            token_amount: amt.toString(),
            token_id: tokenId.toString(),
          },
        },
      };
      const tx = await signer.tx.compute.executeContract(
        {
          contract_address: bridge,
          msg: lock,
          code_hash: bridgeCodeHash,
          sender: signer.address,
        },
        {
          gasLimit: 200_000,
          ...extraArgs,
        },
      );
      return {
        ret: tx,
        hash() {
          return tx.transactionHash;
        },
      };
    },
  };
}

export function encodeSecp256k1Signature(
  pubkey: Uint8Array,
  signature: Uint8Array,
): StdSignature {
  if (signature.length !== 64) {
    throw new Error(
      "Signature must be 64 bytes long. Cosmos SDK uses a 2x32 byte fixed length encoding for the secp256k1 signature integers r and s.",
    );
  }

  return {
    pub_key: encodeSecp256k1Pubkey(pubkey),
    signature: toBase64(signature),
  };
}

export function encodeSecp256k1Pubkey(pubkey: Uint8Array): Pubkey {
  if (pubkey.length !== 33 || (pubkey[0] !== 0x02 && pubkey[0] !== 0x03)) {
    throw new Error(
      "Public key must be compressed secp256k1, i.e. 33 bytes starting with 0x02 or 0x03",
    );
  }
  return {
    type: "tendermint/PubKeySecp256k1",
    value: toBase64(pubkey),
  };
}
