import { addDevice } from "./components/add-device.js";
import { devices } from "./components/devices.js";
import { globalVolume } from "./components/global-volume.js";
import { STATE } from "./state.js";

const BACKEND_URL = location.origin;
const REDIRECT_URI = `${location.protocol}//${location.host}${location.pathname}`;
const CLIENT_ID = "ec93c4e175eb4f979a2a2b810601a679";

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

  if (!accessToken) {
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
}

STATE.registerCallbackFunction(addDevice.render);
STATE.registerCallbackFunction(globalVolume.render);
STATE.registerCallbackFunction(devices.render);

STATE.set({});
