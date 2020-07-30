require("dotenv").config();

const config = {};

config.APP_SECRET = process.env.APP_SECRET;

switch (process.env.MODE) {
  case "development":
    config.host = process.env.PGHOST;
    config.database = process.env.PGDATABASE;
    config.user = process.env.PGUSER;
    config.password = process.env.PGPASSWORD;
    break;
  case "test":
    config.host = process.env.PGHOST;
    config.database = process.env.PGDATABASE_TEST;
    config.user = process.env.PGUSER;
    config.password = process.env.PGPASSWORD;
    break;
  default:
    config.host = process.env.PGHOST;
    config.database = process.env.PGDATABASE;
    config.user = process.env.PGUSER;
    config.password = process.env.PGPASSWORD;
}

console.log(config);

module.exports = config;
