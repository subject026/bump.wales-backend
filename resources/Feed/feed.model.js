const generateAdaptors = require("../generateAdaptors");
const { RequiredParameterError } = require("../../util/errors");

const validateNewFeed = (data) => {
  if (!data.data) throw new RequiredParameterError("feed data");
  if (!data.publisher_id) throw new RequiredParameterError("publisher_id");
};

module.exports = { Feed: generateAdaptors("feeds", validateNewFeed) };
