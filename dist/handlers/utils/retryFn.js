"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const retryFn = async (func, ctx, selector, code, retries = 3) => {
    try {
        return await func();
    }
    catch (e) {
        if (code.includes(selector)) {
            return await retryFn(func, ctx, selector, code, retries - 1);
        }
        return undefined;
    }
};
exports.default = retryFn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnlGbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oYW5kbGVycy91dGlscy9yZXRyeUZuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUNuQixJQUFzQixFQUN0QixHQUFXLEVBQ1gsUUFBZ0IsRUFDaEIsSUFBWSxFQUNaLE9BQU8sR0FBRyxDQUFDLEVBQ2EsRUFBRTtJQUMxQixJQUFJLENBQUM7UUFDSCxPQUFPLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDWCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUM1QixPQUFPLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7QUFDSCxDQUFDLENBQUM7QUFFRixrQkFBZSxPQUFPLENBQUMifQ==