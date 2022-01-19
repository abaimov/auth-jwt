const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const authRoute = require("./routes/auth");
const key = require("./key/index");

mongoose
  .connect(key.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("----conneсt mongodb success----"))
  .catch((e) => {
    console.log(e);
  });

app.use(passport.initialize());
app.use(require("morgan")("dev"));

//parse json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(require("cors")());

app.use("/api/auth", authRoute);

module.exports = app;
