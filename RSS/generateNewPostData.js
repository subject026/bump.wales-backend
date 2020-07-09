const Publisher = require("../resources/Publisher/publisher.model")
  .PublisherModel;
const Post = require("../resources/Post/post.model").PostModel;

const generateNewPostData = (publishersWithFeeds) => {
  const newPostData = [];
  const newPostDataErrors = [];

  publishersWithFeeds.forEach(async (publisher) => {
    // compare feeds to find new posts
    if (publisher.feed.items) {
      const feedLinks = [];
      publisher.feed.items.forEach((item) => {
        // console.log(
        //   "link was in last feed: ",
        //   publisher.lastFeed.includes(item.link)
        // );
        // console.log(publisher.lastFeed);
        feedLinks.push(item.link);
        if (!publisher.lastFeed.includes(item.link)) {
          if (!item.title.length) {
            newPostDataErrors.push(
              `${publisher.name} feed item - no item.title`
            );
          }
          if
          if (!item.description) {
            newPostDataErrors.push(
              `${publisher.name} feed item - no item.description`
            );
          } (!item.link.length) {
            newPostDataErrors.push(
              `${publisher.name} feed item - no item.link`
            );
          }
          if (!item.pubDate.length) {
            newPostDataErrors.push(
              `${publisher.name} feed item - no item.pubDate`
            );
          }
          feedLinks.push(item.link);
          // create post
          newPostData.push({
            title: item.title,
            description: item.description,
            url: item.link,
            pubDate: item.pubDate,
            publisher_id: publisher._id,
          });
        }
      });
      try {
        const res = await Publisher.findOneAndUpdate(
          { _id: publisher._id },
          {
            lastFeed: feedLinks,
          }
        );
        // update publisher last feed
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("feed has no items!");
    }
  });
  return { newPostData, newPostDataErrors };
};

module.exports = generateNewPostData;
