export const addDevice = {
  render: () => {
    const addDeviceContainer = document.getElementById("add-device");

    if (!addDeviceContainer) {
      throw new Error("element with id 'add-device' is missing in the DOM");
    }

    const addDeviceButton = document.createElement("button");
    addDeviceButton.innerHTML = "Add device";

    addDeviceContainer.replaceChildren(addDeviceButton);
  },
};
