const allowedOrigin = ["http://localhost:3000"];
const handleCors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin.toString()); //on this request from this server is allowed for resource to cross origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST"); //method HTTP allowed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Custom-Header",
  ); //custom header must be confiugured
  res.setHeader("Access-Control-Max-Age", "60"); //caching cors headers for 60 seconds
  res.setHeader("Access-Control-Allow-Credentials", "true"); //Without this header explicitly set to "true",
  // the browser will silently discard the session cookie
  if (req.method === "OPTIONS") {
    return res.status(204).send();
  }
  next();
};

module.exports = {
  handleCors,
};
