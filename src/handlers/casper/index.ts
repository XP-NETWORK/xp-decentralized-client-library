import { Parser } from "@make-software/ces-js-parser";
import {
  BurnMode,
  CEP78Client,
  MetadataMutability,
  MintingMode,
  NFTIdentifierMode,
  NFTKind,
  NFTMetadataKind,
  NFTOwnershipMode,
  WhitelistMode,
} from "casper-cep78-js-client";
import {
  CLAccountHash,
  CLByteArray,
  CLPublicKey,
  CLPublicKeyTag,
  type CLString,
  type CLU256,
  CLValueBuilder,
  CasperClient,
  Contracts,
  DeployUtil,
  PurseIdentifier,
  RuntimeArgs,
} from "casper-js-sdk";
import { CLAIM_WASM } from "./claim.wasm";
import { getDeploy } from "./get-deploy";
import { LOCK_WASM } from "./lock.wasm";
import type { TCasperHandler, TCasperParams } from "./types";

export function casperHandler({
  rpc,
  identifier,
  network,
  bridge,
  storage,
}: TCasperParams): TCasperHandler {
  const cc = new CasperClient(rpc);
  const bc = new Contracts.Contract(cc);
  bc.setContractHash(`hash-${bridge}`);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async function signWithCasperWallet(sender: any, deploy: DeployUtil.Deploy) {
    const address = await sender.getActivePublicKey();
    const signedDeployJson = await sender.sign(
      JSON.stringify(DeployUtil.deployToJson(deploy)),
      address,
    );

    const signedDeploy = DeployUtil.setSignature(
      deploy,
      signedDeployJson.signature,
      CLPublicKey.fromHex(address),
    );

    const res = await cc.putDeploy(signedDeploy).catch((e) => {
      console.log(e, "e in signWithCasperWallet");
      return "";
    });

    res && (await getDeploy(cc, res));
    return res;
  }

  return {
    async getBalance(signer) {
      const pubk = await signer.getActivePublicKey();
      const balance = await cc.nodeClient.queryBalance(
        PurseIdentifier.MainPurseUnderPublicKey,
        pubk,
      );
      return balance.toBigInt();
    },
    async submitSignature(signer, hash, sigs) {
      const clSignerAndSignature = sigs.map(({ signature, signerAddress }) => {
        const signerClValue = CLValueBuilder.publicKey(
          Buffer.from(signerAddress, "hex"),
          CLPublicKeyTag.ED25519,
        );
        const signatureClValue = CLValueBuilder.byteArray(
          Buffer.from(signature.replace("0x", ""), "hex"),
        );
        return CLValueBuilder.tuple2([signerClValue, signatureClValue]);
      });

      const clSignerAndSignatureList =
        CLValueBuilder.list(clSignerAndSignature);

      const rt_args = RuntimeArgs.fromMap({
        data_hash_arg: CLValueBuilder.byteArray(Buffer.from(hash, "hex")),
        data_type_arg: CLValueBuilder.u8(0),
        signatures_arg: clSignerAndSignatureList,
      });
      const extraCost = 10000000000 * clSignerAndSignatureList.data.length;
      const deploy = bc.callEntrypoint(
        "submit_signatures",
        rt_args,
        CLPublicKey.fromHex(await signer.getActivePublicKey()),
        network,
        (15000000000 + extraCost).toString(),
        [],
      );
      if (isBrowser()) {
        return await signWithCasperWallet(signer, deploy);
      }
      const signed = await signer.sign(
        DeployUtil.deployToJson(deploy),
        await signer.getActivePublicKey(),
      );
      const txHash = await DeployUtil.deployFromJson(signed).unwrap().send(rpc);
      return txHash;
    },
    async deployNftCollection(signer, da, ga) {
      const cc = new CEP78Client(rpc, network);
      const deploy = cc.install(
        {
          collectionName: da.name,
          collectionSymbol: da.symbol,
          identifierMode: NFTIdentifierMode.Ordinal,
          metadataMutability: MetadataMutability.Immutable,
          nftKind: NFTKind.Digital,
          nftMetadataKind: NFTMetadataKind.Raw,
          ownershipMode: NFTOwnershipMode.Transferable,
          totalTokenSupply: "1000000",
          allowMinting: true,
          burnMode: BurnMode.NonBurnable,
          whitelistMode: WhitelistMode.Unlocked,
          mintingMode: MintingMode.Installer,
        },
        ga?.amount || "600000000000",
        CLPublicKey.fromHex(await signer.getActivePublicKey()),
      );
      if (isBrowser()) {
        return signWithCasperWallet(signer, deploy);
      }

      const signed = await signer.sign(
        DeployUtil.deployToJson(deploy),
        await signer.getActivePublicKey(),
      );
      return DeployUtil.deployFromJson(signed).unwrap().send(rpc);
    },
    async nftData(tokenId, contract) {
      const ctr = new Contracts.Contract(cc);
      ctr.setContractHash(`hash-${contract}`);

      const cn = await ctr.queryContractData(["collection_name"]);
      const cs = await ctr.queryContractData(["collection_symbol"]);
      const md = ((await ctr
        .queryContractDictionary("metadata_raw", tokenId)
        .catch(() => {
          console.log(
            `Failed to get raw metadata for ${contract} - ${tokenId}`,
          );
          return undefined;
        })) ||
        (await ctr
          .queryContractDictionary("metadata_custom_validated", tokenId)
          .catch(() => {
            console.log(
              `Failed to get custom validated metadata for ${contract} - ${tokenId}`,
            );
            throw new Error(
              `Failed to get metadata for ${contract} - ${tokenId}`,
            );
          }))) as CLString;

      return {
        metadata: md.data,
        name: cn,
        royalty: 0n,
        symbol: cs,
      };
    },
    identifier,
    getProvider() {
      return cc;
    },
    async decodeLockedEvent(txHash) {
      const deploy = await getDeploy(cc, txHash);
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const args = deploy.deploy.session.ModuleBytes!.args as any as any[];
      const bc = args.find((e) => e[0] === "bridge_contract");
      const ch = bc[1].bytes;
      const parser = await Parser.create(cc.nodeClient, [ch]);
      const events = parser.parseExecutionResult(
        //@ts-ignore
        deploy.execution_results[0].result as ExecutionResult,
      );
      const event = events
        .filter((ev) => ev.error === null)
        .filter((e) => e.event.name === "LockedEvent")
        .at(0);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return event as any;
    },
    async claimNft(signer, claimData, _, extraArgs) {
      const rt_args = RuntimeArgs.fromMap({
        bridge_contract: CLValueBuilder.byteArray(Buffer.from(bridge, "hex")),
        token_id_arg: CLValueBuilder.string(claimData.token_id.toString()),
        source_chain_arg: CLValueBuilder.string(claimData.source_chain),
        destination_chain_arg: CLValueBuilder.string(
          claimData.destination_chain,
        ),
        destination_user_address_arg: CLValueBuilder.byteArray(
          convertHashStrToHashBuff(claimData.destinationUserAddress),
        ),
        source_nft_contract_address_arg: CLValueBuilder.string(
          claimData.source_chain,
        ),
        name_arg: CLValueBuilder.string(claimData.name),
        symbol_arg: CLValueBuilder.string(claimData.symbol),
        royalty_arg: CLValueBuilder.u512(claimData.royaltyPercentage),
        royalty_receiver_arg: CLValueBuilder.byteArray(
          convertHashStrToHashBuff(claimData.royaltyReceiver),
        ),
        metadata_arg: CLValueBuilder.string(claimData.metadata),
        transaction_hash_arg: CLValueBuilder.string(claimData.transaction_hash),
        token_amount_arg: CLValueBuilder.u512(claimData.amount),
        nft_type_arg: CLValueBuilder.string(claimData.nft_type),
        fee_arg: CLValueBuilder.u512(claimData.fee),
        lock_tx_chain_arg: CLValueBuilder.string(claimData.lockTxChain),
        amount: CLValueBuilder.u512(claimData.amount),
      });
      const n = new Contracts.Contract(cc);

      const deploy = n.install(
        Buffer.from(CLAIM_WASM, "hex"),
        rt_args,
        extraArgs?.amount || "250000000000",
        CLPublicKey.fromFormattedString(await signer.getActivePublicKey()),
        network,
        [],
      );
      if (isBrowser()) {
        const hash = await signWithCasperWallet(signer, deploy);
        return {
          hash() {
            return hash;
          },
          ret: hash,
        };
      }
      const signed = await signer.sign(
        DeployUtil.deployToJson(deploy),
        await signer.getActivePublicKey(),
      );
      const hash = await DeployUtil.deployFromJson(signed).unwrap().send(rpc);
      return {
        hash() {
          return hash;
        },
        ret: hash,
      };
    },
    async getValidatorCount() {
      const bc = new Contracts.Contract(cc);
      bc.setContractHash(bridge);
      const bn: CLU256 = await bc.queryContractData(["validator_count"]);
      return bn.value().toNumber();
    },
    async lockNft(
      signer,
      sourceNft,
      destinationChain,
      to,
      tokenId,
      metaDataUri,
      extraArgs,
    ) {
      const rt_args = RuntimeArgs.fromMap({
        bridge_contract: CLValueBuilder.byteArray(Buffer.from(bridge, "hex")),
        token_id_arg: CLValueBuilder.string(tokenId),
        destination_chain_arg: CLValueBuilder.string(destinationChain),
        destination_user_address_arg: CLValueBuilder.string(to),
        source_nft_contract_address_arg: CLValueBuilder.byteArray(
          convertHashStrToHashBuff(sourceNft),
        ),
        metadata_arg: CLValueBuilder.string(metaDataUri),
        amount: CLValueBuilder.u512(extraArgs?.amount || 250000000000n),
      });
      const n = new Contracts.Contract(cc);

      const deploy = n.install(
        Buffer.from(LOCK_WASM, "hex"),
        rt_args,
        extraArgs?.amount || "250000000000",
        CLPublicKey.fromFormattedString(await signer.getActivePublicKey()),
        network,
        [],
      );
      if (isBrowser()) {
        const hash = await signWithCasperWallet(signer, deploy);
        return {
          hash() {
            return hash;
          },
          ret: hash,
        };
      }
      const signed = await signer.sign(
        DeployUtil.deployToJson(deploy),
        await signer.getActivePublicKey(),
      );
      const hash = await DeployUtil.deployFromJson(signed).unwrap().send(rpc);
      return {
        hash() {
          return hash;
        },
        ret: hash,
      };
    },
    async mintNft(signer, ma) {
      const nft = new CEP78Client(rpc, network);
      nft.setContractHash(ma.contract);
      const deploy = nft.mint(
        {
          meta: {
            uri: ma.uri,
          },
          owner: ma.owner,
          collectionName: ma.collectionName,
        },
        {
          useSessionCode: false,
        },
        "1000000000",
        CLPublicKey.fromFormattedString(await signer.getActivePublicKey()),
      );
      if (isBrowser()) {
        return signWithCasperWallet(signer, deploy);
      }

      const signed = await signer.sign(
        DeployUtil.deployToJson(deploy),
        await signer.getActivePublicKey(),
      );
      return DeployUtil.deployFromJson(signed).unwrap().send(rpc);
    },
    getStorageContract() {
      return storage;
    },
    validateAddress(hex) {
      try {
        CLAccountHash.fromFormattedString(hex);
        return Promise.resolve(true);
      } catch (e) {
        return Promise.resolve(false);
      }
    },
    transform(input) {
      unimplemented("Transform", input);
    },
    async approveNft(signer, tokenId, contract, _) {
      const cep78Client = new CEP78Client(rpc, network);
      cep78Client.setContractHash(contract);
      const deploy = cep78Client.approve(
        {
          operator: new CLByteArray(Buffer.from(bridge.split("-")[1], "hex")),
          // tokenHash: tokenHash,
          tokenId: tokenId,
        },
        "2000000000",
        CLPublicKey.fromHex(await signer.getActivePublicKey()),
      );

      if (isBrowser()) {
        return signWithCasperWallet(signer, deploy);
      }

      const signed = await signer.sign(
        DeployUtil.deployToJson(deploy),
        await signer.getActivePublicKey(),
      );
      const dep = cc.deployFromJson(signed).unwrap();
      return await cc.putDeploy(dep);
    },
  };
}

function unimplemented(msg?: string, ...args: unknown[]): never {
  throw new Error(`Unimplemented: ${msg}. ${JSON.stringify(args)}`);
}

function isBrowser() {
  //@ts-ignore
  return window !== undefined;
}

function convertHashStrToHashBuff(sourceNft: string): Uint8Array {
  let src = sourceNft;
  if (sourceNft.startsWith("hash-")) {
    src = sourceNft.slice(5);
  }
  return Uint8Array.from(Buffer.from(src, "hex"));
}
