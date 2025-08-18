import { CLIENT_ID, SPOTIFY_AUTH_API_URL } from "./constants.js";
import { databaseRepository } from "./database-repository.js";

export const login = async (
  /** @type {string} */ code,
  /** @type {string} */ redirectUri
) => {
  const {
    clientSecret,
    token: { accessToken, expiresAt },
  } = await databaseRepository.getData();

  const date = new Date();

  if (new Date(expiresAt).getTime() > date.getTime()) {
    return accessToken;
  }

  const response = await fetch(`${SPOTIFY_AUTH_API_URL}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    return undefined;
  }

  /** @type {{access_token: string, expires_in: number, refresh_token: string}} */
  const { access_token, expires_in, refresh_token } = await response.json();

  date.setSeconds(date.getSeconds() + expires_in - 30);

  databaseRepository.setData({
    token: {
      accessToken: access_token,
      expiresAt: date.toISOString(),
      refreshToken: refresh_token,
    },
  });

  return accessToken;
};
