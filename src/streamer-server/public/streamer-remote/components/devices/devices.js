import { iconElement } from "../../elements/icon-element.js";
import { DEVICE_MAX_VOLUME } from "../../services/constants.js";
import { STATE } from "../../services/state.js";

export const devices = {
  render: () => {
    const devicesContainer = document.getElementById("devices");

    if (!devicesContainer) {
      throw new Error("element with id 'devices' is missing in the DOM");
    }

    const devices = STATE.get().devices.map(
      ({ id, name, customName, volume }) => {
        const nameContainer = document.createElement("div");
        nameContainer.setAttribute("class", "name-container");
        nameContainer.innerText = customName ?? name;

        const settingsButton = document.createElement("button");
        settingsButton.appendChild(iconElement("settings"));

        const settingsContainer = document.createElement("div");
        settingsContainer.appendChild(settingsButton);

        const nameVolumeContainer = document.createElement("div");
        nameVolumeContainer.setAttribute("class", "name-settings-container");
        nameVolumeContainer.appendChild(nameContainer);
        nameVolumeContainer.appendChild(settingsContainer);

        const volumeSlider = document.createElement("input");
        volumeSlider.setAttribute("type", "range");
        volumeSlider.setAttribute("min", "0");
        volumeSlider.setAttribute("max", DEVICE_MAX_VOLUME.toString());
        volumeSlider.setAttribute("value", volume.toString());
        volumeSlider.addEventListener("change", (event) => {
          const { devices } = STATE.get();
          const thisDevice = devices.find((device) => device.id === id);

          if (
            thisDevice &&
            event.target &&
            "value" in event.target &&
            typeof event.target.value === "string"
          ) {
            thisDevice.volume = +event.target.value;

            STATE.set({ devices });
          }
        });

        const deviceContainer = document.createElement("div");
        deviceContainer.setAttribute("class", "device-container");
        deviceContainer.appendChild(nameVolumeContainer);
        deviceContainer.appendChild(volumeSlider);

        return deviceContainer;
      }
    );

    devicesContainer.replaceChildren(...devices);
  },
};
