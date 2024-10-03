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
        validateAddress(address) {
            try {
                principal_1.Principal.fromText(address);
                return Promise.resolve(true);
            }
            catch {
                return Promise.resolve(false);
            }
        },
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
            const enc = candid_1.IDL.encode([
                candid_1.IDL.Record({
                    owner: candid_1.IDL.Principal,
                    name: candid_1.IDL.Text,
                    symbol: candid_1.IDL.Text,
                }),
            ], [
                {
                    owner: await signer.getPrincipal(),
                    name: _da.name,
                    symbol: _da.symbol,
                },
            ]);
            const actor = await agent_1.Actor.createAndInstallCanister(nft_1.idlFactory, {
                module: Buffer.from(nft_wasm_gz_hex_1.NftByteCode, "hex"),
                arg: enc,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvaWNwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUFrRDtBQUNsRCw0Q0FBc0M7QUFDdEMsb0RBRzZCO0FBQzdCLGtEQUErQztBQUMvQyxtRUFBaUY7QUFFakYsbUVBQWlGO0FBRWpGLDBEQUF3RTtBQUV4RSx1REFBZ0Q7QUFHekMsS0FBSyxVQUFVLGNBQWMsQ0FDbEMsUUFBNEIsRUFDNUIsRUFBRSxLQUFLLEVBQXlDO0lBRWhELElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUM1QixPQUFPLE1BQU0sS0FBSyxDQUFDLFdBQVcsQ0FBVztZQUN2QyxVQUFVLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUMvQixnQkFBZ0IsRUFBRSxnQkFBTTtZQUN4QixJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsT0FBTyxhQUFLLENBQUMsV0FBVyxDQUFXLGdCQUFNLEVBQUU7UUFDekMsVUFBVSxFQUFFLFFBQVE7UUFDcEIsS0FBSztLQUNOLENBQUMsQ0FBQztBQUNMLENBQUM7QUFmRCx3Q0FlQztBQUVNLEtBQUssVUFBVSxpQkFBaUIsQ0FDckMsUUFBNEIsRUFDNUIsRUFBRSxLQUFLLEVBQXlDO0lBRWhELElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUM1QixPQUFPLE1BQU0sS0FBSyxDQUFDLFdBQVcsQ0FBZ0I7WUFDNUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDL0IsZ0JBQWdCLEVBQUUsbUJBQVM7WUFDM0IsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELE9BQU8sYUFBSyxDQUFDLFdBQVcsQ0FBZ0IsbUJBQVMsRUFBRTtRQUNqRCxVQUFVLEVBQUUsUUFBUTtRQUNwQixLQUFLO0tBQ04sQ0FB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