import { SecretNetworkClient, TxOptions, TxResponse } from "secretjs";
import {
  encodeSecp256k1Pubkey,
  encodeSecp256k1Signature,
} from "secretjs/dist/wallet_amino";
import { TNftChain } from "./chain";

export type SecretClaimData = {
  token_id: string;
  source_chain: string;
  destination_chain: string;
  destination_user_address: string;
  source_nft_contract_address: string;
  name: string;
  symbol: string;
  royalty: number;
  royalty_receiver: string;
  metadata: string;
  transaction_hash: string;
  token_amount: string;
  nft_type: string;
  fee: string;
};
export type GetNftArgs = [contract: string, tokenId: bigint];

export type SecretHandler = TNftChain<
  SecretNetworkClient,
  SecretClaimData,
  GetNftArgs,
  TxOptions,
  TxResponse
>;

export type SecretParams = {
  provider: SecretNetworkClient;
  bridge: string;
  chainId: string;
  bridgeCodeHash: string;
};

export function secretHandler({
  bridge,

  bridgeCodeHash,
}: SecretParams): SecretHandler {
  return {
    async claimNft(signer, claimData, ex, sigs) {
      const claim721 = {
        claim721: {
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
          msg: claim721,
          code_hash: bridgeCodeHash,
          sender: signer.address,
          sent_funds: [{ amount: claimData.fee.toString(), denom: "uscrt" }],
        },
        {
          gasLimit: 300_000,
          ...ex,
        },
      );
      return tx;
    },
    async claimSft(signer, claimData, sigs, ex) {
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
          ...ex,
        },
      );

      return tx;
    },
    async nftData(signer, _extraArgs, contract, tokenId) {
      const data = (
        (await signer.query.compute.queryContract({
          contract_address: contract,
          query: { contract_info: {} },
        })) as { contract_info: { name: string; symbol: string } }
      ).contract_info;

      const royalty_info = (
        (await signer.query.compute.queryContract({
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
        (await signer.query.compute.queryContract({
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
    async approveNft(signer, tokenId, contract, ex) {
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
          ...ex,
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
          gasLimit: 200_000,
        },
      );
      return tx;
    },
    async lockSft(signer, sourceNft, destinationChain, to, tokenId, amt, _) {
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
        },
      );
      return tx;
    },
  };
}
