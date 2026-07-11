const path = require("path");

const nodeEnv = process.argv[2];

require("dotenv").config({
  path: path.join(
    __dirname,
    nodeEnv === "production" ? "../.env.production" : "../.env.local",
  ),
});

const { app } = require("./app.js");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
