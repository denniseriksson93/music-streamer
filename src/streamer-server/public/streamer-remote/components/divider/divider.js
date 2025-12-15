export const divider = {
  render: (/** @type {string} */ keySuffix) => {
    const dividerContainer = document.getElementById(`divider-${keySuffix}`);

    if (!dividerContainer) {
      throw new Error(
        `element with id 'divider-${keySuffix}' is missing in the DOM`
      );
    }

    const divider = document.createElement("div");
    divider.setAttribute("class", "divider");

    dividerContainer.replaceChildren(divider);
  },
};
