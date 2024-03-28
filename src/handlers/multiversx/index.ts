import {
  AbiRegistry,
  Account,
  Address,
  AddressType,
  AddressValue,
  BigUIntType,
  BigUIntValue,
  BytesType,
  BytesValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  Field,
  FieldDefinition,
  ResultsParser,
  SmartContract,
  Struct,
  StructType,
  TokenTransfer,
  Transaction,
  TransactionPayload,
  TypedValue,
  VariadicValue,
} from "@multiversx/sdk-core/out";

import { Nonce } from "@multiversx/sdk-network-providers/out/primitives";

import axios from "axios";
import { multiversXBridgeABI } from "../../contractsTypes/evm/abi";
import { raise } from "../ton";
import { TMultiversXHandler, TMultiversXParams } from "./types";

export function multiversxHandler({
  provider,
  gatewayURL,
  bridge,
  storage,
  chainId,
}: TMultiversXParams): TMultiversXHandler {
  const abiRegistry = AbiRegistry.create(multiversXBridgeABI);
  const multiversXBridgeContract = new SmartContract({
    address: Address.fromString(bridge),
    abi: abiRegistry,
  });
  const http = axios.create();

  const waitForTransaction = async (hash: string) => {
    let status = await provider.getTransactionStatus(hash);
    while (status.isPending()) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      status = await provider.getTransactionStatus(hash);
    }
    return status;
  };

  const getNonFungibleToken = async (
    collection: string,
    nonce: number,
  ): Promise<{ royalties: number; metaData: string }> => {
    const nonceAsHex = new Nonce(nonce).hex();
    const response = (
      await (
        await http.get(
          `${gatewayURL.replace(
            "gateway",
            "api",
          )}/nfts/${collection}-${nonceAsHex}`,
        )
      ).data
    ).data;
    return {
      metaData: atob(response.uris[1]),
      royalties: response.royalties,
    };
  };
  return {
    async nftData(nonce, collection) {
      const nftDetails =
        await provider.getDefinitionOfTokenCollection(collection);
      const { royalties, metaData } = await getNonFungibleToken(
        collection,
        parseInt(nonce),
      );
      return {
        name: nftDetails.name,
        symbol: nftDetails.ticker,
        metadata: metaData,
        royalty: BigInt(royalties),
      };
    },
    async deployCollection(signer, da, ga) {
      const builtInSC =
        "erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u";
      const args: TypedValue[] = [
        BytesValue.fromUTF8(da.name),
        BytesValue.fromUTF8(da.ticker),
      ];
      const data = new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction("issueNonFungible"))
        .setArgs(args)
        .build();

      const payment = TokenTransfer.egldFromAmount("0.05");
      const account = await provider.getAccount(signer.getAddress());
      let nonce = account.nonce;
      const tx = new Transaction({
        data,
        gasLimit: ga?.gasLimit ?? 60_000_000,
        receiver: new Address(builtInSC.trim()),
        sender: signer.getAddress(),
        value: payment,
        chainID: chainId,
        nonce: nonce++,
      });
      const signed = await signer.sign(tx.serializeForSigning());
      tx.applySignature(signed);
      const hash = await provider.sendTransaction(tx);

      while (!(await provider.getTransactionStatus(hash)).isSuccessful()) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      const transactionOnNetwork = await provider.getTransaction(hash, true);
      const result = transactionOnNetwork.contractResults.items.find(
        (e: { data: string }) => e.data.startsWith("@"),
      );
      const tickerh: string =
        result?.data.split("@")[2] ?? raise("failed to find ticker");

      const ssra: TypedValue[] = [
        BytesValue.fromHex(tickerh),
        BytesValue.fromHex(signer.getAddress().hex()),
        BytesValue.fromHex("45534454526f6c654e4654437265617465"),
      ];
      const ssr = new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction("setSpecialRole"))
        .setArgs(ssra)
        .build();
      const ssrTx = new Transaction({
        data: ssr,
        gasLimit: ga?.gasLimit ?? 60_000_000,
        receiver: new Address(builtInSC.trim()),
        sender: signer.getAddress(),
        chainID: chainId,
        nonce: nonce++,
      });
      const ssrSigned = await signer.sign(ssrTx.serializeForSigning());
      ssrTx.applySignature(ssrSigned);
      const ssrHash = await provider.sendTransaction(ssrTx);
      while (!(await provider.getTransactionStatus(ssrHash)).isExecuted()) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      return Buffer.from(tickerh, "hex").toString("utf-8");
    },
    getProvider() {
      return provider;
    },
    async getValidatorCount() {
      const query = multiversXBridgeContract.createQuery({
        func: "validatorsCount",
      });
      const queryResponse = await provider.queryContract(query);
      const validatorsCountDefinition =
        multiversXBridgeContract.getEndpoint("validatorsCount");

      const { firstValue } = new ResultsParser().parseQueryResponse(
        queryResponse,
        validatorsCountDefinition,
      );
      const count = (firstValue ?? raise("Failed to get count")).valueOf();
      return Number(count);
    },
    getStorageContract() {
      return storage;
    },
    async mintNft(signer, ma, gasArgs) {
      const args: TypedValue[] = [
        BytesValue.fromUTF8(ma.ticker),
        new BigUIntValue(1),
        BytesValue.fromUTF8(ma.name),
        new BigUIntValue(Number(ma.royalties) * 100 || 0),
        BytesValue.fromUTF8(ma.hash || ""),
        BytesValue.fromUTF8(ma.attrs || ""),
      ];
      for (const uri of ma.uris) {
        args.push(BytesValue.fromUTF8(uri));
      }

      const data = new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction("ESDTNFTCreate"))
        .setArgs(args)
        .build();
      const account = await provider.getAccount(signer.getAddress());

      const tx = new Transaction({
        data,
        gasLimit:
          gasArgs?.gasLimit ??
          3_000_000 +
            data.length() * 1500 +
            (ma.attrs?.length || 0 + (ma.hash?.length ?? 0) || 0) * 50000,
        receiver: signer.getAddress(),
        sender: signer.getAddress(),
        value: gasArgs?.value ?? 0,
        chainID: chainId,
        nonce: account.nonce++,
      });

      const signed = await signer.sign(tx.serializeForSigning());
      tx.applySignature(signed);
      const hash = await provider.sendTransaction(tx);
      return hash;
    },
    transform(input) {
      return {
        attrs: input.metadata,
        destinationChain: input.destinationChain,
        destinationUserAddress: input.destinationUserAddress,
        fee: input.fee,
        metadata: input.metadata,
        name: input.name,
        nftType: input.nftType,
        royalty: input.royalty,
        royaltyReceiver: input.royaltyReceiver,
        sourceChain: input.sourceChain,
        sourceNftContractAddress: input.sourceNftContractAddress,
        symbol: input.symbol,
        tokenAmount: input.tokenAmount,
        tokenId: input.tokenId,
        transactionHash: input.transactionHash,
      };
    },
    async approveNft(_signer, _tokenId, _contract) {
      return Promise.resolve("Not Required for MultiversX");
    },
    async getClaimData(txHash) {
      await waitForTransaction(txHash);
      const response = (
        await axios.get(
          `${gatewayURL.replace("gateway", "api")}/transactions/${txHash}`,
        )
      ).data;

      const lockEvent = response.results.logs.find(
        (e: { identifier: string }) =>
          e.identifier === "lock721" || e.identifier === "lock1155",
      );
      const completed = response.results.logs.find(
        (e: { identifier: string }) => e.identifier === "completedTxEvent",
      );

      if (!lockEvent || !completed) {
        throw new Error("Invalid Lock Transaction");
      }

      const decodedLogs = decodeBase64Array(lockEvent.topics);
      const tokenId = String(decodedLogs[1].charCodeAt(0));
      const destinationChain = decodedLogs[2];
      const destinationUserAddress = decodedLogs[3];
      const sourceNftContractAddress = decodedLogs[4];
      const tokenAmount = String(decodedLogs[5].charCodeAt(0));
      const nftType = decodedLogs[6];
      const sourceChain = decodedLogs[7];

      const fee = await storage.chainFee(destinationChain);
      const royaltyReceiver = await storage.chainRoyalty(destinationChain);
      const metadata = await this.nftData(
        tokenId,
        sourceNftContractAddress,
        undefined,
      );
      return {
        destinationChain,
        destinationUserAddress,
        tokenAmount,
        tokenId,
        nftType,
        sourceNftContractAddress,
        sourceChain,
        transactionHash: txHash,
        fee: fee.toString(),
        royaltyReceiver,
        metadata: metadata.metadata,
        name: metadata.name,
        symbol: metadata.symbol,
        royalty: metadata.royalty.toString(),
      };
    },
    async lockNft(signer, sourceNft, destinationChain, to, tokenId, _) {
      const ba = new Address(bridge);

      const userAddress = new Address(signer.getAddress().bech32());
      const userAccount = new Account(userAddress);
      const userOnNetwork = await provider.getAccount(userAddress);
      userAccount.update(userOnNetwork);

      const collectionIdentifiers = `@${Buffer.from(sourceNft).toString(
        "hex",
      )}`;
      const noncec = `@${tokenId}`;
      const quantity = "@" + "01";
      const destination_address = `@${ba.hex()}`;
      const method = `@${Buffer.from("lock721").toString("hex")}`;
      const token_id = `@${Buffer.from(tokenId.toString()).toString("hex")}`;
      const destination_chain = `@${Buffer.from(destinationChain).toString(
        "hex",
      )}`;
      const destination_user_address = `@${Buffer.from(to).toString("hex")}`;
      const source_nft_contract_address = collectionIdentifiers;

      const tx3 = new Transaction({
        data: new TransactionPayload(
          `ESDTNFTTransfer${collectionIdentifiers}${noncec}${quantity}${destination_address}${method}${token_id}${destination_chain}${destination_user_address}${source_nft_contract_address}${noncec}`,
        ),
        gasLimit: 600000000,
        sender: signer.getAddress(),
        receiver: signer.getAddress(),
        chainID: "D",
      });

      tx3.setNonce(userAccount.getNonceThenIncrement());

      const serializedTransaction = tx3.serializeForSigning();
      const transactionSignature = await signer.sign(serializedTransaction);
      tx3.applySignature(transactionSignature);

      const txHash = await provider.sendTransaction(tx3);
      return {
        tx: txHash,
        hash() {
          return txHash;
        },
      };
    },
    async claimNft(signer, claimData, sig) {
      const userAddress = new Address(signer.getAddress().bech32());
      const userAccount = new Account(userAddress);
      const userOnNetwork = await provider.getAccount(userAddress);
      userAccount.update(userOnNetwork);

      const structClaimData = new StructType("ClaimData", [
        new FieldDefinition("token_id", "name of the nft", new BytesType()),
        new FieldDefinition(
          "source_chain",
          "attributes of the nft",
          new BytesType(),
        ),
        new FieldDefinition(
          "destination_chain",
          "attributes of the nft",
          new BytesType(),
        ),
        new FieldDefinition(
          "destination_user_address",
          "attributes of the nft",
          new AddressType(),
        ),
        new FieldDefinition(
          "source_nft_contract_address",
          "attributes of the nft",
          new BytesType(),
        ),
        new FieldDefinition("name", "attributes of the nft", new BytesType()),
        new FieldDefinition("symbol", "attributes of the nft", new BytesType()),
        new FieldDefinition(
          "royalty",
          "attributes of the nft",
          new BigUIntType(),
        ),
        new FieldDefinition(
          "royalty_receiver",
          "attributes of the nft",
          new AddressType(),
        ),
        new FieldDefinition("attrs", "attributes of the nft", new BytesType()),
        new FieldDefinition(
          "transaction_hash",
          "attributes of the nft",
          new BytesType(),
        ),
        new FieldDefinition(
          "token_amount",
          "attributes of the nft",
          new BigUIntType(),
        ),
        new FieldDefinition(
          "nft_type",
          "attributes of the nft",
          new BytesType(),
        ),
        new FieldDefinition("fee", "attributes of the nft", new BigUIntType()),
      ]);

      const claimDataArgs = new Struct(structClaimData, [
        new Field(
          new BytesValue(
            Buffer.from(new Nonce(Number(claimData.tokenId)).hex(), "hex"),
          ),
          "token_id",
        ),
        new Field(
          new BytesValue(Buffer.from(claimData.sourceChain)),
          "source_chain",
        ),
        new Field(
          new BytesValue(Buffer.from(claimData.destinationChain)),
          "destination_chain",
        ),
        new Field(
          new AddressValue(new Address(claimData.destinationUserAddress)),
          "destination_user_address",
        ),
        new Field(
          new BytesValue(Buffer.from(claimData.sourceNftContractAddress)),
          "source_nft_contract_address",
        ),
        new Field(new BytesValue(Buffer.from(claimData.name)), "name"),
        new Field(
          new BytesValue(
            Buffer.from(`N${claimData.sourceChain.toUpperCase()}`),
          ),
          "symbol",
        ),
        new Field(new BigUIntValue(Number(claimData.royalty)), "royalty"),
        new Field(
          new AddressValue(new Address(claimData.royaltyReceiver)),
          "royalty_receiver",
        ),
        new Field(new BytesValue(Buffer.from(claimData.metadata)), "attrs"),
        new Field(
          new BytesValue(Buffer.from(claimData.transactionHash)),
          "transaction_hash",
        ),
        new Field(new BigUIntValue(claimData.tokenAmount), "token_amount"),
        new Field(new BytesValue(Buffer.from(claimData.nftType)), "nft_type"),
        new Field(new BigUIntValue(claimData.fee), "fee"),
      ]);
      const data = [
        claimDataArgs,

        sig.map((item) => {
          return {
            public_key: new AddressValue(
              new Address(Buffer.from(item.signer, "hex")),
            ),
            sig: new BytesValue(
              Buffer.from(item.signature.replace("0x", ""), "hex"),
            ),
          };
        }),

        VariadicValue.fromItems(
          new BytesValue(Buffer.from(claimData.metadata, "utf-8")),
          new BytesValue(Buffer.from(claimData.metadata, "utf-8")),
        ),
      ];
      const transaction = multiversXBridgeContract.methods
        .claimNft721(data)
        .withSender(signer.getAddress())
        .withChainID("D")
        .withGasLimit(6_000_000_00)
        .withValue(new BigUIntValue("50000000000000000"))
        .buildTransaction();
      transaction.setNonce(userAccount.getNonceThenIncrement());
      transaction.applySignature(
        await signer.sign(transaction.serializeForSigning()),
      );
      const hash = await provider.sendTransaction(transaction);
      return hash;
    },
    async getBalance(signer, _) {
      const bal = BigInt(
        (await provider.getAccount(signer.getAddress())).balance.toString(),
      );
      return bal;
    },
  };
}

const decodeBase64Array = (encodedArray: string[]): string[] => {
  return encodedArray.map((encodedString) => {
    return Buffer.from(encodedString, "base64").toString("utf-8");
  });
};
