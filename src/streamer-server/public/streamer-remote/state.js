/**
 * @typedef State
 * @prop {{ id: string; connected: boolean; name: string; customName: string; volume: number; }[]} devices
 */
let state = {
  devices: [
    {
      id: "1245324",
      connected: true,
      name: "Sony XB10",
      customName: "Kitchen speaker",
      volume: 10000,
    },
    {
      id: "2135235234",
      connected: false,
      name: "JBL 124ls",
      customName: "Living room",
      volume: 30000,
    },
  ],
};

/**
 * @type {(() => void)[]}
 */
const callbackFunctions = [() => console.log("")];

export const STATE = {
  get: () => ({ ...state }),
  set: (/** @type {Partial<State>} */ partialNewState) => {
    state = { ...state, ...partialNewState };
    callbackFunctions.forEach((callbackFunction) => callbackFunction());
  },
  registerCallbackFunction: (/** @type {() => void} */ callbackFunction) =>
    callbackFunctions.push(callbackFunction),
};
