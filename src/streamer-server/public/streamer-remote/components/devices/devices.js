import { dividerElement } from "../../elements/divider-element.js";
import { iconElement } from "../../elements/icon-element.js";
import { iconTextElement } from "../../elements/icon-text-element.js";
import { DEVICE_MAX_VOLUME } from "../../services/constants.js";
import { devicesService } from "../../services/devices-service.js";
import { sortBy } from "../../services/sort-by.js";
import { STATE } from "../../services/state.js";

export const createDevices = () => {
  const devicesContainer = document.getElementById("devices");

  if (!devicesContainer) {
    throw new Error("element with id 'devices' is missing in the DOM");
  }

  return {
    render: () => {
      const devices = sortBy(STATE.get().devices, ({ connected }) =>
        connected ? 0 : 1
      ).map((device) => {
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

        const deviceContainer = document.createElement("div");
        deviceContainer.setAttribute("class", "device-container");
        deviceContainer.appendChild(nameVolumeContainer);

        if (device.connected) {
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

          deviceContainer.appendChild(volumeSlider);
        }

        const frostedGlassContainer = document.createElement("div");
        frostedGlassContainer.setAttribute("class", "frosted-glass");
        frostedGlassContainer.appendChild(deviceContainer);

        return frostedGlassContainer;
      });

      const addDeviceButton = document.createElement("button");
      addDeviceButton.setAttribute("class", "full-width");
      addDeviceButton.appendChild(iconTextElement("add_circle", "Add device"));

      const addDevicesButtonContainer = document.createElement("div");
      addDevicesButtonContainer.setAttribute("class", "frosted-glass");
      addDevicesButtonContainer.appendChild(addDeviceButton);

      devicesContainer.replaceChildren(
        ...[
          dividerElement(),
          ...devices,
          addDevicesButtonContainer,
          dividerElement(),
        ]
      );
    },
  };
};
