const path = require("path");

const NODE_ENV = process.env.NODE_ENV;

require("dotenv").config({
  path: path.join(
    __dirname,
    NODE_ENV == "test" ? "./.env.test" : "./.env.local",
  ),
});
const app = require("./src/app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is runnin on http://localhost:${PORT}`);
});
