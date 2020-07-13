const generateAdaptors = require('../generateAdaptors');
const { RequiredParameterError } = require('../../util/errors');

const validateNewPublisher = (data) => {
  if (!data.name) throw new RequiredParameterError('name');
  if (!data.homepage) throw new RequiredParameterError('homepage');
  if (!data.rss) throw new RequiredParameterError('rss');
};

module.exports = {
  Publisher: generateAdaptors('publishers', validateNewPublisher),
};
