"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeploy = exports.sleep = void 0;
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const getDeploy = async (client, deployHash) => {
    let i = 300;
    while (i !== 0) {
        try {
            const [_, raw] = await client.getDeploy(deployHash);
            //@ts-ignore
            if (raw.execution_results.length !== 0) {
                // @ts-ignore
                if (raw.execution_results[0].result.Success) {
                    return raw;
                }
                else {
                    // @ts-ignore
                    throw Error("Contract execution: " +
                        // @ts-ignore
                        raw.execution_results[0].result.Failure.error_message);
                }
            }
            else {
                i--;
                await (0, exports.sleep)(4000);
                continue;
            }
        }
        catch (e) {
            console.log(e.message);
            if (e.message.match(/(deploy not known|no such deploy)/gim)) {
                i--;
                await (0, exports.sleep)(4000);
                continue;
            }
            else {
                throw e;
            }
        }
    }
    throw Error("Timeout after " + i + "s. Something's wrong");
};
exports.getDeploy = getDeploy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWRlcGxveS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oYW5kbGVycy9jYXNwZXIvZ2V0LWRlcGxveS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLEtBQUssR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFO0lBQ2xDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUM7QUFGVyxRQUFBLEtBQUssU0FFaEI7QUFDSyxNQUFNLFNBQVMsR0FBRyxLQUFLLEVBQUUsTUFBb0IsRUFBRSxVQUFrQixFQUFFLEVBQUU7SUFDMUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwRCxZQUFZO1lBQ1osSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUN2QyxhQUFhO2dCQUNiLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDNUMsT0FBTyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQztxQkFBTSxDQUFDO29CQUNOLGFBQWE7b0JBQ2IsTUFBTSxLQUFLLENBQ1Qsc0JBQXNCO3dCQUNwQixhQUFhO3dCQUNiLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FDeEQsQ0FBQztnQkFDSixDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLENBQUMsRUFBRSxDQUFDO2dCQUNKLE1BQU0sSUFBQSxhQUFLLEVBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLFNBQVM7WUFDWCxDQUFDO1FBQ0gsQ0FBQztRQUFDLE9BQU8sQ0FBTSxFQUFFLENBQUM7WUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxFQUFFLENBQUM7Z0JBQzVELENBQUMsRUFBRSxDQUFDO2dCQUNKLE1BQU0sSUFBQSxhQUFLLEVBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLFNBQVM7WUFDWCxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sTUFBTSxDQUFDLENBQUM7WUFDVixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztBQUM3RCxDQUFDLENBQUM7QUFuQ1csUUFBQSxTQUFTLGFBbUNwQiJ9