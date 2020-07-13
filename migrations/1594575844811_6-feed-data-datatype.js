/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropColumns("feeds", "data");

  pgm.addColumns("feeds", {
    data: {
      type: "jsonb",
    },
  });
};
