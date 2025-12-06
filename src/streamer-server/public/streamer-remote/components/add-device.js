export const addDevice = {
  render: () => {
    const addDeviceButton = document.createElement("button");
    addDeviceButton.innerHTML = "Add device";

    const addDeviceContainer = document.getElementById("add-device");

    if (!addDeviceContainer) {
      throw new Error("element with id 'add-device' is missing in the DOM");
    }

    addDeviceContainer.replaceChildren(addDeviceButton);
  },
};
