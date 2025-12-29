import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const getConnectedBluetoothDevices = async () => {
  const { stdout } = await execAsync("pactl -f json list sinks");

  /** @type {{ index: number, name: string, volume: { ['front-left']: { value_percent: string } } | { mono: { value_percent: string } }, properties: { ['api.bluez5.address']: string , ['device.alias']: string, ['device.bus']: string | undefined } }[]} */
  const connectedDevices = JSON.parse(stdout);

  return connectedDevices.filter(
    ({ properties }) => properties["device.bus"] === "bluetooth"
  );
};

let numberOfConnectedDevices = 0;

const updateOutputAudioDevices = async () => {
  const connectedBluetoothDevices = await getConnectedBluetoothDevices();

  if (numberOfConnectedDevices !== connectedBluetoothDevices.length) {
    for (const { name } of connectedBluetoothDevices) {
      await Promise.all([
        execAsync(`pw-link Chromium:output_FL ${name}:playback_FL`),
        execAsync(`pw-link Chromium:output_FR ${name}:playback_FR`),
      ])
        .then(() => {
          numberOfConnectedDevices = connectedBluetoothDevices.length;
        })
        .catch((error) => {
          const errorAsString = JSON.stringify(error);

          if (errorAsString.includes("File exists")) {
            numberOfConnectedDevices = connectedBluetoothDevices.length;
          }
        });
    }
  }
};

export const soundCardService = {
  getConnectedBluetoothDevices,
  updateOutputAudioDevices,
};
