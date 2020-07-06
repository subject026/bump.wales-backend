const Router = require("express").Router();

const AuthControllers = require("./authControllers");
const UserControllers = require("./User/user.controllers");
const PublisherControllers = require(
  "./Publisher/publisher.controllers",
);
const badRequest = require("../util/badRequest");
const expressCallback = require("../util/expressCallback");

const protect = (roles) => {
  return (req, res, next) => {
    if (!roles) throw new Error("need to pass role(s)!!");
    if (!req.user) {
      res.status(401).json({
        errors: ["not logged in"],
      });
      return;
    }
    if (!req.user.roles) {
      res.status(401).json({
        errors: ["user has no roles!"],
      });
      return;
    }
    roles.forEach((role) => {
      if (!req.user.roles.includes(role)) {
        res.status(401).json({
          errors: ["not authorised"],
        });
        return;
      }
    });
    return next();
  };
};

Router.route("/")
  .get(
    expressCallback(async (req) => {
      return {
        statusCode: 200,
        body: {
          bump: "foo lala",
        },
      };
    }),
  )
  .all(expressCallback(badRequest));

Router.route("/signup")
  .post(expressCallback(AuthControllers.signup))
  .all(expressCallback(badRequest));

Router.route("/login")
  .post(expressCallback(AuthControllers.login))
  .all(expressCallback(badRequest));

Router.route("/logout")
  .get(expressCallback(AuthControllers.logout))
  .all(expressCallback(badRequest));

Router.route("/user")
  .get(expressCallback(async (req) => {
    if (!req.user) {
      return {
        statusCode: 200,
        body: {
          user: false,
        },
      };
    }
    console.log(req.user);
    return {
      statusCode: 200,
      body: {
        user: {
          email: req.user.email,
          roles: req.user.roles,
        },
      },
    };
  }))
  .all(expressCallback(badRequest));

Router.route("/users")
  .get(protect(["ADMIN"]), expressCallback(UserControllers.find))
  .all(expressCallback(badRequest));

Router.route("/publishers")
  .get(protect(["ADMIN"]), expressCallback(PublisherControllers.find))
  .post(protect(["ADMIN"]), expressCallback(PublisherControllers.create))
  .delete(protect(["ADMIN"]), expressCallback(PublisherControllers.delete))
  .all(expressCallback(badRequest));

// Router.route("/publisher")
//   .post(protect, expressCallback(UserFilmMetaControllers.createOne))
//   .get(protect, expressCallback(UserFilmMetaControllers.getMany))
//   .put(protect, expressCallback(UserFilmMetaControllers.updateOne))
//   .delete(protect, expressCallback(UserFilmMetaControllers.deleteOne))
//   .all(expressCallback(badRequest));

module.exports = Router;
