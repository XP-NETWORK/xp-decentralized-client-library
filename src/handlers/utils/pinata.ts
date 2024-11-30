import { config } from "dotenv";
import { PinataSDK } from "pinata-web3";

config();
export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
});
