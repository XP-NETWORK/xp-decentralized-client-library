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
async function icpHandler({ agent, bridge, storage, identifier, }) {
    const ledger = ledger_icp_1.LedgerCanister.create({ agent });
    const bc = createBridgeActor(bridge, { agent });
    await agent.fetchRootKey();
    return {
        async nftList(owner, contract) {
            const nft = createNftActor(contract, { agent });
            const tokens = await nft.icrc7_tokens_of({ owner: principal_1.Principal.fromText(owner), subaccount: [] }, [], []);
            const nfts = await Promise.allSettled(tokens.map(async (tid) => {
                if (owner !== (await nft.icrc7_owner_of([tid]))[0][0]?.owner.toText()) {
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
                };
            }));
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
                name: name === "" ? "TICP" : name,
                royalty: 0n,
                symbol: symbol === "" ? "TICP" : symbol,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaWNwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUFrRDtBQUNsRCw0Q0FBc0M7QUFDdEMsb0RBRzZCO0FBQzdCLGtEQUErQztBQUMvQyxtRUFBaUY7QUFFakYsMERBQXdFO0FBQ3hFLDBEQUF3RDtBQUd4RCx1REFBZ0Q7QUFHaEQsU0FBZ0IsY0FBYyxDQUM1QixRQUE0QixFQUM1QixFQUFFLEtBQUssRUFBd0I7SUFFL0IsT0FBTyxhQUFLLENBQUMsV0FBVyxDQUFXLGdCQUFNLEVBQUU7UUFDekMsVUFBVSxFQUFFLFFBQVE7UUFDcEIsS0FBSztLQUNOLENBQUMsQ0FBQztBQUNMLENBQUM7QUFSRCx3Q0FRQztBQUVELFNBQWdCLGlCQUFpQixDQUMvQixRQUE0QixFQUM1QixFQUFFLEtBQUssRUFBd0I7SUFFL0IsT0FBTyxhQUFLLENBQUMsV0FBVyxDQUFnQixtQkFBUyxFQUFFO1FBQ2pELFVBQVUsRUFBRSxRQUFRO1FBQ3BCLEtBQUs7S0FDTixDQUFDLENBQUM7QUFDTCxDQUFDO0FBUkQsOENBUUM7QUFFTSxLQUFLLFVBQVUsVUFBVSxDQUFDLEVBQy9CLEtBQUssRUFDTCxNQUFNLEVBQ04sT0FBTyxFQUNQLFVBQVUsR0FDQztJQUNYLE1BQU0sTUFBTSxHQUFHLDJCQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNoRCxNQUFNLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzNCLE9BQU87UUFDTCxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRO1lBQzNCLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FB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