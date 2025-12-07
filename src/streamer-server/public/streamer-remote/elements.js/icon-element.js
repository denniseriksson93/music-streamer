export const iconElement = (
  /** @type {'add_circle'|'do_not_disturb_on'} */ icon
) => {
  const iconContainer = document.createElement("span");
  iconContainer.setAttribute("class", "material-symbols-outlined");
  iconContainer.innerText = icon;
  return iconContainer;
};
