"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchHttpOrIpfs = async (uri, http) => {
    const url = new URL(uri);
    if (url.protocol === "http:" || url.protocol === "https:") {
        const response = await http.get(uri);
        return response.data;
    }
    if (url.protocol === "ipfs:") {
        const response = await http.get(`https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`);
        return response.data;
    }
    throw new Error("Unsupported protocol");
};
exports.default = fetchHttpOrIpfs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tIdHRwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hhbmRsZXJzL3V0aWxzL2NoZWNrSHR0cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQU0sZUFBZSxHQUFHLEtBQUssRUFBRSxHQUFXLEVBQUUsSUFBbUIsRUFBRSxFQUFFO0lBQ2pFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUMxRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFLENBQUM7UUFDN0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUM3Qix3QkFBd0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FDckQsQ0FBQztRQUNGLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztJQUN2QixDQUFDO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQztBQUVGLGtCQUFlLGVBQWUsQ0FBQyJ9