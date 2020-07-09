const parser = require("rss-parser");
const { default: promisePool } = require("./promisePool");

const Feed = require("../resources/Feed/feed.model").FeedModel;
const Post = require("../resources/Post/post.model").PostModel;

const Parser = new parser();

const groupData = (newPostData) => {
  let arr = [];
  while (newPostData.length > 0) {
    console.log("newPostData.length: ", newPostData.length);
    arr.push(newPostData.slice(0, 20));
    newPostData = newPostData.slice(20, newPostData.length);
    // console.log(arr[arr.length - 1].length);
  }
  return arr;
};

const createNewPosts = (newPostData) => {
  console.log("creating new posts...");
  const groupedData = groupData(newPostData);
  return Promise.all(
    groupedData.map(async (batch) => {
      await Post.create(batch);
    }),
  );
};

const processPublisher = async (publisher) => {
  try {
    //
    // fetch and parse new newFeed
    console.log("fetching feed");
    const newFeed = await Parser.parseURL(publisher.rss);
    console.log("done");
    //
    // get publishers last feed

    console.log("getting publisher's last feed");
    const res = await Feed.find({ publisher_id: publisher._id })
      .sort({ _id: -1 })
      .limit(1);
    console.log("done");

    // console.log(
    //   `${publisher.name} last feed items: `,
    //   res.length ? res[0].data.items.length : "no res"
    // );
    //
    //  generate post data
    console.log("generating new post data");

    const newPostData = newFeed.items.reduce((acc, item) => {
      const itemData = {
        title: item.title,
        description: item.description,
        url: item.link,
        pubDate: item.pubDate,
        publisher_id: publisher._id,
      };
      if (res.length) {
        const lastFeedItems = [...res[0].data.items];
        if (!lastFeedItems.includes(item.link)) acc.push(itemData);
      } else {
        acc.push(itemData);
      }
      return acc;
    }, []);
    console.log("done");

    //
    // create new posts
    await createNewPosts(newPostData);
    // update publisher last newFeed

    await Feed.create({
      data: {
        ...newFeed,
        items: newFeed.items?.map((i) => i.link),
      },
      publisher_id: publisher._id,
    });
    return {
      newFeedItems: newFeed.items?.length,
      newPosts: newPostData.length,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = processPublisher;
