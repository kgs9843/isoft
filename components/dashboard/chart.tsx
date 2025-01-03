import { LineChart } from 'react-native-charts-wrapper';
import { processColor, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useEffect, useState } from 'react';
import { useMqtt } from '@/hooks/use-mqtt';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Toast from 'react-native-toast-message';
import { useBle } from '@/hooks/use-ble';

const Chart: React.FC = () => {
  const { publish } = useMqtt();

  const {
    readSenderData,
    connectStatus: { device },
    write,
  } = useBle();

  const [threshold, setThreshold] = useState(155);
  const [senderDataList, setSenderDataList] = useState<number[]>([]);

  useEffect(() => {
    if (device) {
      setSenderDataList([]);
      readSenderData((data, flagMessage) => {
        setSenderDataList((prev) =>
          prev.length > 500 ? [135] : [...prev, data]
        );

        flagMessage && publish(flagMessage);
      });
    }
  }, [device, publish]);

  const handleThresholdChange = (text: string) => {
    setThreshold(+text.replace(/\D/g, ''));
  };

  const handleThresholdSubmit = async () => {
    if (!device) {
      Toast.show({
        type: 'error',
        text1: '연결된 Sender가 없습니다.',
      });
      return;
    }

    const num = Math.max(100, Math.min(threshold, 200));
    write(device.id, String(num))
      .then(() =>
        Toast.show({
          type: 'info',
          text1: `${threshold}로 임계값이 변경되었습니다.`,
        })
      )
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: '임계값 변경 실패!',
        });
      });
  };

  if (!device)
    return (
      <View className="flex justify-center items-center h-full">
        <Text>Sender를 연결하면 차트가 표시됩니다!!.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }} className="p-2">
      <View className="flex flex-row items-center px-2 gap-x-2">
        <Text className="font-semibold">임계값 설정</Text>
        <Input
          className="flex-1"
          keyboardType="number-pad"
          placeholder="임계값 설정 (100 ~ 200)"
          value={String(threshold)}
          onChangeText={handleThresholdChange}
        />
        <Button onPress={handleThresholdSubmit}>
          <Text>전송</Text>
        </Button>
      </View>
      <LineChart
        style={{ flex: 1 }}
        highlightPerTapEnabled={false}
        doubleTapToZoomEnabled={false}
        touchEnabled={false}
        chartDescription={{
          text: '',
        }}
        data={{
          dataSets: [
            {
              label: '센더 데이터',
              values: senderDataList,
              config: {
                mode: 'CUBIC_BEZIER',
                drawValues: false,
                lineWidth: 0.8,
                color: processColor('#E8C468'),
                drawCircles: false,
                drawCubicIntensity: 0,
              },
            },
            {
              label: '임계값',
              values: [{ y: threshold }, { x: 500, y: threshold }],
              config: {
                mode: 'LINEAR',
                drawValues: false,
                lineWidth: 1,
                color: processColor('#E21D48'),
                drawCircles: false,
              },
            },
          ],
        }}
        xAxis={{
          enabled: true,
          position: 'BOTTOM',
          drawAxisLine: true,
          drawGridLines: false,
          drawLabels: false,
          textSize: 10,
          textColor: processColor('#000000'),
          axisLineColor: processColor('#000000'),
          axisLineWidth: 1,
          axisMaximum: 500,
        }}
        yAxis={{
          left: {
            enabled: true,
            drawAxisLine: true,
            drawGridLines: true,
            drawLabels: true,
            textSize: 10,
            textColor: processColor('#000000'),
            axisLineColor: processColor('#000000'),
            axisLineWidth: 1,
            axisMinimum: 80,
            axisMaximum: 200,
          },
          right: {
            enabled: true,
            textSize: 10,
            axisLineColor: processColor('#000000'),
            axisLineWidth: 1,
            axisMinimum: 80,
            axisMaximum: 200,
          },
        }}
        legend={{
          enabled: true,
          textSize: 16,
        }}
      />
    </View>
  );
};

export { Chart };
