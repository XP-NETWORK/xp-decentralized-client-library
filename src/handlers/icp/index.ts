import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import {
  LedgerCanister,
  principalToAccountIdentifier,
} from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { idlFactory as BridgeIdl } from "../../contractsTypes/icp/bridge/bridge";
import { _SERVICE as BridgeService } from "../../contractsTypes/icp/bridge/bridge.types";
import { idlFactory as NftIdl } from "../../contractsTypes/icp/nft/nft";
import { init } from "../../contractsTypes/icp/nft/nft";
import { _SERVICE } from "../../contractsTypes/icp/nft/nft.types";
import { TNFTData } from "../types";
import { NftByteCode } from "./nft.wasm.gz.hex";
import { TICPHandler, TICPParams } from "./types";

export function createNftActor(
  contract: string | Principal,
  { agent }: { agent: HttpAgent },
) {
  return Actor.createActor<_SERVICE>(NftIdl, {
    canisterId: contract,
    agent,
  });
}

export function createBridgeActor(
  contract: string | Principal,
  { agent }: { agent: HttpAgent },
) {
  return Actor.createActor<BridgeService>(BridgeIdl, {
    canisterId: contract,
    agent,
  });
}

export function icpHandler({
  agent,
  bridge,
  storage,
  identifier,
}: TICPParams): TICPHandler {
  const ledger = LedgerCanister.create({ agent });
  const bc = createBridgeActor(bridge, { agent });
  return {
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
      const nft = createNftActor(contract, {
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
    async deployCollection(signer, _da) {
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
      const nft = createNftActor(ma.contract, {
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
        throw new Error(`Failed to mint reason: ${mint}`);
      }
      return (
        mint.Ok[0]?.toString() ??
        (() => {
          throw new Error("unreachable");
        })()
      );
    },
    async nftData(tokenId, contract) {
      const nft = createNftActor(contract, {
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
        name,
        royalty: 0n,
        symbol,
      };
    },
    async getClaimData(txHash) {
      const [le] = await bc.get_locked_data(txHash);
      if (!le) throw new Error("No locked event found for the hash");

      const fee = await storage.chainFee(le.destination_chain);
      const royaltyReceiver = await storage.chainRoyalty(le.destination_chain);

      const nft: TNFTData = {
        metadata: "",
        name: "TICP",
        royalty: 0n,
        symbol: "TICP",
      };

      return {
        destinationChain: le.destination_chain,
        destinationUserAddress: le.destination_user_address,
        fee: fee.toString(),
        royaltyReceiver,
        royalty: "0",
        sourceNftContractAddress: le.source_nft_contract_address.toString(),
        nftType: le.nft_type,
        sourceChain: le.source_chain,
        tokenId: le.token_id.toString(),
        tokenAmount: le.token_amount.toString(),
        transactionHash: txHash,
        metadata: nft.metadata,
        name: nft.name,
        symbol: nft.symbol,
        lockTxChain: identifier,
      };
    },
    getStorageContract() {
      return storage;
    },
    async lockNft(signer, sourceNft, destinationChain, to, tokenId) {
      const bcWithSigner = createBridgeActor(bridge, {
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
      const bcWithSigner = createBridgeActor(bridge, {
        agent: signer,
      });
      const lc = LedgerCanister.create({ agent: signer });
      await lc.icrc2Approve({
        amount: BigInt(claimData.fee + 10_000n),
        spender: {
          owner: bridge,
          subaccount: [],
        },
      });
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
