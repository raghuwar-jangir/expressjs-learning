// tests/auth.test.js

const request = require("supertest");
const app = require("../app.js"); // import the Express app itself, NOT server.js
const db = require("../db/connection.js"); //test db lookup

describe("POST auth/signup", () => {
  const newUser = {
    email: "new.test@example.com",
    password: "SuperSecret123",
  };
  //clean up leftover data for fresh testing
  beforeAll(async () => {
    db.prepare("DELETE FROM users WHERE email = ?").run(newUser.email);
  });
  // --- HAPPY PATH ---
  test("should register a new user and return 201 with user data", async () => {
    // ARRANGE — the input we're sending

    // ACT — actually hit the endpoint, through the app, no real server running
    const res = await request(app).post("/auth/signup").send(newUser);

    // ASSERT — check the response is exactly what a correct implementation should return
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(newUser.email);

    // 🔑 critical security check — hashed password must NEVER leak in the response
    expect(res.body.data.password_hash).toBeUndefined();
  });

  // // --- DUPLICATE EMAIL ---
  // test("should return 409 when email already exists", async () => {
  //   const existingUser = {
  //     email: "new.test@example.com", // same email as the test above — already inserted
  //     password: "AnotherPassword123",
  //   };

  //   const res = await request(app).post("/auth/signup").send(existingUser);

  //   expect(res.status).toBe(409);
  //   expect(res.body.success).toBe(false);
  //   expect(res.body.error.message).toBeDefined();
  // });

  // // --- MISSING FIELDS ---
  // test("should return 400 when email is missing", async () => {
  //   const res = await request(app)
  //     .post("/auth/signup")
  //     .send({ password: "SomePassword123" }); // no email

  //   expect(res.status).toBe(400);
  //   expect(res.body.success).toBe(false);
  // });
});

// describe("POST auth/login", () => {
//   // SETUP — seed a real user via the actual signup endpoint before login tests run
//   const testUser = {
//     email: "login.test@example.com",
//     password: "CorrectPassword123",
//   };

//   beforeAll(async () => {
//     db.prepare("DELETE FROM users WHERE email = ?").run(testUser.email);
//     await request(app).post("/auth/signup").send(testUser);
//   });

//   // --- HAPPY PATH ---
//   test("should login successfully with correct credentials", async () => {
//     const res = await request(app).post("/auth/login").send(testUser);

//     expect(res.status).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data.user.email).toBe(testUser.email);

//     // real jose now — tokens should be real, defined, non-empty strings
//     expect(res.body.data.user.password_hash).toBeUndefined();
//     expect(res.body.data.accessToken).toBeDefined();
//     expect(res.body.data.refreshToken).toBeDefined();
//     expect(typeof res.body.data.accessToken).toBe("string");
//   });

//   // --- WRONG PASSWORD ---
//   test("should return 401 for wrong password", async () => {
//     const res = await request(app)
//       .post("/auth/login")
//       .send({ email: testUser.email, password: "WrongPassword999" });

//     expect(res.status).toBe(401);
//     expect(res.body.success).toBe(false);
//     expect(res.body.error.code).toBe("UNAUTHORIZED");
//   });

//   // --- NON-EXISTENT EMAIL ---
//   test("should return 401 for non-existent email", async () => {
//     const res = await request(app)
//       .post("/auth/login")
//       .send({ email: "doesnotexist@example.com", password: "Whatever123" });

//     expect(res.status).toBe(401);
//     expect(res.body.success).toBe(false);
//     expect(res.body.error.code).toBe("UNAUTHORIZED");
//   });

//   // --- SAME MESSAGE FOR BOTH FAILURE CASES — security check ---
//   test("should return identical error message for wrong password vs non-existent email", async () => {
//     const res1 = await request(app)
//       .post("/auth/login")
//       .send({ email: testUser.email, password: "WrongPassword999" });

//     const res2 = await request(app)
//       .post("/auth/login")
//       .send({ email: "doesnotexist@example.com", password: "Whatever123" });

//     expect(res1.body.error.message).toBe(res2.body.error.message);
//   });
// });
