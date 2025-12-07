import { STATE } from "../services/state.js";

export const globalVolume = {
  render: () => {
    const globalVolumeContainer = document.getElementById("global-volume");

    if (!globalVolumeContainer) {
      throw new Error("element with id 'global-volume' is missing in the DOM");
    }

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

    globalVolumeContainer.replaceChildren(
      volumeLabelContainer,
      volumeButtonsContainer
    );
  },
};

const incrementVolumeOnAllDevices = (/** @type {number} */ increment) => {
  const { devices } = STATE.get();

  devices.forEach((device) => {
    device.volume += increment;
  });

  STATE.set({ devices });
};
