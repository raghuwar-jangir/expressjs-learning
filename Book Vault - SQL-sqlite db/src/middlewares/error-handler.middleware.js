const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.status || 500;

  const message = err.status ? err.message : "Internal Server Error";
  const code = err.status ? err.code || "ERROR" : "INTERNAL_ERROR";

  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      ...(err.details ? { detail: err.details[0].message } : {}),
    },
  });
};

module.exports = {
  errorHandler,
};
