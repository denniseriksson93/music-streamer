import { addDevice } from "./components/add-device/add-device.js";
import { devices } from "./components/devices/devices.js";
import { globalVolume } from "./components/global-volume/global-volume.js";
import { signInToSpotify } from "./services/sign-in-to-spotify.js";
import { STATE } from "./services/state.js";

const isSignedIn = await signInToSpotify();

if (isSignedIn) {
  addDevice.render();
  globalVolume.render();
  devices.render();

  STATE.registerOnStateChanged("devices", devices.render);
}
