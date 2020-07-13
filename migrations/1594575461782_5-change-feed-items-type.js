/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn("feeds", "lastFeed", "data");
};
