export const clamp = (
  /** @type {number} */ value,
  /** @type {number} */ min,
  /** @type {number} */ max
) => Math.min(Math.max(value, min), max);
