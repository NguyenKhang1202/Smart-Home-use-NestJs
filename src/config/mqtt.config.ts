import { MqttModuleOptions } from 'nest-mqtt';

async function mqttConfig(): Promise<MqttModuleOptions> {
  return {
    host: 'broker.hivemq.com',
    port: 1883,
    protocol: 'mqtt',
    username: 'fire_alarm_system',
    password: '123456',
  };
}

export { mqttConfig };
