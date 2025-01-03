import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useRouter } from 'expo-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useBle } from '@/hooks/use-ble';

const ConnectButton = () => {
  const router = useRouter();

  const {
    disconnect,
    connectStatus: { device },
  } = useBle();

  const handleSenderConfirmButtonPress = async () => {
    if (!device) return;

    await disconnect(device.id);
    router.push('/sender');
  };

  return (
    <View className="z-10 absolute right-6 bottom-6">
      <Collapsible className="flex flex-col-reverse items-end">
        <CollapsibleTrigger asChild>
          <Button
            size="icon"
            variant="default"
            className={cn('h-14 w-14 rounded-full')}
          >
            <Ionicons name="link" size={28} color="white" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex gap-y-2 my-2">
          <AlertDialog>
            <AlertDialogTrigger asChild={!!device} disabled={!device}>
              <Button
                size="lg"
                variant="default"
                className={cn('flex flex-row gap-x-2', 'rounded-2xl')}
                onPress={() => !device && router.push('/sender')}
              >
                <Text className="font-semibold">Sender 연결하기</Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Sender를 다시 설정하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {`현재 ${device?.name} sender에 연결되어있습니다.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <Text>취소하기</Text>
                </AlertDialogCancel>
                <AlertDialogAction onPress={handleSenderConfirmButtonPress}>
                  <Text>연결하기</Text>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            size="lg"
            variant="outline"
            className={cn('flex flex-row gap-x-2', 'rounded-2xl')}
            onPress={() => router.push('/receiver')}
          >
            <Text className="font-semibold text-foreground">
              Receiver 연결하기
            </Text>
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </View>
  );
};

export { ConnectButton };
