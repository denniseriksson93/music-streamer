export const isMacAddress = (/** @type {string} */ value) => {
  const macRegex = /^([0-9A-Fa-f]{2}([-:])){5}[0-9A-Fa-f]{2}$/;
  return macRegex.test(value);
};
