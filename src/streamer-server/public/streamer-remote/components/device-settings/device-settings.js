import { iconElement } from "../../elements/icon-element.js";
import { iconTextElement } from "../../elements/icon-text-element.js";
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

    const settingsContainer = document.createElement("div");
    settingsContainer.setAttribute("class", "settings-container");
    settingsContainer.appendChild(name);
    settingsContainer.appendChild(customNameContainer);

    const closeButton = document.createElement("button");
    closeButton.setAttribute("class", "full-width button-secondary");
    closeButton.appendChild(iconTextElement("close", "Close"));
    closeButton.addEventListener("click", () =>
      STATE.set({ selectedDeviceId: undefined })
    );

    const saveAndCloseButton = document.createElement("button");
    saveAndCloseButton.setAttribute("class", "full-width");
    saveAndCloseButton.appendChild(iconTextElement("save", "Save"));

    const buttonsContainer = document.createElement("div");
    buttonsContainer.setAttribute("class", "buttons-container");
    buttonsContainer.appendChild(closeButton);
    buttonsContainer.appendChild(saveAndCloseButton);

    const settingsButtonsContainer = document.createElement("div");
    settingsButtonsContainer.setAttribute("class", "settings-button-container");
    settingsButtonsContainer.appendChild(settingsContainer);
    settingsButtonsContainer.appendChild(buttonsContainer);

    const contentContainer = document.createElement("div");
    contentContainer.setAttribute("class", "content-container");
    contentContainer.appendChild(settingsButtonsContainer);

    const mainContainer = document.createElement("div");
    mainContainer.setAttribute("class", "main-container");
    mainContainer.appendChild(contentContainer);

    deviceSettingsContainer.replaceChildren(mainContainer);
  },
};
