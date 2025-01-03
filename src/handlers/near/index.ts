import { Contract, connect } from "near-api-js";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { unimplemented } from "../../utils";
import type { TNearHandler, TNearParams } from "./types";

export async function nearHandler({
  networkId,
  nodeUrl,
  bridge,
  storage,
  identifier,
}: TNearParams): Promise<TNearHandler> {
  const provider = await connect({
    networkId,
    nodeUrl,
  });
  const bc = new Contract(provider.connection, bridge, {
    changeMethods: ["lock_nft", "claim_nft"],
    useLocalViewExecution: false,
    viewMethods: ["validator_count"],
  });

  async function nftData(nonce: string, collection: string) {
    const contract = new Contract(provider.connection, collection, {
      viewMethods: ["nft_token", "nft_metadata"],
      changeMethods: [],
      useLocalViewExecution: false,
    });
    //@ts-ignore ik it works.
    const nft_metadata = await contract.nft_token({ token_id: nonce });
    //@ts-ignore ik it works.
    const collection_metadata = await contract.nft_metadata();
    return {
      name: nft_metadata.metadata.title,
      symbol: collection_metadata.symbol,
      metadata: nft_metadata.metadata.media || nft_metadata.metadata.extra,
      royalty: BigInt(
        Object.values(nft_metadata.metadata.royalty || { a: 0 }).reduce(
          //@ts-ignore ik it works
          (e: number, c: number) => c + e,
        ) as number,
      ),
    };
  }
  return {
    identifier,
    nftData,
    async deployNftCollection(_signer, _da, _ga) {
      unimplemented();
    },
    async nftList(owner, contract) {
      const nft = new Contract(provider.connection, contract, {
        changeMethods: [],
        viewMethods: ["nft_tokens_for_owner"],
        useLocalViewExecution: false,
      });
      //@ts-ignore
      const tokens = await nft.nft_tokens_for_owner({ account_id: owner });
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return tokens.map((e: any) => {
        return {
          native: e,
          uri: e.metadata.media || e.metadata.extra,
          tokenId: e.token_id,
          collectionIdent: contract,
        };
      });
    },
    getProvider() {
      return provider;
    },
    validateAddress(address) {
      if (address.includes(".near") || address.includes(".testnet")) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    },
    async readClaimed721Event(hash) {
      const receipts = await provider.connection.provider.txStatusReceipts(
        hash,
        bridge,
        "FINAL",
      );
      const log = receipts.receipts_outcome
        .flatMap((e) => e.outcome.logs)
        .filter((e) => e.includes("claimed"))[0];
      if (!log) throw new Error("No Claimed Event Found");
      const parsed = JSON.parse(log);
      return {
        transaction_hash: parsed.data.transaction_hash,
        nft_contract: parsed.data.contract,
        source_chain: parsed.data.source_chain,
        token_id: parsed.data.token_id,
        lock_tx_chain: parsed.data.lock_tx_chain,
      };
    },
    async getValidatorCount() {
      //@ts-ignore ik it works
      return bc.validator_count();
    },
    getStorageContract() {
      return storage;
    },
    async mintNft(signer, ma, gasArgs) {
      const call = await signer.functionCall({
        contractId: ma.contract,
        methodName: "nft_mint",
        args: {
          token_id: ma.token_id,
          receiver_id: ma.owner,
          metadata: {
            title: ma.title || "Xp Nft",
            description: ma.description || "Xp Nft Description",
            media: ma.uri,
          },
        },
        attachedDeposit: BigInt(parseNearAmount("0.007") ?? 0),
        gas: gasArgs ? BigInt(gasArgs.gasLimit) : undefined,
      });
      return call.transaction.hash;
    },
    transform(input) {
      return {
        destination_chain: input.destinationChain,
        destination_user_address: input.destinationUserAddress,
        fee: input.fee,
        metadata: input.metadata,
        name: input.name,
        nft_type: input.nftType,
        royalty: Number(input.royalty),
        royalty_receiver: input.royaltyReceiver,
        source_chain: input.sourceChain,
        source_nft_contract_address: input.sourceNftContractAddress,
        symbol: input.symbol,
        token_amount: Number(input.tokenAmount),
        token_id: input.tokenId,
        transaction_hash: input.transactionHash,
        lock_tx_chain: input.lockTxChain,
      };
    },
    async approveNft(signer, tokenId, contract) {
      const approve = await signer.functionCall({
        contractId: contract,
        methodName: "nft_approve",
        args: {
          token_id: tokenId,
          account_id: bridge,
          msg: null,
        },
        attachedDeposit: BigInt(parseNearAmount("0.005") ?? 0),
      });
      return approve.transaction.hash;
    },
    async decodeLockedEvent(txHash) {
      const receipts = await provider.connection.provider.txStatusReceipts(
        txHash,
        bridge,
        "FINAL",
      );
      const log = receipts.receipts_outcome
        .flatMap((e) => e.outcome.logs)
        .filter((e) => e.includes("locked"))[0];
      if (!log) throw new Error("No Locked Event Found");
      const parsed = JSON.parse(log).data;

      const destinationChain = parsed.destination_chain;
      const sourceChain = parsed.source_chain;
      const tokenId = parsed.token_id;
      const tokenAmount = parsed.token_amount.toString();

      return {
        destinationChain,
        destinationUserAddress: parsed.destination_user_address,
        tokenAmount,
        tokenId,
        nftType: parsed.nft_type,
        sourceNftContractAddress: parsed.source_nft_contract_address,
        sourceChain,
        transactionHash: txHash,
        lockTxChain: identifier,
        metaDataUri: parsed.metadata_uri,
      };
    },
    async lockNft(
      signer,
      sourceNft,
      destinationChain,
      to,
      tokenId,
      metadata_uri,
    ) {
      const locked = await signer.functionCall({
        contractId: bridge,
        methodName: "lock_nft",
        args: {
          source_nft_contract_address: sourceNft,
          destination_chain: destinationChain,
          destination_address: to,
          token_id: tokenId.toString(),
          metadata_uri,
        },
        gas: 100000000000000n,
        attachedDeposit:
          BigInt(parseNearAmount("1") ?? 0) +
          BigInt(parseNearAmount("0.5") ?? 0),
      });
      return {
        ret: locked,
        hash() {
          return locked.transaction.hash;
        },
      };
    },
    async claimNft(signer, claimData, sig) {
      const claimed = await signer.functionCall({
        contractId: bridge,
        methodName: "claim_nft",
        args: {
          cd: claimData,
          signatures: sig.map((e) => {
            return {
              signer: e.signerAddress.replace("0x", ""),
              signature: [...Buffer.from(e.signature.replace("0x", ""), "hex")],
            };
          }),
        },
        gas: 300000000000000n,
        attachedDeposit:
          BigInt(claimData.fee) +
          BigInt(parseNearAmount("3") ?? 0) +
          BigInt(parseNearAmount("0.5") ?? 0),
      });
      return { hash: () => claimed.transaction.hash, ret: claimed };
    },
    async getBalance(signer, _) {
      const ab = await signer.getAccountBalance();
      return BigInt(ab.available);
    },
  };
}
