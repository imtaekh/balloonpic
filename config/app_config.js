require('dotenv').load();

var config={
  port: process.env.PORT || 3000
  ,db: process.env.WDI_PROJECT_4_DB
  ,secret: process.env.WDI_PROJECT_4_SESSION_SECRET
  ,INSTAGRAM_CLIENT_ID: process.env.WDI_PROJECT_4_INSTAGRAM_CLIENT_ID
  ,INSTAGRAM_CLIENT_SECRET: process.env.WDI_PROJECT_4_INSTAGRAM_CLIENT_SECRET
  ,GOOGLE_API_KEY: process.env.WDI_PROJECT_4_GOOGLE_API_KEY
  ,instagramCallbackUrl: process.env.WDI_PROJECT_4_INSTAGRAM_CALLBACK_URL
};

module.exports = config;
