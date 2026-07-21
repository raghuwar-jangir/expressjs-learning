const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env.local"),
});

const app = require("./src/app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is runnin on http://localhost:${PORT}`);
});
