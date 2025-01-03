import { useEffect, useState } from 'react';
import WifiManager from 'react-native-wifi-reborn';

const useWifiList = () => {
  const [wifiList, setWifiList] = useState<Array<WifiManager.WifiEntry>>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadWifiList = async () => {
    try {
      setIsLoading(true);
      const wifiList = await WifiManager.loadWifiList();
      setWifiList(wifiList);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    void loadWifiList();
  }, []);

  return { wifiList, isLoading, isError, loadWifiList };
};

export { useWifiList };
