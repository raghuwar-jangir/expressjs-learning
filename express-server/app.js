const express = require("express");
const fs = require("fs");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const errorhandler = require("errorhandler");
const app = express();
//  if middleware fails, they doesn't throw the error, but passess request to next
// if success full it does sends the response and end the request automaticallY

//middlewares
app.use(express.static("public"));

app.use(
  morgan("tiny", {
    //streaming logs in file
    stream: fs.createWriteStream("./app.log", { flags: "a" }),
  }),
);

// //random middleware
// app.use(["/beans", "/beans/:id"], (req, res, next) => {
//   console.log("request  arrived!");
//   next();
// });

app.use(bodyParser.json());

//auth middileware
const checkAuth = (req, res, next) => {
  console.log("authentication checking");
  if (req.params.name === "raghuwar") {
    next();
  } else {
    const error = new Error("Unauthorized");
    error.status = 401;
    return next(error);
  }
};

app.get("/beans", (_, res, next) => {
  res.send("hello world");
});

app.post("/beans", (req, res) => {
  let body = "";
  let chunk = 1;

  //runs in poll phase and this process is so much faster
  // that all the callbacks are availalbe in phase, hence all get executed together.
  req.on("data", (data) => {
    //data will be broken into chunks each of size 64kb
    console.log("chunk no.", chunk);
    console.log("chunk length", data.length);
    console.log("chunk>>", data.toString().slice(0, 10));
    console.log();
    body += data;
    chunk++;
  });

  setTimeout(() => {
    console.log("timeout log log");
  }, 0);

  //run in check phase
  setImmediate(() => {
    console.log("Immediate log");
  });

  //still in check phase and execute this too
  setImmediate(() => {
    console.log("Immediate log");
  });
  //run in poll phase, just after req.on('data') event completed
  req.on("end", () => {
    // console.log("body is ", body);
    res.send();
  });
});

app.get("/beans/:name", checkAuth, (_, res, next) => {
  if (Math.random() > 0.5) {
    return res.send();
  } else {
    const err = new Error("Number is lower than 0.5");
    err.status = 400;
    return next(err);
  }
});

app.post("/beans/:name", (req, res) => {
  console.log("req.body>>> ", req.body);
  console.log("hello");
  res.send();
});

// //custom logger function for response
// app.use(["/beans", "/beans/:id"], (req, res, next) => {
//   console.log("response sent successfull");
// });

// // custom error logger
// app.use((err, req, res, next) => {
//   res.status(err.status || 500).send(err.message);
//   console.error(err);
//   return;
// });

app.use(errorhandler());

const monstersRouter = require("./routers/monsters.js");
app.use("/monsters", monstersRouter);

module.exports = {
  app,
};
