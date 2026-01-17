import { databaseRepository } from "./database-repository.js";
import { soundCardService } from "./sound-card-service.js";
import { wait } from "../public/streamer-remote/services/wait.js";

const getAndResyncDevices = async () => {
  const connectedBluetoothDevices =
    await soundCardService.getConnectedBluetoothDevices();

  const { devices } = await databaseRepository.getData();

  for (const { properties } of connectedBluetoothDevices) {
    const storedDevice = devices.find(
      ({ bluetoothAddress }) =>
        bluetoothAddress === properties["api.bluez5.address"]
    );

    if (storedDevice) {
      storedDevice.name = properties["device.alias"];
    } else {
      devices.push({
        bluetoothAddress: properties["api.bluez5.address"],
        name: properties["device.alias"],
        customName: undefined,
      });
    }
  }

  await databaseRepository.setData({ devices });

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

const setCustomName = async (
  /** @type {string} */ bluetoothAddress,
  /** @type {string | undefined} */ customName
) => {
  const { devices } = await databaseRepository.getData();

  const deviceToSetCustomName = devices.find(
    (device) => device.bluetoothAddress === bluetoothAddress
  );

  if (deviceToSetCustomName) {
    deviceToSetCustomName.customName = customName;
    await databaseRepository.setData({ devices });
  }
};

const deleteDevice = async (/** @type {string} */ bluetoothAddress) => {
  const { devices } = await databaseRepository.getData();

  const deviceToDelete = devices.find(
    (device) => device.bluetoothAddress === bluetoothAddress
  );

  if (deviceToDelete) {
    await Promise.all([
      soundCardService.disconnectDevice(bluetoothAddress),
      databaseRepository.setData({
        devices: devices.filter((device) => device !== deviceToDelete),
      }),
    ]);
  }
};

const startReconnectNotConnectedDevicesWorker = async () => {
  while (true) {
    try {
      const notConnectedDevices = (await getAndResyncDevices()).filter(
        ({ connected }) => !connected
      );

      for (const { bluetoothAddress } of notConnectedDevices) {
        await soundCardService.connectToDevice(bluetoothAddress);
      }
    } catch (error) {
      console.error("unable to reconnect not connected devices", error);
    } finally {
      await wait(6_000);
    }
  }
};

export const devicesService = {
  getAndResyncDevices,
  setCustomName,
  deleteDevice,
  startReconnectNotConnectedDevicesWorker,
};
