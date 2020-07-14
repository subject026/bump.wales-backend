const generateAdaptors = require("../generateAdaptors");
const { RequiredParameterError } = require("../../util/errors");

const validateNewPost = (data) => {
  if (!data.url) throw new RequiredParameterError("url");
  if (!data.publisher_id) throw new RequiredParameterError("publisher_id");
};

module.exports = { Post: generateAdaptors("posts", validateNewPost) };
