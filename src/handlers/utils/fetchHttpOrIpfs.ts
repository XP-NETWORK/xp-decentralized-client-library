import axios from "axios";

export async function fetchHttpOrIpfs(uri: string) {
  const http = axios.create();
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
}
