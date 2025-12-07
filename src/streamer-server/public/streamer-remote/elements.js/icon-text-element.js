import { iconElement } from "./icon-element.js";

export const iconTextElement = (
  /** @type { Parameters<typeof iconElement>[0]} */ icon,
  /** @type {string} */ text
) => {
  const textContainer = document.createElement("div");
  textContainer.innerText = text;

  const iconTextContainer = document.createElement("div");
  iconTextContainer.setAttribute("class", "icon-text-container");
  iconTextContainer.appendChild(iconElement(icon));
  iconTextContainer.appendChild(textContainer);

  return iconTextContainer;
};
