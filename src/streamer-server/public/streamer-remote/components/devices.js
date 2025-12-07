import { STATE } from "../services/state.js";

export const devices = {
  render: () => {
    const devices = STATE.get().devices.map(({ name, customName, volume }) => {
      const nameContainer = document.createElement("div");
      nameContainer.innerText = customName ?? name;

      const volumeSlider = document.createElement("input");
      volumeSlider.setAttribute("type", "range");
      volumeSlider.setAttribute("value", (volume / 1000).toString());

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
    });

    const devicesContainer = document.getElementById("devices");

    if (!devicesContainer) {
      throw new Error("element with id 'devices' is missing in the DOM");
    }

    devicesContainer.replaceChildren(...devices);
  },
};
