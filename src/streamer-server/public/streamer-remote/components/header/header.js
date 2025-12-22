import { iconElement } from "../../elements/icon-element.js";

export const createHeader = () => {
  const headerContainer = document.getElementById("header");

  if (!headerContainer) {
    throw new Error("element with id 'header' is missing in the DOM");
  }

  const icon = iconElement("music_cast");

  const headerNameContainer = document.createElement("div");
  headerNameContainer.setAttribute("class", "header-name-container");
  headerNameContainer.innerText = "Music Streamer";

  const logoContainer = document.createElement("div");
  logoContainer.setAttribute("class", "logo-container");
  logoContainer.appendChild(icon);
  logoContainer.appendChild(headerNameContainer);

  return {
    render: () => {
      if (headerContainer.children.length <= 0) {
        headerContainer.replaceChildren(logoContainer);
      }
    },
  };
};
