/**
 * @typedef Device
 * @prop {string} bluetoothAddress
 * @prop {boolean} connected
 * @prop {string} name
 * @prop {string} customName
 * @prop {number} volume
 * @prop {number} latencyOffset
 */

/**
 * @typedef State
 * @prop {Device[]} devices
 * @prop {Device | undefined} editingDevice
 */

/**
 * @type State
 */
let state = {
  devices: [
    {
      bluetoothAddress: "1245324",
      connected: true,
      name: "Sony XB10",
      customName: "Kitchen speaker",
      volume: 10_000,
      latencyOffset: 0,
    },
    {
      bluetoothAddress: "2135235234",
      connected: false,
      name: "JBL 124ls",
      customName: "Living room",
      volume: 30_000,
      latencyOffset: 0,
    },
    {
      bluetoothAddress: "21352356235",
      connected: true,
      name: "BOSE Sound Link mini",
      customName: "Bathroom",
      volume: 90_000,
      latencyOffset: 0,
    },
  ],
  editingDevice: undefined,
};

/**
 * @type {([keyof State, () => void])[]}
 */
const onStateChangedCallbacks = [];

export const STATE = {
  get: () => ({ ...state }),
  set: (/** @type {Partial<State>} */ newPartialState) => {
    state = { ...state, ...newPartialState };

    onStateChangedCallbacks.forEach(([property, callback]) => {
      if (property in newPartialState) {
        callback();
      }
    });
  },
  registerOnStateChanged: (
    /**@type {keyof State} */ property,
    /** @type {() => void} */ callback
  ) => onStateChangedCallbacks.push([property, callback]),
};
