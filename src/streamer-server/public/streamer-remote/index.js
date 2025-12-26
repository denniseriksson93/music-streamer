import { createDeviceSettings } from "./components/device-settings/device-settings.js";
import { createDevices } from "./components/devices/devices.js";
import { createGlobalVolume } from "./components/global-volume/global-volume.js";
import { createHeader } from "./components/header/header.js";
import { createSignIn } from "./components/sign-in/sign-in.js";
import { createSignOut } from "./components/sign-out/sign-out.js";
import { authService } from "./services/auth-service.js";
import { STATE } from "./services/state.js";

await authService.listenToAuthRedirect();

const isSignedIn = await authService.isSignedIn();

createHeader().render();

if (isSignedIn) {
  const globalVolume = createGlobalVolume();
  const devices = createDevices();
  const deviceSettings = createDeviceSettings();
  const signOut = createSignOut();

  globalVolume.render();
  devices.render();
  signOut.render();

  STATE.registerOnStateChanged("devices", globalVolume.render);
  STATE.registerOnStateChanged("devices", devices.render);
  STATE.registerOnStateChanged("editingDevice", deviceSettings.render);
} else {
  createSignIn().render();
}
