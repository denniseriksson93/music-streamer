import { CLIENT_ID } from "./constants.js";

const BACKEND_URL = location.origin;
const REDIRECT_URI = `${location.protocol}//${location.host}${location.pathname}`;

export const signInToSpotify = async () => {
  const code = new URLSearchParams(window.location.search).get("code");

  if (code) {
    const url = new URL(`${BACKEND_URL}/login`);
    url.searchParams.append("code", code);
    url.searchParams.append("redirectUri", REDIRECT_URI);

    const response = await fetch(url);

    if (response.ok) {
      window.location.href = REDIRECT_URI;
    }
  } else {
    const response = await fetch(`${BACKEND_URL}/access-token`);

    if (!response.ok) {
      window.location.reload();
    }

    /** @type {string | undefined} */
    const accessToken = await response.text();

    if (accessToken) {
      return true;
    }

    const url = new URL("https://accounts.spotify.com/authorize");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("client_id", CLIENT_ID);
    url.searchParams.append(
      "scope",
      "streaming user-read-email user-read-private"
    );
    url.searchParams.append("redirect_uri", REDIRECT_URI);
    window.location.href = url.toString();
  }

  return false;
};
