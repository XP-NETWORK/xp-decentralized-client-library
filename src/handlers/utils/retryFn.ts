const retryFn = async <T>(
  func: () => Promise<T>,
  ctx: string,
  selector: string,
  code: string,
  retries = 3,
): Promise<T | undefined> => {
  try {
    return await func();
  } catch (e) {
    if (code.includes(selector.slice(2))) {
      return await retryFn(func, ctx, selector, code, retries - 1);
    }
    return undefined;
  }
};

export default retryFn;
