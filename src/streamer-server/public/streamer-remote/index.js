import { createAddDevice } from "./components/add-device/add-device.js";
import { createDeviceSettings } from "./components/device-settings/device-settings.js";
import { createDevices } from "./components/devices/devices.js";
import { createGlobalVolume } from "./components/global-volume/global-volume.js";
import { createHeader } from "./components/header/header.js";
import { signInToSpotify } from "./services/sign-in-to-spotify.js";
import { STATE } from "./services/state.js";

const isSignedIn = await signInToSpotify();

if (isSignedIn) {
  const header = createHeader();
  const globalVolume = createGlobalVolume();
  const devices = createDevices();
  const addDevice = createAddDevice();
  const deviceSettings = createDeviceSettings();

  header.render();
  globalVolume.render();
  devices.render();
  addDevice.render();

  STATE.registerOnStateChanged("devices", globalVolume.render);
  STATE.registerOnStateChanged("devices", devices.render);
  STATE.registerOnStateChanged("editingDevice", deviceSettings.render);
}
