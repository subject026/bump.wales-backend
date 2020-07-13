const pgp = require('pg-promise')();

const config = require('./config');

module.exports = pgp({
  host: config.host,
  database: config.database,
  user: config.user,
  password: config.password,
});
