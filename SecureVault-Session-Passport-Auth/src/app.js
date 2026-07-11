const express = require("express");
const app = express();
const createError = require("http-errors");

const database = {
  sam: {
    username: "sam",
    password:
      "$argon2id$v=19$m=65536,t=3,p=4$qS0bqcL8CDcwxEvC7Mw9qA$hlUXOtY6oRzTmvGX51SBf8ejcBfFbm2SosjSmJ/KZDc", //1234
  },
};

const { sessionHandler } = require("./middlewares/session.middleware");
const { errorHandler } = require("./middlewares/error-handler.middleware");
const passport = require("passport");
const { checkAuth } = require("./middlewares/check-auth.middleware");
const argon = require("argon2");
const LocalStrategy = require("passport-local").Strategy;

//global middlewares
app.use(sessionHandler());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = database[username];
    if (!user) return done(createError(409, "User Doesn't Exist"));
    const hashed = await argon.hash(password);
    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) return done(createError(401, "Invalid Credentials"));
    return done(null, user);
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  const user = database[username];
  done(null, user);
});

app.get("/", (req, res) => {
  res.send("hello world landing page");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res, next) => {
    res.send("successfull");
  },
);

app.get("/profile", checkAuth, (req, res) => {
  res.status(201).json(req.user);
});

app.get("/logout", checkAuth, (req, res, next) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.post("/hashme", async (req, res) => {
  const { value } = req.body;
  const hashedValue = await argon.hash(value);
  res.send(hashedValue);
});

app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

app.use(errorHandler);

module.exports = { app };
