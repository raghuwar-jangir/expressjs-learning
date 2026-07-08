//app.js
const express = require("express");
const fs = require("fs");

const { SignJWT, jwtVerify, errors } = require("jose");
const cookieParser = require("cookie-parser");
const argon2 = require("argon2");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env.local"),
});

const { database } = require("./store/data.store");
const {
  generateToken,
  generateNewRefreshObject,
  readDatabase,
  writeDatabase,
  generateError,
} = require("./util/helpers");

const app = express();
const access_secret = new TextEncoder().encode(process.env.ACCESS_SECRET); //Uint8Array needed
const refresh_secret = new TextEncoder().encode(process.env.REFRESH_SECRET); //Uint8Array needed
///////////////////////------------->>>>>>>>>>>
app.use(express.json());
app.use(cookieParser());

app.get("/register", (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Register</title>
  
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
              const response = await fetch("http://localhost:4001/register", {
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
              result.textContent = "Successfully Registered ✅";
            } catch (error) {
              result.textContent = "Error: " + error.message;
            }
          });
        </script>
      </body>
      </html>
    `);
});

const validate = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return next(generateError(401, "Enter both username and password"));
  } else {
    if (database[req.body.username]) {
      return next(generateError(409, "User Does not exist!"));
    }
    return next();
  }
};

app.post("/register", validate, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    database[username] = {
      username,
      password: hashedPassword,
    };
    return res.status(201).json({ message: "User Created Successfully!" });
  } catch (error) {
    return next(generateError(500, "Internal Server Error"));
  }
});

app.get("/login", (req, res) => {
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
              result.textContent = data.message;
            } catch (error) {
              result.textContent = "Error: " + error.message;
            }
          });
        </script>
      </body>
      </html>
    `);
});

app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!database[username]) {
    return next(generateError(401, "User does not exist!"));
  }
  console.log("database>>", database);

  const passWordmatching = await argon2.verify(
    database[username].password,
    password,
  );

  // argon2.verify(storedHash, plainPassword);

  if (passWordmatching) {
    const accessToken = await generateToken(
      "access",
      {
        username,
      },
      access_secret,
    );

    const refreshToken = await generateToken(
      "refresh",
      {
        username,
      },
      refresh_secret,
    );

    const data = await readDatabase();

    const newRefreshObj = generateNewRefreshObject(refreshToken, username);

    const newData = [...data, newRefreshObj];

    await writeDatabase(newData);

    res.cookie("accessToken", accessToken, {
      maxAge: 3 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged in Successfully" });
  } else {
    next(generateError(401, "Invalid Credentials"));
    return;
  }
});

app.get("/refresh", async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      const valid = await jwtVerify(refreshToken, refresh_secret);
      const data = await readDatabase();

      const oldRefreshIndex = data.findIndex(
        (item) => item.token === refreshToken,
      );

      if (oldRefreshIndex === -1) {
        next(generateError(404, "Refresh Token not found"));
        return;
      }

      const oldRefreshToken = data[oldRefreshIndex];

      if (oldRefreshToken?.status === "ACTIVE") {
        console.log("valid", valid);
        const newAccessToken = await generateToken(
          "access",
          {
            username: valid.payload.username,
          },
          access_secret,
        );
        const newRefreshToken = await generateToken(
          "refresh",
          {
            username: valid.payload.username,
          },
          refresh_secret,
        );

        const newRefreshObj = generateNewRefreshObject(
          newRefreshToken,
          valid.payload.username,
        );

        data[oldRefreshIndex] = { ...oldRefreshToken, status: "ROTATED" };
        const newData = [...data, newRefreshObj];
        await writeDatabase(newData);

        res.cookie("accessToken", newAccessToken, {
          maxAge: 3 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
        });
        res.cookie("refreshToken", newRefreshToken, {
          maxAge: 5 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
        });
        res.status(200).send({
          message: "Sent new Refresh token",
        });
      } else if (oldRefreshToken?.status === "ROTATED") {
        const newData = data.filter(
          (item) => item.username !== valid.payload.username,
        );
        await writeDatabase(newData);

        next(generateError(403, "Attack alert"));
        return;
      } else if (oldRefreshToken?.status === "REVOKED") {
        next(generateError(401, "User made Logout"));
        return;
      }
    } catch (error) {
      console.error(error);
      if (error.code === "ERR_JWT_EXPIRED") {
        return next(generateError(401, "Refresh Token Expired"));
      } else {
        return next(generateError(500, "Internal Server Error"));
      }
    }
  } else {
    return next(generateError(400, "Token Expired"));
  }
});

app.get("/logout", async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(generateError(401, "Token Expired"));
  }
  const data = await readDatabase();
  const refreshingIndex = data.findIndex((item) => item.token === refreshToken);

  if (refreshingIndex === -1) {
    return next(generateError(404, "Refresh Token Not Found"));
  }

  data[refreshingIndex] = {
    ...data[refreshingIndex],
    status: "REVOKED",
  };

  await writeDatabase(data);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).send({
    message: "logged out",
  });
});

//private route
const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    try {
      const valid = await jwtVerify(accessToken, access_secret);
      return next();
    } catch (error) {
      if (error.code === "ERR_JWT_EXPIRED") {
        return next(generateError(401, "Unauthorized"));
      }
      return next(error);
    }
  } else {
    return next(generateError(401, "Token Expired"));
  }
};

app.get("/private-route", authenticate, (req, res, next) => {
  res.status(200).json({
    message: database.privateInfo,
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.status || 500;
  return res.status(status).json({
    status,
    message: err.message || "Internal Server Error",
  });
});

module.exports = { app };
