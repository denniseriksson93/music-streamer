import { STATE } from "../../services/state.js";

export const createAddDevice = () => {
  const addDeviceContainer = document.getElementById("add-device");

  if (!addDeviceContainer) {
    throw new Error("element with id 'add-device' is missing in the DOM");
  }

  const contentContainer = document.createElement("div");
  contentContainer.setAttribute("class", "content-container frosted-glass");

  const mainContainer = document.createElement("div");
  mainContainer.setAttribute("class", "main-container");
  mainContainer.appendChild(contentContainer);

  return {
    render: () => {
      const { showAddDevice } = STATE.get();

      if (showAddDevice) {
        if (addDeviceContainer.children.length <= 0) {
          addDeviceContainer.replaceChildren(mainContainer);
          addDeviceContainer.style.removeProperty("display");
        }
      } else {
        addDeviceContainer.replaceChildren();
        addDeviceContainer.style.display = "none";
      }
    },
  };
};
