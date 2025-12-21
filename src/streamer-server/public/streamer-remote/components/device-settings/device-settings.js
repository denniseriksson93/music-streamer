import { STATE } from "../../services/state.js";

export const deviceSettings = {
  render: () => {
    const deviceSettingsContainer = document.getElementById("device-settings");

    if (!deviceSettingsContainer) {
      throw new Error(
        "element with id 'device-settings' is missing in the DOM"
      );
    }

    const { devices, selectedDeviceId } = STATE.get();

    const selectedDevice = devices.find(({ id }) => id === selectedDeviceId);

    if (!selectedDevice) {
      deviceSettingsContainer.replaceChildren();
      return;
    }

    const name = document.createElement("div");
    name.innerText = selectedDevice.name;

    const customNameLabel = document.createElement("div");
    customNameLabel.innerText = "Custom name";

    const customNameInput = document.createElement("input");
    customNameInput.setAttribute("type", "text");
    customNameInput.setAttribute("value", selectedDevice.customName);

    const customNameContainer = document.createElement("div");
    customNameContainer.setAttribute("class", "custom-name-container");
    customNameContainer.appendChild(customNameLabel);
    customNameContainer.appendChild(customNameInput);

    const contentContainer = document.createElement("div");
    contentContainer.setAttribute("class", "content-container");
    contentContainer.appendChild(name);
    contentContainer.appendChild(customNameContainer);

    const mainContainer = document.createElement("div");
    mainContainer.setAttribute("class", "main-container");
    mainContainer.appendChild(contentContainer);

    deviceSettingsContainer.replaceChildren(mainContainer);
  },
};
