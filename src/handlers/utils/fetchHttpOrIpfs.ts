import axios from "axios";

async function fetchWithFallback(uri: string, fallbackUri: string) {
  const http = axios.create();
  try {
    const response = await http.get(uri, { timeout: 10000 });
    return response.data;
  } catch (ex) {
    try {
      const response = await http.get(fallbackUri, { timeout: 10000 });
      return response.data;
    } catch (ex) {
      return "";
    }
  }
}

export async function fetchHttpOrIpfs(uri: string) {
  const url = new URL(uri);
  if (url.protocol === "http:" || url.protocol === "https:") {
    return fetchWithFallback(
      uri,
      `${uri.replace("ipfs.io", "xpnetwork.infura-ipfs.io")}`,
    );
  }
  if (url.protocol === "ipfs:") {
    const ipfsUri = `https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`;
    const fallbackIpfsUri = `https://xpnetwork.infura-ipfs.io/ipfs/${uri.replace(
      "ipfs://",
      "",
    )}`;
    return fetchWithFallback(ipfsUri, fallbackIpfsUri);
  }
  throw new Error("Unsupported protocol");
}
