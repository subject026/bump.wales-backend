const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    pubDate: {
      type: String,
      required: false,
    },
    publisher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "publisher",
      // required: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  PostModel: mongoose.model("post", postSchema),
};
