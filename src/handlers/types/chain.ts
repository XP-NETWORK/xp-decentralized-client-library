import { BridgeStorage } from "../../contractsTypes/evm";
import { TSupportedChain, TSupportedSftChain } from "../../factory/types/utils";

export type MintNft<Signer, MintArgs, GasArgs, RetTx> = {
  mintNft: (signer: Signer, ma: MintArgs, gasArgs?: GasArgs) => Promise<RetTx>;
};

export type MintSft<Signer, MintArgs, GasArgs, RetTx> = {
  mintSft: (
    signer: Signer,
    ma: MintArgs,
    amount: bigint,
    gasArgs?: GasArgs,
  ) => Promise<RetTx>;
};

export type Mint<Signer, MintArgs, GasArgs, RetTx> = MintNft<
  Signer,
  MintArgs,
  GasArgs,
  RetTx
> &
  MintSft<Signer, MintArgs, GasArgs, RetTx>;

export type DeployNFTCollection<Signer, DeployArgs, GasArgs, RetTx> = {
  deployNftCollection: (
    signer: Signer,
    da: DeployArgs,
    ga?: GasArgs,
  ) => Promise<RetTx>;
};

export type DeploySFTCollection<Signer, DeployArgs, GasArgs, RetTx> = {
  deploySFTCollection: (
    signer: Signer,
    da: DeployArgs,
    ga?: GasArgs,
  ) => Promise<RetTx>;
};

export type TValidateAddress = {
  validateAddress: (address: string) => Promise<boolean>;
};

export type DeployCollection<Signer, DeployArgs, GasArgs, RetTx> =
  DeployNFTCollection<Signer, DeployArgs, GasArgs, RetTx> &
    DeploySFTCollection<Signer, DeployArgs, GasArgs, RetTx>;

/**
 * Represents a function that locks an NFT on the chain inside the bridge smart contract.
 * @template Signer The type of the signer. ie {Signer} on EVM from ethers
 * @template ExtraArgs The type of the extra arguments. It could be anything that might be required as extra arguments on a chain.
 * @template RetTx The type of the return value after a transaction.
 */
export type TLockNFT<Signer, ExtraArgs, RetTx> = {
  /**
   * Locks an NFT on the source chain using the bridge smart contract.
   * @param signer The signer who is going to send the lock transaction.
   * @param sourceNft The address of the NFT contract on the source chain.
   * @param destinationChain The destination chain where the NFT will transferred to on claim.
   * @param to The address of the recipient on the destination chain.
   * @param tokenId The id of the NFT to be locked.
   * @param extraArgs The extra arguments required for a chain.
   * @returns A promise that resolves to the transaction which is of type {RetTx}.
   */
  lockNft: (
    signer: Signer,
    sourceNft: string,
    destinationChain: TSupportedChain,
    to: string,
    tokenId: bigint,
    metaDataUri: string,
    extraArgs?: ExtraArgs,
  ) => Promise<{ ret: RetTx; hash: () => string }>;
};

/**
 * Represents a type definition for the `approveNft` function.
 * @template Signer The type of the signer.
 * @template ExtraArgs The type of the extra arguments.
 * @template RetTx The type of the return transaction.
 */
export type TApproveNFT<Signer, ExtraArgs, RetTx> = {
  /**
   * Approves the NFT to be locked on the source chain using the bridge smart contract.
   * @param signer The signer who is going to send the approve transaction.
   * @param tokenId The id of the NFT to be approved.
   * @param contract The address of the NFT contract on the source chain.
   * @param extraArgs The extra arguments required for a chain.
   * @returns A promise that resolves to the transaction which is of type {RetTx}.
   */
  approveNft: (
    signer: Signer,
    tokenId: string,
    contract: string,
    extraArgs?: ExtraArgs,
  ) => Promise<RetTx>;
};

/**
 * Represents a signer and its corresponding signature.
 * @field signer The signer's address as a string (should be HEX Encoded)
 * @field signature The generated signature as a string (should be HEX Encoded)
 */
export type TSignerAndSignature = {
  signerAddress: string;
  signature: string;
};

/**
 * Represents a function that claims an NFT (locked on a source chain) on the chain using the claim data.
 * @template Signer The type of the signer. ie {Signer} on EVM from ethers
 * @template ClaimData The type of the claim data. It could be anything that might be required to claim an NFT depending on the chain.
 * @template ExtraArgs The type of the extra arguments. It could be anything that might be required as extra arguments on a chain.
 * @template RetTx The type of the return value after a transaction.
 */
export type TClaimNFT<Signer, ClaimData, ExtraArgs, Ret> = {
  /**
   * Function that can be used to claim an NFT on the chain.
   * @param signer The signer who is going to send the claim transaction.
   * @param claimData The claim data required to claim the SFT.
   * @param sigs Signatures Fetched from the Storage Smart Contract That are required to validate the transaction
   * @param extraArgs The extra arguments required for a chain.
   * @returns A promise that resolves to the transaction which is of type {Ret}.
   */
  claimNft: (
    signer: Signer,
    claimData: ClaimData,
    sig: TSignerAndSignature[],
    extraArgs?: ExtraArgs,
  ) => Promise<{ ret: Ret; hash: () => string }>;
};

/**
 * Represents a function type for getting the balance of a signer.
 * @template Signer The type of the signer.
 * @template ExtraArgs The type of the extra arguments.
 */
export type TGetBalance<Signer, ExtraArgs> = {
  /**
   * Retrieves the balance of a signer.
   * @param signer The signer.
   * @param extraArgs The extra arguments required for a chain.
   * @returns A promise that resolves to the balance as a bigint.
   */
  getBalance: (signer: Signer, extraArgs?: ExtraArgs) => Promise<bigint>;
};

/**
 * Represents the data structure for an NFT (Non-Fungible Token).
 * @field name The name of the NFT.
 * @field symbol The symbol of the NFT.
 * @field royalty royalty of the NFT in bigint.
 * @field metadata The metadata uri of the NFT.
 */
export type TNFTData = {
  name: string;
  symbol: string;
  royalty: bigint;
  metadata: string;
};

export type Claimed721Event = {
  lock_tx_chain: string;
  transaction_hash: string;
  source_chain: string;
  token_id: string;
  nft_contract: string;
};

export type Claimed1155Event = Claimed721Event & {
  amount: bigint;
};

export type ReadClaimed721Event = {
  readClaimed721Event: (hash: string) => Promise<Claimed721Event>;
};

export type ReadClaimed1155Event = {
  readClaimed1155Event: (hash: string) => Promise<Claimed1155Event>;
};

/**
 * Represents a type that defines a function to retrieve NFT data.
 * @template ExtraArgs The type of the extra arguments.
 * @template GetNftArgs The type of the arguments for retrieving NFT data.
 */
export type TGetNFTData<ExtraArgs> = {
  /**
   * The function that retrieves the NFT Data
   * @param tokenId The id of the NFT
   * @param contract The address of the NFT contract
   * @param signer Signer that will send the query transaction
   * @returns
   */
  nftData: (
    tokenId: string,
    contract: string,
    extraArgs?: ExtraArgs,
  ) => Promise<TNFTData>;
};

/**
 * Represents the details of a claim for an NFT/SFT.
 */
export type TNftTransferDetailsObject = {
  tokenId: string;
  sourceChain: string;
  destinationChain: string;
  destinationUserAddress: string;
  sourceNftContractAddress: string;
  name: string;
  symbol: string;
  royalty: string;
  royaltyReceiver: string;
  metadata: string;
  transactionHash: string;
  tokenAmount: string;
  nftType: string;
  fee: string;
  lockTxChain: string;
  imgUri?: string;
};

export type LockEvent = {
  tokenId: string;
  destinationChain: string;
  destinationUserAddress: string;
  sourceNftContractAddress: string;
  tokenAmount: string;
  nftType: string;
  sourceChain: string;
  transactionHash: string;
  metaDataUri: string;
};

/**
 * Represents a type that defines a function to get claim data.
 */
export type TGetClaimData = {
  /**
   * Retrieves claim data for a given transaction hash.
   * @param txHash - The transaction hash.
   * @returns A promise that resolves to an object containing claim data @type {TNftTransferDetailsObject}.
   */
  decodeLockedEvent: (txHash: string) => Promise<LockEvent>;
};

/**
 * Represents a type for locking SFT (Semi Fungible Token) on a specific chain.
 * @template Signer - The type of the signer.
 * @template ExtraArgs - The type of additional arguments.
 * @template RetTx - The type of the returned transaction.
 */
export type TLockSFT<Signer, ExtraArgs, RetTx> = {
  /**
   * Locks an SFT on the source chain using the bridge smart contract.
   * @param signer The signer who is going to send the lock transaction.
   * @param sourceNft The address of the SFT contract on the source chain.
   * @param destinationChain The destination chain where the SFT will transferred to on claim.
   * @param to The address of the recipient on the destination chain.
   * @param tokenId The id of the SFT to be locked.
   * @param amt The amount of the SFT to be locked.
   * @param extraArgs The extra arguments required for a chain.
   * @returns A promise that resolves to the transaction which is of type {RetTx}.
   */
  lockSft: (
    signer: Signer,
    sourceNft: string,
    destinationChain: TSupportedSftChain,
    to: string,
    tokenId: bigint,
    amt: bigint,
    metaDataUri: string,
    extraArgs?: ExtraArgs,
  ) => Promise<{ tx: RetTx; hash: () => string }>;
};

/**
 * Represents a function that claims an SFT (locked on a source chain) on the chain using the claim data.
 * @template Signer The type of the signer. ie {Signer} on EVM from ethers
 * @template ClaimData The type of the claim data. It could be anything that might be required to claim an NFT depending on the chain.
 * @template ExtraArgs The type of the extra arguments. It could be anything that might be required as extra arguments on a chain.
 * @template RetTx The type of the return value after a transaction.
 */
export type TClaimSFT<Signer, ClaimData, ExtraArgs, Ret> = {
  /**
   * Function that can be used to claim an SFT on the chain.
   * @param signer The signer who is going to send the claim transaction.
   * @param claimData The claim data required to claim the SFT.
   * @param sigs Signatures Fetched from the Storage Smart Contract That are required to validate the transaction
   * @param extraArgs The extra arguments required for a chain.
   * @returns A promise that resolves to the transaction which is of generic type Ret.
   */
  claimSft: (
    signer: Signer,
    claimData: ClaimData,
    sigs: TSignerAndSignature[],
    extraArgs?: ExtraArgs,
  ) => Promise<{ ret: Ret; hash: () => string }>;
};

export type TGetValidatorCount = {
  getValidatorCount: () => Promise<number>;
};

export type TGetStorage = {
  getStorageContract: () => BridgeStorage;
};

export type TGetChainIdentifier = {
  identifier: string;
};

export type TGetProvider<T> = {
  getProvider: () => T;
};

export type TMapTransferDetailsToChainClaimData<To> = {
  transform: (input: TNftTransferDetailsObject) => To;
};

/**
 * Represents a type that has all the methods required to implement on a chain that can be used in the bridge to transfer Non Fungible Tokens. It is a combination of some of the types defined above.
 * @template Signer The type of the signer. ie {Signer} on EVM from ethers
 * @template ClaimData The type of the claim data. It could be anything that might be required to claim an NFT depending on the chain.
 * @template ExtraArgs The type of the extra arguments. It could be anything that might be required as extra arguments on a chain.
 * @template RetTx The type of the return value after a transaction.
 */
export type TSingularNftChain<Signer, ClaimData, ExtraArgs, RetTx, Provider> =
  TApproveNFT<Signer, ExtraArgs, RetTx> &
    TLockNFT<Signer, ExtraArgs, RetTx> &
    TGetNFTData<ExtraArgs> &
    TClaimNFT<Signer, ClaimData, ExtraArgs, RetTx> &
    TGetBalance<Signer, ExtraArgs> &
    TGetClaimData &
    TGetProvider<Provider> &
    TMapTransferDetailsToChainClaimData<ClaimData> &
    TGetValidatorCount &
    TGetStorage &
    TGetChainIdentifier &
    TValidateAddress;

/**
 * Represents a type that has all the methods required to implement on a chain that can be used in the bridge to transfer Semi Fungible Tokens. It is a combination of some of the types defined above.
 * @template Signer The type of the signer. ie {Signer} on EVM from ethers
 * @template ClaimData The type of the claim data. It could be anything that might be required to claim an NFT depending on the chain.
 * @template ExtraArgs The type of the extra arguments. It could be anything that might be required as extra arguments on a chain.
 * @template RetTx The type of the return value after a transaction.
 */
export type TMultipleNftChain<Signer, ClaimData, ExtraArgs, RetTx, Provider> =
  TLockSFT<Signer, ExtraArgs, RetTx> &
    TClaimSFT<Signer, ClaimData, ExtraArgs, RetTx> &
    TGetNFTData<ExtraArgs> &
    TGetBalance<Signer, ExtraArgs> &
    TGetProvider<Provider>;

/**
 * Represents a type that has all the methods required to implement on a chain that can be used in the bridge to transfer Semi Fungible Tokens or Non Fungible Tokens. It is a combination of all the types defined above.
 * @template Signer The type of the signer. ie {Signer} on EVM from ethers
 * @template ClaimData The type of the claim data. It could be anything that might be required to claim an NFT depending on the chain.
 * @template ExtraArgs The type of the extra arguments. It could be anything that might be required as extra arguments on a chain.
 * @template RetTx The type of the return value after a transaction.
 */
export type TNftChain<Signer, ClaimData, ExtraArgs, RetTx, Provider> =
  TSingularNftChain<Signer, ClaimData, ExtraArgs, RetTx, Provider> &
    TMultipleNftChain<Signer, ClaimData, ExtraArgs, RetTx, Provider>;

/**
 * Represents a type that has the methods required to fetch NFTs from a chain for a user, and a certain contract. This type should be implemented for all chains, that do not have a working indexer.
 * @template NFT The type of the NFT. It could be anything that represents an NFT on that particular chain.
 */
export type TNFTList<NFT, EA> = {
  nftList: (
    owner: string,
    contract: string,
    extraArgs: EA,
  ) => Promise<
    {
      readonly native: NFT;
      readonly uri: string;
      readonly collectionIdent: string;
      readonly tokenId: string;
    }[]
  >;
};
