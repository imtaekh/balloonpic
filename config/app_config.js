require('dotenv').load();

var config={
  port: 3001
  ,db: process.env.PROJECT_4_DB
  ,sessionSecret: "iloveyou"
  ,INSTAGRAM_CLIENT_ID: process.env.WDI_PROJECT_3_INSTAGRAM_CLIENT_ID
  ,INSTAGRAM_CLIENT_SECRET: process.env.WDI_PROJECT_3_INSTAGRAM_CLIENT_SECRET
};

module.exports = config;
