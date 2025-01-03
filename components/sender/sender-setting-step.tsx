import { View } from 'react-native';
import { Faq } from '@/components/common/faq';
import { Text } from '@/components/ui/text';
import YoutubePlayer from 'react-native-youtube-iframe';
import { extractYoutubeVideoId } from '@/lib/utils';
import { useGetDescriptionQuery } from '@/lib/api/text/queries';

const SenderSettingStep = () => {
  const { data } = useGetDescriptionQuery();

  const videoId =
    data?.S01.youtube_video_url &&
    extractYoutubeVideoId(data?.S01.youtube_video_url);

  return (
    <View className="flex gap-y-16">
      <View className="my-10 w-full h-56 bg-neutral-900">
        {videoId ? (
          <YoutubePlayer height={300} play={false} videoId={videoId} />
        ) : (
          <Text className="text-white text-center pt-4">
            영상이 존재하지 않습니다.
          </Text>
        )}
      </View>
      <Faq screen="S01" />
    </View>
  );
};
export { SenderSettingStep };
