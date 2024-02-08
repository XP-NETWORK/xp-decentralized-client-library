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
  Field,
  FieldDefinition,
  SmartContract,
  Struct,
  StructType,
  Transaction,
  TransactionPayload,
  VariadicValue,
} from "@multiversx/sdk-core/out";
import { INetworkProvider } from "@multiversx/sdk-network-providers/out/interface";
import { Nonce } from "@multiversx/sdk-network-providers/out/primitives";
import { TSingularNftChain } from "./chain";

import { UserAddress } from "@multiversx/sdk-wallet/out/userAddress";
import { multiversXBridgeABI } from "../contractsTypes/abi";

export type MultiversXSigner = {
  sign: (message: Buffer) => Promise<Buffer>;
  getAddress: () => UserAddress;
};

export type ClaimStruct = {
  tokenId: string;
  sourceChain: string;
  destinationChain: string;
  destinationUserAddress: string;
  sourceNftContractAddress: string;
  name: string;
  symbol: string;
  royalty: string;
  royaltyReceiver: string;
  attrs: string;
  transactionHash: string;
  tokenAmount: string;
  nftType: string;
  fee: string;
  metadata: string;
};

export type MultiversXHandler = TSingularNftChain<
  MultiversXSigner,
  ClaimStruct,
  [nonce: number, collection: string],
  unknown,
  string
>;

export type MultiversXParams = {
  provider: INetworkProvider;
  gatewayURL: string;
  bridge: string;
};

export function multiversxHandler({
  provider,
  gatewayURL,
  bridge,
}: MultiversXParams): MultiversXHandler {
  const abiRegistry = AbiRegistry.create(multiversXBridgeABI);
  const multiversXBridgeContract = new SmartContract({
    address: Address.fromString(bridge),
    abi: abiRegistry,
  });

  const getNonFungibleToken = async (
    collection: string,
    nonce: number,
  ): Promise<{ royalties: number; metaData: string }> => {
    const nonceAsHex = new Nonce(nonce).hex();
    const response = (
      await (
        await fetch(
          `${gatewayURL.replace(
            "gateway",
            "api",
          )}/nfts/${collection}-${nonceAsHex}`,
        )
      ).json()
    ).data;
    return {
      metaData: atob(response.uris[1]),
      royalties: response.royalties,
    };
  };
  return {
    async nftData(_, _a, nonce, collection) {
      const nftDetails =
        await provider.getDefinitionOfTokenCollection(collection);
      const { royalties, metaData } = await getNonFungibleToken(
        collection,
        nonce,
      );
      return {
        name: nftDetails.name,
        symbol: nftDetails.ticker,
        metadata: metaData,
        royalty: BigInt(royalties),
      };
    },
    async approveNft(_signer, _tokenId, _contract) {
      return Promise.resolve("Not Required for MultiversX");
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
      return txHash;
    },
    async claimNft(signer, claimData, _, sig) {
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
