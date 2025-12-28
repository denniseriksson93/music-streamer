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

export const devicesService = { getAndSetDevices };
