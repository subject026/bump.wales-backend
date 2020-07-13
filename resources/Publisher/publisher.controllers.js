const { Publisher } = require('./publisher.model');
const generateControllers = require('../generateControllers');

const PublisherControllers = generateControllers(Publisher);

module.exports = PublisherControllers;
