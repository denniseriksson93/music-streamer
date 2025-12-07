import {
  CLIENT_ID,
  SPOTIFY_AUTH_API_URL,
} from "../public/streamer-remote/services/constants.js";
import { databaseRepository } from "./database-repository.js";

export const getAndRefreshToken = async () => {
  const {
    token: { accessToken, expiresAt, refreshToken },
  } = await databaseRepository.getData();

  const date = new Date();

  if (new Date(expiresAt).getTime() > date.getTime()) {
    return accessToken;
  }

  const response = await fetch(`${SPOTIFY_AUTH_API_URL}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
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
