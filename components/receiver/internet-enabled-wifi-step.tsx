import { Platform, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { Faq } from '@/components/common/faq';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';

const openWifiSettings = () => {
  if (Platform.OS === 'android') {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.WIFI_SETTINGS
    );
  } else {
    Linking.openURL('App-Prefs:root=WIFI');
  }
};

const InternetEnabledWifiStep = () => {
  return (
    <View className="flex gap-y-4">
      <View className="flex gap-y-4">
        <Button
          variant="outline"
          size="lg"
          className="flex flex-row items-center gap-x-2"
          onPress={openWifiSettings}
        >
          <Text>와이파이 설정 페이지로 이동</Text>
          <Ionicons name="open-outline" size={20} color="black" />
        </Button>
      </View>
      <Faq screen="R04" />
    </View>
  );
};

export { InternetEnabledWifiStep };
