import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ConnectButton } from '@/components/dashboard/connect-button';
import { Chart } from '@/components/dashboard/chart';
import { useAtom } from 'jotai/index';
import { isMQTTConnectedAtom, mqttClientAtom } from '@/lib/atoms/receiver-atom';
import { usePrefetch } from '@/hooks/use-prefetch';
import { useBle } from '@/hooks/use-ble';

const DashboardScreen = () => {
  const {
    connectStatus: { device },
  } = useBle();

  const [isMQTTConnected] = useAtom(isMQTTConnectedAtom);
  const [client] = useAtom(mqttClientAtom);

  usePrefetch();

  return (
    <View style={{ flex: 1 }} className="p-4">
      <ConnectButton />
      <View className="flex flex-row gap-x-2 mb-2">
        <View className="p-4 rounded-xl bg-muted flex-1">
          <View className="flex flex-row items-center gap-x-2 mb-2">
            <View className="p-1 bg-primary rounded-full">
              <Ionicons name="bluetooth" size={16} color="white" />
            </View>
            <Text className="text-foreground text-sm">Sender</Text>
          </View>
          <Text className="font-semibold text-2xl">
            {device ? device?.name : '연결 안됨'}
          </Text>
        </View>
        <View className="p-4 rounded-xl bg-muted flex-1">
          <View className="flex flex-row items-center gap-x-2 mb-2">
            <View className="p-1 rounded-full bg-chart-4">
              <Ionicons name="wifi" size={16} color="white" />
            </View>
            <Text className="text-foreground text-sm">MQTT</Text>
          </View>
          {device ? (
            isMQTTConnected ? (
              <>
                <Text className="font-semibold text-2xl">서버 연결됨</Text>
                <Text className="text-sm text-muted-foreground">
                  topic: {process.env.EXPO_PUBLIC_MQTT_USER}/{device?.name}
                </Text>
              </>
            ) : (
              <TouchableOpacity
                className="flex flex-row items-center gap-x-2 w-full"
                onPress={() => client?.connect()}
              >
                <Text className="text-xl">서버 재연결</Text>
                <Ionicons name="reload" size={24} color="black" />
              </TouchableOpacity>
            )
          ) : (
            <>
              <Text className="font-semibold text-xl">서버 연결 안됨</Text>
              <Text className="text-sm text-slate-500">
                먼저 sender를 연결해주세요
              </Text>
            </>
          )}
        </View>
      </View>
      <View style={{ flex: 1 }} className="bg-muted rounded-xl py-4">
        <Text className="font-semibold text-xl px-4">Sender 차트</Text>
        <Chart />
      </View>
    </View>
  );
};

export default DashboardScreen;
