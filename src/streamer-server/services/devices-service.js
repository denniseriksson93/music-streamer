import { exec } from "node:child_process";
import { promisify } from "node:util";
import { databaseRepository } from "./database-repository.js";

const execAsync = promisify(exec);

let numberOfConnectedDevices = 0;

const getDevices = async () => {
  const { stdout } = await execAsync("pactl -f json list sinks");

  /** @type {{ index: number, name: string, volume: { ['front-left']: { value_percent: string } } | { mono: { value_percent: string } }, properties: { ['api.bluez5.address']: string , ['device.alias']: string, ['device.bus']: string | undefined } }[]} */
  const connectedDevices = JSON.parse(stdout);

  const connectedBluetoothDevices = connectedDevices.filter(
    ({ properties }) => properties["device.bus"] === "bluetooth"
  );

  const { devices } = await databaseRepository.getData();

  for (const connectedBluetoothDevice of connectedBluetoothDevices) {
    const storedDevice = devices.find(
      ({ bluetoothAddress }) =>
        bluetoothAddress ===
        connectedBluetoothDevice.properties["api.bluez5.address"]
    );

    if (storedDevice) {
      storedDevice.name = connectedBluetoothDevice.properties["device.alias"];
    } else {
      devices.push({
        bluetoothAddress:
          connectedBluetoothDevice.properties["api.bluez5.address"],
        name: connectedBluetoothDevice.properties["device.alias"],
        customName: undefined,
      });
    }
  }

  await databaseRepository.setData({ devices });

  if (numberOfConnectedDevices !== connectedBluetoothDevices.length) {
    await execAsync("pactl unload-module module-combine-sink");

    const connectedBluetoothDevicesNames = connectedBluetoothDevices
      .map(({ name }) => name)
      .join();

    await execAsync(
      `pactl load-module module-combine-sink slaves=${connectedBluetoothDevicesNames} adjust_time=20 resample_method=trivial`
    );

    await execAsync("pactl set-default-sink combined");

    numberOfConnectedDevices = connectedBluetoothDevices.length;
  }

  return devices.map(({ bluetoothAddress, name, customName }) => {
    const connectedBluetoothDevice = connectedBluetoothDevices.find(
      ({ properties }) => properties["api.bluez5.address"] === bluetoothAddress
    );

    let volume = 0;

    if (connectedBluetoothDevice) {
      if ("mono" in connectedBluetoothDevice.volume) {
        volume = +connectedBluetoothDevice.volume.mono.value_percent.replace(
          "%",
          ""
        );
      } else {
        volume = +connectedBluetoothDevice.volume[
          "front-left"
        ].value_percent.replace("%", "");
      }
    }

    return {
      bluetoothAddress,
      connected: Boolean(connectedBluetoothDevice),
      name,
      customName,
      volume,
      latencyOffset: 0,
    };
  });
};

export const devicesService = { getDevices };
