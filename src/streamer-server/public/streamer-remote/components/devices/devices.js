import { dividerElement } from "../../elements/divider-element.js";
import { iconElement } from "../../elements/icon-element.js";
import { iconTextElement } from "../../elements/icon-text-element.js";
import { DEVICE_MAX_VOLUME } from "../../services/constants.js";
import { STATE } from "../../services/state.js";

export const createDevices = () => {
  const devicesContainer = document.getElementById("devices");

  if (!devicesContainer) {
    throw new Error("element with id 'devices' is missing in the DOM");
  }

  return {
    render: () => {
      const devices = STATE.get().devices.map((device) => {
        const { bluetoothAddress, connected, name, customName, volume } =
          device;

        const nameContainer = document.createElement("div");
        nameContainer.innerText = customName ?? name;

        const statusContainer = document.createElement("div");
        statusContainer.setAttribute("class", "status-container");
        statusContainer.innerText = connected ? "Connected" : "Disconnected";

        const nameStatusContainer = document.createElement("div");
        nameStatusContainer.setAttribute("class", "name-status-container");
        nameStatusContainer.appendChild(nameContainer);
        nameStatusContainer.appendChild(statusContainer);

        const settingsButton = document.createElement("button");
        settingsButton.appendChild(iconElement("settings"));
        settingsButton.addEventListener("click", () => {
          STATE.set({ editingDevice: { ...device } });
        });

        const settingsContainer = document.createElement("div");
        settingsContainer.appendChild(settingsButton);

        const nameVolumeContainer = document.createElement("div");
        nameVolumeContainer.setAttribute("class", "name-settings-container");
        nameVolumeContainer.appendChild(nameStatusContainer);
        nameVolumeContainer.appendChild(settingsContainer);

        const volumeSlider = document.createElement("input");
        volumeSlider.setAttribute("type", "range");
        volumeSlider.setAttribute("min", "0");
        volumeSlider.setAttribute("max", DEVICE_MAX_VOLUME.toString());
        volumeSlider.value = volume.toString();
        volumeSlider.addEventListener("change", (event) => {
          const { devices } = STATE.get();
          const thisDevice = devices.find(
            (device) => device.bluetoothAddress === bluetoothAddress
          );

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

        const frostedGlassContainer = document.createElement("div");
        frostedGlassContainer.setAttribute("class", "frosted-glass");
        frostedGlassContainer.appendChild(deviceContainer);

        return frostedGlassContainer;
      });

      const resyncDevicesButton = document.createElement("button");
      resyncDevicesButton.setAttribute("class", "button-secondary full-width ");
      resyncDevicesButton.appendChild(iconTextElement("sync", "Resync"));

      const addDeviceButton = document.createElement("button");
      addDeviceButton.setAttribute("class", "full-width");
      addDeviceButton.appendChild(iconTextElement("add_circle", "Add device"));

      const buttonsContainer = document.createElement("div");
      buttonsContainer.setAttribute("class", "buttons-container frosted-glass");
      buttonsContainer.appendChild(resyncDevicesButton);
      buttonsContainer.appendChild(addDeviceButton);

      if (devices.length > 0) {
        devicesContainer.replaceChildren(
          ...[dividerElement(), ...devices, buttonsContainer, dividerElement()]
        );

        devicesContainer.style.removeProperty("display");
      } else {
        devicesContainer.style.display = "none";
      }
    },
  };
};
