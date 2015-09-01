require('dotenv').load();

var config={
  port:3001,
  db:process.env.PROJECT_4_DB
};

module.exports = config;
