"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icpHandler = void 0;
const agent_1 = require("@dfinity/agent");
const candid_1 = require("@dfinity/candid");
const ledger_icp_1 = require("@dfinity/ledger-icp");
const principal_1 = require("@dfinity/principal");
const bridge_1 = require("../../contractsTypes/icp/bridge");
const nft_1 = require("../../contractsTypes/icp/nft");
const nft_did_1 = require("../../contractsTypes/icp/nft/nft.did");
const nft_wasm_gz_hex_1 = require("./nft.wasm.gz.hex");
async function icpHandler({ agent, bridge, storage, }) {
    const ledger = ledger_icp_1.LedgerCanister.create({ agent });
    const bc = (0, bridge_1.createActor)(bridge);
    return {
        async getBalance(signer) {
            return ledger.accountBalance({
                accountIdentifier: (0, ledger_icp_1.principalToAccountIdentifier)(await signer.getPrincipal()),
            });
        },
        getProvider() {
            return agent;
        },
        async approveNft(signer, tokenId, contract) {
            const nft = (0, nft_1.createActor)(contract, {
                agent: signer,
            });
            const approvals = await nft.icrc37_approve_tokens([
                {
                    approval_info: {
                        created_at_time: [BigInt(Date.now())],
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
                throw new Error("Failed to approve");
            return approval.Ok.toString();
        },
        async deployCollection(signer, da) {
            const actor = await agent_1.Actor.createAndInstallCanister(nft_1.idlFactory, {
                module: Buffer.from(nft_wasm_gz_hex_1.NftByteCode, "hex"),
                arg: (0, nft_did_1.init)({ IDL: candid_1.IDL })[0].encodeValue({
                    icrc3_args: [],
                    icrc37_args: [],
                    icrc7_args: [
                        {
                            name: da.name,
                            symbol: da.symbol,
                        },
                    ],
                }),
            }, {
                agent: signer,
            });
            return agent_1.Actor.canisterIdOf(actor).toString();
        },
        async mintNft(signer, ma) {
            const nft = (0, nft_1.createActor)(ma.contract, {
                agent: signer,
            });
            const mints = await nft.icrcX_mint(ma.token_id, {
                owner: principal_1.Principal.fromText(ma.owner),
                subaccount: [],
            }, ma.metadata);
            const mint = mints[0];
            if (!("Ok" in mint)) {
                throw new Error(`Failed to mint reason: ${mint}`);
            }
            return (mint.Ok[0]?.toString() ??
                (() => {
                    throw new Error("unreachable");
                })());
        },
        async nftData(tokenId, contract) {
            const nft = (0, nft_1.createActor)(contract, {
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
            if (!le)
                throw new Error("No locked event found for the hash");
            const fee = await storage.chainFee(le.destination_chain);
            const royaltyReceiver = await storage.chainRoyalty(le.destination_chain);
            const nft = {
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
            };
        },
        getStorageContract() {
            return storage;
        },
        async lockNft(signer, sourceNft, destinationChain, to, tokenId) {
            const bcWithSigner = (0, bridge_1.createActor)(bridge, {
                agent: signer,
            });
            const hash = await bcWithSigner.lock_nft(principal_1.Principal.fromText(sourceNft), tokenId, destinationChain, to);
            return {
                hash: () => hash,
                ret: hash,
            };
        },
        async claimNft(signer, claimData, sig) {
            const bcWithSigner = (0, bridge_1.createActor)(bridge, {
                agent: signer,
            });
            const claim = await bcWithSigner.claim_nft(claimData, sig.map((e) => {
                return {
                    signature: e.signature,
                    signer: e.signerAddress,
                };
            }));
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
            if (!ev)
                throw new Error("No Claimed Event fonud for this hash");
            return {
                nft_contract: ev.nft_contract.toText(),
                source_chain: ev.source_chain,
                token_id: ev.token_id.toString(),
                transaction_hash: ev.transaction_hash.toString(),
            };
        },
        transform(input) {
            return {
                destination_chain: input.destinationChain,
                destination_user_address: principal_1.Principal.fromText(input.destinationUserAddress),
                fee: BigInt(input.fee),
                nft_type: input.nftType,
                metadata: input.metadata,
                name: input.name,
                royalty: BigInt(input.royalty),
                royalty_receiver: principal_1.Principal.fromText(input.royaltyReceiver),
                source_chain: input.sourceChain,
                source_nft_contract_address: input.sourceNftContractAddress,
                symbol: input.symbol,
                token_amount: BigInt(input.tokenAmount),
                token_id: BigInt(input.tokenId),
                transaction_hash: input.transactionHash,
            };
        },
    };
}
exports.icpHandler = icpHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaWNwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUF1QztBQUN2Qyw0Q0FBc0M7QUFDdEMsb0RBRzZCO0FBQzdCLGtEQUErQztBQUMvQyw0REFBOEQ7QUFDOUQsc0RBR3NDO0FBQ3RDLGtFQUE0RDtBQUU1RCx1REFBZ0Q7QUFHekMsS0FBSyxVQUFVLFVBQVUsQ0FBQyxFQUMvQixLQUFLLEVBQ0wsTUFBTSxFQUNOLE9BQU8sR0FDSTtJQUNYLE1BQU0sTUFBTSxHQUFHLDJCQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNoRCxNQUFNLEVBQUUsR0FBRyxJQUFBLG9CQUFXLEVBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsT0FBTztRQUNMLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTTtZQUNyQixPQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUM7Z0JBQzNCLGlCQUFpQixFQUFFLElBQUEseUNBQTRCLEVBQzdDLE1BQU0sTUFBTSxDQUFDLFlBQVksRUFBRSxDQUM1QjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVE7WUFDeEMsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBYyxFQUFDLFFBQVEsRUFBRTtnQkFDbkMsS0FBSyxFQUFFLE1BQU07YUFDZCxDQUFDLENBQUM7WUFDSCxNQUFNLFNBQVMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDaEQ7b0JBQ0UsYUFBYSxFQUFFO3dCQUNiLGVBQWUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDckMsT0FBTyxFQUFFOzRCQUNQLEtB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