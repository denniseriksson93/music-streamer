import { iconElement } from "../../elements/icon-element.js";
import { STATE } from "../../services/state.js";

export const globalVolume = {
  render: () => {
    const globalVolumeContainer = document.getElementById("global-volume");

    if (!globalVolumeContainer) {
      throw new Error("element with id 'global-volume' is missing in the DOM");
    }

    const volumeLabelContainer = document.createElement("div");
    volumeLabelContainer.innerText = "Volym";

    const minusButton = document.createElement("button");
    minusButton.appendChild(iconElement("do_not_disturb_on"));
    minusButton.addEventListener("click", () =>
      incrementVolumeOnAllDevices(-5_000)
    );

    const plusButton = document.createElement("button");
    plusButton.appendChild(iconElement("add_circle"));
    plusButton.addEventListener("click", () =>
      incrementVolumeOnAllDevices(5_000)
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
