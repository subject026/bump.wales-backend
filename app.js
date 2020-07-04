const express = require("express");

const setupMiddleware = require("./util/setupMiddleware");
const Router = require("./resources/Router");
const DB = require("./DB");
const expressCallback = require("./util/expressCallback");

const app = express();
setupMiddleware(app);

app.use("/", Router);

// Return 404 if no routes match
app.all(
  "*",
  expressCallback(async () => {
    return {
      statusCode: 404,
      body: {
        errors: ["No resource found at that location!"],
      },
    };
  })
);

app.use((err, req, res) => {
  console.log("\n\nUnhandled error???\n\n", err, "\n\n");
  res.status(500).json({
    errors: [err],
  });
});

DB();

module.exports = app;
