"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const retryFn = async (func, ctx, selector, code, retries = 3) => {
    try {
        return await func();
    }
    catch (e) {
        if (code.includes(selector.slice(2))) {
            return await retryFn(func, ctx, selector, code, retries - 1);
        }
        return undefined;
    }
};
exports.default = retryFn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnlGbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oYW5kbGVycy91dGlscy9yZXRyeUZuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUNuQixJQUFzQixFQUN0QixHQUFXLEVBQ1gsUUFBZ0IsRUFDaEIsSUFBWSxFQUNaLE9BQU8sR0FBRyxDQUFDLEVBQ2EsRUFBRTtJQUMxQixJQUFJLENBQUM7UUFDSCxPQUFPLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDWCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDckMsT0FBTyxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsT0FBTyxDQUFDIn0=