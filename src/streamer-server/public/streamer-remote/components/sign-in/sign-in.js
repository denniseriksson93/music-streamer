import { iconTextElement } from "../../elements/icon-text-element.js";
import { authService } from "../../services/auth-service.js";

export const createSignIn = () => {
  const signInContainer = document.getElementById("sign-in");

  if (!signInContainer) {
    throw new Error("element with id 'sign-in' is missing in the DOM");
  }

  const signInButton = document.createElement("button");
  signInButton.setAttribute("class", "full-width");
  signInButton.appendChild(iconTextElement("login", "Sign in with Spotify"));
  signInButton.addEventListener("click", authService.signIn);

  const signOutButtonContainer = document.createElement("div");
  signOutButtonContainer.setAttribute("class", "frosted-glass");
  signOutButtonContainer.appendChild(signInButton);

  return {
    render: () => {
      if (signInContainer.children.length <= 0) {
        signInContainer.replaceChildren(signOutButtonContainer);
        signInContainer.style.removeProperty("display");
      }
    },
  };
};
