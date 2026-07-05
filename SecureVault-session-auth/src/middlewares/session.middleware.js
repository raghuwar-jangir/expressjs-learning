const session = require("express-session");

const store = session.MemoryStore();

const sessionMiddleware = () =>
  session({
    secret: process.env.SECRET,
    name: "svid",
    cookie: {
      maxAge: 2 * 60 * 60 * 1000, //2 hours
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // because our frontend and backend are different origin,
      // thats why we have CORS. so "none" is right here
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    store,
  });

module.exports = {
  sessionMiddleware,
};
