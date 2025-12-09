import { iconTextElement } from "../../elements/icon-text-element.js";

export const addDevice = {
  render: () => {
    const addDeviceContainer = document.getElementById("add-device");

    if (!addDeviceContainer) {
      throw new Error("element with id 'add-device' is missing in the DOM");
    }

    const addDeviceButton = document.createElement("button");
    addDeviceButton.appendChild(iconTextElement("add_circle", "Add device"));

    const addDeviceButtonContainer = document.createElement("div");
    addDeviceButtonContainer.setAttribute(
      "class",
      "add-device-button-container"
    );
    addDeviceButtonContainer.appendChild(addDeviceButton);

    const frostedGlassContainer = document.createElement("div");
    frostedGlassContainer.setAttribute("class", "frosted-glass");
    frostedGlassContainer.appendChild(addDeviceButtonContainer);

    addDeviceContainer.replaceChildren(frostedGlassContainer);
  },
};
