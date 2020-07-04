const generateControllers = require("../../util/generateControllers");
const User = require("./user.model").UserModel;

const UserControllers = generateControllers(User);

// module.exports = UserControllers;

const getUser = async (req) => {
  if (!req.user) {
    return {
      statusCode: 200,
      body: {
        user: false,
      },
    };
  }
  try {
    const user = await User.findById({ _id: req.user._id });
    // !!! if user not found return correct code
    return {
      statusCode: 200,
      body: {
        user,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: {
        errors: ["mongoose error"],
      },
    };
  }
};

const getUsers = async (req) => {
  try {
    const docs = await User.find();
    const users = docs.map((user) => {
      return {
        _id: user._id,
        email: user.email,
        roles: user.roles,
      };
    });
    return {
      statusCode: 200,
      body: {
        users,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: {
        error: err,
      },
    };
  }
};

module.exports = { getUser, getUsers };
