import { CLIENT_ID } from "./constants.js";

const BACKEND_IP = "192.168.68.56";
const REDIRECT_URI = `${location.protocol}//${location.host}${location.pathname}`;

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

/** @type {string | undefined} */
let accessToken = undefined;

if (code) {
  const url = new URL(`https://${BACKEND_IP}:3000/login`);
  url.searchParams.append("code", code);
  url.searchParams.append("redirectUri", REDIRECT_URI);

  const response = await fetch(url);

  if (!response.ok) {
    window.location.reload();
  }

  accessToken = await response.text();
} else {
  const response = await fetch(`https://${BACKEND_IP}:3000/access-token`);

  if (!response.ok) {
    window.location.reload();
  }

  accessToken = await response.text();

  if (!accessToken) {
    const url = new URL("https://accounts.spotify.com/authorize");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("client_id", CLIENT_ID);
    url.searchParams.append("scope", "user-read-private user-read-email");
    url.searchParams.append("redirect_uri", REDIRECT_URI);

    window.location.href = url.toString();
  }
}
