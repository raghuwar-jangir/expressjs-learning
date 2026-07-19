const errorHandler = (err, req, res, next) => {
  const code = err?.status || 500;
  const message = err.message || "Internal Server Error";
  return res.status(code).json({
    status: code,
    message: message,
  });
};

module.exports = {
  errorHandler,
};
