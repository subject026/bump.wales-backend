/* eslint-disable camelcase */
require("dotenv").config();
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn("publishers", "createdAt", "created_at");

  pgm.renameColumn("feeds", "createdAt", "created_at");

  pgm.renameColumn("posts", "pubDate", "pub_date");
  pgm.renameColumn("posts", "createdAt", "created_at");
};
