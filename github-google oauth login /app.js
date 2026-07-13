const express = require("express");
const app = express();
const passport = require("passport");
require("dotenv").config();
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github").Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4001/auth/google/callback",
    },
    (accessToken, RefreshToken, profile, done) => {
      done(null, profile);
    },
  ),
);
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:4001/auth/github/callback",
    },
    (accessToken, RefreshToken, profile, done) => {
      done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(
  session({
    secret: "session_secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Login</title>
              <style>
                  body {
                      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      margin: 0;
                      background-color: #f9f9f9;
                  }
                  .login-container {
                      text-align: center;
                      padding: 2rem;
                      background: white;
                      border-radius: 8px;
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                  }
                  h2 {
                      margin-bottom: 1.5rem;
                      color: #333;
                  }
                  .btn {
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      width: 220px;
                      padding: 12px;
                      margin: 10px auto;
                      font-size: 16px;
                      font-weight: 600;
                      border: none;
                      border-radius: 4px;
                      cursor: pointer;
                      text-decoration: none;
                      transition: background-color 0.2s;
                  }
                  .btn-github {
                      background-color: #24292e;
                      color: white;
                  }
                  .btn-github:hover {
                      background-color: #555;
                  }
                  .btn-google {
                      background-color: #ffffff;
                      color: #757575;
                      border: 1px solid #ddd;
                  }
                  .btn-google:hover {
                      background-color: #f5f5f5;
                  }
              </style>
          </head>
          <body>
  
              <div class="login-container">
                  <h2>Welcome Back</h2>
                  
                  <!-- Replace /auth/github with your actual backend authentication route -->
                  <a href="/auth/github" class="btn btn-github">
                      Login with GitHub
                  </a>
                  
                  <!-- Replace /auth/google with your actual backend authentication route -->
                  <a href="/auth/google" class="btn btn-google">
                      Login with Google
                  </a>
              </div>
  
          </body>
          </html>
      `);
});

app.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user"],
  }),
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/",
    successRedirect: "/profile",
  }),
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/profile",
  }),
);

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

app.get("/profile", checkAuth, (req, res) => {
  res.render("account", { user: req.user });
});

app.listen(4001, () => {
  console.log("server is listening");
});
