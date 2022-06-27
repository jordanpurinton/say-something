export const asyncHandler = (fn: () => Promise<any>) => {
  try {
    return fn();
  } catch (err) {
    console.error(err);
    throw Error(err.toS);
  }
};
