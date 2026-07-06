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

app.get("/landing", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f4f4f4;
          margin: 0;
        }

        .login-container {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          width: 320px;
        }

        h2 {
          margin-bottom: 20px;
          text-align: center;
        }

        input {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          box-sizing: border-box;
        }

        button {
          width: 100%;
          padding: 10px;
          cursor: pointer;
        }

        #result {
          margin-top: 12px;
          white-space: pre-wrap;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h2>Login</h2>

        <form id="loginForm">
          <input
            type="text"
            id="username"
            placeholder="Username"
            required
          />

          <input
            type="password"
            id="password"
            placeholder="Password"
            required
          />

          <button type="submit">Login</button>
        </form>

        <div id="result"></div>
      </div>

      <script>
        const form = document.getElementById("loginForm");
        const result = document.getElementById("result");
        form.addEventListener("submit", async (e) => {
          e.preventDefault();

          const username = document.getElementById("username").value;
          const password = document.getElementById("password").value;

          try {
            const response = await fetch("http://localhost:4001/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              credentials: "include",
              body: JSON.stringify({
                username,
                password
              })
            });

            const data = await response.json();
            result.textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            result.textContent = "Error: " + error.message;
          }
        });
      </script>
    </body>
    </html>
  `);
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
          // return res.redirect("/private-route");
          return res.status(200).json("successfully logged in");
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
