const { app } = require("./app");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env.local"),
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server is Listening on ${PORT}`);
});
