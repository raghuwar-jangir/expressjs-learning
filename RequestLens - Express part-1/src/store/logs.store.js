// store.js — owns the DATA

// Knows how the array works
// Knows how to find, add, delete entries
// Has zero knowledge of HTTP — no req, no res

//example log object
// { id: 1, message: "deploy triggered", createdAt: "..." }
const logs = [];

let nextId = 0;
let nextTagId = 0;

const getAllLogs = () => {
  return logs;
};

const getLogById = (id) => {
  const logToFind = logs.find((log) => log.id === id);
  return logToFind;
};

const addLog = (data) => {
  const newLog = {
    id: ++nextId,
    ...data,
    createdAt: new Date().toISOString(),
  };
  logs.push(newLog);
  return newLog;
};

const deleteLog = (id) => {
  const index = logs.findIndex((log) => log.id === id);
  if (index === -1) {
    return null;
  }
  const deletedLog = logs[index];
  logs.splice(index, 1);
  return deletedLog;
};

// patern to follow
// 1. get log
// 2. create new tag
// 3. put that obect in the log
// 4. return updated log
const addLogTag = (logId, tag) => {
  const logIndex = logs.findIndex((item) => item.id === logId);
  //logIndex cannot be "-1" because we already checked its existence in router param
  const log = logs[logIndex];

  const newTagObj = {
    id: ++nextTagId,
    name: tag,
  };
  const updatedLog = {
    ...log,
    tags: log?.tags ? [...log.tags, newTagObj] : [newTagObj],
  };
  logs[logIndex] = updatedLog;
  return logs[logIndex];
};

module.exports = {
  addLog,
  getAllLogs,
  getLogById,
  deleteLog,
  addLogTag,
};
