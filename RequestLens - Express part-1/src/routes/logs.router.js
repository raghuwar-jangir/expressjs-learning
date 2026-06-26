// Routes file just maps URL + method → controller function
const express = require("express");
const { tagsRouter } = require("./tags.router");

const logsController = require("../controllers/logs.controller");

const logsRouter = express.Router();

const { validateLogBody } = require("../middlewares/validateLogBody");

const { getLogById } = require("../store/logs.store");

// ✅ safe — param is registered first, for readability
logsRouter.param("logId", (req, res, next, logId) => {
  const foundLog = getLogById(+logId);
  if (!foundLog) {
    const err = new Error("Log not found");
    err.status = 404;
    return next(err);
  }
  req.log = foundLog;
  next();
});

// param("logId") only fires when :logId is in the route — NOT for /:id routes below.
// Direct log routes use /:id and handle their own existence checks in controllers.
// param("logId") is exclusively for nested tag routes (/:logId/tags) — keeps routers loosely coupled.
logsRouter.get("/", logsController.findAll);
logsRouter.get("/:id", logsController.findOne);
logsRouter.post("/", validateLogBody, logsController.createNewLog);
logsRouter.delete("/:id", logsController.remove);

//further path handling
logsRouter.use("/:logId/tags", tagsRouter);

module.exports = logsRouter;
