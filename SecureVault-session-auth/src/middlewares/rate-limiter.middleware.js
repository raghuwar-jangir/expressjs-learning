let ipMap = {};
let timeoutIdMap = {};

const MAXREQUEST = 10;
const resetTime = 20;

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  if (ipMap[ip] !== MAXREQUEST) {
    ipMap[ip] = (ipMap[ip] || 0) + 1;
    next();
  } else {
    const err = new Error("Too many request");
    err.status = 429;
    next(err);
  }
  if (!timeoutIdMap[ip]) {
    timeoutIdMap[ip] = setTimeout(() => {
      ipMap[ip] = 0;
      timeoutIdMap[ip] = null;
    }, resetTime * 1000);
  }
};

module.exports = {
  rateLimiter,
};
