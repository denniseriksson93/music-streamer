// https://fonts.google.com/icons?icon.size=24&icon.color=%231f1f1f
export const iconElement = (
  /** @type {'add_circle'|'do_not_disturb_on'|'settings'} */ icon
) => {
  const iconContainer = document.createElement("span");
  iconContainer.setAttribute("class", "material-symbols-outlined");
  iconContainer.innerText = icon;
  return iconContainer;
};
