import {
  TChainFactory,
  TChainInfo,
  TInferChainH,
  TParamMap,
  TSupportedChain,
} from "../factory/types/utils";
import { aptosHandler } from "../handlers/aptos";
import { cosmWasmHandler } from "../handlers/cosmwasm";
import { evmHandler } from "../handlers/evm";
import { hederaHandler } from "../handlers/hedera";
import { icpHandler } from "../handlers/icp";
import { multiversxHandler } from "../handlers/multiversx";
import { nearHandler } from "../handlers/near";
import { secretHandler } from "../handlers/secret";
import { tezosHandler } from "../handlers/tezos";
import { raise, tonHandler } from "../handlers/ton";
import { fetchHttpOrIpfs } from "../handlers/utils";
import { TChainParams } from "./config";

export namespace Chain {
  export const MULTIVERSX = "MULTIVERSX";
  export const SECRET = "SECRET";
  export const TON = "TON";
  export const ETH = "ETH";
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
}

function mapNonceToParams(chainParams: Partial<TChainParams>): TParamMap {
  const cToP: TParamMap = new Map();
  cToP.set(Chain.MULTIVERSX, chainParams.multiversxParams);
  cToP.set(Chain.BSC, chainParams.bscParams);
  cToP.set(Chain.MATIC, chainParams.maticParams);
  cToP.set(Chain.BASE, chainParams.baseParams);
  cToP.set(Chain.HEDERA, chainParams.hederaParams);
  cToP.set(Chain.ETH, chainParams.ethParams);
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
  return cToP;
}

export function ChainFactory(cp: Partial<TChainParams>): TChainFactory {
  const map = mapNonceToParams(cp);
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
      const ogNftData = await sc.nftData(
        data.tokenId,
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
      const metadata = ogNftData.metadata || data.metaDataUri;
      const imgUri = (await fetchHttpOrIpfs(metadata)).image;
      return {
        ...data,
        ...ogNftData,
        metadata,
        royalty: ogNftData.royalty.toString(),
        royaltyReceiver: royaltyReceiver,
        fee: fee.toString(),
        imgUri,
        lockTxChain: chain.identifier,
      };
    },
  };
}

export const CHAIN_INFO: TChainInfo = new Map();

CHAIN_INFO.set(Chain.BSC, {
  constructor: evmHandler,
});
CHAIN_INFO.set(Chain.ETH, {
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
