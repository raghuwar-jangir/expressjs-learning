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

const requireAuth = passport.authenticate("jwt", { session: false });

module.exports = {
  requireAuth,
};
