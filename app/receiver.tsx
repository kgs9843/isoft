import { View } from 'react-native';
import { Step, Steps, StepsProvider } from '@/components/ui/step';
import { useRouter } from 'expo-router';
import { ReceiverConnectStep } from '@/components/receiver/receiver-connect-step';
import { WifiSelectStep } from '@/components/receiver/wifi-select-step';
import useNetworkInfo from '@/hooks/use-network-info';
import { useAtom } from 'jotai/index';
import {
  connectedWifiIpAddressAtom,
  isReceiverNetworkSetFinishedAtom,
  selectedWifiSSIDAtom,
} from '@/lib/atoms/receiver-atom';
import { useEffect } from 'react';
import WifiPasswordFormStep from '@/components/receiver/wifi-password-form-step';
import { InternetEnabledWifiStep } from '@/components/receiver/internet-enabled-wifi-step';
import { useGetDescriptionQuery } from '@/lib/api/text/queries';

const ReceiverScreen = () => {
  const router = useRouter();

  const [connectedWifiIpAddress] = useAtom(connectedWifiIpAddressAtom);
  const [selectedWifiSSID, setSelectedWifiSSID] = useAtom(selectedWifiSSIDAtom);
  const [isReceiverNetworkSetFinished, setIsReceiverNetworkSetFinished] =
    useAtom(isReceiverNetworkSetFinishedAtom);

  const isSenderIpAddress = true

  const steps = {
    'Receiver 접속': {
      complete: isSenderIpAddress,
    },
    'wifi 선택': { complete: !!selectedWifiSSID },
    'wifi 비밀번호 입력': { complete: isReceiverNetworkSetFinished },
    '인터넷이 되는 wifi에 연결': {
      complete: !isSenderIpAddress,
    },
  };

  const { data } = useGetDescriptionQuery();

  useNetworkInfo();

  useEffect(() => {
    return () => {
      setSelectedWifiSSID(null);
      setIsReceiverNetworkSetFinished(false);
    };
  }, []);

  return (
    <View style={{ flex: 1 }} className="px-6">
      <StepsProvider>
        <Steps steps={steps}>
          <Step
            value="Receiver 접속"
            title={data?.R01.title ?? '1. Receiver 접속하기'}
            description={
              data?.R01.description ?? '리시버의 네트워크에 접속합니다.'
            }
            goPrev={() => {
              router.back();
            }}
          >
            <ReceiverConnectStep />
          </Step>
          <Step
            value="wifi 선택"
            title={data?.R02.title ?? '2. Receiver와 연결할 WIFI 네트워크 선택'}
            description={data?.R02.description ?? '설명'}
          >
            <WifiSelectStep />
          </Step>
          <Step
            value="wifi 비밀번호 입력"
            title={
              data?.R03.title ??
              '3. Receiver와 연결할 WIFI 네트워크의 비밀번호 입력'
            }
            description={data?.R03.description ?? '설명'}
          >
            <WifiPasswordFormStep />
          </Step>
          <Step
            value="인터넷이 되는 wifi에 연결"
            title={
              data?.R04.title ??
              '4. 인터넷이 가능한 wifi 네트워크에 연결해주세요.'
            }
            description={data?.R04.description ?? '설명'}
            goNext={() => {
              router.back();
            }}
          >
            <InternetEnabledWifiStep />
          </Step>
        </Steps>
      </StepsProvider>
    </View>
  );
};

export default ReceiverScreen;
