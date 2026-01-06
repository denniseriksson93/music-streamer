import { BACKEND_URL } from "./auth-service.js";
import { STATE } from "./state.js";

const getAndSetDevices = async () => {
  const response = await fetch(`${BACKEND_URL}/devices`);

  if (!response.ok) {
    window.location.reload();
  }

  /** @type { ReturnType<STATE['get']>['devices']} */
  const devices = await response.json();

  STATE.set({ devices });
};

const setVolumeOnDevice = async (
  /** @type {string} */ bluetoothAddress,
  /** @type {number} */ volume
) => {
  const response = await fetch(`${BACKEND_URL}/set-volume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bluetoothAddress, volume }),
  });

  if (!response.ok) {
    window.location.reload();
  }
};

export const devicesService = { getAndSetDevices, setVolumeOnDevice };
