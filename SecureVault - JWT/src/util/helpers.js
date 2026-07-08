//helpers
const fs = require("fs");
const path = require("path");
const dataFilePath = path.join(__dirname, "../store/refresh-table.json");

const { SignJWT } = require("jose");

const generateToken = async (tokenType, payload, secret) => {
  const token = await new SignJWT({
    ...payload,
    tokenType: tokenType,
  })
    .setProtectedHeader({
      typ: "JWT",
      alg: "HS256",
    })
    .setExpirationTime(tokenType === "access" ? "3m" : "5m")
    .setIssuedAt()
    .sign(secret);

  return token;
};

const generateNewRefreshObject = (token, username) => {
  return {
    token: token,
    username: username,
    device: "browser",
    status: "ACTIVE",
  };
};

const readDatabase = async () => {
  const refreshTableData = await fs.promises.readFile(dataFilePath, "utf-8");
  const data = refreshTableData ? JSON.parse(refreshTableData)["data"] : [];
  return data;
};

const writeDatabase = async (newData) => {
  const writeStream = await fs.createWriteStream(dataFilePath);
  writeStream.write(JSON.stringify({ data: newData }));
  writeStream.end();
};

const generateError = (code, message) => {
  const err = new Error(message);
  err.status = code;
  return err;
};

module.exports = {
  generateToken,
  generateNewRefreshObject,
  readDatabase,
  writeDatabase,
  generateError,
};
