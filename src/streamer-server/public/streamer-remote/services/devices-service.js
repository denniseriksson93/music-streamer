import { BACKEND_URL } from "./auth-service.js";
import { STATE } from "./state.js";

const getAndSetDevices = async () => {
  const response = await fetch(`${BACKEND_URL}/devices`);

  if (!response.ok) {
    window.location.reload();
  }

  /** @type {ReturnType<STATE['get']>['devices']} */
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

const setCustomNameOnDevice = async (
  /** @type {string} */ bluetoothAddress,
  /** @type {string | undefined} */ customName
) => {
  const response = await fetch(`${BACKEND_URL}/set-custom-name`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bluetoothAddress, customName }),
  });

  if (!response.ok) {
    window.location.reload();
  }
};

const deleteDevice = async (/** @type {string} */ bluetoothAddress) => {
  const url = new URL(`${BACKEND_URL}/delete-device`);
  url.searchParams.append("bluetoothAddress", bluetoothAddress);

  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    window.location.reload();
  }
};

const scanDevices = async (/** @type {AbortController} */ abortController) => {
  try {
    const response = await fetch(`${BACKEND_URL}/scan-devices`, {
      signal: abortController.signal,
    });

    if (!response.ok) {
      window.location.reload();
    }

    /** @type {{ bluetoothAddress: string, name: string }[]} */
    const notConnectedDevices = await response.json();

    return notConnectedDevices;
  } catch {
    return "aborted";
  }
};

const connectDevice = async (/** @type {string} */ bluetoothAddress) => {
  const response = await fetch(`${BACKEND_URL}/connect-device`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bluetoothAddress }),
  });

  if (!response.ok) {
    window.location.reload();
  }

  /** @type {{ succeeded: boolean }} */
  const { succeeded } = await response.json();

  return succeeded;
};

export const devicesService = {
  getAndSetDevices,
  setVolumeOnDevice,
  setCustomNameOnDevice,
  deleteDevice,
  scanDevices,
  connectDevice,
};
