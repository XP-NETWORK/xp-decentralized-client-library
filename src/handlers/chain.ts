export type LockNFT<Signer, ExtraArgs, RetTx> = {
  lockNft: (
    signer: Signer,
    sourceNft: string,
    destinationChain: string,
    to: string,
    tokenId: bigint,
    ex: ExtraArgs,
  ) => Promise<RetTx>;
};

export type SignerAndSignature = {
  signer: string;
  signature: string;
};

export type ClaimNFT<Signer, ClaimData, ExtraArgs, Ret> = {
  claimNft: (
    signer: Signer,
    claimData: ClaimData,
    ex: ExtraArgs,
    sig: SignerAndSignature[],
  ) => Promise<Ret>;
};

export type GetBalance<Signer, ExtraArgs> = {
  getBalance: (signer: Signer, ex: ExtraArgs) => Promise<bigint>;
};

export type NFTData = {
  name: string | undefined;
  symbol: string | undefined;
  royalty: bigint | undefined;
  metadata: string | undefined;
};

export type GetNFTData<Signer, ExtraArgs, GetNftArgs extends unknown[]> = {
  nftData: (
    signer: Signer,
    extraArgs: ExtraArgs,
    ...args: GetNftArgs
  ) => Promise<NFTData>;
};

export type LockSFT<Signer, ExtraArgs, RetTx> = {
  lockSft: (
    signer: Signer,
    sourceNft: string,
    destinationChain: string,
    to: string,
    tokenId: bigint,
    amt: bigint,
    ex: ExtraArgs,
  ) => Promise<RetTx>;
};

export type ClaimSFT<Signer, ClaimData, ExtraArgs, Ret> = {
  claimSft: (
    signer: Signer,
    claimData: ClaimData,
    sigs: SignerAndSignature[],
    ex: ExtraArgs,
  ) => Promise<Ret>;
};

export type SingularNftChain<Signer, ClaimData, ExtraArgs, RetTx> = LockNFT<
  Signer,
  ExtraArgs,
  RetTx
> &
  GetNFTData<Signer, ExtraArgs, [tokenId: bigint, contract: string]> &
  ClaimNFT<Signer, ClaimData, ExtraArgs, RetTx> &
  GetBalance<Signer, ExtraArgs>;

export type MultipleNftChain<Signer, ClaimData, ExtraArgs, RetTx> = LockSFT<
  Signer,
  ExtraArgs,
  RetTx
> &
  ClaimSFT<Signer, ClaimData, ExtraArgs, RetTx>;

export type NftChain<Signer, ClaimData, ExtraArgs, RetTx> =
  | SingularNftChain<Signer, ClaimData, ExtraArgs, RetTx>
  | MultipleNftChain<Signer, ClaimData, ExtraArgs, RetTx>;
