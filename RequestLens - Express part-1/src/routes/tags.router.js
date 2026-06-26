//tags router

const express = require("express");
const tagsRouter = express.Router({ mergeParams: true });
const tagsController = require("../controllers/tags.controller");

tagsRouter.get("/", tagsController.findAllTags);
tagsRouter.post("/", tagsController.addTag);
tagsRouter.get("/:tagId", tagsController.findOneTag);

module.exports = {
  tagsRouter,
};
