import {
  TransactionEventsParser,
  TransactionWatcher,
  findEventsByFirstTopic,
} from "@multiversx/sdk-core";
import {
  AbiRegistry,
  Account,
  Address,
  AddressValue,
  BigUIntValue,
  BytesValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  Field,
  ResultsParser,
  SmartContract,
  Struct,
  TokenTransfer,
  Transaction,
  TransactionPayload,
  TransactionsConverter,
  TypedValue,
} from "@multiversx/sdk-core/out";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { Nonce } from "@multiversx/sdk-network-providers/out/primitives";
import { UserSigner } from "@multiversx/sdk-wallet/out";
import axios from "axios";
import { multiversXBridgeABI } from "../../contractsTypes/multiversx";
import { raise } from "../ton";
import { fetchHttpOrIpfs } from "../utils";
import {
  StructClaimDataType,
  TMultiversXHandler,
  TMultiversXParams,
  TMultiversXSigner,
} from "./types";

export function multiversxHandler({
  provider,
  gatewayURL,
  bridge,
  storage,
  chainId,
  identifier,
}: TMultiversXParams): TMultiversXHandler {
  const abiRegistry = AbiRegistry.create(multiversXBridgeABI);
  const multiversXBridgeContract = new SmartContract({
    address: Address.fromString(bridge),
    abi: abiRegistry,
  });
  const apin = new ApiNetworkProvider(gatewayURL.replace("gateway", "api"));
  const txWatcher = new TransactionWatcher(apin);

  const eventsParser = new TransactionEventsParser({
    abi: abiRegistry,
  });
  const converter = new TransactionsConverter();
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
    const response = await (
      await http.get(
        `${gatewayURL.replace(
          "gateway",
          "api",
        )}/nfts/${collection}-${nonceAsHex}`,
      )
    ).data;
    return {
      metaData: atob(response.uris[1]),
      royalties: response.royalties ?? 0,
    };
  };
  return {
    identifier,
    validateAddress(address) {
      try {
        Address.newFromBech32(address);
        return Promise.resolve(true);
      } catch {
        return Promise.resolve(false);
      }
    },
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
    async deployNftCollection(signer, da, ga) {
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
      const account = await provider.getAccount(
        Address.fromString(await signer.getAddress()),
      );
      let nonce = account.nonce;
      const tx = new Transaction({
        data,
        gasLimit: ga?.gasLimit ?? 60_000_000,
        receiver: new Address(builtInSC.trim()),
        sender: Address.fromString(await signer.getAddress()),
        value: payment,
        chainID: chainId,
        nonce: nonce++,
      });
      const signed = await signer.signTransaction(tx);
      const hash = await provider.sendTransaction(signed);

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
        BytesValue.fromHex(Address.fromString(await signer.getAddress()).hex()),
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
        sender: Address.fromString(await signer.getAddress()),
        chainID: chainId,
        nonce: nonce++,
      });
      const ssrSigned = await signer.signTransaction(ssrTx);
      const ssrHash = await provider.sendTransaction(ssrSigned);
      while (!(await provider.getTransactionStatus(ssrHash)).isExecuted()) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      return Buffer.from(tickerh, "hex").toString("utf-8");
    },
    getProvider() {
      return provider;
    },
    async claimSft(signer, claimData, sigs) {
      const userAddress = Address.fromString(await signer.getAddress());
      const userAccount = new Account(userAddress);
      const userOnNetwork = await provider.getAccount(userAddress);
      userAccount.update(userOnNetwork);

      const imgUri = (await fetchHttpOrIpfs(claimData.metadata)).image;

      const claimDataArgs = new Struct(StructClaimDataType, [
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
        new Field(new BytesValue(Buffer.from(claimData.symbol)), "symbol"),
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
        new Field(
          new BytesValue(Buffer.from(claimData.lockTxChain)),
          "lock_tx_chain",
        ),
        new Field(new BytesValue(Buffer.from(imgUri)), "img_uri"),
      ]);
      const data = [
        claimDataArgs,

        sigs.map((item) => {
          return {
            public_key: new AddressValue(
              new Address(Buffer.from(item.signerAddress, "hex")),
            ),
            sig: new BytesValue(
              Buffer.from(item.signature.replace("0x", ""), "hex"),
            ),
          };
        }),
      ];
      const transaction = multiversXBridgeContract.methods
        .claimNft721(data)
        .withSender(Address.fromString(await signer.getAddress()))
        .withChainID("D")
        .withGasLimit(6_000_000_00)
        .withValue(new BigUIntValue("50000000000000000"))
        .buildTransaction();
      transaction.setNonce(userAccount.getNonceThenIncrement());
      const signed = await signer.signTransaction(transaction);
      const hash = await provider.sendTransaction(signed);
      return { hash: () => hash, ret: hash };
    },
    async lockSft(signer, sourceNft, destinationChain, to, tokenId, amt) {
      const ba = new Address(bridge);

      const userAddress = Address.fromString(await signer.getAddress());

      const userAccount = new Account(userAddress);
      const userOnNetwork = await provider.getAccount(userAddress);
      userAccount.update(userOnNetwork);

      const collectionIdentifiers = `@${Buffer.from(sourceNft).toString(
        "hex",
      )}`;
      const amount = `@${amt}`;
      const nonce = new Nonce(Number(tokenId)).hex();
      const noncec = `@${nonce}`;
      const quantity = "@" + "01";
      const destination_address = `@${ba.hex()}`;
      const method = `@${Buffer.from("lock721").toString("hex")}`;
      const token_id = `@${Buffer.from(`${sourceNft}-0${tokenId}`).toString(
        "hex",
      )}`;
      const destination_chain = `@${Buffer.from(destinationChain).toString(
        "hex",
      )}`;
      const destination_user_address = `@${Buffer.from(to).toString("hex")}`;
      const source_nft_contract_address = collectionIdentifiers;

      const tx3 = new Transaction({
        data: new TransactionPayload(
          `ESDTNFTTransfer${collectionIdentifiers}${noncec}${quantity}${destination_address}${method}${token_id}${destination_chain}${destination_user_address}${source_nft_contract_address}${amount}${noncec}`,
        ),
        gasLimit: 600000000,
        sender: Address.fromString(await signer.getAddress()),
        receiver: Address.fromString(await signer.getAddress()),
        chainID: "D",
      });

      tx3.setNonce(userAccount.getNonceThenIncrement());

      const signed = await signer.signTransaction(tx3);

      const txHash = await provider.sendTransaction(signed);
      return {
        tx: txHash,
        hash() {
          return txHash;
        },
      };
    },
    async readClaimed721Event(hash) {
      await waitForTransaction(hash);
      const response = (
        await axios.get(
          `${gatewayURL.replace(
            "gateway",
            "api",
          )}/transactions/${hash}?withScResults=true`,
        )
      ).data;
      const event = response.logs.events.find(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (e: any) =>
          Buffer.from(e.topics[0], "base64").toString("utf-8") === "Claimed721",
      );
      return {
        transaction_hash: Buffer.from(event.topics[3], "base64").toString(
          "utf-8",
        ),
        nft_contract: Buffer.from(event.topics[4], "base64").toString("utf-8"),
        lock_tx_chain: Buffer.from(event.topics[1], "base64").toString("utf-8"),
        source_chain: Buffer.from(event.topics[2], "base64").toString("hex"),
        token_id: Buffer.from(event.topics[5], "base64").toString("hex"),
      };
    },
    async readClaimed1155Event(hash) {
      await waitForTransaction(hash);
      const response = (
        await axios.get(
          `${gatewayURL.replace("gateway", "api")}/transactions/${hash}`,
        )
      ).data;

      const event = response.results
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .flatMap((e: any) => e.logs?.events)
        .find(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (e: any) =>
            e.identifier === "callBack" &&
            Buffer.from(e.topics[0], "base64").toString("utf-8") ===
              "Claimed1155",
        );
      return {
        transaction_hash: Buffer.from(event.topics[2], "base64").toString(
          "utf-8",
        ),
        nft_contract: Buffer.from(event.topics[3], "base64").toString("utf-8"),
        source_chain: Buffer.from(event.topics[1], "base64").toString("utf-8"),
        token_id: Buffer.from(event.topics[4], "base64").toString("hex"),
        amount: BigInt(Buffer.from(event.topics[5], "base64").toString("hex")),
        lock_tx_chain: Buffer.from(event.topics[6], "base64").toString("hex"),
      };
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
      const account = await provider.getAccount(
        Address.fromString(await signer.getAddress()),
      );

      const tx = new Transaction({
        data,
        gasLimit:
          gasArgs?.gasLimit ??
          3_000_000 +
            data.length() * 1500 +
            (ma.attrs?.length || 0 + (ma.hash?.length ?? 0) || 0) * 50000,
        receiver: Address.fromString(await signer.getAddress()),
        sender: Address.fromString(await signer.getAddress()),
        value: gasArgs?.value ?? 0,
        chainID: chainId,
        nonce: account.nonce++,
      });

      const signed = await signer.signTransaction(tx);
      const hash = await provider.sendTransaction(signed);
      await waitForTransaction(hash);
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
        lockTxChain: input.lockTxChain,
        imgUri: input.imgUri || "",
      };
    },
    async approveNft(_signer, _tokenId, _contract) {
      return Promise.resolve("Not Required for MultiversX");
    },
    async decodeLockedEvent(txHash) {
      await txWatcher.awaitCompleted(txHash);
      const transactionOnNetworkMultisig = await provider.getTransaction(
        txHash,
        true,
      );
      const tx = await apin.getTransaction(
        transactionOnNetworkMultisig.contractResults.items[0].hash,
      );
      console.log(
        `HyperBlock Nonce: ${transactionOnNetworkMultisig.hyperblockNonce} ${tx.hyperblockNonce}`,
      );
      const transactionOutcomeMultisig =
        converter.transactionOnNetworkToOutcome(tx);
      const [event] = findEventsByFirstTopic(
        transactionOutcomeMultisig,
        "Locked",
      );
      const parsed = eventsParser.parseEvent({ event });
      const destinationChain = parsed.destination_chain.toString("utf-8");
      const sourceChain = parsed.chain.toString("utf-8");
      const tokenId = parsed.token_id.toString();
      const tokenAmount = parsed.token_amount.toString();

      return {
        destinationChain,
        destinationUserAddress:
          parsed.destination_user_address.toString("utf-8"),
        tokenAmount,
        tokenId,
        nftType: parsed.nft_type.toString("utf-8"),
        sourceNftContractAddress: parsed.source_nft_contract_address,
        sourceChain,
        transactionHash: txHash,
        metaDataUri: "",
      };
    },
    async lockNft(signer, sourceNft, destinationChain, to, tokenId) {
      const ba = new Address(bridge);

      const userAddress = Address.fromString(await signer.getAddress());

      const userAccount = new Account(userAddress);
      const userOnNetwork = await provider.getAccount(userAddress);
      userAccount.update(userOnNetwork);

      const collectionIdentifiers = `@${Buffer.from(sourceNft).toString(
        "hex",
      )}`;
      const nonce = new Nonce(Number(tokenId)).hex();
      const noncec = `@${nonce}`;
      const quantity = "@" + "01";
      const destination_address = `@${ba.hex()}`;
      const method = `@${Buffer.from("lock721").toString("hex")}`;
      const token_id = `@${Buffer.from(`${sourceNft}-0${tokenId}`).toString(
        "hex",
      )}`;
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
        sender: Address.fromString(await signer.getAddress()),
        receiver: Address.fromString(await signer.getAddress()),
        chainID: "D",
      });

      tx3.setNonce(userAccount.getNonceThenIncrement());

      const signed = await signer.signTransaction(tx3);

      const txHash = await provider.sendTransaction(signed);
      return {
        ret: txHash,
        hash() {
          return txHash;
        },
      };
    },
    async claimNft(signer, claimData, sig) {
      const userAddress = Address.fromString(await signer.getAddress());
      const userAccount = new Account(userAddress);
      const userOnNetwork = await provider.getAccount(userAddress);
      userAccount.update(userOnNetwork);

      const imgUri = (await fetchHttpOrIpfs(claimData.metadata)).image;

      const claimDataArgs = new Struct(StructClaimDataType, [
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
        new Field(new BytesValue(Buffer.from(claimData.symbol)), "symbol"),
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
        new Field(
          new BytesValue(Buffer.from(claimData.lockTxChain)),
          "lock_tx_chain",
        ),
        new Field(new BytesValue(Buffer.from(imgUri)), "img_uri"),
      ]);
      const data = [
        claimDataArgs,

        sig.map((item) => {
          return {
            public_key: new AddressValue(
              new Address(Buffer.from(item.signerAddress, "hex")),
            ),
            sig: new BytesValue(
              Buffer.from(item.signature.replace("0x", ""), "hex"),
            ),
          };
        }),
      ];
      const transaction = multiversXBridgeContract.methods
        .claimNft721(data)
        .withSender(Address.fromString(await signer.getAddress()))
        .withChainID("D")
        .withGasLimit(6_000_000_00)
        .withValue(new BigUIntValue("50000000000000000"))
        .buildTransaction();
      transaction.setNonce(userAccount.getNonceThenIncrement());
      const signed = await signer.signTransaction(transaction);
      const hash = await provider.sendTransaction(signed);
      return { hash: () => hash, ret: hash };
    },
    async getBalance(signer, _) {
      const bal = BigInt(
        (
          await provider.getAccount(
            Address.fromString(await signer.getAddress()),
          )
        ).balance.toString(),
      );
      return bal;
    },
    async getTransactionStatus(txHash) {
      return (await waitForTransaction(txHash)).isSuccessful()
        ? "success"
        : "failed";
    },
  };
}

export function userSignerToSigner(us: UserSigner): TMultiversXSigner {
  return {
    async getAddress() {
      return us.getAddress().toString();
    },
    async signTransaction(transaction) {
      const signature = await us.sign(transaction.serializeForSigning());
      transaction.applySignature(signature);
      return transaction;
    },
  };
}
