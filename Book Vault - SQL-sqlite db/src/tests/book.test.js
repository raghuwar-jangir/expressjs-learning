const request = require("supertest");
const app = require("../app");

const invalidToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyOWJiNzdhZi04ZjY4LTQ3MzktOTVlYy1jMTA3ZTlhOTNhNjMiLCJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIiwiaWF0IjoxNzg0NjYwNzcwLCJleHAiOjE3ODQ2NjE2NzAsImlzcyI6ImJvb2t2YXVsdC1hcGkifQ.ypouvUZP5fsymidkUXay2izHu49pDuDLgXwdjc7U1H8";
const validToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0Y2U2MjRlZS05NWNmLTQ1MDItODFkNi05ZTg5YjM2MWRmYjAiLCJlbWFpbCI6InJhZ2h1LnRlc3RAZXhhbXBsZTkuY29tIiwiaWF0IjoxNzg0NzM3MzQ2LCJleHAiOjE3ODQ3MzgyNDYsImlzcyI6ImJvb2t2YXVsdC1hcGkifQ.waueC3YErkENHiBTQurr7EQjvTEJ8hJwQsxUyZwpBOQ";

describe("POST books/", () => {
  // --- HAPPY PATH ---
  test("should get all the books and return 200 with array of book object", async () => {
    const res = await request(app)
      .get("/books")
      .auth(validToken, { type: "bearer" });

    // ASSERT — check the response is exactly what a correct implementation should return
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // --- INVALID OR MISSING TOKEN ---
  test("should give 401 error when invalid token is used", async () => {
    const res = await request(app)
      .get("/books")
      .auth(invalidToken, { type: "bearer" });

    // ASSERT — check the response is exactly what a correct implementation should return
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBeDefined();
  });
});
