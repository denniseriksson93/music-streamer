// @ts-nocheck

const getAccessToken = async () => {
  const accessTokenResponse = await fetch("/access-token");

  if (!accessTokenResponse.ok) {
    window.location.reload;
  }

  return await accessTokenResponse.text();
};

window.onSpotifyWebPlaybackSDKReady = async () => {
  const player = new Spotify.Player({
    name: "Music streamer",
    getOAuthToken: async (cb) => {
      const accessToken = await getAccessToken();
      cb(accessToken);
    },
    volume: 0.5,
  });

  // Ready
  player.addListener("ready", ({ device_id }) => {
    console.log("Ready with Device ID", device_id);
  });

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  player.addListener("initialization_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("authentication_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("account_error", ({ message }) => {
    console.error(message);
  });

  document.getElementById("togglePlay").onclick = function () {
    player.togglePlay();
  };

  player.connect();
};
