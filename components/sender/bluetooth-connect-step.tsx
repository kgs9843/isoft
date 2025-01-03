import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Faq } from '@/components/common/faq';
import { useBle } from '@/hooks/use-ble';

const BluetoothConnectStep = () => {
  const {
    scanDeviceList,
    isScan,
    startScan,
    connect,
    stopScan,
    connectStatus: { device, isLoading },
  } = useBle();

  useEffect(() => {
    (async () => {
      if (!isScan) await startScan();
    })();
  }, []);

  const toggleScan = async () => {
    isScan ? stopScan() : await startScan();
  };

  const handleConnect = async (deviceId: string) => {
    await connect(deviceId);
  };

  return (
    <View>
      <View className="mb-4 bg-muted rounded-lg px-4 py-2 h-56">
        {isLoading ? (
          <View className="flex items-center justify-center h-full">
            <ActivityIndicator size="large" />
            <Text>연결중입니다...</Text>
          </View>
        ) : device ? (
          <View className="flex flex-row gap-x-2 justify-center items-center h-full">
            <View className="rounded-full bg-primary p-2">
              <Ionicons name="bluetooth" size={24} color="white" />
            </View>
            <View>
              <Text className="font-semibold">
                {device?.name}에 연결되었습니다.
              </Text>
              <Text className="text-xs text-muted-foreground">
                다음 버튼을 눌러주세요
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View className="flex flex-row justify-between items-center">
              <Text className="font-semibold">연결 가능한 장치 목록</Text>
              <Pressable
                onPress={toggleScan}
                className="flex flex-row gap-x-1 items-center"
              >
                <Text className="text-foreground">
                  {isScan ? '스캔 중지' : '주변 장치 스캔'}
                </Text>
                <Ionicons name="reload-circle" size={24} color="black" />
              </Pressable>
            </View>
            <View className="w-full h-[1px] my-2 bg-slate-200" />
            <FlatList
              data={scanDeviceList}
              keyExtractor={(item) => item.id}
              renderItem={({ item: { name, id } }) => (
                <Button
                  className="flex-row justify-between items-center py-2 mb-1.5 bg-card border border-border active:bg-slate-300"
                  variant="ghost"
                  onPress={() => handleConnect(id)}
                >
                  <Text>{name}</Text>
                  <Text className="text-xs text-neutral-600">{id}</Text>
                </Button>
              )}
            />
          </>
        )}
      </View>
      <Faq screen="S02" />
    </View>
  );
};

export { BluetoothConnectStep };
