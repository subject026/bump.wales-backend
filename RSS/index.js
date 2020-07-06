require("dotenv").config();
const parser = require("rss-parser");
const promisePool = require("./promisePool");

const DB = require("../DB");
const Publisher = require("../resources/Publisher/publisher.model")
  .PublisherModel;
const Post = require("../resources/Post/post.model").PostModel;

let Parser = new parser();

//
//

//
//

const feedItemHasErrors = (item) => {
  const errors = [];
  if (!item.title) {
    errors.push("feed item invalid! - no item.title");
  }
  if (!item.link) {
    errors.push("feed item invalid! - no link");
  }
  if (errors.length) return errors;
  return false;
};

const trimSlash = (string) => {
  if (string.endsWith("/")) {
    return string.substring(0, string.length - 1);
  }
  return string;
};

const getPublisher = (publishers, feedUrl) => {
  return publishers.reduce((acc, publisher) => {
    if (trimSlash(publisher.rss) === trimSlash(feedUrl)) {
      return {
        publisherId: publisher._id,
        publisherName: publisher.name,
        lastFeed: publisher.lastFeed,
      };
    }
    return acc;
  }, {});
};

(async () => {
  DB();

  console.log("getting publishers...");
  const publishers = await Publisher.find();

  //
  // parse and attach feeds

  const publishersWithFeeds = await promisePool(
    [publishers[0]],
    async (publisher) => {
      const feed = await Parser.parseURL(publisher.rss);
      publisher.feed = feed;
      console.log(`feed for ${publisher.name} resolved!`);
      return publisher;
    },
  );

  publishersWithFeeds.forEach((publisher) => {
    // compare feeds to find new posts
    console.log(publisher);
    console.log(Object.keys(publisher.feed));
  });

  // publishersWithFeeds.forEach((publisher) => {
  //   console.log("8OOM: ", publisher.rss);
  //   // feed.publisherId =
  //   // feed.publisherName =
  // });

  // feeds.forEach((feed) => {
  //   if (!feed.items) console.log("error - no feed.items for " + feed.feedUrl);
  //   const { publisherId, publisherName, lastFeed } = getPublisher(
  //     publishers,
  //     feed.feedUrl
  //   );

  //   // !!! save list of query URLs here to update Publisher record after

  //   feed.items.forEach((item) => {
  //     // !!! check if url was on last fetch - just keep list of urls attached to publisher

  //     // console.log(item);
  //     const feedErrors = feedItemHasErrors(item);
  //     if (feedErrors.length) {
  //       console.log("feedErrors: ", feedErrors);
  //     } else {
  //       promiseQueue.push(
  //         Post.create({
  //           title: item.title,
  //           url: item.link,
  //           pubDate: item.pubDate,
  //           publisher_id: publisherId,
  //           publisherName: publisherName,
  //         })
  //       );

  //       // console.log(item.title);
  //       // console.log(item.link);
  //       // console.log(item.pubDate);
  //       // console.log(item.categories);
  //     }
  //   });
  // });
})();
