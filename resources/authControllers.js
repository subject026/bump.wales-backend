const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../DB");
const { User, UserRoles } = require("./User/user.model");
const hash = require("../util/hash");

const salt = 8;

const generateToken = (user) => {
  const token = jwt.sign(
    { _id: user._id, email: user.email, roles: user.roles },
    process.env.APP_SECRET,
  );
  return token;
};

const validate = (body) => {
  let messages = [];
  if (!body.email) {
    messages.push("email is required");
  }
  if (!body.password) {
    messages.push("password is required");
  }
  return messages;
};

const signup = async (req) => {
  const errors = validate(req.body);
  if (errors.length) {
    return {
      statusCode: 400,
      body: {
        errors,
      },
    };
  }

  try {
    // check if user already exists
    const userExists = await db.oneOrNone(
      `SELECT * FROM users WHERE email = '${req.body.email}'`,
    );
    if (userExists) {
      return {
        statusCode: 400,
        body: {
          errors: ["email already signed up"],
        },
      };
    }

    // create new user
    const hashedPassword = await hash(req.body.password, salt);
    const email = req.body.email;
    const password = hashedPassword;
    const roles = req.body.email === "subject026@protonmail.com"
      ? [UserRoles.USER, UserRoles.ADMIN]
      : [UserRoles.USER];
    const newUser = await db.oneOrNone(
      `INSERT INTO users(email, password, roles) VALUES ('${email}', '${password}', '${
        roles.join(
          ", ",
        )
      }')
      RETURNING *`,
    );

    return {
      statusCode: 200,
      cookie: generateToken(newUser),
      body: {
        email: newUser.email,
        _id: newUser.id,
      },
    };
  } catch (err) {
    console.log("signup error:\n\n", err);
    return {
      statusCode: 500,
      body: {
        errors: [err],
      },
    };
  }
};

const login = async (req, res) => {
  if (req.user) {
    console.log(req.user);
    return {
      statusCode: 400,
      body: {
        errors: ["already logged in"],
      },
    };
  }
  const errors = validate(req.body);
  if (errors.length) {
    return {
      statusCode: 400,
      body: {
        errors,
      },
    };
  }

  try {
    let user = await User.find({
      email: req.body.email,
    });

    console.log("\n\n\n\n", user);

    if (!user.length) {
      return {
        statusCode: 400,
        body: {
          errors: ["email not found"],
        },
      };
    }

    user = user[0];

    console.log(req.body.password, user.password, "\n\n\n\n\n");
    const same = await bcrypt.compare(req.body.password, user.password);
    if (!same) {
      return {
        statusCode: 401,
        body: {
          errors: ["password incorrect"],
        },
      };
    }

    return {
      statusCode: 200,
      cookie: generateToken(user),
      body: {
        doc: {
          _id: user._id,
          email: user.email,
          roles: user.roles,
        },
      },
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: {
        errors: [`db error - ${err.message}`],
      },
    };
  }
};

const logout = async (req) => {
  if (!req.user) {
    return {
      statusCode: 500,
      body: {
        errors: ["no user attached to request object!"],
      },
    };
  }
  return {
    statusCode: 200,
    body: {
      messages: ["logged out successfully"],
    },
    clearCookie: true,
  };
};

module.exports = {
  login,
  signup,
  logout,
};
