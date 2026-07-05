const authenticationHandler = (req, res, next) => {
  if (req.session.authenticated) {
    return next();
  } else {
    const err = new Error("Unauthorised User");
    err.status = 403;
    next(err);
  }
};

module.exports = {
  authenticationHandler,
};
