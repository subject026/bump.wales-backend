/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('users', 'roles', {
    type: 'string',
  });
};
