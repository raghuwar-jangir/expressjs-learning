const express = require("express");
const session = require("express-session");
const path = require("path");

const mode = process.argv[2];

const userdata = {
  name: "Raghuwar",
  password: "123",
};

require("dotenv").config({
  path: path.join(
    __dirname,
    mode === "prod" ? "../.env.production" : "../.env.local",
  ),
});

const app = express();
const PORT = process.env.PORT; // process.env only contain internal env variable.
// not which we write in .env, to make it work, we need .dotenv package

const NODE_ENV = process.env.NODE_ENV;

//write code here------------>

app.use(express.json());
const store = session.MemoryStore(); //default storage for session, will change to redis later

//session middlware
app.use(
  session({
    secret: process.env.SECRET, //used to generate signed session id with signature attached
    cookie: {
      maxAge: 2 * 60 * 60 * 1000, //expire after 2 hours
      sameSite: "lax", //cookies to server from different origin
      secure: false, //development
      // secure: ture, // works on HTTPs only **PRODUCTION**
      // sameSite: "none", //only allowed from same origin, **PRODUCTION**
    },
    resave: false, //don't save session on every request. only save when the session get modified
    saveUninitialized: false, //dont save the empty session in store. save when something added to session
    // store,
  }),
);

const authenticate = (req, res, next) => {
  console.log("req in autheticate>", req.session);
  if (req.session.authenticated) {
    next();
  } else {
    return res.status(403).send("user is unauthorized to see this page");
  }
};

app.get("/", (req, res, next) => {
  console.log("session", req.session);
  req.session.name = "raghu";
  res.send("hello world");
});

app.get("/user", authenticate, (req, res, next) => {
  res.status(200).json(req.session.user);
});

app.post("/login", (req, res, next) => {
  const { password, name } = req.body;
  if (name == userdata.name && password == userdata.password) {
    req.session.authenticated = true;
    req.session.user = userdata;
    return res.status(200).send("successfull logged in");
  }
  return res.status(401).send("wrong credentials!");
});

//listening to server
app.listen(PORT, () => {
  console.log("🚀 ----------------🚀");
  console.log(`🚀 ~ server is listening on ${PORT} >>>`);
  console.log(`🚀 ~ mode on >>> ${NODE_ENV}`);
  console.log("🚀 ----------------🚀");
});
