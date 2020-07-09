require("dotenv").config();

const Publisher = require("../resources/Publisher/publisher.model")
  .PublisherModel;
const DB = require("../DB");

const clearLastFeeds = async (publishers) => {
  // console.log(publishers);
  return Promise.all(
    publishers.map(async (publisher) => {
      console.log(publisher.name, "  ", publisher.lastFeed.length);
      try {
        const res = await Publisher.findOneAndUpdate(
          { _id: publisher._id },
          { lastFeed: [] }
        );
      } catch (err) {
        console.log(err);
      }
    })
  );
};

const connection = DB();

const init = async () => {
  try {
    const publishers = await Publisher.find();

    await clearLastFeeds(publishers);
    return;
  } catch (err) {
    console.log(err);
    return;
  }
};

init()
  .then(() => {
    connection.close();
    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });
