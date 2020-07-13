const parser = require("rss-parser");
const pgp = require("pg-promise")({ capSQL: true });
// const { default: promisePool } = require("./promisePool");
const db = require("../DB");
const { addLink, collectItemFields, collectFeedFields } = require("./report");

const { Feed } = require("../resources/Feed/feed.model");
const { Post } = require("../resources/Post/post.model");

const Parser = new parser();

// const groupData = (newPostData) => {
//   let arr = [];
//   while (newPostData.length > 0) {
//     console.log("newPostData.length: ", newPostData.length);
//     arr.push(newPostData.slice(0, 20));
//     newPostData = newPostData.slice(20, newPostData.length);
//     // console.log(arr[arr.length - 1].length);
//   }
//   return arr;
// };

const fetchFeed = async (link) => {
  try {
    const feed = await Parser.parseURL(link);
    collectFeedFields(feed);
    collectItemFields(feed.items);
    return feed;
  } catch (err) {
    console.log("error fetching feed!!");
  }
};

const createNewPosts = (newPostData) => {
  // const groupedData = groupData(newPostData);
  const cs = new pgp.helpers.ColumnSet(
    ["title", "description", "url", "pub_date", "publisher_id", "feed_id"],
    { table: "posts" },
  );
  const query = pgp.helpers.insert(newPostData, cs);
  return db.none(query);
};

const processPublisher = async (publisher) => {
  //
  // fetch and parse new newFeed
  const newFeed = await fetchFeed(publisher.rss);

  // record feed fields in report

  try {
    //
    // get publishers last feed

    const lastFeed = await db.oneOrNone(
      `SELECT * FROM Feeds WHERE publisher_id = ${publisher.id} ORDER BY id DESC LIMIT 1;`,
    );
    // save publisher newFeed
    const newFeedDoc = await Feed.create({
      data: JSON.stringify({
        ...newFeed,
        items: newFeed.items?.map((i) => i.link),
      }),
      publisher_id: publisher.id,
    }).save();

    // console.log(
    //   `${publisher.name} last feed items: `,
    //   res.length ? res[0].data.items.length : "no res"
    // );
    //
    //  generate post data

    const newPostData = newFeed.items.reduce((acc, item) => {
      const itemData = {
        title: item.title,
        description: item.description,
        url: item.link,
        pub_date: item.pubDate,
        publisher_id: publisher.id,
        feed_id: newFeedDoc.id,
      };
      // console.log(lastFeed.data.items);
      if (lastFeed) {
        const lastFeedItems = [...lastFeed.data.items];
        if (!lastFeedItems.includes(item.link)) {
          acc.push(itemData);
          addLink({ publisher: publisher.name, link: item.link });
        }
      } else {
        // if no last feed was found it's a new publisher, save all posts
        acc.push(itemData);
        addLink({ publisher: publisher.name, link: item.link });
      }
      return acc;
    }, []);

    //
    // create new posts
    if (newPostData.length) await createNewPosts(newPostData);

    return;
  } catch (err) {
    console.log(err);
  }
};

module.exports = processPublisher;
