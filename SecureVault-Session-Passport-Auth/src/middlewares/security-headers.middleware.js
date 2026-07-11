const securityHeaders = (_, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff"); //prevents browser from guessing and execute malicious mime file
  //   res.setHeader("X-Frame-Options", "DENY"); //prevents iframing -> clickjacking // set on frontend server
  res.setHeader("X-XSS-Protection", "0"); // for older browser, value 0 means not to apply this header as it is buggy

  //it convert http url https automatically after https url is visited even for once
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    ); // not for development mode. // set on nginx code for both frontend and backend
  }
  res.setHeader("Content-Security-Policy", "default-src 'self'"); //prevent browser to load content from unknown sources, set on frontend server
  next();
};

module.exports = {
  securityHeaders,
};
