import { exec } from "node:child_process";
import { promisify } from "node:util";
import { wait } from "../public/streamer-remote/services/wait.js";
import { databaseRepository } from "./database-repository.js";
import { isMacAddress } from "./is-mac-address.js";

const execAsync = promisify(exec);

const getConnectedBluetoothDevices = async () => {
  const { stdout } = await execAsync("pactl -f json list sinks");

  /** @type {{ index: number, name: string, volume: { ['front-left']: { value_percent: string } } | { mono: { value_percent: string } }, properties: { ['api.bluez5.address']: string , ['device.alias']: string, ['device.bus']: string | undefined } }[]} */
  const connectedDevices = JSON.parse(stdout);

  return connectedDevices.filter(
    ({ properties }) => properties["device.bus"] === "bluetooth"
  );
};

/** @type {string[] | undefined} */
let previouslyConnectedBluetoothDevicesNames;

const startUpdateOutputAudioDevicesWorker = async () => {
  while (true) {
    try {
      const connectedBluetoothDevicesNames = (
        await getConnectedBluetoothDevices()
      )
        .map(({ name }) => name)
        .sort();

      if (
        JSON.stringify(previouslyConnectedBluetoothDevicesNames) !==
        JSON.stringify(connectedBluetoothDevicesNames)
      ) {
        await execAsync("pactl unload-module module-combine-sink");

        await execAsync(
          `pactl load-module module-combine-sink slaves=${connectedBluetoothDevicesNames.join()}`
        );

        await execAsync("pactl set-default-sink combined");

        previouslyConnectedBluetoothDevicesNames =
          connectedBluetoothDevicesNames;
      }
    } catch (error) {
      console.error("unable to update output audio devices", error);
    } finally {
      await wait(3_000);
    }
  }
};

const updateOutputAudioDevices2 = async () => {
  const connectedBluetoothDevices = await getConnectedBluetoothDevices();

  for (const { name } of connectedBluetoothDevices) {
    await Promise.all([
      execAsync(`pw-link Chromium:output_FL ${name}:playback_FL`),
      execAsync(`pw-link Chromium:output_FR ${name}:playback_FR`),
    ]).catch(() => undefined);
  }
};

const setVolumeOnDevice = async (
  /** @type {string} */ bluetoothAddress,
  /** @type {number} */ volume
) => {
  const connectedBluetoothDevices = await getConnectedBluetoothDevices();

  const deviceToUpdate = connectedBluetoothDevices.find(
    ({ properties }) => properties["api.bluez5.address"] === bluetoothAddress
  );

  if (deviceToUpdate) {
    await execAsync(`pactl set-sink-volume ${deviceToUpdate.name} ${volume}%`);
  }
};

const disconnectDevice = async (/** @type {string} */ bluetoothAddress) => {
  await execAsync(
    `bluetoothctl disconnect ${bluetoothAddress} && bluetoothctl remove ${bluetoothAddress}`
  ).catch((error) => console.error("unable to disconnect device", error));
};

const connectToDevice = async (/** @type {string} */ bluetoothAddress) =>
  execAsync(`bluetoothctl connect ${bluetoothAddress}`)
    .then(() => true)
    .catch(() => false);

const scanDevices = async () => {
  await execAsync("bluetoothctl --timeout 3 scan on");
  const { stdout } = await execAsync("bluetoothctl devices");
  const notPairedDevicesRows = stdout.split("Device ");
  const { devices } = await databaseRepository.getData();

  /** @type {{ bluetoothAddress: string, name: string }[]} */
  const notPairedDevices = [];

  notPairedDevicesRows.forEach((notPairedDeviceRow) => {
    const index = notPairedDeviceRow.indexOf(" ");
    const bluetoothAddress = notPairedDeviceRow.substring(0, index);
    const name = notPairedDeviceRow.substring(index + 1).replace("\n", "");

    if (
      bluetoothAddress &&
      name &&
      !isMacAddress(name) &&
      !devices.some((device) => device.bluetoothAddress === bluetoothAddress)
    ) {
      notPairedDevices.push({
        bluetoothAddress,
        name,
      });
    }
  });

  return notPairedDevices;
};

export const soundCardService = {
  getConnectedBluetoothDevices,
  startUpdateOutputAudioDevicesWorker,
  setVolumeOnDevice,
  disconnectDevice,
  connectToDevice,
  scanDevices,
};
