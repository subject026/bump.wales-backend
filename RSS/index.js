require("dotenv").config();

const DB = require("../DB");
const Publisher = require("../resources/Publisher/publisher.model")
  .PublisherModel;

// const attachFeeds = require("./attachFeeds");
// const generateNewPostData = require("./generateNewPostData");
// const createNewPosts = require("./createNewPosts");
const sendMessage = require("./sendMessage");
const processPublisher = require("./processPublisher");

(async () => {
  const DBConnection = DB();

  console.log("getting publishers...");
  const publishers = await Publisher.find();
  console.log("publishers.length: ", publishers.length);
  // await clearLastFeeds(publishers);
  //
  // parse and attach feeds

  const report = [];

  for (let i = 0; i < publishers.length; i++) {
    const publisher = publishers[i];
    const { newFeedItems, newPosts } = await processPublisher(publisher);
    report.push({
      publisher: publisher.name,
      newFeedItems,
      newPosts,
    });
  }
  console.log(report);
  // const publishersWithFeeds = await attachFeeds(publishers);

  // const { newPostData, newPostDataErrors } = await generateNewPostData(
  //   publishersWithFeeds
  // );

  // console.log("newPostData.length: ", newPostData.length);
  // console.log(
  //   "\n newPostDataErrors: ",
  //   newPostDataErrors && newPostDataErrors.length ? newPostDataErrors : "none."
  // );

  // // create posts
  // console.log("creating new posts...");
  // const { res, errors } = await createNewPosts(newPostData);
  // console.log("done...  posts errors? ", errors);

  // await sendMessage("woo");
  // DBConnection.close();
  // process.exit();
  // return;
})();
