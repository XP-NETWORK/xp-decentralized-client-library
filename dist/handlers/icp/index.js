"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icpHandler = exports.ifBrowserSigners = exports.createLedgerActor = exports.createBridgeActor = exports.createNftActor = void 0;
const agent_1 = require("@dfinity/agent");
const candid_1 = require("@dfinity/candid");
const ledger_icp_1 = require("@dfinity/ledger-icp");
const principal_1 = require("@dfinity/principal");
const bridge_1 = require("../../contractsTypes/icp/bridge/bridge");
const ledger_1 = require("../../contractsTypes/icp/ledger/ledger");
const nft_1 = require("../../contractsTypes/icp/nft/nft");
const nft_2 = require("../../contractsTypes/icp/nft/nft");
const nft_wasm_gz_hex_1 = require("./nft.wasm.gz.hex");
async function createNftActor(contract, { agent }) {
    if (ifBrowserSigners(agent)) {
        return await agent.createActor({
            canisterId: contract.toString(),
            interfaceFactory: nft_1.idlFactory,
            host: undefined,
        });
    }
    return agent_1.Actor.createActor(nft_1.idlFactory, {
        canisterId: contract,
        agent,
    });
}
exports.createNftActor = createNftActor;
async function createBridgeActor(contract, { agent }) {
    if (ifBrowserSigners(agent)) {
        return await agent.createActor({
            canisterId: contract.toString(),
            interfaceFactory: bridge_1.idlFactory,
            host: undefined,
        });
    }
    return agent_1.Actor.createActor(bridge_1.idlFactory, {
        canisterId: contract,
        agent,
    });
}
exports.createBridgeActor = createBridgeActor;
async function createLedgerActor(contract, { agent }) {
    if (ifBrowserSigners(agent)) {
        return await agent.createActor({
            canisterId: contract.toString(),
            interfaceFactory: ledger_1.idlFactory,
            host: undefined,
        });
    }
    return agent_1.Actor.createActor(bridge_1.idlFactory, {
        canisterId: contract,
        agent,
    });
}
exports.createLedgerActor = createLedgerActor;
function ifBrowserSigners(signers) {
    if ("_isAgent" in signers) {
        return false;
    }
    return true;
}
exports.ifBrowserSigners = ifBrowserSigners;
async function icpHandler({ agent, bridge, storage, identifier, }) {
    const ledger = ledger_icp_1.LedgerCanister.create({ agent });
    const bc = await createBridgeActor(bridge, { agent });
    await agent.fetchRootKey();
    return {
        async nftList(owner, contract) {
            const nft = await createNftActor(contract, { agent });
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
            const nft = await createNftActor(ma.contract, {
                agent: signer,
            });
            const mints = await nft.icrcX_mint(ma.token_id, {
                owner: principal_1.Principal.fromText(ma.owner),
                subaccount: [],
            }, ma.metadata);
            const mint = mints[0];
            if (!("Ok" in mint)) {
                throw new Error(`Failed to mint reason: ${JSON.stringify(mint)}`);
            }
            return (mint.Ok[0]?.toString() ??
                (() => {
                    throw new Error("unreachable");
                })());
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
            const bcWithSigner = await createBridgeActor(bridge, {
                agent: signer,
            });
            const hash = await bcWithSigner.lock_nft(principal_1.Principal.fromText(sourceNft), tokenId, destinationChain, to);
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
                amount: BigInt(claimData.fee + 10000n),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaWNwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUFrRDtBQUNsRCw0Q0FBc0M7QUFDdEMsb0RBRzZCO0FBQzdCLGtEQUErQztBQUMvQyxtRUFBaUY7QUFFakYsbUVBQWlGO0FBRWpGLDBEQUF3RTtBQUN4RSwwREFBd0Q7QUFHeEQsdURBQWdEO0FBR3pDLEtBQUssVUFBVSxjQUFjLENBQ2xDLFFBQTRCLEVBQzVCLEVBQUUsS0FBSyxFQUF5QztJQUVoRCxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDNUIsT0FBTyxNQUFNLEtBQUssQ0FBQyxXQUFXLENBQVc7WUFDdkMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDL0IsZ0JBQWdCLEVBQUUsZ0JBQU07WUFDeEIsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELE9BQU8sYUFBSyxDQUFDLFdBQVcsQ0FBVyxnQkFBTSxFQUFFO1FBQ3pDLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLEtBQUs7S0FDTixDQUFDLENBQUM7QUFDTCxDQUFDO0FBZkQsd0NBZUM7QUFFTSxLQUFLLFVBQVUsaUJBQWlCLENBQ3JDLFFBQTRCLEVBQzVCLEVBQUUsS0FBSyxFQUF5QztJQUVoRCxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDNUIsT0FBTyxNQUFNLEtBQUssQ0FBQyxXQUFXLENBQWdCO1lBQzVDLFVBQVUsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQy9CLGdCQUFnQixFQUFFLG1CQUFTO1lBQzNCLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxPQUFPLGFBQUssQ0FBQyxXQUFXLENBQWdCLG1CQUFTLEVBQUU7UUFDakQsVUFBVSxFQUFFLFFBQVE7UUFDcEIs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