// Routes file just maps URL + method → controller function
const express = require("express");

const logsController = require("../controllers/logs.controller");

const logsRouter = express.Router();

const { validateLogBody } = require("../middlewares/validateLogBody");

logsRouter.get("/", logsController.findAll);
logsRouter.get("/:id", logsController.findOne);
logsRouter.post("/", validateLogBody, logsController.createNewLog);
logsRouter.delete("/:id", logsController.remove);

module.exports = logsRouter;
