import {
  CLIENT_ID,
  SPOTIFY_API_URL,
  SPOTIFY_AUTH_API_URL,
} from "../public/streamer-remote/services/constants.js";
import { databaseRepository } from "./database-repository.js";
import * as Types from "./types.js";

export const login = async (
  /** @type {string} */ code,
  /** @type {string} */ redirectUri
) => {
  const { clientSecret } = await databaseRepository.getData();

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
    throw new Error("unable to login");
  }

  /** @type {{ access_token: string, expires_in: number, refresh_token: string }} */
  const { access_token, expires_in, refresh_token } = await response.json();

  const date = new Date();

  date.setSeconds(date.getSeconds() + expires_in - 30);

  const profile = await getProfile(access_token);

  databaseRepository.setData({
    token: {
      accessToken: access_token,
      expiresAt: date.toISOString(),
      refreshToken: refresh_token,
    },
    profile,
  });
};

const getProfile = async (/** @type {string} */ accessToken) => {
  const response = await fetch(`${SPOTIFY_API_URL}/v1/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("unable to get profile");
  }

  /** @type {NonNullable<Types.Database['profile']>} */
  const { display_name, email } = await response.json();

  return { display_name, email };
};
