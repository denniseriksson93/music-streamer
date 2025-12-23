import { dividerElement } from "../../elements/divider-element.js";
import { iconTextElement } from "../../elements/icon-text-element.js";
import { signOutFromSpotify } from "../../services/sign-out-from-spotify.js";

export const createSignOut = () => {
  const signOutContainer = document.getElementById("sign-out");

  if (!signOutContainer) {
    throw new Error("element with id 'sign-out' is missing in the DOM");
  }

  const divider = dividerElement();

  const signOutButton = document.createElement("button");
  signOutButton.setAttribute("class", "full-width button-danger button-small");
  signOutButton.appendChild(iconTextElement("logout", "Sign out from Spotify"));
  signOutButton.addEventListener("click", signOutFromSpotify);

  const signOutButtonContainer = document.createElement("div");
  signOutButtonContainer.setAttribute("class", "frosted-glass");
  signOutButtonContainer.appendChild(signOutButton);

  return {
    render: () => {
      if (signOutContainer.children.length <= 0) {
        signOutContainer.replaceChildren(divider, signOutButtonContainer);
      }
    },
  };
};
