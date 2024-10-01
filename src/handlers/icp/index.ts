import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import {
  LedgerCanister,
  principalToAccountIdentifier,
} from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { idlFactory as BridgeIdl } from "../../contractsTypes/icp/bridge/bridge";
import { _SERVICE as BridgeService } from "../../contractsTypes/icp/bridge/bridge.types";
import { idlFactory as LedgerIDL } from "../../contractsTypes/icp/ledger/ledger";
import { _SERVICE as LedgerService } from "../../contractsTypes/icp/ledger/ledger.types";
import { idlFactory as NftIdl } from "../../contractsTypes/icp/nft/nft";
import { init } from "../../contractsTypes/icp/nft/nft";
import { _SERVICE } from "../../contractsTypes/icp/nft/nft.types";
import { NftByteCode } from "./nft.wasm.gz.hex";
import { BrowserSigners, TICPHandler, TICPParams } from "./types";

export async function createNftActor(
  contract: string | Principal,
  { agent }: { agent: HttpAgent | BrowserSigners },
) {
  if (ifBrowserSigners(agent)) {
    return await agent.createActor<_SERVICE>({
      canisterId: contract.toString(),
      interfaceFactory: NftIdl,
      host: undefined,
    });
  }
  return Actor.createActor<_SERVICE>(NftIdl, {
    canisterId: contract,
    agent,
  });
}

export async function createBridgeActor(
  contract: string | Principal,
  { agent }: { agent: HttpAgent | BrowserSigners },
) {
  if (ifBrowserSigners(agent)) {
    return await agent.createActor<BridgeService>({
      canisterId: contract.toString(),
      interfaceFactory: BridgeIdl,
      host: undefined,
    });
  }
  return Actor.createActor<BridgeService>(BridgeIdl, {
    canisterId: contract,
    agent,
  });
}

export async function createLedgerActor(
  contract: string | Principal,
  { agent }: { agent: HttpAgent | BrowserSigners },
) {
  if (ifBrowserSigners(agent)) {
    return await agent.createActor<LedgerService>({
      canisterId: contract.toString(),
      interfaceFactory: LedgerIDL,
      host: undefined,
    });
  }
  return Actor.createActor<LedgerService>(BridgeIdl, {
    canisterId: contract,
    agent,
  });
}

export function ifBrowserSigners(
  signers: BrowserSigners | HttpAgent,
): signers is BrowserSigners {
  if ("_isAgent" in signers) {
    return false;
  }
  return true;
}

export async function icpHandler({
  agent,
  bridge,
  storage,
  identifier,
}: TICPParams): Promise<TICPHandler> {
  const ledger = LedgerCanister.create({ agent });
  const bc = await createBridgeActor(bridge, { agent });
  await agent.fetchRootKey();
  return {
    validateAddress(address) {
      try {
        Principal.fromText(address);
        return Promise.resolve(true);
      } catch {
        return Promise.resolve(false);
      }
    },
    identifier,
    async nftList(owner, contract) {
      const nft = await createNftActor(contract, { agent });
      const tokens = await nft.icrc7_tokens_of(
        { owner: Principal.fromText(owner), subaccount: [] },
        [],
        [],
      );

      const nfts = await Promise.allSettled(
        tokens.map(async (tid) => {
          if (
            owner !== (await nft.icrc7_owner_of([tid]))[0][0]?.owner.toText()
          ) {
            throw new Error("Invalid Owner");
          }
          const [[md]] = await nft.icrc7_token_metadata([tid]);
          if (!md)
            throw new Error("No metadata found for this token id and contract");
          const [, value] = md[0];
          if (!("Text" in value)) {
            throw new Error("Invalid Metadata");
          }
          const metadata = value.Text;
          return {
            tokenId: tid.toString(),
            uri: metadata,
            native: md,
            collectionIdent: contract,
          } as const;
        }),
      );
      const response = nfts.flatMap((e) => {
        if (e.status === "fulfilled") {
          return [e.value];
        }
        return [];
      });
      return response;
    },
    async getBalance(signer) {
      return ledger.accountBalance({
        accountIdentifier: principalToAccountIdentifier(
          await signer.getPrincipal(),
        ),
      });
    },
    getProvider() {
      return agent;
    },
    async approveNft(signer, tokenId, contract) {
      const nft = await createNftActor(contract, {
        agent: signer,
      });
      const approvals = await nft.icrc37_approve_tokens([
        {
          approval_info: {
            created_at_time: [],
            spender: {
              owner: bridge,
              subaccount: [],
            },
            expires_at: [],
            from_subaccount: [],
            memo: [],
          },
          token_id: BigInt(tokenId),
        },
      ]);
      const [approval] = approvals[0];
      if (!approval || "Err" in approval)
        throw new Error(`Failed to approve, ${approval?.Err}`);
      return approval.Ok.toString();
    },
    async deployNftCollection(signer, _da) {
      const encoded = init({ IDL })[0].encodeValue({
        icrc3_args: [
          {
            maxRecordsToArchive: 10_000,
            archiveIndexType: {
              Stable: [],
            },
            maxArchivePages: 62500,
            settleToRecords: 2000,
            archiveCycles: 2_000_000_000_000,
            maxActiveRecords: 4000,
            maxRecordsInArchiveInstance: 5_000_000,
            archiveControllers: [],
            supportedBlocks: [[]],
            deployer: await signer.getPrincipal(),
          },
        ],
        icrc37_args: [],
        icrc7_args: [],
      });
      const actor = await Actor.createAndInstallCanister(
        NftIdl,
        {
          module: Buffer.from(NftByteCode, "hex"),
          arg: encoded,
        },
        {
          agent: signer,
        },
      );
      return Actor.canisterIdOf(actor).toString();
    },
    async mintNft(signer, ma) {
      const nft = await createNftActor(ma.contract, {
        agent: signer,
      });
      const mints = await nft.icrcX_mint(
        ma.token_id,
        {
          owner: Principal.fromText(ma.owner),
          subaccount: [],
        },
        ma.metadata,
      );
      const mint = mints[0];
      if (!("Ok" in mint)) {
        throw new Error(`Failed to mint reason: ${JSON.stringify(mint)}`);
      }
      return (
        mint.Ok[0]?.toString() ??
        (() => {
          throw new Error("unreachable");
        })()
      );
    },
    async nftData(tokenId, contract) {
      const nft = await createNftActor(contract, {
        agent,
      });
      const name = await nft.icrc7_name();
      const symbol = await nft.icrc7_symbol();
      const [[md]] = await nft.icrc7_token_metadata([BigInt(tokenId)]);
      if (!md)
        throw new Error("No metadata found for this token id and contract");
      const [, value] = md[0];
      if (!("Text" in value)) {
        throw new Error("Invalid Metadata");
      }
      const metadata = value.Text;
      return {
        metadata,
        name: name === "" ? "TICP" : name,
        royalty: 0n,
        symbol: symbol === "" ? "TICP" : symbol,
      };
    },
    async decodeLockedEvent(txHash) {
      const [le] = await bc.get_locked_data(txHash);
      if (!le) throw new Error("No locked event found for the hash");

      return {
        destinationChain: le.destination_chain,
        destinationUserAddress: le.destination_user_address,
        sourceNftContractAddress: le.source_nft_contract_address.toString(),
        nftType: le.nft_type,
        sourceChain: le.source_chain,
        tokenId: le.token_id.toString(),
        tokenAmount: le.token_amount.toString(),
        transactionHash: txHash,
        lockTxChain: identifier,
        metaDataUri: "",
      };
    },
    getStorageContract() {
      return storage;
    },
    async lockNft(signer, sourceNft, destinationChain, to, tokenId) {
      const bcWithSigner = await createBridgeActor(bridge, {
        agent: signer,
      });
      const hash = await bcWithSigner.lock_nft(
        Principal.fromText(sourceNft),
        tokenId,
        destinationChain,
        to,
      );
      return {
        hash: () => hash,
        ret: hash,
      };
    },

    async claimNft(signer, claimData, sig) {
      const lc = await createLedgerActor("ryjl3-tyaaa-aaaaa-aaaba-cai", {
        agent: signer,
      });
      await lc.icrc2_approve({
        amount: BigInt(claimData.fee + 10_000n),
        spender: {
          owner: bridge,
          subaccount: [],
        },
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
        fee: [],
        from_subaccount: [],
        memo: [],
      });
      const bcWithSigner = await createBridgeActor(bridge, { agent: signer });
      const claim = await bcWithSigner.claim_nft(
        claimData,
        sig.map((e) => {
          return {
            signature: e.signature.replace("0x", ""),
            signer: e.signerAddress,
          };
        }),
      );
      return {
        hash() {
          return claim;
        },
        ret: claim,
      };
    },
    async getValidatorCount() {
      return Number(await bc.get_validator_count());
    },
    async readClaimed721Event(hash) {
      const [ev] = await bc.get_claimed_data(hash);
      if (!ev) throw new Error("No Claimed Event fonud for this hash");
      return {
        nft_contract: ev.nft_contract.toText(),
        source_chain: ev.source_chain,
        token_id: ev.token_id.toString(),
        transaction_hash: ev.transaction_hash.toString(),
        lock_tx_chain: ev.lock_tx_chain,
      };
    },
    transform(input) {
      return {
        destination_chain: input.destinationChain,
        destination_user_address: Principal.fromText(
          input.destinationUserAddress,
        ),
        fee: BigInt(input.fee),
        nft_type: input.nftType,
        metadata: input.metadata,
        name: input.name,
        royalty: BigInt(input.royalty),
        royalty_receiver: Principal.fromText(input.royaltyReceiver),
        source_chain: input.sourceChain,
        source_nft_contract_address: input.sourceNftContractAddress,
        symbol: input.symbol,
        token_amount: BigInt(input.tokenAmount),
        token_id: BigInt(input.tokenId),
        transaction_hash: input.transactionHash,
        lock_tx_chain: input.lockTxChain,
      };
    },
  };
}
