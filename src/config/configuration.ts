export default () => ({
  env: process.env.ENV || 'development',
  database: {
    host: process.env.HOST || 'localhost',
  },
});

export const topicMqtt = {
  smart_home_control_device: 'smart_home_control_device',
  smart_home_humidity_and_temperature: 'smart_home_humidity_and_temperature',
};
