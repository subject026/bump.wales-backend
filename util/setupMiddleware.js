const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const config = require("../config");
const path = require("path");

const parseToken = (req, res, next) => {
  if (req.cookies && req.cookies.token) {
    const token = jwt.verify(req.cookies.token, config.APP_SECRET);
    req.user = { _id: token._id, email: token.email, roles: token.roles };
    return next();
  }
  return next();
};

function SetupMiddleware(app) {
  app.use(express.json());
  app.use(cookieParser());
  if (process.env.MODE === "production") {
    console.log("\n\n\n\n", path.join(__dirname, "../logs/myLogFile.log"));
    let logFile = fs.createWriteStream(
      path.join(__dirname, "../logs/myLogFile.log"),
      {
        flags: "a",
      },
    );
    app.use(morgan({ stream: logFile }));
  }
  if (process.env.MODE === "development") {
    app.use(morgan("dev"));
  }
  const origin = process.env.MODE === "development"
    ? process.env.DEV_FRONTEND_URL
    : process.env.PROD_FRONTEND_URL;

  app.use(
    cors({
      origin,
      credentials: true,
    }),
  );
  app.use(parseToken);
}

module.exports = SetupMiddleware;
