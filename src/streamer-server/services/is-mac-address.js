const macRegex = /^([0-9A-Fa-f]{2}([-:])){5}[0-9A-Fa-f]{2}$/;

export const isMacAddress = (/** @type {string} */ value) =>
  macRegex.test(value);
