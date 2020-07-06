const Model = require("./post.model");
const generateControllers = require("../generateControllers");

const PostControllers = generateControllers(Model);

module.exports = PostControllers;
