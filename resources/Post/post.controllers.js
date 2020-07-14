const { Post } = require("./post.model");
const generateControllers = require("../generateControllers");

const PostControllers = generateControllers(Post);

module.exports = PostControllers;
