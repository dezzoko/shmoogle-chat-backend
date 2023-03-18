export default () => ({
  auth: {
    secret: process.env.AUTH_SECRET || 'secret',
    expiresIn: process.env.AUTH_EXPIRES || '1h',
    refreshExpiresIn:
      +process.env.AUTH_REFRESH_EXPIRES || 30 * 24 * 60 * 60 * 1000,
  },
  authGoogle: {
    secret: process.env.GOOGLE_SECRET || 'secret',
    appId: process.env.GOOGLE_APP_ID || 'shmoogle-chat',
    callbackUrl: process.env.GOOGLE_CALLBACK || 'http://localhost:3000/welcome',
  },
});
