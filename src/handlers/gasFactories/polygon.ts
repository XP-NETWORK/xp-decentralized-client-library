import axios from "axios";
import {
  GAS_LIMIT,
  type TGas,
  convertToGwei,
  getConstantGas,
  getGas,
} from "./utils";

const getConstantGasForPolygon = (): TGas => getConstantGas(800);

const getGasFromGasStation = async (): Promise<TGas> => {
  const response = await axios.get("https://gasstation.polygon.technology/v2");
  console.log("polygon gas response", response.data);

  const gas = convertToGwei(String(response?.data?.fast.maxFee));

  return {
    maxPriorityFeePerGas: gas,
    maxFeePerGas: gas,
    gasLimit: GAS_LIMIT,
  };
};

export const getPolygonGas = async (): Promise<TGas> => {
  const gas = await getGas(getGasFromGasStation, getConstantGasForPolygon);
  console.log({ gas }, "gas in internal polygon");
  return gas;
};
