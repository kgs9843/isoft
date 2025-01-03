import { atom } from 'jotai';
import { BleManager, Device } from 'react-native-ble-plx';

const bleManagerAtom = atom(new BleManager());
const scanDeviceListAtom = atom<Device[]>([]);
const isScanAtom = atom(false);
const connectStatusAtom = atom({
  device: null as Device | null,
  isError: false,
  isLoading: false,
});

export { bleManagerAtom, scanDeviceListAtom, isScanAtom, connectStatusAtom };
