import { iconElement } from "../../elements/icon-element.js";
import { clamp } from "../../services/clamp.js";
import { DEVICE_MAX_VOLUME } from "../../services/constants.js";
import { backendService } from "../../services/backend-service.js";
import { STATE } from "../../services/state.js";

const VOLUME_STEP = 5;

export const createGlobalVolume = () => {
  const globalVolumeContainer = document.getElementById("global-volume");

  if (!globalVolumeContainer) {
    throw new Error("element with id 'global-volume' is missing in the DOM");
  }

  const volumeLabelContainer = document.createElement("div");
  volumeLabelContainer.innerText = "Volume";

  const minusButton = document.createElement("button");
  minusButton.appendChild(iconElement("do_not_disturb_on"));
  minusButton.addEventListener(
    "click",
    async () => await incrementVolumeOnAllDevices(-VOLUME_STEP),
  );

  const plusButton = document.createElement("button");
  plusButton.appendChild(iconElement("add_circle"));
  plusButton.addEventListener(
    "click",
    async () => await incrementVolumeOnAllDevices(VOLUME_STEP),
  );

  const volumeButtonsContainer = document.createElement("div");
  volumeButtonsContainer.setAttribute("class", "volume-buttons-container");
  volumeButtonsContainer.appendChild(minusButton);
  volumeButtonsContainer.appendChild(plusButton);

  const globalVolumeContent = document.createElement("div");
  globalVolumeContent.setAttribute("class", "global-volume-content");
  globalVolumeContent.appendChild(volumeLabelContainer);
  globalVolumeContent.appendChild(volumeButtonsContainer);

  const frostedGlassContainer = document.createElement("div");
  frostedGlassContainer.setAttribute("class", "frosted-glass");
  frostedGlassContainer.appendChild(globalVolumeContent);

  return {
    render: () => {
      const { devices } = STATE.get();

      const connectedDevices = devices.filter(({ connected }) => connected);

      if (connectedDevices.length > 0) {
        if (connectedDevices.every(({ volume }) => volume <= 0)) {
          minusButton.setAttribute("disabled", "disabled");
        } else {
          minusButton.removeAttribute("disabled");
        }

        if (
          connectedDevices.every(({ volume }) => volume >= DEVICE_MAX_VOLUME)
        ) {
          plusButton.setAttribute("disabled", "disabled");
        } else {
          plusButton.removeAttribute("disabled");
        }
      } else {
        minusButton.setAttribute("disabled", "disabled");
        plusButton.setAttribute("disabled", "disabled");
      }

      if (globalVolumeContainer.children.length <= 0) {
        globalVolumeContainer.replaceChildren(frostedGlassContainer);
      }
    },
  };
};

const incrementVolumeOnAllDevices = async (/** @type {number} */ increment) => {
  const { devices } = STATE.get();

  await Promise.all(
    devices
      .filter(({ connected }) => connected)
      .map((device) =>
        backendService.setVolumeOnDevice(
          device.bluetoothAddress,
          clamp(device.volume + increment, 0, DEVICE_MAX_VOLUME),
        ),
      ),
  );

  await backendService.getAndSetDevices();
};
