const express = require("express");

const { errorHandler } = require("./middlewares/error-handler.middleware");
const generateError = require("http-errors");
const app = express();

app.get("/", () => {
  res.send("helllo world");
});

app.use((req, res, next) => {
  next(generateError(404, "Not Found"));
});

app.use(errorHandler);

module.exports = {
  app,
};
