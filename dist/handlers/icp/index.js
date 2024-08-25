"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icpHandler = exports.createBridgeActor = exports.createNftActor = void 0;
const agent_1 = require("@dfinity/agent");
const candid_1 = require("@dfinity/candid");
const ledger_icp_1 = require("@dfinity/ledger-icp");
const principal_1 = require("@dfinity/principal");
const bridge_1 = require("../../contractsTypes/icp/bridge/bridge");
const nft_1 = require("../../contractsTypes/icp/nft/nft");
const nft_2 = require("../../contractsTypes/icp/nft/nft");
const nft_wasm_gz_hex_1 = require("./nft.wasm.gz.hex");
function createNftActor(contract, { agent }) {
    return agent_1.Actor.createActor(nft_1.idlFactory, {
        canisterId: contract,
        agent,
    });
}
exports.createNftActor = createNftActor;
function createBridgeActor(contract, { agent }) {
    return agent_1.Actor.createActor(bridge_1.idlFactory, {
        canisterId: contract,
        agent,
    });
}
exports.createBridgeActor = createBridgeActor;
function icpHandler({ agent, bridge, storage, identifier, }) {
    const ledger = ledger_icp_1.LedgerCanister.create({ agent });
    const bc = createBridgeActor(bridge, { agent });
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
            const encoded = (0, nft_2.init)({ IDL: candid_1.IDL })[0].encodeValue({
                icrc3_args: [
                    {
                        maxRecordsToArchive: 10000,
                        archiveIndexType: {
                            Stable: [],
                        },
                        maxArchivePages: 62500,
                        settleToRecords: 2000,
                        archiveCycles: 2000000000000,
                        maxActiveRecords: 4000,
                        maxRecordsInArchiveInstance: 5000000,
                        archiveControllers: [],
                        supportedBlocks: [[]],
                        deployer: await signer.getPrincipal(),
                    },
                ],
                icrc37_args: [],
                icrc7_args: [],
            });
            const actor = await agent_1.Actor.createAndInstallCanister(nft_1.idlFactory, {
                module: Buffer.from(nft_wasm_gz_hex_1.NftByteCode, "hex"),
                arg: encoded,
            }, {
                agent: signer,
            });
            return agent_1.Actor.canisterIdOf(actor).toString();
        },
        async mintNft(signer, ma) {
            const nft = createNftActor(ma.contract, {
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
            const hash = await bcWithSigner.lock_nft(principal_1.Principal.fromText(sourceNft), tokenId, destinationChain, to);
            return {
                hash: () => hash,
                ret: hash,
            };
        },
        async claimNft(signer, claimData, sig) {
            const bcWithSigner = createBridgeActor(bridge, {
                agent: signer,
            });
            const lc = ledger_icp_1.LedgerCanister.create({ agent: signer });
            await lc.icrc2Approve({
                amount: BigInt(claimData.fee + 10000n),
                spender: {
                    owner: bridge,
                    subaccount: [],
                },
            });
            const claim = await bcWithSigner.claim_nft(claimData, sig.map((e) => {
                return {
                    signature: e.signature.replace("0x", ""),
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
                lock_tx_chain: ev.lock_tx_chain,
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
                lock_tx_chain: input.lockTxChain,
            };
        },
    };
}
exports.icpHandler = icpHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaWNwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUFrRDtBQUNsRCw0Q0FBc0M7QUFDdEMsb0RBRzZCO0FBQzdCLGtEQUErQztBQUMvQyxtRUFBaUY7QUFFakYsMERBQXdFO0FBQ3hFLDBEQUF3RDtBQUd4RCx1REFBZ0Q7QUFHaEQsU0FBZ0IsY0FBYyxDQUM1QixRQUE0QixFQUM1QixFQUFFLEtBQUssRUFBd0I7SUFFL0IsT0FBTyxhQUFLLENBQUMsV0FBVyxDQUFXLGdCQUFNLEVBQUU7UUFDekMsVUFBVSxFQUFFLFFBQVE7UUFDcEIsS0FBSztLQUNOLENBQUMsQ0FBQztBQUNMLENBQUM7QUFSRCx3Q0FRQztBQUVELFNBQWdCLGlCQUFpQixDQUMvQixRQUE0QixFQUM1QixFQUFFLEtBQUssRUFBd0I7SUFFL0IsT0FBTyxhQUFLLENBQUMsV0FBVyxDQUFnQixtQkFBUyxFQUFFO1FBQ2pELFVBQVUsRUFBRSxRQUFRO1FBQ3BCLEtBQUs7S0FDTixDQUFDLENBQUM7QUFDTCxDQUFDO0FBUkQsOENBUUM7QUFFRCxTQUFnQixVQUFVLENBQUMsRUFDekIsS0FBSyxFQUNMLE1BQU0sRUFDTixPQUFPLEVBQ1AsVUFBVSxHQUNDO0lBQ1gsTUFBTSxNQUFNLEdBQUcsMkJBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sRUFBRSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDaEQsT0FBTztRQUNMLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTTtZQUNyQixPQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUM7Z0JBQzNCLGlCQUFpQixFQUFFLElBQUEseUNBQTRCLEVBQzdDLE1BQU0sTUFBTSxDQUFDLFlBQVksRUFBRSxDQUM1QjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVE7WUFDeEMsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLFFBQVEsRUFBRTtnQkFDbkMsS0FBSyxFQUFFLE1BQU07YUFDZCxDQUFDLENBQUM7WUFDSCxNQUFNLFNBQVMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDaEQ7b0JBQ0UsYUFBYSxFQUFFO3dCQUNiLGVBQWUsRUFBRSxFQUFFO3dCQUNuQixPQUFPLEVBQUU7NEJBQ1AsS0FBSyxFQUFFLE1BQU07NEJBQ2IsVUFBVSxFQUFFLEVBQUU7eUJBQ2Y7d0JBQ0QsVUFBVSxFQUFFLEVBQUU7d0JBQ2QsZUFBZSxFQUFFLEVBQUU7d0JBQ25CLElBQUksRUFBRSxFQUFFO3FCQUNUO29CQUNELFFBQVEsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDO2lCQUMxQjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLElBQUksUUFBUTtnQkFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDekQsT0FBTyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLENBQUM7UUFDRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUc7WUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBQSxVQUFJLEVBQUMsRUFBRSxHQUFHLEVBQUgsWUFBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7Z0JBQzNDLFVBQVUsRUFBRTtvQkFDVjt3QkFDRSxtQkFBbUIsRUFBRSxLQUFNO3dCQUMzQixnQkFBZ0IsRUFBRTs0QkFDaEIsTUFBTSxFQUFFLEVBQUU7eUJBQ1g7d0JBQ0QsZUFBZSxFQUFFLEtBQUs7d0JBQ3RCLGVBQWUsRUFBRSxJQUFJO3dCQUNyQixhQUFhLEVBQUUsYUFBaUI7d0JBQ2hDLGdCQUFnQixFQUFFLElBQUk7d0JBQ3RCLDJCQUEyQixFQUFFLE9BQVM7d0JBQ3RDLGtCQUFrQixFQUFFLEVBQUU7d0JBQ3RCLGVBQWUsRUFBRSxDQUFDLEVBQUUsQ0FBQzt3QkFDckIsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDLFlBQVksRUFBRTtxQkFDdEM7aUJBQ0Y7Z0JBQ0QsV0FBVyxFQUFFLEVBQUU7Z0JBQ2YsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDLENBQUM7WUFDSCxNQUFNLEtBQUssR0FBRyxNQUFNLGFBQUssQ0FBQyx3QkFBd0IsQ0FDaEQsZ0JBQU0sRUFDTjtnQkFDRSxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBVyxFQUFFLEtBQUssQ0FBQztnQkFDdkMsR0FBRyxFQUFFLE9BQU87YUFDYixFQUNEO2dCQUNFLEtBQUssRUFBRSxNQUFNO2FBQ2QsQ0FDRixDQUFDO1lBQ0YsT0FBTyxhQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzlDLENBQUM7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3RCLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO2dCQUN0QyxLQUFLLEVBQUUsTUFBTTthQUNkLENBQUMsQ0FBQztZQUNILE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FDaEMsRUFBRSxDQUFDLFFBQVEsRUFDWDtnQkFDRSxLQUFLLEVBQUUscUJBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDbkMsVUFBVSxFQUFFLEVBQUU7YUFDZixFQUNELEVBQUUsQ0FBQyxRQUFRLENBQ1osQ0FBQztZQUNGLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNwRCxDQUFDO1lBQ0QsT0FBTyxDQUNMLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFO2dCQUN0QixDQUFDLEdBQUcsRUFBRTtvQkFDSixNQUFNLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDLENBQUMsRUFBRSxDQUNMLENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUTtZQUM3QixNQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFO2dCQUNuQyxLQUFLO2FBQ04sQ0FBQyxDQUFDO1lBQ0gsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDcEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDeEMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7WUFDRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQzVCLE9BQU87Z0JBQ0wsUUFBUTtnQkFDUixJQUFJO2dCQUNKLE9BQU8sRUFBRSxFQUFFO2dCQUNYLE1BQU07YUFDUCxDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTTtZQUN2QixNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxFQUFFO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUUvRCxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDekQsTUFBTSxlQUFlLEdBQUcsTUFBTSxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBRXpFLE1BQU0sR0FBRyxHQUFhO2dCQUNwQixRQUFRLEVBQUUsRUFBRTtnQkFDWixJQUFJLEVBQUUsTUFBTTtnQkFDWixPQUFPLEVBQUUsRUFBRTtnQkFDWCxNQUFNLEVBQUUsTUFBTTthQUNmLENBQUM7WUFFRixPQUFPO2dCQUNMLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxpQkFBaUI7Z0JBQ3RDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyx3QkFBd0I7Z0JBQ25ELEdBQUcsRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUNuQixlQUFlO2dCQUNmLE9BQU8sRUFBRSxHQUFHO2dCQUNaLHdCQUF3QixFQUFFLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxRQUFRLEVBQUU7Z0JBQ25FLE9BQU8sRUFBRSxFQUFFLENBQUMsUUFBUTtnQkFDcEIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxZQUFZO2dCQUM1QixPQUFPLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7Z0JBQy9CLFdBQVcsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRTtnQkFDdkMsZUFBZSxFQUFFLE1BQU07Z0JBQ3ZCLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUTtnQkFDdEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO2dCQUNkLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtnQkFDbEIsV0FBVyxFQUFFLFVBQVU7YUFDeEIsQ0FBQztRQUNKLENBQUM7UUFDRCxrQkFBa0I7WUFDaEIsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsT0FBTztZQUM1RCxNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7Z0JBQzdDLEtBQUssRUFBRSxNQUFNO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxJQUFJLEdBQUcsTUFBTSxZQUFZLENBQUMsUUFBUSxDQUN0QyxxQkFBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFDN0IsT0FBTyxFQUNQLGdCQUFnQixFQUNoQixFQUFFLENBQ0gsQ0FBQztZQUNGLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUk7Z0JBQ2hCLEdBQUcsRUFBRSxJQUFJO2FBQ1YsQ0FBQztRQUNKLENBQUM7UUFFRCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRztZQUNuQyxNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7Z0JBQzdDLEtBQUssRUFBRSxNQUFNO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxFQUFFLEdBQUcsMkJBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUNwRCxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3BCLE1BQU0sRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxNQUFPLENBQUM7Z0JBQ3ZDLE9BQU8sRUFBRTtvQkFDUCxLQUFLLEVBQUUsTUFBTTtvQkFDYixVQUFVLEVBQUUsRUFBRTtpQkFDZjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sS0FBSyxHQUFHLE1BQU0sWUFBWSxDQUFDLFNBQVMsQ0FDeEMsU0FBUyxFQUNULEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDWixPQUFPO29CQUNMLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO29CQUN4QyxNQUFNLEVBQUUsQ0FBQyxDQUFDLGFBQWE7aUJBQ3hCLENBQUM7WUFDSixDQUFDLENBQUMsQ0FDSCxDQUFDO1lBQ0YsT0FBTztnQkFDTCxJQUFJO29CQUNGLE9BQU8sS0FBSyxDQUFDO2dCQUNmLENBQUM7Z0JBQ0QsR0FBRyxFQUFFLEtBQUs7YUFDWCxDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssQ0FBQyxpQkFBaUI7WUFDckIsT0FBTyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFDRCxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSTtZQUM1QixNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLEVBQUU7Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQ2pFLE9BQU87Z0JBQ0wsWUFBWSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO2dCQUN0QyxZQUFZLEVBQUUsRUFBRSxDQUFDLFlBQVk7Z0JBQzdCLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtnQkFDaEMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtnQkFDaEQsYUFBYSxFQUFFLEVBQUUsQ0FBQyxhQUFhO2FBQ2hDLENBQUM7UUFDSixDQUFDO1FBQ0QsU0FBUyxDQUFDLEtBQUs7WUFDYixPQUFPO2dCQUNMLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7Z0JBQ3pDLHdCQUF3QixFQUFFLHFCQUFTLENBQUMsUUFBUSxDQUMxQyxLQUFLLENBQUMsc0JBQXNCLENBQzdCO2dCQUNELEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDdEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPO2dCQUN2QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7Z0JBQ3hCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtnQkFDaEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUM5QixnQkFBZ0IsRUFBRSxxQkFBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO2dCQUMzRCxZQUFZLEVBQUUsS0FBSyxDQUFDLFdBQVc7Z0JBQy9CLDJCQUEyQixFQUFFLEtBQUssQ0FBQyx3QkFBd0I7Z0JBQzNELE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtnQkFDcEIsWUFBWSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO2dCQUN2QyxRQUFRLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQy9CLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxlQUFlO2dCQUN2QyxhQUFhLEVBQUUsS0FBSyxDQUFDLFdBQVc7YUFDakMsQ0FBQztRQUNKLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQTNPRCxnQ0EyT0MifQ==