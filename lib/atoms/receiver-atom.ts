import { atom } from 'jotai';
import { IMqttClient } from 'sp-react-native-mqtt';

const selectedWifiSSIDAtom = atom<string | null>(null);
const connectedWifiSSIDAtom = atom<string | null>(null);
const connectedWifiIpAddressAtom = atom<string | null>(null);
const isReceiverNetworkSetFinishedAtom = atom<boolean>(false);

const isMQTTConnectedAtom = atom<boolean>(false);
const mqttClientAtom = atom<IMqttClient | null>(null);

export {
  selectedWifiSSIDAtom,
  connectedWifiSSIDAtom,
  connectedWifiIpAddressAtom,
  isReceiverNetworkSetFinishedAtom,
  isMQTTConnectedAtom,
  mqttClientAtom,
};
