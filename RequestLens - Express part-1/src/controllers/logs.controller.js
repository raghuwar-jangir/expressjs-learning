// controller.js — owns the HTTP

// Reads req.body
// Calls store functions
// Sends res.json() back
// Has zero knowledge of how data is stored

const {
  addLog,
  getAllLogs,
  getLogById,
  deleteLog,
} = require("../store/logs.store");

const findAll = (req, res) => {
  const data = getAllLogs();
  return res.status(200).send(data);
};

const findOne = (req, res, next) => {
  const id = req.params.id;
  const data = getLogById(+id);
  if (data) {
    return res.status(200).send(data);
  } else {
    const err = new Error("Log not found");
    err.status = 404;
    return next(err);
  }
};

const createNewLog = (req, res) => {
  const data = addLog(req.body);
  return res.status(201).send(data);
};

const remove = (req, res, next) => {
  const id = req.params.id;
  const data = deleteLog(+id);
  if (data) {
    return res.status(200).send(data);
  } else {
    const err = new Error("Log not found");
    err.status = 404;
    return next(err);
  }
};

module.exports = {
  findAll,
  findOne,
  remove,
  createNewLog,
};
