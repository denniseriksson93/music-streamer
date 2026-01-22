import { dividerElement } from "../../elements/divider-element.js";
import { iconTextElement } from "../../elements/icon-text-element.js";
import { backendService } from "../../services/backend-service.js";
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
        editingDevice.customName =
          event.target.value === "" ? undefined : event.target.value;

        STATE.set({ editingDevice });
      }
    }
  });

  const customNameContainer = document.createElement("div");
  customNameContainer.setAttribute("class", "custom-name-container");
  customNameContainer.appendChild(customNameLabel);
  customNameContainer.appendChild(customNameInput);

  const settingsContainer = document.createElement("div");
  settingsContainer.setAttribute("class", "settings-container");
  settingsContainer.appendChild(name);
  settingsContainer.appendChild(customNameContainer);

  const deleteDeviceButton = document.createElement("button");
  deleteDeviceButton.setAttribute("class", "full-width button-danger");
  deleteDeviceButton.appendChild(iconTextElement("delete", "Delete"));
  deleteDeviceButton.addEventListener("click", async () => {
    const { editingDevice } = STATE.get();

    if (editingDevice) {
      const didConfirm = window.confirm(
        `Are you sure you want to delete device ${
          editingDevice?.customName ?? editingDevice?.name
        }?`,
      );

      if (didConfirm) {
        STATE.set({ editingDevice: undefined });
        await backendService.deleteDevice(editingDevice.bluetoothAddress);
        await backendService.getAndSetDevices();
      }
    }
  });

  const saveAndCloseButton = document.createElement("button");
  saveAndCloseButton.setAttribute("class", "full-width");
  saveAndCloseButton.appendChild(iconTextElement("save", "Save"));
  saveAndCloseButton.addEventListener("click", async () => {
    const { editingDevice } = STATE.get();

    if (editingDevice) {
      STATE.set({ editingDevice: undefined });

      await backendService.setCustomNameOnDevice(
        editingDevice.bluetoothAddress,
        editingDevice.customName,
      );

      await backendService.getAndSetDevices();
    }
  });

  const firstRowButtonsContainer = document.createElement("div");
  firstRowButtonsContainer.setAttribute("class", "first-row-buttons-container");
  firstRowButtonsContainer.appendChild(deleteDeviceButton);
  firstRowButtonsContainer.appendChild(saveAndCloseButton);

  const closeButton = document.createElement("button");
  closeButton.setAttribute("class", "full-width button-secondary");
  closeButton.appendChild(iconTextElement("cancel", "Close"));
  closeButton.addEventListener("click", () =>
    STATE.set({ editingDevice: undefined }),
  );

  const buttonsContainer = document.createElement("div");
  buttonsContainer.setAttribute("class", "buttons-container");
  buttonsContainer.appendChild(firstRowButtonsContainer);
  buttonsContainer.appendChild(closeButton);

  const settingsButtonsContainer = document.createElement("div");
  settingsButtonsContainer.setAttribute("class", "settings-buttons-container");
  settingsButtonsContainer.appendChild(settingsContainer);
  settingsButtonsContainer.appendChild(dividerElement("black"));
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
