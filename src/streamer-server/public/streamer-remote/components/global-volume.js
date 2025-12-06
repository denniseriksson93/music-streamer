import { STATE } from "../state.js";

export const globalVolume = {
  render: () => {
    const volumeLabelContainer = document.createElement("div");
    volumeLabelContainer.innerText = "Volym";

    const minusButton = document.createElement("button");
    minusButton.innerText = "-";
    minusButton.addEventListener("click", () =>
      incrementVolumeOnAllDevices(-1000)
    );

    const plusButton = document.createElement("button");
    plusButton.innerText = "+";
    plusButton.addEventListener("click", () =>
      incrementVolumeOnAllDevices(1000)
    );

    const volumeButtonsContainer = document.createElement("div");
    volumeButtonsContainer.setAttribute("class", "volume-buttons-container");
    volumeButtonsContainer.appendChild(minusButton);
    volumeButtonsContainer.appendChild(plusButton);

    const globalVolumeContainer = document.getElementById("global-volume");

    if (!globalVolumeContainer) {
      throw new Error("element with id 'global-volume' is missing in the DOM");
    }

    globalVolumeContainer.replaceChildren(
      volumeLabelContainer,
      volumeButtonsContainer
    );
  },
};

const incrementVolumeOnAllDevices = (/** @type {number} */ increment) => {
  const newState = STATE.get();

  newState.devices.forEach((device) => {
    device.volume += increment;
  });

  STATE.set(newState);
};
