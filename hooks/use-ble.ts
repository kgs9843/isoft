import { useAtom } from 'jotai/index';
import { Characteristic, Device, DeviceId } from 'react-native-ble-plx';
import {
  bleManagerAtom,
  connectStatusAtom,
  isScanAtom,
  scanDeviceListAtom,
} from '@/lib/atoms/sender-atom';
import Toast from 'react-native-toast-message';
import { atob } from 'react-native-quick-base64';
import { useEffect } from 'react';
import { mqttClientAtom } from '@/lib/atoms/receiver-atom';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const SCAN_TIMEOUT = 10000;

const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
  devices.findIndex((device) => nextDevice.id === device.id) > -1;

const useBle = () => {
  const [bleManager] = useAtom(bleManagerAtom);
  const [scanDeviceList, setScanDeviceList] = useAtom(scanDeviceListAtom);
  const [isScan, setIsScan] = useAtom(isScanAtom);
  const [connectStatus, setConnectStatus] = useAtom(connectStatusAtom);

  const [MQTTClient] = useAtom(mqttClientAtom);

  useEffect(() => {
    if (!connectStatus.device) return;

    bleManager.onDeviceDisconnected(connectStatus.device.id, () => {
      setConnectStatus({ device: null, isLoading: false, isError: false });
      MQTTClient?.disconnect();
    });
  }, [bleManager, connectStatus.device, setConnectStatus]);

  const addDevice = (device: Device) => {
    setScanDeviceList((devices) => {
      if (isDuplicateDevice(devices, device)) {
        return devices;
      }
      return [...devices, device];
    });
  };

  const clearDevices = () => {
    setScanDeviceList([]);
  };

  const destroyManager = () => {
    bleManager.destroy();
  };

  const stopScan = () => {
    setIsScan(false);
    bleManager.stopDeviceScan();
  };

  const startScan = async () => {
    clearDevices();
    setIsScan(true);

    await bleManager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          stopScan();
          return;
        }

        if (device && device.name !== null) {
          addDevice(device);
        }
      }
    );

    setTimeout(() => {
      if (isScan) {
        stopScan();
      }
    }, SCAN_TIMEOUT);
  };

  const findServicesAndCharacteristics = async (id: DeviceId) => {
    const device =
      await bleManager.discoverAllServicesAndCharacteristicsForDevice(id);
    const services = await device.services();
    return await Promise.all(
      services.map((service) => service.characteristics())
    );
  };

  const subscribeCharacteristic = (
    id: DeviceId,
    callback: (dataArr: Characteristic | null) => void
  ) => {
    bleManager.monitorCharacteristicForDevice(
      id,
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          return;
        }
        callback(characteristic);
      }
    );
  };

  const readSenderData = async (
    callback?: (data: number, flagMessage?: string) => void
  ) => {
    if (!connectStatus.device) return;

    const {
      device: { id },
    } = connectStatus;

    await findServicesAndCharacteristics(id);
    subscribeCharacteristic(id, (dataArr) => {
      const [dataStr, flagStr] = atob(dataArr?.value!).split(',');

      const data = Number.parseInt(dataStr);
      const flag = flagStr === '0' || flagStr === '1';

      callback?.(data, flag ? flagStr : undefined);
    });
  };

  const connect = async (id: DeviceId) => {
    isScan && stopScan();
    setConnectStatus({ device: null, isLoading: true, isError: false });

    try {
      const device = await bleManager.connectToDevice(id);
      setConnectStatus({ device, isLoading: false, isError: false });
    } catch (e) {
      const error = e as Error;

      setConnectStatus({ device: null, isLoading: false, isError: true });
      Toast.show({
        type: 'error',
        text1: `장치에 연결할 수 없습니다.`,
        text2: error.message,
      });
    }
  };

  const disconnect = async (id: DeviceId) => {
    try {
      await bleManager.cancelDeviceConnection(id);
      setConnectStatus({ device: null, isLoading: false, isError: false });
    } catch {
      setConnectStatus((prev) => ({
        ...prev,
        isError: true,
        isLoading: false,
      }));
    }
  };

  const write = async (id: DeviceId, data: string) => {
    const encodedData = btoa(data);
    await bleManager.writeCharacteristicWithResponseForDevice(
      id,
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      encodedData
    );
  };

  const isConnectedDevice = async (id: DeviceId) => {
    return bleManager.isDeviceConnected(id);
  };

  const onDisconnect = (id: DeviceId, callback: () => void) => {
    bleManager.onDeviceDisconnected(id, () => {
      callback();
    });
  };

  return {
    bleManager,
    scanDeviceList,
    isScan,
    connectStatus,
    addDevice,
    clearDevices,
    destroyManager,
    startScan,
    stopScan,
    connect,
    disconnect,
    write,
    isConnectedDevice,
    onDisconnect,
    readSenderData,
  };
};

export { useBle };
