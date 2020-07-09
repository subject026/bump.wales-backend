const parser = require("rss-parser");

const promisePool = require("./promisePool");

let Parser = new parser();

const attachFeeds = (publishers) => {
  return promisePool(publishers, async (publisher) => {
    const feed = await Parser.parseURL(publisher.rss);
    publisher.feed = feed;
    return publisher;
  });
};

module.exports = attachFeeds;
