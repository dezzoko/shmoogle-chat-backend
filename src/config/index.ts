export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  assetsDir: (process.env.ASSETS_DIRECTORY || './assets') + '/files',
});
