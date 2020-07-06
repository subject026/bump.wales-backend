const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    homepage: {
      type: String,
      required: true,
      trim: true,
    },
    rss: {
      type: String,
      required: true,
      trim: true,
    },
    lastFeed: {
      type: [{ type: String }],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  PublisherModel: mongoose.model("publisher", publisherSchema),
};
