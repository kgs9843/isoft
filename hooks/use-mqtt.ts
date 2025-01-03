import { useCallback, useEffect } from 'react';
import MQTT from 'sp-react-native-mqtt';
import { useAtom } from 'jotai';
import { connectStatusAtom } from '@/lib/atoms/sender-atom';
import Toast from 'react-native-toast-message';
import { isMQTTConnectedAtom, mqttClientAtom } from '@/lib/atoms/receiver-atom';

const useMqtt = () => {
  const [connectStatus] = useAtom(connectStatusAtom);

  const [client, setClient] = useAtom(mqttClientAtom);
  const [isMQTTConnected, setIsMQTTConnected] = useAtom(isMQTTConnectedAtom);

  useEffect(() => {
    if (!connectStatus.device?.name) return;
    if (client) return;

    // @ts-ignore
    MQTT.createClient({
      host: process.env.EXPO_PUBLIC_MQTT_HOST || 'localhost',
      port: 1883,
      protocol: 'mqtt',
      clientId: `${connectStatus.device?.name}_receiver_app`,
      auth: true,
      user: process.env.EXPO_PUBLIC_MQTT_USER || 'user',
      pass: process.env.EXPO_PUBLIC_MQTT_PASSWORD || 'password',
    })
      .then((mqttClient) => {
        console.log(`${connectStatus.device?.name}`);
        mqttClient.on('closed', () => {
          console.log('MQTT client closed');
          setIsMQTTConnected(false);
        });

        mqttClient.on('error', (msg: string) => {
          Toast.show({
            type: 'error',
            text1: 'MQTT 에러 발생',
            text2: msg,
          });

          console.log('[MQTT error]', msg);

          setIsMQTTConnected(false);
        });

        mqttClient.on('connect', () => {
          console.log('Connected to MQTT Broker');
          setIsMQTTConnected(true);
        });

        setClient(mqttClient);
        mqttClient.connect();
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'MQTT 에러 발생',
        });
      });

    return () => {
      if (client) {
        MQTT.removeClient(client);
      }
    };
  }, [connectStatus]);

  const publish = useCallback(
    (message: string) => {
      const topic = `${process.env.EXPO_PUBLIC_MQTT_USER}/${connectStatus.device?.name}`;

      client?.publish(topic, message, 1, false);
    },
    [client]
  );

  const mqttConnect = () => {
    client?.connect();
  };

  const mqttDisconnect = () => {
    client?.disconnect();
  };

  return {
    isMQTTConnected,
    mqttConnect,
    mqttDisconnect,
    publish,
  };
};

export { useMqtt };
