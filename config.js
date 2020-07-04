let config = {};

config.APP_SECRET = process.env.APP_SECRET;

switch (process.env.MODE) {
  case "development":
    config.DB_URL = process.env.DEV_DB_URL;
    break;
  case "test":
    config.DB_URL = process.env.TEST_DB_URL;
    break;
  default:
    config.DB_URL = process.env.PROD_DB_URL;
}

module.exports = config;
