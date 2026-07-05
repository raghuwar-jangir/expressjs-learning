const fs = require("fs");
const morgan = require("morgan");
const path = require("path");

const morganMiddleware = () =>
  morgan("short", {
    stream: fs.createWriteStream(path.join(__dirname, "../logs.txt"), {
      flags: "a",
    }),
  });

module.exports = {
  morganMiddleware,
};
