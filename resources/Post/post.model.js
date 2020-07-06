const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    pubDate: {
      type: String,
      required: true,
    },
    publisher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "publisher",
      // required: true
    },
    publisherName: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = {
  PostModel: mongoose.model("post", postSchema),
};
