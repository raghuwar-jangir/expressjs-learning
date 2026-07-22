const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, "Password should be minimum 4 char long"),
});

module.exports = {
  loginSchema,
  signupSchema,
};
