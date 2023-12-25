const request = require("supertest");
const app = require("./index");

describe("GET /api/data", () => {
  it("should respond with a JSON object containing a message", async () => {
    const response = await request(app).get("/api/data");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Hello, world!" });
  });
});
