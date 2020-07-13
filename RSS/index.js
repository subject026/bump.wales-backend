require("dotenv").config();

const db = require("../DB");
const { Publisher } = require("../resources/Publisher/publisher.model");

// const attachFeeds = require("./attachFeeds");
// const generateNewPostData = require("./generateNewPostData");
// const createNewPosts = require("./createNewPosts");
const { sendMessage } = require("./sendMessage");
const processPublisher = require("./processPublisher");
const { getReport } = require("./report");

(async () => {
  // const DBConnection = DB();

  console.log("getting publishers...");
  const publishers = await Publisher.find();
  console.log("publishers.length: ", publishers.length);
  // await clearLastFeeds(publishers);
  //
  // parse and attach feeds

  // const report = [];

  for (let i = 0; i < publishers.length; i++) {
    const publisher = publishers[i];
    await processPublisher(publisher);
  }
  // const publishersWithFeeds = await attachFeeds(publishers);
  const report = getReport();

  //
  console.log("report.newLinks.length", report);
  console.log("report.newLinks", report.newLinks);
  if (report.newLinks.length) sendMessage(report);
})();
