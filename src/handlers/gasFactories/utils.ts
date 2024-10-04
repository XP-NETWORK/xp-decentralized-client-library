import { BigNumberish as EthersBigNumber, ethers } from "ethers";

export type TGas = {
  maxPriorityFeePerGas: EthersBigNumber;
  maxFeePerGas: EthersBigNumber;
  gasLimit: number;
};

type TArgs = [
  getGasStationGas: () => Promise<TGas>,
  getConstantGas: () => TGas,
];

type TGetGas = (...args: TArgs) => Promise<TGas>;

export const GAS_LIMIT = 5_000_000;

export type TCreateGasConfig = {
  chainNonce: number;
  gasToAdd: number;
  constantGas: number;
  gasStationEndpoint: string;
};

export const convertToGwei = (value: string): EthersBigNumber => {
  return ethers.parseUnits(value, "gwei");
};

export const getConstantGas = (fee: number): TGas => {
  const maxPriorityFeePerGas = convertToGwei(`${fee}`);
  const maxFeePerGas = convertToGwei(`${fee}`);
  return {
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit: GAS_LIMIT,
  };
};

export const getGas: TGetGas = async (getGasStationGas, getConstantGas) => {
  let retriesForGettingGas = 0;
  while (retriesForGettingGas < 5) {
    try {
      return await getGasStationGas();
    } catch (error) {
      console.log("error when getting gas for", error);
      if (retriesForGettingGas === 4) {
        return getConstantGas();
      }
      await sleep(5_000);
      retriesForGettingGas++;
    }
  }
  return getConstantGas();
};

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
