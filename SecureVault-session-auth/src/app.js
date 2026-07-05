//app.js === raw server file
const express = require("express");
const {
  securityHeaders,
} = require("./middlewares/security-headers.middleware");

const name = "raghuwar";
const pass = "1234";

const { handleCors } = require("./middlewares/cors.middleware");
const { morganMiddleware } = require("./middlewares/morgan.middleware");
const { sessionMiddleware } = require("./middlewares/session.middleware");
const { errorHandler } = require("./middlewares/errorhandler.middleware");
const {
  authenticationHandler,
} = require("./middlewares/authenticate.middlware");
const { rateLimiter } = require("./middlewares/rate-limiter.middleware");

const app = express();
app.set("trust proxy", true); //for getting ip address

app.use(morganMiddleware());
app.use(express.json());
app.use(securityHeaders);
app.use(handleCors);
app.use(sessionMiddleware());

app.get("/", (req, res, next) => {
  res.send("hello world");
});

app.get("/private-route", authenticationHandler, (req, res, next) => {
  res.json({
    user: req.session.user,
    loggedin: req.session.authenticated || false,
  });
});

app.post("/login", rateLimiter, (req, res, next) => {
  const { username, password } = req.body;
  if (username === name && password === pass) {
    req.session.regenerate((err) => {
      if (err) {
        return next(err);
      } else {
        req.session.authenticated = true;
        req.session.user = {
          username,
          password,
        };
        req.session.save((err) => {
          if (err) return next(err);
          return res.status(200).send("successfully logged in");
        });
      }
    });
  } else {
    const err = new Error("Invalid Credentials");
    err.status = 401;
    next(err);
  }
});

app.post("/logout", (req, res, next) => {
  if (req.session.authenticated) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        res.clearCookie("svid");
        res.status(204).send();
      }
    });
  } else {
    res.status(400).send("already logged out!");
  }
});

app.use(errorHandler);

module.exports = {
  app,
};
