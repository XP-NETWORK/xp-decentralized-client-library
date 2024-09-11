"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkHttpOrIpfs = (contractUri, eventUri) => {
    const contractUrl = new URL(contractUri);
    const eventUrl = new URL(eventUri);
    let firstIpfsId = "";
    let secondIpfsId = "";
    if ((contractUrl.protocol === "http:" || contractUrl.protocol === "https:") &&
        contractUrl.pathname.startsWith("/ipfs/")) {
        firstIpfsId = contractUrl.pathname.slice(6);
    }
    else if (contractUrl.protocol === "ipfs:") {
        firstIpfsId = contractUrl.href.slice(7);
    }
    if ((eventUrl.protocol === "http:" || eventUrl.protocol === "https:") &&
        eventUrl.pathname.startsWith("/ipfs/")) {
        secondIpfsId = eventUrl.pathname.slice(6);
    }
    else if (eventUrl.protocol === "ipfs:") {
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
exports.default = checkHttpOrIpfs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tJcGZzT3JIdHRwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hhbmRsZXJzL3V0aWxzL2NoZWNrSXBmc09ySHR0cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sZUFBZSxHQUFHLENBQUMsV0FBbUIsRUFBRSxRQUFnQixFQUFFLEVBQUU7SUFDaEUsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekMsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkMsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUV0QixJQUNFLENBQUMsV0FBVyxDQUFDLFFBQVEsS0FBSyxPQUFPLElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUM7UUFDdkUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQ3pDLENBQUM7UUFDRCxXQUFXLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztTQUFNLElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUUsQ0FBQztRQUM1QyxXQUFXLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQ0UsQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLE9BQU8sSUFBSSxRQUFRLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQztRQUNqRSxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFDdEMsQ0FBQztRQUNELFlBQVksR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO1NBQU0sSUFBSSxRQUFRLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRSxDQUFDO1FBQ3pDLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsSUFBSSxXQUFXLENBQUMsUUFBUSxLQUFLLE9BQU8sSUFBSSxXQUFXLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQzFFLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLFdBQVcsQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFLENBQUM7UUFDckMsSUFBSSxXQUFXLEtBQUssWUFBWSxFQUFFLENBQUM7WUFDakMsTUFBTSxHQUFHLEdBQUcsd0JBQXdCLFdBQVcsRUFBRSxDQUFDO1lBRWxELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQztBQUVGLGtCQUFlLGVBQWUsQ0FBQyJ9