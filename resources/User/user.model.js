const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const UserRoles = {
  ADMIN: "ADMIN",
  USER: "USER",
};

module.exports = {
  UserModel: mongoose.model("user", userSchema),
  UserRoles,
};
