import { createHash } from "crypto";
import {
  Account,
  Aptos,
  Ed25519Account,
  InputViewFunctionData,
  PendingTransactionResponse,
} from "@aptos-labs/ts-sdk";
import { BCS, HexString } from "aptos";
import {
  BRIDGE_FUNCTIONS,
  BRIDGE_MODULE,
  MINT_FUNCTIONS,
  MINT_MODULE,
} from "./constants";

type TCollectionCounterObj = {
  key: string;
  value: string;
};

type TValidatorsObj = {
  key: string;
  value: {
    pending_reward: string;
  };
};

export type TClaimData = {
  collection: string;
  description: string;
  symbol: string;
  amount: number;
  uri: string;
  iconUri: string;
  projectUri: string;
  royaltyPointsNumerator: number;
  royaltyPointsDenominator: number;
  royaltyPayeeAddress: HexString;
  fee: number;
  sourceChain: Uint8Array;
  sourceNftContractAddress: Uint8Array;
  destinationChain: Uint8Array;
  transactionHash: Uint8Array;
  tokenId: string;
  nftType: Uint8Array;
  metadata: string;
};

type TBridgeData = {
  collection_objects: {
    handle: string;
  };
  duplicate_to_original_mapping: {
    handle: string;
  };
  nft_collection_tokens: {
    handle: string;
  };
  nft_collections_counter: {
    data: TCollectionCounterObj[];
  };
  nfts_counter: string;
  original_to_duplicate_mapping: {
    handle: string;
  };
  self_chain: string;
  validators: {
    data: TValidatorsObj[];
  };
  signer_cap: {
    account: string;
  };
};

export class BridgeClient {
  private aptosClient: Aptos;
  private address: string;

  constructor(client: Aptos, address: string) {
    this.aptosClient = client;
    this.address = address;
  }

  async fundAccounts(accounts: Ed25519Account[]): Promise<void> {
    await Promise.all(
      accounts.map((account) =>
        this.aptosClient.fundAccount({
          accountAddress: account.accountAddress,
          amount: 100,
          options: { checkSuccess: true },
        }),
      ),
    );
  }

  async initialize(
    adminAccount: Ed25519Account,
    validators: Uint8Array[],
    seed: Uint8Array,
    selfChain: Uint8Array,
  ): Promise<PendingTransactionResponse> {
    const transaction = await this.aptosClient.transaction.build.simple({
      sender: adminAccount.accountAddress,
      data: {
        function: `${this.address}::${BRIDGE_MODULE}::${BRIDGE_FUNCTIONS.Initialize}`,
        functionArguments: [validators, seed, selfChain],
      },
    });

    return this.aptosClient.signAndSubmitTransaction({
      signer: adminAccount,
      transaction,
    });
  }

  async addValidator(
    adminAccount: Ed25519Account,
    validator: Uint8Array,
    signatures: Uint8Array[],
    public_keys: Uint8Array[],
  ) {
    const transaction = await this.aptosClient.transaction.build.simple({
      sender: adminAccount.accountAddress,
      data: {
        function: `${this.address}::${BRIDGE_MODULE}::${BRIDGE_FUNCTIONS.AddValidator}`,
        functionArguments: [validator, signatures, public_keys],
      },
    });

    return this.aptosClient.signAndSubmitTransaction({
      signer: adminAccount,
      transaction,
    });
  }

  async lock721(
    owner: Account,
    collection: string,
    name: string,
    destination_chain: Uint8Array,
    token_id: number,
    source_nft_contract_address: Uint8Array,
  ) {
    const transaction = await this.aptosClient.transaction.build.simple({
      sender: owner.accountAddress,
      data: {
        function: `${this.address}::${BRIDGE_MODULE}::${BRIDGE_FUNCTIONS.Lock721}`,
        functionArguments: [
          collection,
          name,
          destination_chain,
          token_id,
          source_nft_contract_address,
        ],
      },
    });

    return this.aptosClient.signAndSubmitTransaction({
      signer: owner,
      transaction,
    });
  }

  async lock1155(
    owner: Account,
    collection: string,
    name: string,
    amount: number,
    destination_chain: Uint8Array,
    token_id: number,
    source_nft_contract_address: Uint8Array,
  ) {
    const transaction = await this.aptosClient.transaction.build.simple({
      sender: owner.accountAddress,
      data: {
        function: `${this.address}::${BRIDGE_MODULE}::${BRIDGE_FUNCTIONS.Lock1155}`,
        functionArguments: [
          collection,
          name,
          amount,
          destination_chain,
          token_id,
          source_nft_contract_address,
        ],
      },
    });

    return this.aptosClient.signAndSubmitTransaction({
      signer: owner,
      transaction,
    });
  }

  async claim721(
    sender: Account,
    {
      collection,
      description,
      symbol,
      uri,
      royaltyPointsNumerator,
      royaltyPointsDenominator,
      royaltyPayeeAddress,
      fee,

      sourceChain,
      sourceNftContractAddress,
      destinationChain,
      transactionHash,
      tokenId,
      nftType,
      metadata,
    }: TClaimData,
    signatures: Uint8Array[],
    publicKeys: Uint8Array[],
  ) {
    const transaction = await this.aptosClient.transaction.build.simple({
      sender: sender.accountAddress,
      data: {
        function: `${this.address}::${BRIDGE_MODULE}::${BRIDGE_FUNCTIONS.Claim721}`,
        functionArguments: [
          collection,
          description,
          uri,
          royaltyPointsNumerator,
          royaltyPointsDenominator,
          royaltyPayeeAddress.toString(),
          fee,
          signatures,
          publicKeys,
          destinationChain,
          sourceChain,
          sourceNftContractAddress,
          tokenId,
          transactionHash,
          nftType,
          metadata,
          symbol,
          // amount,
          // iconUri,
          // projectUri,
        ],
      },
    });

    return this.aptosClient.signAndSubmitTransaction({
      signer: sender,
      transaction,
    });
  }

  async claim1155(
    sender: Account,
    {
      collection,
      description,
      symbol,
      amount,
      uri,
      iconUri,
      projectUri,
      royaltyPointsNumerator,
      royaltyPointsDenominator,
      royaltyPayeeAddress,
      fee,
      sourceChain,
      sourceNftContractAddress,
      destinationChain,
      transactionHash,
      tokenId,
      nftType,
      metadata,
    }: TClaimData,
    signatures: Uint8Array[],
    publicKeys: Uint8Array[],
  ) {
    const transaction = await this.aptosClient.transaction.build.simple({
      sender: sender.accountAddress,
      data: {
        function: `${this.address}::${BRIDGE_MODULE}::${BRIDGE_FUNCTIONS.Claim1155}`,
        functionArguments: [
          collection,
          description,
          uri,
          royaltyPointsNumerator,
          royaltyPointsDenominator,
          royaltyPayeeAddress.toString(),
          fee,
          signatures,
          publicKeys,
          destinationChain,
          sourceChain,
          sourceNftContractAddress,
          tokenId,
          transactionHash,
          nftType,
          metadata,
          symbol,
          amount,
          iconUri,
          projectUri,
        ],
      },
    });

    return this.aptosClient.signAndSubmitTransaction({
      signer: sender,
      transaction,
    });
  }

  async claimValidatorRewards(
    adminAccount: Ed25519Account,
    to: HexString,
    validator: Uint8Array,
    signatures: Uint8Array[],
    public_keys: Uint8Array[],
  ) {
    const transaction = await this.aptosClient.transaction.build.simple({
      sender: adminAccount.accountAddress,
      data: {
        function: `${this.address}::${BRIDGE_MODULE}::${BRIDGE_FUNCTIONS.ClaimValidatorRewards}`,
        functionArguments: [to.toString(), validator, signatures, public_keys],
      },
    });

    return this.aptosClient.signAndSubmitTransaction({
      signer: adminAccount,
      transaction,
    });
  }

  async mintNft721(
    owner: Ed25519Account,
    collection_name: string,
    collection_description: string,
    collection_uri: string,
    nft_name: string,
    nft_description: string,
    nft_uri: string,
  ) {
    const transaction = await this.aptosClient.transaction.build.simple({
      sender: owner.accountAddress,
      data: {
        function: `${this.address}::${MINT_MODULE}::${MINT_FUNCTIONS.MINT_TO}`,
        functionArguments: [
          collection_name,
          collection_description,
          collection_uri,
          nft_name,
          nft_description,
          nft_uri,
        ],
      },
    });

    return this.aptosClient.signAndSubmitTransaction({
      signer: owner,
      transaction,
    });
  }

  async mintNft1155(
    owner: Ed25519Account,
    collection_name: string,
    collection_description: string,
    collection_uri: string,
    nft_name: string,
    nft_description: string,
    nft_uri: string,
    token_symbol: string,
    amount: number,
    icon_uri: string,
    project_uri: string,
  ) {
    const transaction = await this.aptosClient.transaction.build.simple({
      sender: owner.accountAddress,
      data: {
        function: `${this.address}::${MINT_MODULE}::${MINT_FUNCTIONS.MINT_1155_TO}`,
        functionArguments: [
          collection_name,
          collection_description,
          collection_uri,
          nft_name,
          nft_description,
          nft_uri,
          token_symbol,
          amount,
          icon_uri,
          project_uri,
        ],
      },
    });

    return this.aptosClient.signAndSubmitTransaction({
      signer: owner,
      transaction,
    });
  }

  async userOwnsNft(
    owner: HexString,
    collection: string,
    name: string,
  ): Promise<[boolean]> {
    const payload: InputViewFunctionData = {
      function: `${this.address}::${BRIDGE_MODULE}::${BRIDGE_FUNCTIONS.OwnsNFT}`,
      // type_arguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [owner.toString(), collection, name],
    };
    return this.aptosClient.view({ payload });
  }

  async getBridgeData(): Promise<TBridgeData | undefined> {
    const resources = await this.aptosClient.getAccountResources({
      accountAddress: this.address,
    });
    const bridgeResource = resources.find(
      (r) => r.type === `0x${this.address}::aptos_nft_bridge::Bridge`,
    );
    return bridgeResource?.data as TBridgeData;
  }

  generateRandomSeed(length: number): string {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  convertToHexString(str: Uint8Array | string): string {
    return `0x${Buffer.from(str).toString("hex")}`;
  }

  generateClaimDataHash(claimData: TClaimData, user: Ed25519Account): Buffer {
    const serializer = new BCS.Serializer();
    serializer.serializeStr(claimData.tokenId);
    serializer.serializeBytes(claimData.sourceChain);
    serializer.serializeBytes(claimData.destinationChain);
    serializer.serializeFixedBytes(
      new HexString(user.accountAddress.toString()).toUint8Array(),
    );
    serializer.serializeBytes(claimData.sourceNftContractAddress);
    serializer.serializeStr(claimData.collection);
    serializer.serializeU64(claimData.royaltyPointsNumerator);
    serializer.serializeU64(claimData.royaltyPointsDenominator);
    serializer.serializeFixedBytes(
      new HexString(user.accountAddress.toString()).toUint8Array(),
    );
    serializer.serializeStr(claimData.metadata);
    serializer.serializeBytes(claimData.transactionHash);
    serializer.serializeU256(claimData.amount);
    serializer.serializeBytes(claimData.nftType);
    serializer.serializeU64(claimData.fee);
    serializer.serializeStr(claimData.symbol);
    return createHash("SHA256").update(serializer.getBytes()).digest();
  }
}
