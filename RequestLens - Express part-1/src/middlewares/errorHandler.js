//4 params is mandatory, Express won't treat it as error middleware otherwise
const errorHandler = (err, req, res, next) => {
  const code = err?.status || 500;
  return res.status(code).send({
    error: err.message,
    status: code,
  });
};

module.exports = {
  errorHandler,
};
