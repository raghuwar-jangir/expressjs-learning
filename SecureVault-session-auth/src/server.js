//server.js
// 1. this file is to turn on the raw server, it is the entry point of our app
//** when we require a file, it get executed, try it */
// require("./wow"); //<-----

const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env.local"),
});

const { app } = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
