// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import crypto from "crypto";
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
  type CLU64,
  CLValueBuilder,
  CasperClient,
  Contracts,
  DeployUtil,
  PurseIdentifier,
  RuntimeArgs,
} from "casper-js-sdk";
import type { Any } from "../utils/any";
import { pinata } from "../utils/pinata";
import { CLAIM_WASM } from "./claim.wasm";
import { getDeploy } from "./get-deploy";
import { LOCK_WASM } from "./lock.wasm";
import { Serializer } from "./serializer";
import type { TCasperHandler, TCasperParams } from "./types";

const COLLECTION_DEPLOY_PLUS_CLAIM_AMOUNT = "750000000000";

export function casperHandler({
  rpc,
  identifier,
  network,
  bridge,
  storage,
  proxy_url,
}: TCasperParams): TCasperHandler {
  if (proxy_url) {
    rpc = proxy_url + rpc;
  }
  const cc = new CasperClient(rpc);
  const bc = new Contracts.Contract(cc);
  bc.setContractHash(bridge);

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
        .filter((e) => e.event.name === "Locked")
        .at(0);
      const data = event?.event?.data;
      return {
        tokenAmount: data?.token_amount?.data?.toString(),
        sourceChain: data?.source_chain?.data,
        sourceNftContractAddress: data?.source_nft_contract_address?.data,
        tokenId: data?.token_id?.data,
        destinationChain: data?.destination_chain?.data,
        destinationUserAddress: data?.destination_user_address?.data,
        nftType: data?.nft_type?.data,
        transactionHash: txHash,
        lockTxChain: identifier,
        metaDataUri: data?.metadata_uri?.data,
      };
    },
    hashClaimData(data) {
      const serializer = Serializer();
      const bytes = serializer.claimNft({
        amount: COLLECTION_DEPLOY_PLUS_CLAIM_AMOUNT,
        destination_chain_arg: data.destination_chain,
        destination_user_address_arg: data.destinationUserAddress,
        fee_arg: data.fee.toString(),
        lock_tx_chain_arg: data.lockTxChain,
        metadata_arg: data.metadata,
        name_arg: data.name,
        nft_type_arg: data.nft_type,
        royalty_arg: data.royaltyPercentage.toString(),
        royalty_receiver_arg: data.royaltyReceiver,
        source_chain_arg: data.source_chain,
        source_nft_contract_address_arg:
          data.source_chain === "CASPER"
            ? `contract-${data.source_nft_contract_address}`
            : data.source_nft_contract_address,
        symbol_arg: data.symbol,
        token_amount_arg: data.amount.toString(),
        token_id_arg: data.token_id.toString(),
        transaction_hash_arg: data.transaction_hash,
      });
      return crypto.createHash("sha256").update(bytes).digest("hex");
    },
    async claimNft(signer, claimData, sigs, extraArgs) {
      const dataHash = this.hashClaimData(claimData);

      if (!(await checkSignatureStatus(bc, dataHash))) {
        await this.submitSignature(signer, dataHash, sigs);
      }
      if (await checkSignatureStatus(bc, dataHash)) {
        const rt_args = RuntimeArgs.fromMap({
          bridge_contract: CLValueBuilder.byteArray(
            convertHashStrToHashBuff(bridge),
          ),
          token_id_arg: CLValueBuilder.string(claimData.token_id.toString()),
          source_chain_arg: CLValueBuilder.string(claimData.source_chain),
          destination_chain_arg: CLValueBuilder.string(
            claimData.destination_chain,
          ),
          destination_user_address_arg: CLValueBuilder.byteArray(
            convertHashStrToHashBuff(claimData.destinationUserAddress),
          ),
          source_nft_contract_address_arg: CLValueBuilder.string(
            claimData.source_chain === "CASPER"
              ? `contract-${claimData.source_nft_contract_address}`
              : claimData.source_nft_contract_address,
          ),
          name_arg: CLValueBuilder.string(claimData.name),
          symbol_arg: CLValueBuilder.string(claimData.symbol),
          royalty_arg: CLValueBuilder.u512(
            claimData.royaltyPercentage.toString(),
          ),
          royalty_receiver_arg: CLValueBuilder.byteArray(
            convertHashStrToHashBuff(claimData.royaltyReceiver),
          ),
          metadata_arg: CLValueBuilder.string(claimData.metadata),
          transaction_hash_arg: CLValueBuilder.string(
            claimData.transaction_hash,
          ),
          token_amount_arg: CLValueBuilder.u512(claimData.amount.toString()),
          nft_type_arg: CLValueBuilder.string(claimData.nft_type),
          fee_arg: CLValueBuilder.u512(claimData.fee.toString()),
          lock_tx_chain_arg: CLValueBuilder.string(claimData.lockTxChain),
          amount: CLValueBuilder.u512(COLLECTION_DEPLOY_PLUS_CLAIM_AMOUNT),
        });
        const n = new Contracts.Contract(cc);

        const deploy = n.install(
          Buffer.from(CLAIM_WASM, "hex"),
          rt_args,
          extraArgs?.amount || COLLECTION_DEPLOY_PLUS_CLAIM_AMOUNT,
          CLPublicKey.fromHex(await signer.getActivePublicKey()),
          network,
          [],
        );
        if (isBrowser()) {
          const hash = await signWithCasperWallet(signer, deploy);
          const is_waiting = await checkWaiting(
            bc,
            claimData.source_nft_contract_address.replace("hash-", ""),
            claimData.source_chain,
          );

          if (is_waiting) {
            while (true) {
              await new Promise((r) => setTimeout(r, 5 * 1000));
              if (
                await checkCollection(
                  bc,
                  claimData.source_nft_contract_address.replace("hash-", ""),
                  claimData.source_chain,
                )
              ) {
                break;
              }
            }
            return this.claimNft(signer, claimData, sigs, extraArgs);
          }
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
      }
      throw new Error("Failed");
    },
    async getValidatorCount() {
      const bn: CLU64 = await bc.queryContractData(["validators_count"]);
      return Number(bn);
    },
    async lockNft(
      signer,
      sourceNft,
      destinationChain,
      to,
      tokenId,
      _metaDataUri,
      extraArgs,
    ) {
      const cc = new CasperClient(rpc);
      const nftContract = new Contracts.Contract(cc);
      nftContract.setContractHash(sourceNft);
      const metadata = await getMetaData(nftContract, tokenId);
      const nft_storage_exists = await checkStorage(
        bc,
        sourceNft.replace("hash-", ""),
      );

      const rt_args = RuntimeArgs.fromMap({
        bridge_contract: CLValueBuilder.byteArray(
          convertHashStrToHashBuff(bridge),
        ),
        token_id_arg: CLValueBuilder.string(tokenId),
        destination_chain_arg: CLValueBuilder.string(destinationChain),
        destination_user_address_arg: CLValueBuilder.string(to),
        source_nft_contract_address_arg: CLValueBuilder.byteArray(
          convertHashStrToHashBuff(sourceNft),
        ),
        metadata_arg: CLValueBuilder.string(metadata),
        amount: CLValueBuilder.u512(extraArgs?.amount || "150000000000"),
      });
      const n = new Contracts.Contract(cc);

      const deploy = n.install(
        Buffer.from(LOCK_WASM, "hex"),
        rt_args,
        extraArgs?.amount || "30000000000",
        CLPublicKey.fromHex(await signer.getActivePublicKey()),
        network,
        [],
      );
      if (isBrowser()) {
        const hash = await signWithCasperWallet(signer, deploy);
        if (!nft_storage_exists) {
          while (true) {
            await new Promise((r) => setTimeout(r, 5 * 1000));
            if (await checkStorage(bc, sourceNft.replace("hash-", ""))) {
              break;
            }
          }
          return this.lockNft(
            signer,
            sourceNft,
            destinationChain,
            to,
            tokenId,
            metadata,
            extraArgs,
          );
        }
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
          owner: new CLAccountHash(
            Buffer.from(ma.owner.replace("account-hash-", ""), "hex"),
          ),
          collectionName: ma.collectionName,
        },
        {
          useSessionCode: false,
        },
        "1000000000",
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
    getStorageContract() {
      return storage;
    },
    validateAddress(hex) {
      try {
        new CLAccountHash(convertHashStrToHashBuff(hex));
        return Promise.resolve(true);
      } catch (e) {
        return Promise.resolve(false);
      }
    },
    transform(input) {
      return {
        destination_chain: input.destinationChain,
        amount: BigInt(1),
        nft_type: input.nftType,
        royaltyPercentage: BigInt(input.royalty),
        source_chain: input.sourceChain,
        source_nft_contract_address: input.sourceNftContractAddress,
        token_id: BigInt(input.tokenId),
        transaction_hash: input.transactionHash,
        uri: input.metadata,
        tokenId: input.tokenId,
        sourceChain: input.sourceChain,
        destinationChain: input.destinationChain,
        destinationUserAddress: input.destinationUserAddress,
        sourceNftContractAddress: input.sourceNftContractAddress,
        name: input.name,
        symbol: input.symbol,
        royalty: input.royalty,
        royaltyReceiver: input.royaltyReceiver,
        metadata: input.metadata,
        transactionHash: input.transactionHash,
        tokenAmount: input.tokenAmount,
        nftType: input.nftType,
        fee: BigInt(input.fee),
        lockTxChain: input.lockTxChain,
        imgUri: input.imgUri,
      };
    },
    async approveNft(signer, tokenId, contract, _) {
      const cep78Client = new CEP78Client(rpc, network);
      cep78Client.setContractHash(contract);
      const deploy = cep78Client.approve(
        {
          operator: new CLByteArray(convertHashStrToHashBuff(bridge)),
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

async function checkStorage(bc: Contracts.Contract, sourceNft: string) {
  const serializer = Serializer();
  const bytes = serializer.storageKey({
    source_nft_contract_address: sourceNft,
  });
  const dic_key = crypto.createHash("sha256").update(bytes).digest("hex");

  let ret = false;
  try {
    const duplicate_storage_dict = await bc.queryContractDictionary(
      "duplicate_storage_dict",
      dic_key,
    );
    console.log("duplicate_storage_dict", duplicate_storage_dict);

    ret = true;
  } catch (ex) {
    console.log("duplicate_storage_dict", ex);
  }

  try {
    const original_storage_dict = await bc.queryContractDictionary(
      "original_storage_dict",
      dic_key,
    );
    console.log("original_storage_dict", original_storage_dict);

    ret = true;
  } catch (ex) {
    console.log("original_storage_dict", ex);
  }

  return ret;
}

async function checkCollection(
  bc: Contracts.Contract,
  sourceNft: string,
  sourceChain: string,
) {
  const serializer = Serializer();
  const bytes = serializer.collectionKey({
    source_nft_contract_address: sourceNft,
    source_chain: sourceChain,
  });
  const dic_key = crypto.createHash("sha256").update(bytes).digest("hex");

  let ret = false;

  try {
    const original_to_duplicate_dict = await bc.queryContractDictionary(
      "original_to_duplicate_dict",
      dic_key,
    );
    console.log("original_to_duplicate_dict", original_to_duplicate_dict);

    ret = true;
  } catch (ex) {
    console.log("original_to_duplicate_dict", ex);
  }

  return ret;
}

async function checkWaiting(
  bc: Contracts.Contract,
  sourceNft: string,
  sourceChain: string,
) {
  const serializer = Serializer();
  const bytes = serializer.collectionKey({
    source_nft_contract_address: sourceNft,
    source_chain: sourceChain,
  });
  const dic_key = crypto.createHash("sha256").update(bytes).digest("hex");

  let ret = false;
  try {
    const waiting_dict = await bc.queryContractDictionary(
      "waiting_dict",
      dic_key,
    );
    console.log("waiting_dict", waiting_dict.data[0].data);

    ret = waiting_dict.data[0].data;
  } catch (ex) {
    console.log("waiting_dict", ex);
  }
  return ret;
}

async function checkSignatureStatus(bc: Contracts.Contract, dataHash: string) {
  let ret = false;
  try {
    const ss = await bc.queryContractDictionary(
      "submitted_signatures_dict",
      dataHash,
    );
    const done = ss.data[1].data[0].data[0].data;

    console.log("DONE", done); // DONE

    const canDo = ss.data[1].data[0].data[1].data;

    console.log("CAN DO", canDo); // CAN DO
    ret = canDo;
  } catch (ex) {
    console.log("submitted_signatures_dict", ex);
  }

  return ret;
}

async function getMetaData(nftContract: Contracts.Contract, tokenId: string) {
  // CEP78 = 0, --> metadata_cep78
  // NFT721 = 1, --> metadata_nft721
  // Raw = 2, --> metadata_raw
  // CustomValidated = 3 --> metadata_custom_validated

  let data: Any | undefined;

  try {
    data = JSON.parse(
      (
        await nftContract.queryContractDictionary("metadata_cep78", tokenId)
      ).toJSON(),
    );
    if (data?.token_uri) {
      data = data?.token_uri;
    }
    console.log("metadata_cep78", data);
  } catch (ex) {
    try {
      data = JSON.parse(
        (
          await nftContract.queryContractDictionary("metadata_nft721", tokenId)
        ).toJSON(),
      );
      if (data?.token_uri) {
        data = data?.token_uri;
      }
      console.log("metadata_nft721", data);
    } catch (ex) {
      try {
        data = JSON.parse(
          (
            await nftContract.queryContractDictionary("metadata_raw", tokenId)
          ).toJSON(),
        );
        if (data?.token_uri) {
          data = data?.token_uri;
        }
        console.log("metadata_raw", data);
      } catch (ex) {
        try {
          data = JSON.parse(
            (
              await nftContract.queryContractDictionary(
                "metadata_custom_validated",
                tokenId,
              )
            ).toJSON(),
          );
          if (data?.token_uri) {
            data = data?.token_uri;
          }
          console.log("metadata_custom_validated", data);
        } catch (ex) {}
      }
    }
  }
  if (data) {
    if (typeof data === "object") {
      const pinResponse = await pinata.upload.json(data);
      const metadata = `https://xpnetwork.infura-ipfs.io/ipfs/${pinResponse.IpfsHash}`;
      console.log({ metadata });
      return metadata;
    }
    return data;
  }
}
