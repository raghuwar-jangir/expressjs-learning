// tests/books.test.js
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");

let validToken;
let testBookId;

const invalidToken = "this.is.not.a.valid.token";

const testUser = {
  email: "books.test@example.com",
  password: "SuperSecret123",
};
const testBook = {
  title: "Clean Code",
  author: "Robert Martin",
  pages: 464,
  rating: 5,
};

beforeAll(async () => {
  console.log("STEP 1 — beforeAll running");
  // clean slate
  db.prepare("DELETE FROM users WHERE email = ?").run(testUser.email);

  // real user, real login flow — same pattern as auth.test.js
  await request(app).post("/auth/signup").send(testUser);
  const loginRes = await request(app).post("/auth/login").send(testUser);
  validToken = await loginRes.body.data.accessToken;
  console.log("🚀 ~ book.test.js:30 ~ validToken >>>", validToken);
  console.log("STEP 2 — token set:", validToken);
});

describe("GET /books", () => {
  console.log("STEP 3 — test running, token is:", validToken);
  console.log("valid token>>>", validToken);
  test("should return 200 with array of books for authenticated user", async () => {
    const res = await request(app)
      .get("/books")
      .auth(validToken, { type: "bearer" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // test("should return 401 when token is invalid", async () => {
  //   const res = await request(app)
  //     .get("/books")
  //     .auth(invalidToken, { type: "bearer" });

  //   expect(res.status).toBe(401);
  //   expect(res.body.success).toBe(false);
  // });

  // test("should return 401 when no token is provided", async () => {
  //   const res = await request(app).get("/books");

  //   expect(res.status).toBe(401);
  // });
});

// describe("POST /books", () => {
//   test("should create a book and return 201", async () => {
//     const res = await request(app)
//       .post("/books")
//       .auth(validToken, { type: "bearer" })
//       .send(testBook);

//     expect(res.status).toBe(201);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data.title).toBe(testBook.title);
//     expect(res.body.data.id).toBeDefined();

//     testBookId = res.body.data.id; // save for later tests (GET/PATCH/DELETE by id)
//   });

//   test("should return 400 when required field is missing", async () => {
//     const res = await request(app)
//       .post("/books")
//       .auth(validToken, { type: "bearer" })
//       .send({ author: "No Title Here" }); // missing title, pages

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBe(false);
//   });

//   test("should return 400 when rating is out of range", async () => {
//     const res = await request(app)
//       .post("/books")
//       .auth(validToken, { type: "bearer" })
//       .send({ ...testBook, rating: 10 }); // invalid — max is 5

//     expect(res.status).toBe(400);
//   });
// });

// describe("GET /books/search", () => {
//   test("should find books matching a title keyword", async () => {
//     const res = await request(app)
//       .get("/books/search?title=Clean")
//       .auth(validToken, { type: "bearer" });

//     expect(res.status).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(Array.isArray(res.body.data)).toBe(true);
//   });
// });

// describe("GET /books/top_rated", () => {
//   test("should return books sorted by rating", async () => {
//     const res = await request(app)
//       .get("/books/top_rated")
//       .auth(validToken, { type: "bearer" });

//     expect(res.status).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(Array.isArray(res.body.data)).toBe(true);
//   });
// });

// describe("GET /books/:id", () => {
//   test("should return a single book by id", async () => {
//     const res = await request(app)
//       .get(`/books/${testBookId}`)
//       .auth(validToken, { type: "bearer" });

//     expect(res.status).toBe(200);
//     expect(res.body.data.id).toBe(testBookId);
//   });

//   test("should return 404 for a non-existent book id", async () => {
//     const res = await request(app)
//       .get("/books/non-existent-id-123")
//       .auth(validToken, { type: "bearer" });

//     expect(res.status).toBe(404);
//   });
// });

// describe("PATCH /books/:id", () => {
//   test("should update only the fields provided", async () => {
//     const res = await request(app)
//       .patch(`/books/${testBookId}`)
//       .auth(validToken, { type: "bearer" })
//       .send({ rating: 4 });

//     expect(res.status).toBe(200);
//     expect(res.body.data.rating).toBe(4);
//     expect(res.body.data.title).toBe(testBook.title); // untouched field stays intact
//   });

//   test("should return 400 for invalid update payload", async () => {
//     const res = await request(app)
//       .patch(`/books/${testBookId}`)
//       .auth(validToken, { type: "bearer" })
//       .send({ rating: 99 });

//     expect(res.status).toBe(400);
//   });
// });

// describe("DELETE /books/:id", () => {
//   test("should delete the book and return 200", async () => {
//     const res = await request(app)
//       .delete(`/books/${testBookId}`)
//       .auth(validToken, { type: "bearer" });

//     expect(res.status).toBe(200);
//     expect(res.body.success).toBe(true);
//   });

//   test("should return 404 when deleting an already-deleted book", async () => {
//     const res = await request(app)
//       .delete(`/books/${testBookId}`)
//       .auth(validToken, { type: "bearer" });

//     expect(res.status).toBe(404);
//   });
// });
