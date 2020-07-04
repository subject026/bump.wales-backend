const mongoose = require("mongoose");

const userFilmMetaSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    filmId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("userFilmMeta", userFilmMetaSchema);
