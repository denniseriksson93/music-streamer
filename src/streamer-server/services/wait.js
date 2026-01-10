export const wait = (/** @type {number} */ milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
