import { addDevice } from "./components/add-device/add-device.js";
import { deviceSettings } from "./components/device-settings/device-settings.js";
import { devices } from "./components/devices/devices.js";
import { globalVolume } from "./components/global-volume/global-volume.js";
import { header } from "./components/header/header.js";
import { signInToSpotify } from "./services/sign-in-to-spotify.js";
import { STATE } from "./services/state.js";

const isSignedIn = await signInToSpotify();

if (isSignedIn) {
  header.render();
  globalVolume.render();
  devices.render();
  addDevice.render();

  STATE.registerOnStateChanged("devices", globalVolume.render);
  STATE.registerOnStateChanged("devices", devices.render);
  STATE.registerOnStateChanged("editingDevice", deviceSettings.render);

  const mainContainer = document.getElementById("main-container");

  if (mainContainer) {
    mainContainer.classList.remove("hide");
  }
}
