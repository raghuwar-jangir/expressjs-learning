const errorHandler = (err, req, res, next) => {
  return res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
};

module.exports = {
  errorHandler,
};
