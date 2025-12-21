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

    const editingState = { ...selectedDevice };

    const name = document.createElement("div");
    name.setAttribute("class", "name");
    name.innerText = selectedDevice.name;

    const customNameLabel = document.createElement("div");
    customNameLabel.innerText = "Custom name";

    const customNameInput = document.createElement("input");
    customNameInput.setAttribute("type", "text");
    customNameInput.setAttribute("value", selectedDevice.customName);
    customNameInput.addEventListener("input", (event) => {
      if (
        event.target &&
        "value" in event.target &&
        typeof event.target.value === "string"
      ) {
        editingState.customName = event.target.value;
      }
    });

    const customNameContainer = document.createElement("div");
    customNameContainer.setAttribute("class", "custom-name-container");
    customNameContainer.appendChild(customNameLabel);
    customNameContainer.appendChild(customNameInput);

    const latencyOffsetLabel = document.createElement("div");
    latencyOffsetLabel.innerText = "Latency offset";

    const latencyOffsetMinusButton = document.createElement("button");
    latencyOffsetMinusButton.appendChild(iconElement("do_not_disturb_on"));

    const latencyOffsetValue = document.createElement("div");
    latencyOffsetValue.innerText = selectedDevice.latencyOffset.toString();

    const latencyOffsetPlusButton = document.createElement("button");
    latencyOffsetPlusButton.appendChild(iconElement("add_circle"));

    const latencyOffsetInputContainer = document.createElement("div");
    latencyOffsetInputContainer.setAttribute(
      "class",
      "latency-offset-input-container"
    );
    latencyOffsetInputContainer.appendChild(latencyOffsetMinusButton);
    latencyOffsetInputContainer.appendChild(latencyOffsetValue);
    latencyOffsetInputContainer.appendChild(latencyOffsetPlusButton);

    const latencyOffsetContainer = document.createElement("div");
    latencyOffsetContainer.setAttribute("class", "latency-offset-container");
    latencyOffsetContainer.appendChild(latencyOffsetLabel);
    latencyOffsetContainer.appendChild(latencyOffsetInputContainer);

    const settingsContainer = document.createElement("div");
    settingsContainer.setAttribute("class", "settings-container");
    settingsContainer.appendChild(name);
    settingsContainer.appendChild(customNameContainer);
    settingsContainer.appendChild(latencyOffsetContainer);

    const closeButton = document.createElement("button");
    closeButton.setAttribute("class", "full-width button-secondary");
    closeButton.appendChild(iconTextElement("close", "Close"));
    closeButton.addEventListener("click", () =>
      STATE.set({ selectedDeviceId: undefined })
    );

    const saveAndCloseButton = document.createElement("button");
    saveAndCloseButton.setAttribute("class", "full-width");
    saveAndCloseButton.appendChild(iconTextElement("save", "Save"));
    saveAndCloseButton.addEventListener("click", () => {
      const { devices } = STATE.get();

      const deviceToUpdate = devices.find(({ id }) => id === selectedDeviceId);

      if (deviceToUpdate) {
        Object.assign(deviceToUpdate, editingState);
      }

      STATE.set({ devices, selectedDeviceId: undefined });
    });

    const buttonsContainer = document.createElement("div");
    buttonsContainer.setAttribute("class", "buttons-container");
    buttonsContainer.appendChild(closeButton);
    buttonsContainer.appendChild(saveAndCloseButton);

    const settingsButtonsContainer = document.createElement("div");
    settingsButtonsContainer.setAttribute(
      "class",
      "settings-buttons-container"
    );
    settingsButtonsContainer.appendChild(settingsContainer);
    settingsButtonsContainer.appendChild(buttonsContainer);

    const contentContainer = document.createElement("div");
    contentContainer.setAttribute("class", "content-container frosted-glass");
    contentContainer.appendChild(settingsButtonsContainer);

    const mainContainer = document.createElement("div");
    mainContainer.setAttribute("class", "main-container");
    mainContainer.appendChild(contentContainer);

    deviceSettingsContainer.replaceChildren(mainContainer);
  },
};
