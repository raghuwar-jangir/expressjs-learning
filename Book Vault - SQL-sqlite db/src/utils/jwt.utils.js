//this files contains helper functions which knows HOW to do a generic task, doesn't know WHY or WHEN it's being used.

const { SignJWT, jwtVerify } = require("jose");

const access_secret = new TextEncoder().encode(process.env.ACCESS_SECRET);
const refresh_secret = new TextEncoder().encode(process.env.REFRESH_SECRET);

const generateAccessToken = async (payload) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({
      typ: "JWT",
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("15m")
    .setIssuer("bookvault-api")
    .sign(access_secret);

  return token;
};

const generateRefreshToken = async (payload) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({
      typ: "JWT",
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("24h")
    .setIssuer("bookvault-api")
    .sign(refresh_secret);

  return token;
};

const verifyAccesToken = async (token) => {
  return await jwtVerify(token, access_secret);
};
const verifyRefreshToken = async (token) => {
  return await jwtVerify(token, refresh_secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccesToken,
  verifyRefreshToken,
};
