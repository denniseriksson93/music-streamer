import { DEVICE_MAX_VOLUME } from "../services/constants.js";
import { STATE } from "../services/state.js";

export const devices = {
  render: () => {
    const devicesContainer = document.getElementById("devices");

    if (!devicesContainer) {
      throw new Error("element with id 'devices' is missing in the DOM");
    }

    const devices = STATE.get().devices.map(
      ({ id, name, customName, volume }) => {
        const nameContainer = document.createElement("div");
        nameContainer.innerText = customName ?? name;

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

        const nameVolumeContainer = document.createElement("div");
        nameVolumeContainer.setAttribute("class", "name-volume-container");
        nameVolumeContainer.appendChild(nameContainer);
        nameVolumeContainer.appendChild(volumeSlider);

        const settingsButton = document.createElement("button");
        settingsButton.innerText = "Settings";

        const settingsContainer = document.createElement("div");
        settingsContainer.appendChild(settingsButton);

        const deviceContainer = document.createElement("div");
        deviceContainer.setAttribute("class", "device-container");
        deviceContainer.appendChild(nameVolumeContainer);
        deviceContainer.appendChild(settingsContainer);

        return deviceContainer;
      }
    );

    devicesContainer.replaceChildren(...devices);
  },
};
