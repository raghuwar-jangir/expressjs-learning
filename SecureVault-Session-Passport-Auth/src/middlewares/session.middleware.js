const session = require("express-session");

const store = session.MemoryStore();

const sessionHandler = () => {
  return session({
    secret: process.env.SESSION_SECRET,
    name: "svid",
    cookie: {
      maxAge: 2 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax", //for different site (different domain), cookies saved in browser will tackup only with navigation and GET request,
      //not with any other type of request like "POST", "PUT", "DELETE", request
    },
    resave: false,
    saveUninitialized: false,
    store,
  });
};

module.exports = {
  sessionHandler,
};
