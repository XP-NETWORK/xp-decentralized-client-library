import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

import { Bridge, CosmNft } from "@xp/cosmos-client";
import { CosmWasmExtraArgs, TCosmWasmHandler, TCosmWasmParams } from "./types";

export async function cosmWasmHandler({
  rpc,
  bridge,
  denom,
  nftCodeId,
  storage,
  chainId,
}: TCosmWasmParams): Promise<TCosmWasmHandler> {
  const provider = await CosmWasmClient.connect(rpc);

  async function nftData(
    tokenId: string,
    contract: string,
    _extra: CosmWasmExtraArgs | undefined,
  ) {
    const nft = new CosmNft.CosmosNftQueryClient(provider, contract);
    const data = await nft.nftInfo({ tokenId });
    const collection = await nft.contractInfo();
    const royalty = await nft.extension({
      msg: {
        royalty_info: {
          sale_price: "10000",
          token_id: tokenId,
        },
      },
    });
    return {
      metadata: data.token_uri ?? "",
      name: collection.name,
      symbol: collection.symbol,
      royalty: royalty.royalty_amount,
    };
  }
  const bc = new Bridge.BridgeQueryClient(provider, bridge);
  return {
    async approveNft(signer, tokenId, contract, extraArgs) {
      const cosmSigner = await SigningCosmWasmClient.connectWithSigner(
        rpc,
        signer,
      );
      const nft = new CosmNft.CosmosNftClient(
        cosmSigner,
        (await signer.getAccounts())[0].address,
        contract,
      );
      const approved = await nft.approve(
        {
          spender: bridge,
          tokenId: tokenId,
        },
        extraArgs?.fee ?? {
          amount: [
            {
              amount: "50000",
              denom: denom,
            },
          ],
          gas: "2500000",
        },
        extraArgs?.memo,
        extraArgs?.funds,
      );
      return approved;
    },
    async readClaimed721Event(hash) {
      const tx = await provider.getTx(hash);
      if (!tx) throw new Error(`Failed to find tx hash on ${chainId}: ${hash}`);
      const attributes = tx.events.flatMap((e) => {
        if (e.type === "wasm") return e.attributes;
        return [];
      });
      const attribute = attributes.find((e) => e.key === "ClaimedEventInfo");
      if (!attribute)
        throw new Error(
          `No ClaimedEventInfo attribute found in tx: ${tx.hash}`,
        );
      const data = JSON.parse(attribute.value);
      return {
        nft_contract: data.contract,
        source_chain: data.source_chain,
        transaction_hash: data.transaction_hash,
        token_id: data.token_id,
      };
    },
    getProvider() {
      return provider;
    },
    async getValidatorCount() {
      return (await bc.getValidatorsCount()).count;
    },
    async getBalance(signer) {
      const account = (await signer.getAccounts())[0];
      return BigInt(
        (await provider.getBalance(account.address, "uatom")).amount,
      );
    },
    async claimNft(signer, claimData, sig, extraArgs) {
      const cosmSigner = await SigningCosmWasmClient.connectWithSigner(
        rpc,
        signer,
      );
      const bc = new Bridge.BridgeClient(
        cosmSigner,
        (await signer.getAccounts())[0].address,
        bridge,
      );

      const claim = await bc.claim721(
        {
          data: {
            data: claimData,
            signatures: sig.map((e) => {
              return {
                signature: Buffer.from(
                  e.signature.replace("0x", ""),
                  "hex",
                ).toString("base64"),
                signer_address: Buffer.from(e.signerAddress, "hex").toString(
                  "base64",
                ),
              };
            }),
          },
        },
        extraArgs?.fee ?? {
          amount: [
            {
              amount: "50000",
              denom: denom,
            },
          ],
          gas: "2500000",
        },
        extraArgs?.memo,
        [
          {
            amount: claimData.fee.toString(),
            denom: denom,
          },
        ],
      );
      return {
        ret: claim,
        hash() {
          return claim.transactionHash;
        },
      };
    },
    getStorageContract() {
      return storage;
    },
    transform(input) {
      return {
        destination_chain: input.destinationChain,
        destination_user_address: input.destinationUserAddress,
        // biome-ignore lint/suspicious/noExplicitAny: broken cosmwasm types
        fee: input.fee as any,
        name: input.name,
        symbol: input.symbol,
        metadata: input.metadata,
        royalty: parseInt(input.royalty),
        nft_type: input.nftType,
        royalty_receiver: input.royaltyReceiver,
        source_chain: input.sourceChain,
        source_nft_contract_address: input.sourceNftContractAddress,
        // biome-ignore lint/suspicious/noExplicitAny: broken cosmwasm types
        token_amount: input.tokenAmount as any,
        token_id: input.tokenId,
        transaction_hash: input.transactionHash,
      };
    },
    async getClaimData(txHash) {
      const tx = await provider.getTx(txHash);
      if (!tx) {
        throw new Error("Transaction not found");
      }
      const e = tx.events.find((e) => {
        e.type === "wasm" &&
          e.attributes.find((e) => e.key === "LockedEventInfo");
      });
      if (!e) {
        throw new Error("Event not found");
      }
      const data = e.attributes.find((e) => e.key === "LockedEventInfo");
      if (!data) {
        throw new Error("Data not found");
      }
      const {
        token_id: tokenId, // Unique ID for the NFT transfer
        destination_chain: destinationChain, // Chain to where the NFT is being transferred
        destination_user_address: destinationUserAddress, // User's address in the destination chain
        source_nft_contract_address: sourceNftContractAddress, // Address of the NFT contract in the source chain
        token_amount: tokenAmount, // amount of nfts to be transfered ( 1 in 721 case )
        nft_type: nftType, // Sigular or multiple ( 721 / 1155)
        source_chain: sourceChain, // Source chain of NFT
      } = JSON.parse(data.value);

      const fee = await storage.chainFee(destinationChain);
      const royaltyReceiver = await storage.chainRoyalty(destinationChain);

      const nft = await nftData(tokenId, sourceNftContractAddress, {});

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
    async lockNft(signer, sourceNft, destinationChain, to, tokenId, extraArgs) {
      const cosmSigner = await SigningCosmWasmClient.connectWithSigner(
        rpc,
        signer,
      );
      const bc = new Bridge.BridgeClient(
        cosmSigner,
        (await signer.getAccounts())[0].address,
        bridge,
      );
      const lockCollectionId =
        await cosmSigner.getContractCodeHistory(sourceNft);
      const lock = await bc.lock721(
        {
          data: {
            destination_chain: destinationChain,
            collection_code_id:
              lockCollectionId[lockCollectionId.length - 1].codeId,
            destination_user_address: to,
            token_id: tokenId.toString(),
            source_nft_contract_address: sourceNft,
          },
        },
        extraArgs?.fee ?? {
          amount: [
            {
              amount: "15000",
              denom: denom,
            },
          ],
          gas: "1000000",
        },
        extraArgs?.memo,
      );
      return {
        hash() {
          return lock.transactionHash;
        },
        tx: lock,
      };
    },
    nftData: nftData,
    async mintNft(signer, ma, gasArgs) {
      const cosmSigner = await SigningCosmWasmClient.connectWithSigner(
        rpc,
        signer,
      );
      const nft = new CosmNft.CosmosNftClient(
        cosmSigner,
        (await signer.getAccounts())[0].address,
        ma.contract,
      );
      const mint = await nft.mint(
        {
          owner: ma.owner ?? (await signer.getAccounts())[0].address,
          tokenId: ma.token_id,
          tokenUri: ma.token_uri,
          // biome-ignore lint/suspicious/noExplicitAny:
        } as unknown as any,
        gasArgs?.fee ?? {
          amount: [
            {
              amount: "50000",
              denom: denom,
            },
          ],
          gas: "150000",
        },
        gasArgs?.memo,
        gasArgs?.funds,
      );
      return mint;
    },
    async deployCollection(signer, data, gasArgs) {
      const sender = (await signer.getAccounts())[0];
      const client = await SigningCosmWasmClient.connectWithSigner(rpc, signer);
      const msg = {
        name: data.name,
        symbol: data.symbol,
        minter: sender.address,
      };
      const inst = await client.instantiate(
        sender.address,
        data.codeId ?? nftCodeId,
        msg,
        `${data.name}-${Math.random() * 1000}`,
        gasArgs?.fee ?? {
          amount: [
            {
              amount: "50000",
              denom: denom,
            },
          ],
          gas: "2500000",
        },
        {
          funds: gasArgs?.funds,
          memo: gasArgs?.memo,
        },
      );
      return inst.contractAddress;
    },
  };
}
