export default () => ({
  env: process.env.ENV || 'development',
  database: {
    host: process.env.HOST || 'localhost',
  },
});
