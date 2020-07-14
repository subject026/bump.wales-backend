const supertest = require("supertest");

const app = require("../../app");
const db = require("../../DB");
const { Post } = require("./post.model");

const request = supertest(app);

beforeAll(async () => {
  await db.none("DELETE FROM posts");
  await db.none(`
  INSERT INTO publishers(name, homepage, rss) VALUES ('publisher 1', 'www.homepage.com', 'no');
  INSERT INTO publishers(name, homepage, rss) VALUES ('publisher 2', 'www.homepage2.com', 'no');
  INSERT INTO posts(title, description, url, pub_date, feed_id, publisher_id) VALUES ('post 1', 'something', 'www.wooo.com', 'some date', 1, 1);
  INSERT INTO posts(title, description, url, pub_date, feed_id, publisher_id) VALUES ('post 2', 'something', 'www.wooo.com', 'some date', 1, 1);
  INSERT INTO posts(title, description, url, pub_date, feed_id, publisher_id) VALUES ('post a', 'something', 'www.wooo2.com', 'some date', 2, 2);
  INSERT INTO posts(title, description, url, pub_date, feed_id, publisher_id) VALUES ('post b', 'something', 'www.wooo3.com', 'some date', 2, 2);
  INSERT INTO posts(title, description, url, pub_date, feed_id, publisher_id) VALUES ('post c', 'something', 'www.wooo3.com', 'some date', 2, 2);`);
});

describe("GET /posts", () => {
  test("returns all posts with publisher data attached", async () => {
    const res = await request.get("/posts");
    console.log(res.status);
  });
});
