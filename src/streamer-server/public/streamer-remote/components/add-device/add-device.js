import { iconTextElement } from "../../elements/icon-text-element.js";

export const addDevice = {
  render: () => {
    const addDeviceContainer = document.getElementById("add-device");

    if (!addDeviceContainer) {
      throw new Error("element with id 'add-device' is missing in the DOM");
    }

    const addDeviceButton = document.createElement("button");
    addDeviceButton.appendChild(iconTextElement("add_circle", "Add device"));

    addDeviceContainer.replaceChildren(addDeviceButton);
  },
};
