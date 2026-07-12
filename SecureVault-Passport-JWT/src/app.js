const express = require("express");
const app = express();
//passport related
const passport = require("passport");
const JWT_Strategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const { SignJWT } = require("jose");

const options = {};

const JWT_SECRET = new TextEncoder().encode(process.env.SECRET);

app.use(express.json());

passport.use(
  new JWT_Strategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (jwt_payload, done) => {
      if (
        jwt_payload.name === "raghuwar" &&
        jwt_payload.role === "SuperHuman"
      ) {
        done(null, { name: jwt_payload.name, role: jwt_payload.role });
      } else {
        done(null, false);
      }
    },
  ),
);

app.post("/login", async (req, res) => {
  const { username } = req.body;
  const userPayload = {
    name: username,
    role: "SuperHuman",
  };
  const token = await new SignJWT(userPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SECRET);

  res.send(token);
});

app.get(
  "/private-route",
  (req, _, next) => {
    next();
  },
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  },
);

module.exports = {
  app,
};
