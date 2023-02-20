export default () => ({
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost/nest',
  },
});
