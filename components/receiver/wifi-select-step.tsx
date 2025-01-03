import { ActivityIndicator, FlatList, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Faq } from '@/components/common/faq';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useWifiList } from '@/hooks/use-wifi-list';
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai/index';
import { selectedWifiSSIDAtom } from '@/lib/atoms/receiver-atom';

const WifiSelectStep = () => {
  const { wifiList, isLoading, isError } = useWifiList();

  const [selectedWifiSSID, setSelectedWifiSSID] = useAtom(selectedWifiSSIDAtom);

  return (
    <View className="flex gap-y-4">
      <View className="flex gap-y-4">
        <View className="bg-muted rounded-lg px-4 py-2 h-60">
          <View className="flex flex-row justify-between items-center">
            <Text className="font-semibold">검색된 WIFI 목록</Text>
          </View>
          <View className="w-full h-[1px] my-2 bg-slate-200" />
          <View className="flex justify-center flex-1">
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : isError ? (
              <Button
                variant="outline"
                size="lg"
                className="flex flex-row items-center justify-center gap-x-2"
              >
                <Text>와이파이 목록 다시 불러오기</Text>
                <Ionicons name="reload" size={20} color="black" />
              </Button>
            ) : selectedWifiSSID ? (
              <View className="flex gap-y-4">
                <View className="flex flex-row gap-x-2 justify-center items-center">
                  <View className="rounded-full bg-emerald-500 p-2">
                    <Ionicons name="wifi" size={24} color="white" />
                  </View>
                  <View>
                    <Text className="font-semibold">
                      {selectedWifiSSID}가 선택되었습니다.
                    </Text>
                    <Text className="text-xs text-neutral-500">
                      다음 버튼을 눌러주세요
                    </Text>
                  </View>
                </View>
                <Button
                  variant="outline"
                  className="flex flex-row items-center justify-center gap-x-2"
                  size="lg"
                  onPress={() => setSelectedWifiSSID(null)}
                >
                  <Text>다른 와이파이 선택하기</Text>
                  <Ionicons
                    name="arrow-undo-circle-outline"
                    size={24}
                    color="black"
                  />
                </Button>
              </View>
            ) : (
              <FlatList
                data={wifiList}
                keyExtractor={(item) => item.BSSID}
                renderItem={({ item: { SSID } }) => (
                  <Button
                    className="flex-row justify-start items-center gap-x-2 py-2 mb-1.5 bg-slate-200 active:bg-slate-300"
                    variant="ghost"
                    onPress={() => setSelectedWifiSSID(SSID)}
                  >
                    <Ionicons name="wifi" size={20} />
                    <Text>{SSID}</Text>
                  </Button>
                )}
              />
            )}
          </View>
        </View>
      </View>
      <Faq screen="R02" />
    </View>
  );
};

export { WifiSelectStep };
