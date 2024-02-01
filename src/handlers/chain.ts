export type LockNFT<Signer, ExtraArgs> = {
  lockNft: (
    signer: Signer,
    sourceNft: string,
    destinationChain: string,
    to: string,
    tokenId: bigint,
    ex: ExtraArgs,
  ) => Promise<void>;
};

export type SignerAndSignature = {
  signer: string;
  signature: string;
};

export type ClaimNFT<Signer, ClaimData, ExtraArgs> = {
  claimNft: (
    signer: Signer,
    claimData: ClaimData,
    ex: ExtraArgs,
    sig: SignerAndSignature,
  ) => Promise<void>;
};

export type GetBalance<Signer, ExtraArgs> = {
  getBalance: (signer: Signer, ex: ExtraArgs) => Promise<bigint>;
};

export type NFTData = {
  name: string | undefined;
  symbol: string | undefined;
  royalty: number | undefined;
  metadata: string | undefined;
};

export type GetNFTData<Signer, ExtraArgs> = {
  nftData: (
    signer: Signer,
    contract: string | undefined,
    tokenId: string | undefined,
    extraArgs: ExtraArgs | undefined,
  ) => Promise<NFTData>;
};

export type LockSFT<Signer, ExtraArgs> = {
  lockSft: (
    signer: Signer,
    sourceNft: string,
    destinationChain: string,
    to: string,
    tokenId: bigint,
    amt: bigint,
    ex: ExtraArgs,
  ) => Promise<void>;
};

export type ClaimSFT<Signer, ClaimData, ExtraArgs> = {
  claimSft: (
    signer: Signer,
    claimData: ClaimData,
    ex: ExtraArgs,
  ) => Promise<void>;
};

export type SingularNftChain<Signer, ClaimData, ExtraArgs> = LockNFT<
  Signer,
  ExtraArgs
> &
  GetNFTData<Signer, ExtraArgs> &
  ClaimNFT<Signer, ClaimData, ExtraArgs> &
  GetBalance<Signer, ExtraArgs>;

export type MultipleNftChain<Signer, ClaimData, ExtraArgs> = LockSFT<
  Signer,
  ExtraArgs
> &
  ClaimSFT<Signer, ClaimData, ExtraArgs>;

export type NftChain<Signer, ClaimData, ExtraArgs> =
  | SingularNftChain<Signer, ClaimData, ExtraArgs>
  | MultipleNftChain<Signer, ClaimData, ExtraArgs>;
