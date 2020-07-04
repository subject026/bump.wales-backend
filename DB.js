const mongoose = require("mongoose");

const config = require("./config");

module.exports = () => {
  mongoose
    .connect(config.DB_URL, {
      useNewUrlParser: true
      // useUnifiedTopology: true
    })
    .then(
      () =>
        process.env.MODE !== "test" && console.log("The mongoose has landed")
    )
    .catch(err => console.log(err));

  mongoose.connection.on("error", err => console.log(err));
};
