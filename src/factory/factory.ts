import type {
  TChainFactory,
  TChainInfo,
  TInferChainH,
  TParamMap,
  TSupportedChain,
} from "../factory/types/utils";
import { aptosHandler } from "../handlers/aptos";
import { casperHandler } from "../handlers/casper";
import { cosmWasmHandler } from "../handlers/cosmwasm";
import { evmHandler } from "../handlers/evm";
import { hederaHandler } from "../handlers/hedera";
import { icpHandler } from "../handlers/icp";
import { multiversxHandler } from "../handlers/multiversx";
import { nearHandler } from "../handlers/near";
import { secretHandler } from "../handlers/secret";
import { tezosHandler } from "../handlers/tezos";
import { raise, tonHandler } from "../handlers/ton";
import {
  convertNumbToHexToString,
  convertStringToHexToNumb,
  fetchHttpOrIpfs,
} from "../handlers/utils";
import type { IBridgeConfig, TChainParams } from "./config";

export namespace Chain {
  export const MULTIVERSX = "MULTIVERSX";
  export const SECRET = "SECRET";
  export const TON = "TON";
  export const ETHEREUM = "ETHEREUM";
  export const BSC = "BSC";
  export const TEZOS = "TEZOS";
  export const TERRA = "TERRA";
  export const MATIC = "MATIC";
  export const HEDERA = "HEDERA";
  export const APTOS = "APTOS";
  export const ICP = "ICP";
  export const BASE = "BASE";
  export const NEAR = "NEAR";
  export const MOONBEAM = "MOONBEAM";
  export const BLAST = "BLAST";
  export const FANTOM = "FANTOM";
  export const AVALANCHE = "AVALANCHE";
  export const CASPER = "CASPER";
  export const VECHAIN = "VECHAIN";
}

function mapNonceToParams(chainParams: Partial<TChainParams>): TParamMap {
  const cToP: TParamMap = new Map();
  cToP.set(Chain.MULTIVERSX, chainParams.multiversxParams);
  cToP.set(Chain.BSC, chainParams.bscParams);
  cToP.set(Chain.MATIC, chainParams.maticParams);
  cToP.set(Chain.BASE, chainParams.baseParams);
  cToP.set(Chain.HEDERA, chainParams.hederaParams);
  cToP.set(Chain.ETHEREUM, chainParams.ethParams);
  cToP.set(Chain.TEZOS, chainParams.tezosParams);
  cToP.set(Chain.SECRET, chainParams.secretParams);
  cToP.set(Chain.TON, chainParams.tonParams);
  cToP.set(Chain.TERRA, chainParams.terraParams);
  cToP.set(Chain.APTOS, chainParams.aptosParams);
  cToP.set(Chain.ICP, chainParams.icpParams);
  cToP.set(Chain.NEAR, chainParams.nearParams);
  cToP.set(Chain.MOONBEAM, chainParams.moonbeamParams);
  cToP.set(Chain.BLAST, chainParams.blastParams);
  cToP.set(Chain.FANTOM, chainParams.fantomParams);
  cToP.set(Chain.AVALANCHE, chainParams.avaxParams);
  cToP.set(Chain.CASPER, chainParams.casperParams);
  cToP.set(Chain.VECHAIN, chainParams.vechainParams);
  return cToP;
}

export function ChainFactory(bc: IBridgeConfig): TChainFactory {
  const map = mapNonceToParams(bc.bridgeChains);
  const helpers = new Map<TSupportedChain, TInferChainH<TSupportedChain>>();
  return {
    async lockNft(
      sourceChain,
      signer,
      sourceNftContractAddress,
      destinationChain,
      to,
      tokenId,
      metadataUri,
      extraArgs,
    ) {
      const destination = await this.inner(destinationChain);
      const valid = await destination.validateAddress(to);
      if (!valid) {
        throw new Error("Invalid destination user address");
      }
      const lock = await sourceChain.lockNft(
        signer,
        sourceNftContractAddress,
        destinationChain,
        to,
        tokenId,
        metadataUri,
        extraArgs,
      );
      return lock;
    },
    async lockSft(
      sourceChain,
      signer,
      sourceNftContractAddress,
      destinationChain,
      to,
      tokenId,
      amt,
      metadataUri,
      extraArgs,
    ) {
      const destination = await this.inner(destinationChain);
      const valid = await destination.validateAddress(to);
      if (!valid) {
        throw new Error("Invalid destination user address");
      }
      if (!("claimSft" in destination)) {
        throw new Error("Destination chain does not support SFTs .");
      }
      const lock = await sourceChain.lockSft(
        signer,
        sourceNftContractAddress,
        destinationChain,
        to,
        tokenId,
        amt,
        metadataUri,
        extraArgs,
      );
      return lock;
    },
    async inner(chain) {
      const helper = helpers.get(chain);
      if (helper) {
        return helper;
      }
      const params = map.get(chain) ?? raise("No Such Chain Found in cToP");
      const cf = CHAIN_INFO.get(chain) ?? raise("No such chain in CHAIN_INFO");
      const handler = await cf.constructor(params);
      helpers.set(chain, handler);
      return handler;
    },
    async getClaimData(chain, txHash) {
      const storage = chain.getStorageContract();
      const data = await chain.decodeLockedEvent(txHash);
      const royaltyReceiver = await storage.chainRoyalty(data.destinationChain);
      const fee = await storage.chainFee(data.destinationChain);
      const sc = await this.inner(
        data.sourceChain as unknown as TSupportedChain,
      );
      let convertedTokenId = data.tokenId;
      if (data.sourceChain === "SECRET") {
        if (chain.identifier === "SECRET") {
          convertedTokenId = convertStringToHexToNumb(data.tokenId);
        } else if (data.destinationChain === "SECRET") {
          convertedTokenId = convertNumbToHexToString(data.tokenId);
        }
      }
      const ogNftData = await sc.nftData(
        data.sourceChain === "SECRET" && data.destinationChain === "SECRET"
          ? convertedTokenId
          : data.tokenId,
        data.sourceNftContractAddress,
        undefined,
      );
      if (data.destinationChain === "MULTIVERSX") {
        ogNftData.name = ogNftData.name.replace(/[^a-zA-Z0-9]/g, "");
        ogNftData.symbol = ogNftData.symbol
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase()
          .substring(0, 8);
      }
      let metadata = "";
      if (data.sourceChain === "CASPER" || data.sourceChain === "SECRET") {
        metadata = data.metaDataUri;
      } else {
        metadata = ogNftData.metadata || data.metaDataUri;
      }

      if (data.destinationChain === "CASPER") {
        metadata = JSON.stringify({
          token_uri: metadata,
        });
      }

      const imgUri = (await fetchHttpOrIpfs(metadata)).image;

      return {
        ...data,
        ...ogNftData,
        metadata,
        tokenId: convertedTokenId,
        royalty: ogNftData.royalty.toString(),
        royaltyReceiver: royaltyReceiver,
        fee: fee.toString(),
        imgUri,
        lockTxChain: chain.identifier,
      };
    },
    async getLockNftSignatures(chain, txHash, from) {
      const storageContract = chain.getStorageContract();
      let signatures = await storageContract.getLockNftSignatures(txHash, from);
      if (signatures.length === 0) {
        signatures = await bc.oldStorage.getLockNftSignatures(txHash, from);
      }
      return signatures;
    },
  };
}

export const CHAIN_INFO: TChainInfo = new Map();

CHAIN_INFO.set(Chain.BSC, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.ETHEREUM, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.MATIC, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.BASE, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.MOONBEAM, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.HEDERA, {
  constructor: hederaHandler,
});
CHAIN_INFO.set(Chain.MULTIVERSX, {
  constructor: multiversxHandler,
});
CHAIN_INFO.set(Chain.SECRET, {
  constructor: secretHandler,
});
CHAIN_INFO.set(Chain.TON, {
  constructor: tonHandler,
});
CHAIN_INFO.set(Chain.TEZOS, {
  constructor: tezosHandler,
});
CHAIN_INFO.set(Chain.TERRA, {
  constructor: cosmWasmHandler,
});
CHAIN_INFO.set(Chain.APTOS, {
  constructor: aptosHandler,
});
CHAIN_INFO.set(Chain.ICP, {
  constructor: icpHandler,
});
CHAIN_INFO.set(Chain.NEAR, {
  constructor: nearHandler,
});
CHAIN_INFO.set(Chain.BLAST, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.FANTOM, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.AVALANCHE, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.CASPER, {
  constructor: casperHandler,
});
CHAIN_INFO.set(Chain.VECHAIN, {
  constructor: evmHandler,
});
