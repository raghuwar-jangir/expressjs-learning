const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const createError = require("http-errors");

//import routers
const authRouter = require("./routes/auth.route");
const booksRouter = require("./routes/books.route");
const { errorHandler } = require("./middlewares/error-handler.middleware");
const { requireAuth } = require("./middlewares/passport.middleware"); //clean passport jwt integration

const app = express();

// --- global middlewares ---
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// --- routes ---
app.get("/", (req, res, next) => {
  res.send("hello world");
});
app.use("/auth", authRouter);
app.use("/books", requireAuth, booksRouter);

// --- 404 handler ---
app.use((req, res, next) => {
  next(
    createError(404, "Not Found", {
      code: "NOT_FOUND",
    }),
  );
});

// --- global error handler (always last) ---
app.use(errorHandler);

module.exports = app;
