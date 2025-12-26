import { iconElement } from "../../elements/icon-element.js";
import { iconTextElement } from "../../elements/icon-text-element.js";
import { authService } from "../../services/auth-service.js";

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

  const profileContainer = document.createElement("div");
  profileContainer.setAttribute("class", "profile");

  return {
    render: () => {
      authService.getProfile().then((profile) => {
        if (profile) {
          const { display_name, email } = profile;

          profileContainer.replaceChildren(
            iconTextElement("account_circle", display_name ?? email ?? "")
          );
        }
      });

      if (headerContainer.children.length <= 0) {
        headerContainer.replaceChildren(logoContainer, profileContainer);
      }
    },
  };
};
