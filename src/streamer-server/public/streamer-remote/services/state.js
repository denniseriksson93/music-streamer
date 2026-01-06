/**
 * @typedef Device
 * @prop {string} bluetoothAddress
 * @prop {boolean} connected
 * @prop {string} name
 * @prop {string} customName
 * @prop {number} volume
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
  devices: [],
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
