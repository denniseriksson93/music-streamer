import { BACKEND_URL } from "./auth-service.js";
import { STATE } from "./state.js";

const getDevices = async () => {
  const response = await fetch(`${BACKEND_URL}/devices`);

  if (!response.ok) {
    window.location.reload();
  }

  /** @type { ReturnType<STATE['get']>['devices']} */
  const parsedResponse = await response.json();

  return parsedResponse;
};

export const devicesService = { getDevices };
