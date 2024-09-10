const checkHttpOrIpfs = (contractUri: string, eventUri: string) => {
  const contractUrl = new URL(contractUri);
  const eventUrl = new URL(eventUri);

  let firstIpfsId = "";
  let secondIpfsId = "";

  if (
    (contractUrl.protocol === "http:" || contractUrl.protocol === "https:") &&
    contractUrl.pathname.startsWith("/ipfs/")
  ) {
    firstIpfsId = contractUrl.pathname.slice(6);
  } else if (contractUrl.protocol === "ipfs:") {
    firstIpfsId = contractUrl.href.slice(7);
  }

  if (
    (eventUrl.protocol === "http:" || eventUrl.protocol === "https:") &&
    eventUrl.pathname.startsWith("/ipfs/")
  ) {
    secondIpfsId = eventUrl.pathname.slice(6);
  } else if (eventUrl.protocol === "ipfs:") {
    secondIpfsId = eventUrl.href.slice(7);
  }

  if (contractUrl.protocol === "http:" || contractUrl.protocol === "https:") {
    return contractUri;
  }
  if (contractUrl.protocol === "ipfs:") {
    if (firstIpfsId === secondIpfsId) {
      const url = `https://ipfs.io/ipfs/${firstIpfsId}`;

      return url;
    }
    throw new Error("Unsupported protocol");
  }
  throw new Error("Unsupported protocol");
};

export default checkHttpOrIpfs;
