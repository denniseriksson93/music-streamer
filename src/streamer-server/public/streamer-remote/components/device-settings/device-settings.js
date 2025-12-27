import { iconElement } from "../../elements/icon-element.js";
import { iconTextElement } from "../../elements/icon-text-element.js";
import { STATE } from "../../services/state.js";

export const createDeviceSettings = () => {
  const deviceSettingsContainer = document.getElementById("device-settings");

  if (!deviceSettingsContainer) {
    throw new Error("element with id 'device-settings' is missing in the DOM");
  }

  const name = document.createElement("div");
  name.setAttribute("class", "name");

  const customNameLabel = document.createElement("div");
  customNameLabel.innerText = "Custom name";

  const customNameInput = document.createElement("input");
  customNameInput.setAttribute("type", "text");
  customNameInput.addEventListener("input", (event) => {
    const { editingDevice } = STATE.get();

    if (editingDevice) {
      if (
        event.target &&
        "value" in event.target &&
        typeof event.target.value === "string"
      ) {
        editingDevice.customName = event.target.value;
        STATE.set({ editingDevice });
      }
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
  latencyOffsetMinusButton.addEventListener("click", () => {
    const { editingDevice } = STATE.get();

    if (editingDevice) {
      editingDevice.latencyOffset -= 10;
      STATE.set({ editingDevice });
    }
  });

  const latencyOffsetValue = document.createElement("div");

  const latencyOffsetPlusButton = document.createElement("button");
  latencyOffsetPlusButton.appendChild(iconElement("add_circle"));
  latencyOffsetPlusButton.addEventListener("click", () => {
    const { editingDevice } = STATE.get();

    if (editingDevice) {
      editingDevice.latencyOffset += 10;
      STATE.set({ editingDevice });
    }
  });

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
  closeButton.appendChild(iconTextElement("cancel", "Close"));
  closeButton.addEventListener("click", () =>
    STATE.set({ editingDevice: undefined })
  );

  const saveAndCloseButton = document.createElement("button");
  saveAndCloseButton.setAttribute("class", "full-width");
  saveAndCloseButton.appendChild(iconTextElement("save", "Save"));
  saveAndCloseButton.addEventListener("click", () => {
    const { editingDevice, devices } = STATE.get();

    if (editingDevice) {
      const deviceToUpdate = devices.find(
        ({ bluetoothAddress }) =>
          bluetoothAddress === editingDevice.bluetoothAddress
      );

      if (deviceToUpdate) {
        Object.assign(deviceToUpdate, editingDevice);
      }

      STATE.set({ devices, editingDevice: undefined });
    }
  });

  const firstRowButtonsContainer = document.createElement("div");
  firstRowButtonsContainer.setAttribute("class", "first-row-buttons-container");
  firstRowButtonsContainer.appendChild(closeButton);
  firstRowButtonsContainer.appendChild(saveAndCloseButton);

  const deleteDeviceButton = document.createElement("button");
  deleteDeviceButton.setAttribute(
    "class",
    "full-width button-danger button-small"
  );
  deleteDeviceButton.appendChild(iconTextElement("delete", "Delete device"));
  deleteDeviceButton.addEventListener("click", () => {
    const { devices, editingDevice } = STATE.get();

    if (editingDevice) {
      const didConfirm = window.confirm(
        `Are you sure you want to delete device ${
          editingDevice?.customName ?? editingDevice?.name
        }?`
      );

      if (didConfirm) {
        STATE.set({
          devices: devices.filter(
            ({ bluetoothAddress }) =>
              bluetoothAddress !== editingDevice.bluetoothAddress
          ),
          editingDevice: undefined,
        });
      }
    }
  });

  const buttonsContainer = document.createElement("div");
  buttonsContainer.setAttribute("class", "buttons-container");
  buttonsContainer.appendChild(firstRowButtonsContainer);
  buttonsContainer.appendChild(deleteDeviceButton);

  const settingsButtonsContainer = document.createElement("div");
  settingsButtonsContainer.setAttribute("class", "settings-buttons-container");
  settingsButtonsContainer.appendChild(settingsContainer);
  settingsButtonsContainer.appendChild(buttonsContainer);

  const contentContainer = document.createElement("div");
  contentContainer.setAttribute("class", "content-container frosted-glass");
  contentContainer.appendChild(settingsButtonsContainer);

  const mainContainer = document.createElement("div");
  mainContainer.setAttribute("class", "main-container");
  mainContainer.appendChild(contentContainer);

  return {
    render: () => {
      const { editingDevice } = STATE.get();

      if (editingDevice) {
        name.innerText = editingDevice.name;

        customNameInput.value = editingDevice.customName ?? "";

        latencyOffsetValue.innerText = `${editingDevice.latencyOffset.toString()} ms`;

        if (deviceSettingsContainer.children.length <= 0) {
          deviceSettingsContainer.replaceChildren(mainContainer);
          deviceSettingsContainer.style.removeProperty("display");
        }
      } else {
        deviceSettingsContainer.replaceChildren();
        deviceSettingsContainer.style.display = "none";
      }
    },
  };
};
