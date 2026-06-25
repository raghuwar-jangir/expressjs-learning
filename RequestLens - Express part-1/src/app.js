const express = require("express");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");

const { requestTimer } = require("./middlewares/requestTimer");
const { errorHandler } = require("./middlewares/errorHandler");

const logsRouter = require("./routes/logs.router");

const app = express();

//morgan should be top middleware because it will log all the request
app.use(morgan("dev"));

//logs streamer
app.use(
  morgan("tiny", {
    // fs module can create file if doesn't exit but not folder
    stream: fs.createWriteStream(path.join(__dirname, "logs", "access.log"), {
      flags: "a",
    }),
  }),
);

// Static middleware should come after Morgan —
// otherwise static file requests (like loading index.html) won't get logged.
app.use(express.static(path.join(__dirname, "../public")));

//body parsing middleware
app.use(express.json());

// ✅ fix — parse body first, then start time
// Timer should measure only the time your actual route logic takes
//  — not body parsing time.
app.use(requestTimer);

//health check route
app.get("/health", (_, res) => {
  res.send({ status: "ok" });
});

//routes alignment
app.use("/logs", logsRouter);

// add this AFTER all routes, BEFORE errorHandler
app.use((req, res, next) => {
  const err = new Error(`Route ${req.method} ${req.path} not found`);
  err.status = 404;
  next(err);
});

//global error handler
app.use(errorHandler);

module.exports = {
  app,
};
