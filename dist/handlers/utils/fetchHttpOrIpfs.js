"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHttpOrIpfs = void 0;
const axios_1 = __importDefault(require("axios"));
async function fetchWithFallback(uri, fallbackUri) {
    const http = axios_1.default.create();
    try {
        const response = await http.get(uri, { timeout: 10000 });
        return response.data;
    }
    catch (ex) {
        try {
            const response = await http.get(fallbackUri, { timeout: 10000 });
            return response.data;
        }
        catch (ex) {
            return "";
        }
    }
}
async function fetchHttpOrIpfs(uri) {
    const url = new URL(uri);
    if (url.protocol === "http:" || url.protocol === "https:") {
        return fetchWithFallback(uri, `${uri.replace("ipfs.io", "xpnetwork.infura-ipfs.io")}`);
    }
    if (url.protocol === "ipfs:") {
        const ipfsUri = `https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`;
        const fallbackIpfsUri = `https://xpnetwork.infura-ipfs.io/ipfs/${uri.replace("ipfs://", "")}`;
        return fetchWithFallback(ipfsUri, fallbackIpfsUri);
    }
    throw new Error("Unsupported protocol");
}
exports.fetchHttpOrIpfs = fetchHttpOrIpfs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hIdHRwT3JJcGZzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hhbmRsZXJzL3V0aWxzL2ZldGNoSHR0cE9ySXBmcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBMEI7QUFFMUIsS0FBSyxVQUFVLGlCQUFpQixDQUFDLEdBQVcsRUFBRSxXQUFtQjtJQUMvRCxNQUFNLElBQUksR0FBRyxlQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDNUIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztJQUN2QixDQUFDO0lBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztRQUNaLElBQUksQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNqRSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDdkIsQ0FBQztRQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7WUFDWixPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVNLEtBQUssVUFBVSxlQUFlLENBQUMsR0FBVztJQUMvQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDMUQsT0FBTyxpQkFBaUIsQ0FDdEIsR0FBRyxFQUNILEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsMEJBQTBCLENBQUMsRUFBRSxDQUN4RCxDQUFDO0lBQ0osQ0FBQztJQUNELElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUUsQ0FBQztRQUM3QixNQUFNLE9BQU8sR0FBRyx3QkFBd0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNyRSxNQUFNLGVBQWUsR0FBRyx5Q0FBeUMsR0FBRyxDQUFDLE9BQU8sQ0FDMUUsU0FBUyxFQUNULEVBQUUsQ0FDSCxFQUFFLENBQUM7UUFDSixPQUFPLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFqQkQsMENBaUJDIn0=