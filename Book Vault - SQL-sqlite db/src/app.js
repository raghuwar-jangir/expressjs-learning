const express = require("express");

const createError = require("http-errors");

const app = express();

//ROUTERS
const { authRouter } = require("./routes/auth.route");

//import middlewares
const { errorHandler } = require("./middlewares/error-handler.middleware");

/////////////

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("hello world");
});

app.use("/auth", authRouter);
/////////////
app.use((req, res, next) => {
  next(
    createError(404, "Not Found", {
      code: "NOT_FOUND",
    }),
  );
});

app.use(errorHandler);

module.exports = app;
