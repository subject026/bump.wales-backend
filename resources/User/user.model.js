const generateAdaptors = require("../generateAdaptors");
const { RequiredParameterError } = require("../../util/errors");

const validateNewUser = (data) => {
  if (!data.email) throw new RequiredParameterError("email");
  if (!data.password) throw new RequiredParameterError("password");
};

const UserRoles = {
  USER: "USER",
  PUBLISHER: "PUBLISHER",
  ADMIN: "ADMIN",
};

module.exports = {
  User: generateAdaptors("users", validateNewUser),
  UserRoles,
};
