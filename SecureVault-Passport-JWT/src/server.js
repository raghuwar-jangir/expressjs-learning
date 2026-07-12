const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env.local"),
});

const { app } = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
