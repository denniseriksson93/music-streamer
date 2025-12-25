const getAccessToken = async () => {
  const response = await fetch("/access-token");

  if (!response.ok) {
    return undefined;
  }

  return await response.text();
};

while (true) {
  const accessToken = await getAccessToken();

  if (accessToken) {
    break;
  } else {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

// @ts-ignore
window.onSpotifyWebPlaybackSDKReady = async () => {
  // @ts-ignore
  const player = new Spotify.Player({
    name: "Music Streamer",
    getOAuthToken: async (
      /** @type {(accessToken: string | undefined) => void} */ cb
    ) => {
      const accessToken = await getAccessToken();

      if (accessToken) {
        cb(accessToken);
      } else {
        window.location.reload();
      }
    },
    volume: 0.5,
  });

  player.addListener("initialization_error", () => window.location.reload());
  player.addListener("account_error", () => window.location.reload());

  player.connect();
};

const script = window.document.createElement("script");
script.src = "https://sdk.scdn.co/spotify-player.js";
script.async = true;
window.document.body.appendChild(script);
