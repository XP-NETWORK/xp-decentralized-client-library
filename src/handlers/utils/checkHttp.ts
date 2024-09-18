import type { AxiosInstance } from "axios";

const fetchHttpOrIpfs = async (uri: string, http: AxiosInstance) => {
  const url = new URL(uri);
  if (url.protocol === "http:" || url.protocol === "https:") {
    const response = await http.get(uri);
    return response.data;
  }
  if (url.protocol === "ipfs:") {
    const response = await http.get(
      `https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`,
    );
    return response.data;
  }
  throw new Error("Unsupported protocol");
};

export default fetchHttpOrIpfs;
