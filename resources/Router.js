const Router = require("express").Router();

const AuthControllers = require("../util/authControllers");
const UserControllers = require("./User/user.controllers");
const UserFilmMetaControllers = require(
  "./UserFilmMeta/userFilmMeta.controllers",
);
const badRequest = require("../util/badRequest");
const expressCallback = require("../util/expressCallback");

const protect = (roles) => {
  return (req, res, next) => {
    if (!roles) throw new Error("need to pass role(s)!!");
    roles.forEach((role) => {
      if (!req.user.roles.contains(role)) {
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
          bump: "yeaaaa",
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

Router.route("/users")
  .get(protect(["ADMIN"]), expressCallback(UserControllers.getUsers))
  .all(expressCallback(badRequest));

// Router.route("/publisher")
//   .post(protect, expressCallback(UserFilmMetaControllers.createOne))
//   .get(protect, expressCallback(UserFilmMetaControllers.getMany))
//   .put(protect, expressCallback(UserFilmMetaControllers.updateOne))
//   .delete(protect, expressCallback(UserFilmMetaControllers.deleteOne))
//   .all(expressCallback(badRequest));

module.exports = Router;
