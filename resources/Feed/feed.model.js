const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema(
  {
    data: {
      type: Object,
      required: true,
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
  FeedModel: mongoose.model("feed", feedSchema),
};
