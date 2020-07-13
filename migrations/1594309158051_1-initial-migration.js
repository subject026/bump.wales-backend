/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'varchar(1000)', notNull: true, unique: true },
    password: { type: 'varchar(1000)', notNull: true, unique: false },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};
