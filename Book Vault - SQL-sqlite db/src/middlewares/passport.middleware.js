const createHttpError = require("http-errors");
const passport = require("passport");
const JWT_Strategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const { findUserById } = require("../services/auth.service");

const jwtStrategyHandler = () => {
  return new JWT_Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_SECRET,
    },
    (jwt_payload, done) => {
      //this callback only runs when JWT token is not expired and have valid signature
      try {
        const user = findUserById(jwt_payload.sub); // I used id as subject
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    },
  );
};

passport.use(jwtStrategyHandler());

const requireAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (user) {
      req.user = user;
      return next();
    } else {
      return next(
        createHttpError(401, info?.message || "Unauthorised", {
          code: "UNAUTHORIZED",
        }),
      );
    }
  })(req, res, next); //Remember to pass the Express context objects here
};

module.exports = {
  requireAuth,
};
