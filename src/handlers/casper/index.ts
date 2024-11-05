import { CEP78Client } from "casper-cep78-js-client";
import {
  CLAccountHash,
  CLByteArray,
  CLPublicKey,
  CLString,
  CasperClient,
  Contracts,
  DeployUtil,
  PurseIdentifier,
} from "casper-js-sdk";
import { getDeploy } from "./get-deploy";
import { TCasperHandler, TCasperParams } from "./types";

export function casperHandler({
  rpc,
  identifier,
  network,
  bridge,
  storage,
}: TCasperParams): TCasperHandler {
  const cc = new CasperClient(rpc);

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
    deployNftCollection(signer, da, ga) {
      unimplemented("deploy nft collection", signer, da, ga);
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
    decodeLockedEvent(txHash) {
      unimplemented("decode tx hash", txHash);
    },
    claimNft(signer, claimData, sig, extraArgs) {
      unimplemented("claim nft", signer, claimData, sig, extraArgs);
    },
    getValidatorCount() {
      unimplemented();
    },
    lockNft(
      signer,
      sourceNft,
      destinationChain,
      to,
      tokenId,
      metaDataUri,
      extraArgs,
    ) {
      unimplemented(
        "lock nft",
        signer,
        sourceNft,
        destinationChain,
        tokenId,
        metaDataUri,
        extraArgs,
        to,
      );
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
