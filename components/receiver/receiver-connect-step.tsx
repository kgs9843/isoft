import { Platform, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Faq } from '@/components/common/faq';
import { Button } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as IntentLauncher from 'expo-intent-launcher';
import { useGetDescriptionQuery } from '@/lib/api/text/queries';
import { extractYoutubeVideoId } from '@/lib/utils';
import YoutubePlayer from 'react-native-youtube-iframe';

const openWifiSettings = () => {
  if (Platform.OS === 'android') {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.WIFI_SETTINGS
    );
  } else {
    Linking.openURL('App-Prefs:root=WIFI');
  }
};

const ReceiverConnectStep = () => {
  const { data } = useGetDescriptionQuery();

  const videoId =
    data?.R01.youtube_video_url &&
    extractYoutubeVideoId(data?.R01.youtube_video_url);

  return (
    <View className="flex gap-y-4">
      <View className="flex gap-y-4">
        <View className="w-full h-56 bg-neutral-900">
          {videoId ? (
            <YoutubePlayer height={300} play={false} videoId={videoId} />
          ) : (
            <Text className="text-white text-center pt-4">
              영상이 존재하지 않습니다.
            </Text>
          )}
        </View>
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
      <Faq screen="R01" />
    </View>
  );
};

export { ReceiverConnectStep };
