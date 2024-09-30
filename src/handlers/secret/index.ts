import { StdSignature, toBase64 } from "secretjs";
import { Pubkey } from "secretjs/dist/wallet_amino";
import { Lock721, Lock1155 } from "../../contractsTypes/secret/secretBridge";
import { raise } from "../ton";
import { TSecretHandler, TSecretParams } from "./types";

export function secretHandler({
  bridge,
  provider,
  storage,
  bridgeCodeHash,
  nftCodeId,
  identifier,
}: TSecretParams): TSecretHandler {
  return {
    identifier,
    getProvider() {
      return provider;
    },
    async nftList(owner, viewingKey, contract, codeHash) {
      const { token_list } = await provider.query.snip721.GetOwnedTokens({
        auth: {
          viewer: {
            address: owner,
            viewing_key: viewingKey,
          },
        },
        contract: {
          address: contract,
          codeHash: codeHash || "",
        },
        owner: owner,
      });
      if (token_list.tokens.length === 0) {
        return [];
      }
      const response: {
        readonly native: Record<string, unknown>;
        readonly uri: string;
        readonly collectionIdent: string;
        readonly tokenId: string;
      }[] = [];
      await Promise.all(
        token_list.tokens.map(async (token) => {
          const tokenInfo = await provider.query.snip721.GetTokenInfo({
            contract: {
              address: contract,
              codeHash: codeHash || "",
            },
            auth: {
              viewer: {
                address: owner,
                viewing_key: viewingKey,
              },
            },
            token_id: token,
          });

          response.push({
            collectionIdent: contract,
            uri: tokenInfo.all_nft_info.info?.token_uri || "",
            tokenId: token,
            native: {
              contract: contract,
              contractHash: codeHash || "",
              tokenId: token,
              viewingKey,
              metadata: tokenInfo.all_nft_info.info?.token_uri || "",
            },
          });
        }),
      );
      return response;
    },
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
        royalty: parseInt(input.royalty),
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
        metaDataUri: "",
      };
    },
    async claimSft(signer, claimData, sigs, extraArgs) {
      const claim1155 = {
        claim1155: {
          data: {
            claimData,
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
    async approveNft(signer, tokenId, contract, extraArgs) {
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
            metadata_uri: metaDataUri,
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
        tx,
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
