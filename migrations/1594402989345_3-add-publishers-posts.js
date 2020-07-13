/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('users', {
    roles: { type: 'TEXT []', unique: false },
  });

  pgm.createTable('publishers', {
    id: 'id',
    name: { type: 'varchar(1000)', notNull: true, unique: true },
    homepage: {
      type: 'string',
    },
    rss: {
      type: 'string',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('feeds', {
    id: 'id',
    lastFeed: {
      type: 'TEXT []',
      notNull: true,
    },
    publisher_id: {
      type: 'integer',
      references: 'publishers',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('posts', {
    id: 'id',
    title: {
      type: 'string',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    url: {
      type: 'string',
      notNull: true,
    },
    pubDate: {
      type: 'string',
    },
    publisher_id: {
      type: 'integer',
      references: 'publishers',
      notNull: true,
    },
    feed_id: {
      type: 'integer',
      references: 'feeds',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};
