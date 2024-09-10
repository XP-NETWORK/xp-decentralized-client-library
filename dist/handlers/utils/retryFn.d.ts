declare const retryFn: <T>(func: () => Promise<T>, ctx: string, selector: string, code: string, retries?: number) => Promise<T | undefined>;
export default retryFn;
//# sourceMappingURL=retryFn.d.ts.map