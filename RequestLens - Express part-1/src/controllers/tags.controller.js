//tags controller

const { addLogTag } = require("../store/logs.store");

const findAllTags = (req, res, next) => {
  return res.status(200).send(req.log?.tags || []);
};
const findOneTag = (req, res, next) => {
  const found = req.log?.tags?.find((tag) => tag.id === +req.params.tagId);
  if (!found) {
    const err = new Error("Tag not found");
    err.status = 404;
    return next(err);
  }
  return res.status(200).send(found);
};

const addTag = (req, res, next) => {
  return res.status(201).send(addLogTag(req.log.id, req.body.tag));
};

module.exports = {
  findAllTags,
  findOneTag,
  addTag,
};
