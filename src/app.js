const express = require("express");
const router = require("./routes/v1");
const httpStatusCode = require("./utils/http-status-code");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", router);

app.use((req, res, next) => {
  res.status(httpStatusCode.NOT_ALLOWED).send("Not Allowed");
  next();
});

module.exports = app;
