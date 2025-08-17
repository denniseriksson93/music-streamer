import { CLIENT_ID } from "../../src/constants.js";

const accessToken = await fetch("");

const REDIRECT_URI = `${location.protocol}//${location.host}${location.pathname}`;

const url = new URL("https://accounts.spotify.com/authorize");
url.searchParams.append("response_type", "code");
url.searchParams.append("client_id", CLIENT_ID);
url.searchParams.append("scope", "user-read-private user-read-email");
url.searchParams.append("REDIRECT_URI", REDIRECT_URI);

window.location.href = url.toString();
