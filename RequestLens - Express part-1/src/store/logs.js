// store.js — owns the DATA

// Knows how the array works
// Knows how to find, add, delete entries
// Has zero knowledge of HTTP — no req, no res

//example log object
// { id: 1, message: "deploy triggered", createdAt: "..." }
const logs = [];

const getAllLogs = () => {
  return logs;
};

const getLogById = (id) => {
  const logToFind = logs.find((log) => log.id === id);
  return logToFind;
};

let nextId = 0;
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

module.exports = {
  addLog,
  getAllLogs,
  getLogById,
  deleteLog,
};
