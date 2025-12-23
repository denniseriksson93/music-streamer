import { BACKEND_URL } from "./sign-in-to-spotify.js";

export const signOutFromSpotify = async () => {
  const response = await fetch(`${BACKEND_URL}/sign-out`, { method: "delete" });

  if (response.ok) {
    window.location.reload();
  }
};
