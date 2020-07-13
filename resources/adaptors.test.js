const { User } = require('./User/user.model');
const { Publisher } = require('./Publisher/publisher.model');
const { RequiredParameterError } = require('../util/errors');
const db = require('../DB');

beforeAll(async () => {
  try {
    await db.none(
      `delete from users; delete from publishers; insert into publishers(name, homepage, rss) values ('existing publisher', 'homepage.com', 'homepage.rss');`,
    );
    await db.any(`
      insert into users(email, password) values ('jake@example.com', 'jakes_password');
      insert into users(email, password) values ('archibald@example.com', 'archibalds_password');
      insert into users(email, password) values ('jonty@example.com', 'jontys_password');`);
  } catch (err) {
    console.log('beforeAll error: ', err);
  }
});

describe('find resource', () => {
  test('find() should find all records', async () => {
    User.find()
      .then((res) => {
        expect(res.length).toBe(3);
      })
      .catch((err) => {
        expect(err).toBeFalsy();
      });
  });

  test('find(QUERY) should find correct record', async () => {
    try {
      const res = await User.find({ email: 'jake@example.com' });
      expect(res.length).toBe(1);
      expect(res[0].password).toBe('jakes_password');
    } catch (err) {
      console.log('\n\n\n', err.message);
      expect(err).toBeFalsy();
    }
  });
});

describe('create resource', () => {
  test('should throw errors if required fields are missing', async () => {
    expect(() => User.create({ email: '123456@boom.com' })).toThrow(
      new RequiredParameterError('password'),
    );
    expect(() => User.create({ password: 'password' })).toThrow(
      new RequiredParameterError('email'),
    );
  });

  test('valid request should create new doc', async () => {
    const usersBefore = await User.find();
    expect(usersBefore.length).toEqual(3);

    await User.create({
      email: '123456@boom.com',
      password: '123456',
    }).save();

    const usersAfter = await User.find();
    expect(usersAfter.length).toBe(4);

    // publisher
    const publishersBefore = await Publisher.find();
    expect(publishersBefore.length).toEqual(1);

    await Publisher.create({
      name: 'publisher name 1',
      homepage: 'homepage.com',
      rss: 'homepage.com/rss',
    }).save();

    const publishersAfter = await Publisher.find();
    expect(publishersAfter.length).toBe(2);
  });
});

describe('update a resource', () => {
  test('valid request should return updated doc', async () => {
    const updatedUser = await User.update(
      { email: 'jake@example.com' },
      { email: 'jakesnewemail@example.com' },
    );
    expect(updatedUser.email).toBe('jakesnewemail@example.com');
  });
});

describe('delete a resource', () => {
  test('valid request should delete resource', async () => {
    const usersBefore = await db.many(`SELECT * FROM Users`);
    expect(usersBefore.length).toBe(4);

    const updatedUser = await User.delete({ email: 'jonty@example.com' });

    const usersAfter = await db.many(`SELECT * FROM Users`);
    expect(usersAfter.length).toBe(3);
  });
});
