const express = require("express");
// const { app } = require("../app.js"); //can't access app here, because it create circular dependency,
// this router is imported in app.js and app is imported here in router File,
// hence => circular dependency

const monstersRouter = express.Router();
const secretRouter = express.Router();

const monsters = {
  hydra: { height: 3, age: 4, secret: "I am human monster" },
  dragon: { height: 200, age: 350, secret: "I am alien monster" },
};

monstersRouter.use("/:name", secretRouter);
monstersRouter.param("name", (req, res, next, value) => {
  req.name = value;
  next();
});

secretRouter.get("/secret", (req, res, next) => {
  console.log("name of monster >>", req.name);
  res.send(monsters[req.name].secret);
});

monstersRouter.get("/", (req, res, next) => {
  setTimeout(() => {
    return res.status(200).json(monsters);
  }, 1000);
});

monstersRouter.get("/:name", (req, res, next) => {
  console.log("this monster router running");
  next();
  // const monster = monsters[req.params.name];
  // if (monster) {
  //   return res.status(200).send(monster);
  // }
  // return res.status(404).send("monster not found");
});

monstersRouter.put("/:name", (req, res) => {
  if (monsters[req.params.name]) {
    monsters[req.params.name]["age"] = Number(req.query.age);
    return res.status(200).send(monsters[req.params.name]);
  } else {
    return res.status(404).send("monster not found");
  }
});

monstersRouter.post("/", (req, res) => {
  const newMonster = req.query;
  monsters[req.query.name] = {
    height: Number(newMonster.height),
    age: Number(newMonster.age),
  };
  return res.status(201).send(monsters[newMonster.name]);
});

monstersRouter.delete("/:name", (req, res, next) => {
  if (monsters[req.params.name]) {
    delete monsters[req.params.name];
    return res.status(204).send();
  } else {
    return res.status(404).send("monster not found");
  }
});

module.exports = monstersRouter;
