const generateControllers = require("../generateControllers");
const Model = require("./user.model").UserModel;

const UserControllers = generateControllers(Model);

module.exports = UserControllers;
