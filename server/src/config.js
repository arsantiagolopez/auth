// Server config file

require("dotenv").config();

export default {
  // Environment
  nodeEnv: process.env.NODE_ENV || "production",
  // Node.js app
  port: process.env.PORT || 4000,
  // Cookie name
  cookieName: process.env.COOKIE_NAME || "cid",
  // Database URL
  databaseUrl: process.env.DATABASE_URL,

  // API info
  api: {
    // Server URL
    serverUrl: process.env.SERVER_URL,
    // Client URL
    clientUrl: process.env.CLIENT_URL,
    // Redis URL
    redisUrl: process.env.REDIS_URL,
  },

  // Authentication
  auth: {
    // JWT secret key
    jwt: { secret: process.env.JWT_SECRET || "Auth Secret Key" },
    // Facebook keys
    facebook: {
      // App ID
      id: process.env.FACEBOOK_APP_ID,
      // App secret
      secret: process.env.FACEBOOK_APP_SECRET,
    },
    // Google keys
    google: {
      // Client ID
      id: process.env.GOOGLE_CLIENT_ID,
      // Client secret
      secret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  // Mailing service
  sendgrid: {
    // API key
    apiKey: process.env.SENDGRID_API_KEY,
    // From mail
    fromEmail: process.env.SENGRID_FROM_EMAIL,
  },
};
