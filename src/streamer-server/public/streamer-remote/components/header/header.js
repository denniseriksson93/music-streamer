import { iconElement } from "../../elements/icon-element.js";
import { iconTextElement } from "../../elements/icon-text-element.js";

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

  const refreshIcon = iconTextElement("sync", "Resync");

  const refreshIconContainer = document.createElement("div");
  refreshIconContainer.setAttribute(
    "class",
    "refresh-icon-container frosted-glass"
  );
  refreshIconContainer.appendChild(refreshIcon);
  refreshIconContainer.addEventListener("click", () =>
    window.location.reload()
  );

  return {
    render: () => {
      if (headerContainer.children.length <= 0) {
        headerContainer.replaceChildren(logoContainer, refreshIconContainer);
      }
    },
  };
};
