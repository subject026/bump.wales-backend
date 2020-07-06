const Model = require("./publisher.model").PublisherModel;
const generateControllers = require("../generateControllers");

const PublisherControllers = generateControllers(Model);

module.exports = PublisherControllers;
