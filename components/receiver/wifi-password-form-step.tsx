import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Faq } from '@/components/common/faq';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai/index';
import {
  connectedWifiSSIDAtom,
  isReceiverNetworkSetFinishedAtom,
  selectedWifiSSIDAtom,
} from '@/lib/atoms/receiver-atom';
import { usePostSsidMutation } from '@/lib/api/receiver/mutations';
import { Controller, useForm } from 'react-hook-form';
import { TPostSsidReqDto } from '@/lib/api/receiver/client';
import { SubmitHandler } from 'react-hook-form/dist/types/form';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const topicRegex = new RegExp('G-BRAIN_\\w+\\d+');

const WifiPasswordFormStep = () => {
  const [connectedWifiSSID] = useAtom(connectedWifiSSIDAtom);
  const [selectedWifiSSID] = useAtom(selectedWifiSSIDAtom);
  const [isReceiverNetworkSetFinished, setIsReceiverNetworkSetFinished] =
    useAtom(isReceiverNetworkSetFinishedAtom);

  const [showPassword, setShowPassword] = useState(false);

  const defaultTopic = topicRegex.test(connectedWifiSSID ?? '')
    ? connectedWifiSSID?.split('_').at(-1)
    : undefined;

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<TPostSsidReqDto>({
    defaultValues: {
      ssid: selectedWifiSSID ?? undefined,
      password: undefined,
      topic: defaultTopic,
    },
  });

  const { mutate, isPending } = usePostSsidMutation({
    onSuccess: () => {
      setIsReceiverNetworkSetFinished(true);
    },
    onError: (error) => {
      setIsReceiverNetworkSetFinished(false);
      console.error('Error details:', error); // 오류 세부 정보 로그 출력
      Toast.show({
        type: 'error',
        text1: '와이파이 설정 실패',
        text2: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<TPostSsidReqDto> = (data) => {
    console.log('Submitting data:', data); // 요청 데이터 로그 출력
    mutate({
      ...data,
      topic: data.topic.toUpperCase(),
    });
  };

  return (
    <View className="flex gap-y-4">
      <View className="bg-muted rounded-lg p-4 h-[230px]">
        {isReceiverNetworkSetFinished ? (
          <View className="h-full flex items-start justify-center">
            <Text className="font-semibold text-xl">
              Sender 와이파이 설정이 완료되었습니다.
            </Text>
            <Text>
              리시버가 {selectedWifiSSID} 네트워크에 연결되었습니다.{'\n'}다음
              버튼을 눌러주세요
            </Text>
          </View>
        ) : (
          <>
            <View className="mb-4">
              <Text className="mb-0.5 ps-1 text-sm font-semibold">
                WIFI Password
              </Text>
              <View className="relative">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      secureTextEntry={!showPassword}
                      textContentType="password"
                      className="focus:border focus:border-blue-500"
                      placeholder="wifi 비밀번호를 입력해주세요."
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-0 h-full justify-center pr-2"
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text className="mb-0.5 ps-1 text-sm font-semibold">
                Serial No.
              </Text>
              <Controller
                control={control}
                name="topic"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className="focus:border focus:border-blue-500"
                    placeholder="sender의 시리얼번호를 입력해주세요."
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
            <Button
              className="mt-8 w-20 self-end"
              size="sm"
              variant="secondary"
              disabled={!isValid}
              onPress={handleSubmit(onSubmit)}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-semibold">전송</Text>
              )}
            </Button>
          </>
        )}
      </View>
      <Faq screen="R03" />
    </View>
  );
};

export default WifiPasswordFormStep;
