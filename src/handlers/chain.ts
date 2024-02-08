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
    destinationChain: string,
    to: string,
    tokenId: bigint,
    extraArgs: ExtraArgs,
  ) => Promise<RetTx>;
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
  approveNft(
    signer: Signer,
    tokenId: string,
    contract: string,
    extraArgs: ExtraArgs,
  ): Promise<RetTx>;
};

/**
 * Represents a signer and its corresponding signature.
 * @field signer The signer's address as a string (should be HEX Encoded)
 * @field signature The generated signature as a string (should be HEX Encoded)
 */
export type TSignerAndSignature = {
  signer: string;
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
    extraArgs: ExtraArgs,
    sig: TSignerAndSignature[],
  ) => Promise<Ret>;
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
  getBalance: (signer: Signer, extraArgs: ExtraArgs) => Promise<bigint>;
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

/**
 * Represents a type that defines a function to retrieve NFT data.
 * @template Signer The type of the signer.
 * @template ExtraArgs The type of the extra arguments.
 * @template GetNftArgs The type of the arguments for retrieving NFT data.
 */
export type TGetNFTData<Signer, ExtraArgs, GetNftArgs extends unknown[]> = {
  /**
   * The function that retrieves the NFT Data
   * @param signer Signer that will send the query transaction
   * @param extraArgs ExtraArgs required to retrieve NFT data
   * @param args Arguments required to retrieve NFT data. Must be a Tuple
   * @returns
   */
  nftData: (
    signer: Signer,
    extraArgs: ExtraArgs,
    ...args: GetNftArgs
  ) => Promise<TNFTData>;
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
    destinationChain: string,
    to: string,
    tokenId: bigint,
    amt: bigint,
    extraArgs: ExtraArgs,
  ) => Promise<RetTx>;
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
    extraArgs: ExtraArgs,
  ) => Promise<Ret>;
};

/**
 * Represents a type that has all the methods required to implement on a chain that can be used in the bridge to transfer Non Fungible Tokens. It is a combination of some of the types defined above.
 * @template Signer The type of the signer. ie {Signer} on EVM from ethers
 * @template ClaimData The type of the claim data. It could be anything that might be required to claim an NFT depending on the chain.
 * @template GetNFTArgs The type of the arguments for retrieving NFT data. It has to be a named tuple
 * @template ExtraArgs The type of the extra arguments. It could be anything that might be required as extra arguments on a chain.
 * @template RetTx The type of the return value after a transaction.
 */
export type TSingularNftChain<
  Signer,
  ClaimData,
  GetNFTArgs extends unknown[],
  ExtraArgs,
  RetTx,
> = TApproveNFT<Signer, ExtraArgs, RetTx> &
  TLockNFT<Signer, ExtraArgs, RetTx> &
  TGetNFTData<Signer, ExtraArgs, GetNFTArgs> &
  TClaimNFT<Signer, ClaimData, ExtraArgs, RetTx> &
  TGetBalance<Signer, ExtraArgs>;

/**
 * Represents a type that has all the methods required to implement on a chain that can be used in the bridge to transfer Semi Fungible Tokens. It is a combination of some of the types defined above.
 * @template Signer The type of the signer. ie {Signer} on EVM from ethers
 * @template ClaimData The type of the claim data. It could be anything that might be required to claim an NFT depending on the chain.
 * @template GetNFTArgs The type of the arguments for retrieving NFT data. It has to be a named tuple
 * @template ExtraArgs The type of the extra arguments. It could be anything that might be required as extra arguments on a chain.
 * @template RetTx The type of the return value after a transaction.
 */
export type TMultipleNftChain<
  Signer,
  ClaimData,
  GetNFTArgs extends unknown[],
  ExtraArgs,
  RetTx,
> = TLockSFT<Signer, ExtraArgs, RetTx> &
  TClaimSFT<Signer, ClaimData, ExtraArgs, RetTx> &
  TGetNFTData<Signer, ExtraArgs, GetNFTArgs> &
  TGetBalance<Signer, ExtraArgs>;

/**
 * Represents a type that has all the methods required to implement on a chain that can be used in the bridge to transfer Semi Fungible Tokens or Non Fungible Tokens. It is a combination of all the types defined above.
 * @template Signer The type of the signer. ie {Signer} on EVM from ethers
 * @template ClaimData The type of the claim data. It could be anything that might be required to claim an NFT depending on the chain.
 * @template GetNFTArgs The type of the arguments for retrieving NFT data. It has to be a named tuple
 * @template ExtraArgs The type of the extra arguments. It could be anything that might be required as extra arguments on a chain.
 * @template RetTx The type of the return value after a transaction.
 */
export type TNftChain<
  Signer,
  ClaimData,
  GetNFTArgs extends unknown[],
  ExtraArgs,
  RetTx,
> = TSingularNftChain<Signer, ClaimData, GetNFTArgs, ExtraArgs, RetTx> &
  TMultipleNftChain<Signer, ClaimData, GetNFTArgs, ExtraArgs, RetTx>;
