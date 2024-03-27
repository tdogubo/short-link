const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const router = require("./routes/v1");
const httpStatusCode = require("./utils/http-status-code");

const app = express();

morgan.token("body", function (req) {
  const body = "body: " + JSON.stringify(req.body);
  const params = "params: " + JSON.stringify(req.params);
  return `'${params}' '${body}'`
});

app.use(
  morgan(
    "[:date[clf]] :method HTTP/:http-version :status ':url' :body :response-time ms ':user-agent'"
  )
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use((req, res, next) => {
  res.status(httpStatusCode.NOT_ALLOWED).send("Not Allowed");
  next();
});

module.exports = app;
