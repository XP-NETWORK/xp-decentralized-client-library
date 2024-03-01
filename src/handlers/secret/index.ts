import { readFile } from "fs/promises";
import { StdSignature, toBase64 } from "secretjs";
import { Pubkey } from "secretjs/dist/wallet_amino";
import { raise } from "../ton";
import { TSecretHandler, TSecretParams } from "./types";

export function secretHandler({
  bridge,
  provider,
  storage,
  bridgeCodeHash,
}: TSecretParams): TSecretHandler {
  return {
    getProvider() {
      return provider;
    },
    async claimNft(signer, claimData, sigs, extraArgs) {
      const claim721 = {
        claim721: {
          data: {
            data: claimData,
            signatures: sigs.map((e) => {
              return {
                signature: encodeSecp256k1Signature(
                  Buffer.from(e.signer, "hex"),
                  Buffer.from(e.signature.replace("0x", ""), "hex"),
                ).signature,
                signer_address: encodeSecp256k1Pubkey(
                  Buffer.from(e.signer, "hex"),
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
      return tx;
    },
    async deployCollection(signer, da, ga) {
      const stored = await signer.tx.compute.storeCode(
        {
          wasm_byte_code: await readFile("./contract.wasm.gz"),
          sender: "",
          builder: "",
          source: "",
        },
        {
          ...ga,
        },
      );
      const code = stored.arrayLog?.find((e) => e.key === "code_id")?.value;
      if (!code) {
        throw new Error("Code not found");
      }
      const contract = await signer.tx.compute.instantiateContract(
        {
          code_id: code,
          init_msg: {
            name: da.name,
            symbol: da.symbol,
            owner: signer.address,
            config: {
              public_token_supply: true,
            },
          },
          init_funds: [],
          sender: signer.address,
          label: `${da.name}-${Date.now()}`,
        },
        {
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
              public_metadata: {
                token_uri: ma.uri,
              },
              token_id: ma.tokenId,
              owner: signer.address,
            },
          },
          sender: signer.address,
        },
        gasArgs,
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
    async getClaimData(txHash) {
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

      const fee = await storage.chainFee(destinationChain);
      const royaltyReceiver = await storage.chainRoyalty(destinationChain);

      const nft = await this.nftData(tokenId, sourceNftContractAddress, {});

      return {
        destinationChain,
        destinationUserAddress,
        sourceNftContractAddress,
        tokenId,
        tokenAmount,
        nftType,
        sourceChain,
        fee: fee.toString(),
        royaltyReceiver: royaltyReceiver,
        metadata: nft.metadata,
        name: nft.name,
        symbol: nft.symbol,
        royalty: nft.royalty.toString(),
        transactionHash: txHash,
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
                  Buffer.from(e.signer, "hex"),
                  Buffer.from(e.signature.replace("0x", ""), "hex"),
                ).signature,
                signer_address: encodeSecp256k1Pubkey(
                  Buffer.from(e.signer, "hex"),
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

      return tx;
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
      const decimal_places_in_rates = royalty_info.decimal_places_in_rates;
      const max_percentage = Number(`1${"0".repeat(decimal_places_in_rates)}`);
      const rate = royalty_info.royalties[0].rate;
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
      const tokenURI = nft_info?.extension?.media[0]?.url || "";

      return {
        name: data.name,
        symbol: data.symbol,
        metadata: tokenURI,
        royalty: BigInt(royalty),
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
    async lockNft(signer, sourceNft, destinationChain, to, tokenId, _) {
      const tx = await signer.tx.compute.executeContract(
        {
          contract_address: bridge,
          msg: {
            destination_chain: destinationChain,
            destination_user_address: to,
            source_nft_contract_address: sourceNft,
            token_id: tokenId,
          },
          code_hash: bridgeCodeHash,
          sender: signer.address,
        },
        {
          ..._,
          gasLimit: 200_000,
        },
      );
      return { tx, hash: () => tx.transactionHash };
    },
    async lockSft(
      signer,
      sourceNft,
      destinationChain,
      to,
      tokenId,
      amt,
      extraArgs,
    ) {
      const tx = await signer.tx.compute.executeContract(
        {
          contract_address: bridge,
          msg: {
            destination_chain: destinationChain,
            destination_user_address: to,
            source_nft_contract_address: sourceNft,
            collection_code_info: {},
            token_id: tokenId,
            token_amount: amt.toString(),
          },
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
