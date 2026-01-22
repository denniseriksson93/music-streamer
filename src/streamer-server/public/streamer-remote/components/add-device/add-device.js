import { dividerElement } from "../../elements/divider-element.js";
import { iconElement } from "../../elements/icon-element.js";
import { iconTextElement } from "../../elements/icon-text-element.js";
import { backendService } from "../../services/backend-service.js";
import { sortBy } from "../../services/sort-by.js";
import { STATE } from "../../services/state.js";

export const createAddDevice = () => {
  const addDeviceContainer = document.getElementById("add-device");

  if (!addDeviceContainer) {
    throw new Error("element with id 'add-device' is missing in the DOM");
  }

  const searchingContainer = document.createElement("div");
  searchingContainer.setAttribute("class", "searching");
  searchingContainer.innerText = "Searching";

  const notPairedDevicesContainer = document.createElement("div");
  notPairedDevicesContainer.setAttribute(
    "class",
    "not-paired-devices-container",
  );
  notPairedDevicesContainer.style.display = "none";

  let abortController = new AbortController();

  const closeButton = document.createElement("button");
  closeButton.setAttribute("class", "full-width button-secondary");
  closeButton.appendChild(iconTextElement("cancel", "Close"));
  closeButton.addEventListener("click", () => {
    abortController.abort();
    STATE.set({ showAddDevice: false });
  });

  const contentContainer = document.createElement("div");
  contentContainer.setAttribute("class", "content-container frosted-glass");
  contentContainer.appendChild(searchingContainer);
  contentContainer.appendChild(notPairedDevicesContainer);
  contentContainer.appendChild(closeButton);

  const mainContainer = document.createElement("div");
  mainContainer.setAttribute("class", "main-container");
  mainContainer.appendChild(contentContainer);

  return {
    render: async () => {
      const { showAddDevice } = STATE.get();

      if (showAddDevice) {
        if (addDeviceContainer.children.length <= 0) {
          const scanDevicesRecursive = async () => {
            const devicesResponse =
              await backendService.scanDevices(abortController);

            if (devicesResponse === "aborted") {
              abortController = new AbortController();
              return;
            }

            const notPairedDevices = sortBy(
              devicesResponse,
              ({ name }) => name,
            );

            const notPairedDevicesElements = notPairedDevices.map(
              ({ bluetoothAddress, name }) => {
                const nameContainer = document.createElement("div");
                nameContainer.setAttribute("class", "name-container");
                nameContainer.innerText = name;

                const pairButton = document.createElement("button");
                pairButton.appendChild(iconElement("add_circle"));

                const pairButtonContainer = document.createElement("div");
                pairButtonContainer.appendChild(pairButton);
                pairButton.addEventListener("click", async () => {
                  STATE.set({ showAddDevice: false });

                  const succeeded =
                    await backendService.connectDevice(bluetoothAddress);

                  if (succeeded) {
                    await backendService.getAndSetDevices();
                  } else {
                    alert(`Unable to connect to ${name}`);
                  }
                });

                const notPairedDeviceContainer = document.createElement("div");
                notPairedDeviceContainer.setAttribute(
                  "class",
                  "not-paired-device-container frosted-glass",
                );
                notPairedDeviceContainer.appendChild(nameContainer);
                notPairedDeviceContainer.appendChild(pairButtonContainer);

                return notPairedDeviceContainer;
              },
            );

            if (notPairedDevices.length > 0) {
              notPairedDevicesContainer.style.removeProperty("display");
            } else {
              notPairedDevicesContainer.style.display = "none";
            }

            notPairedDevicesContainer.replaceChildren(
              ...notPairedDevicesElements,
              dividerElement("black"),
            );

            await scanDevicesRecursive();
          };

          void scanDevicesRecursive();

          addDeviceContainer.replaceChildren(mainContainer);
          addDeviceContainer.style.removeProperty("display");
        }
      } else {
        notPairedDevicesContainer.style.display = "none";
        notPairedDevicesContainer.replaceChildren();

        addDeviceContainer.replaceChildren();
        addDeviceContainer.style.display = "none";
      }
    },
  };
};
