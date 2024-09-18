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
        identifier,
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
        async deployNftCollection(signer, _da) {
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
        async decodeLockedEvent(txHash) {
            const [le] = await bc.get_locked_data(txHash);
            if (!le)
                throw new Error("No locked event found for the hash");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaWNwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUFrRDtBQUNsRCw0Q0FBc0M7QUFDdEMsb0RBRzZCO0FBQzdCLGtEQUErQztBQUMvQyxtRUFBaUY7QUFFakYsbUVBQWlGO0FBRWpGLDBEQUF3RTtBQUN4RSwwREFBd0Q7QUFFeEQsdURBQWdEO0FBR3pDLEtBQUssVUFBVSxjQUFjLENBQ2xDLFFBQTRCLEVBQzVCLEVBQUUsS0FBSyxFQUF5QztJQUVoRCxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDNUIsT0FBTyxNQUFNLEtBQUssQ0FBQyxXQUFXLENBQVc7WUFDdkMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDL0IsZ0JBQWdCLEVBQUUsZ0JBQU07WUFDeEIsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELE9BQU8sYUFBSyxDQUFDLFdBQVcsQ0FBVyxnQkFBTSxFQUFFO1FBQ3pDLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLEtBQUs7S0FDTixDQUFDLENBQUM7QUFDTCxDQUFDO0FBZkQsd0NBZUM7QUFFTSxLQUFLLFVBQVUsaUJBQWlCLENBQ3JDLFFBQTRCLEVBQzVCLEVBQUUsS0FBSyxFQUF5QztJQUVoRCxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDNUIsT0FBTyxNQUFNLEtBQUssQ0FBQyxXQUFXLENBQWdCO1lBQzVDLFVBQVUsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQy9CLGdCQUFnQixFQUFFLG1CQUFTO1lBQzNCLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxPQUFPLGFBQUssQ0FBQyxXQUFXLENBQWdCLG1CQUFTLEVBQUU7UUFDakQsVUFBVSxFQUFFLFFBQVE7UUFDcEIs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