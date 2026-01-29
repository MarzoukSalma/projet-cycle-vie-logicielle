const request = require("supertest")
const app = require("../../app")


// 🔐 mock auth middleware ONCE
jest.mock("../../middleware/auth", () => ({
  authenticateToken: (req, res, next) => {
    req.user = {
      id: "69e64163-1fdf-4004-b0e5-2a2271b55225",
    }
    next()
  },

  optionalAuth: (req, res, next) => {
    // optional auth → allow anonymous or user
    req.user = {
      id: "69e64163-1fdf-4004-b0e5-2a2271b55225",
    }
    next()
  },

  checkOwnership: (req, res, next) => {
    next()
  },
}))

describe("Users routes", () => {

  it("POST /api/users/login should login user", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: "marie@example.com",
        password: "password123",
      })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("token")
    expect(res.body).toHaveProperty("user")
  })

  it("GET /api/users/:id should return visited profile", async () => {
    const res = await request(app)
      .get("/api/users/69e64163-1fdf-4004-b0e5-2a2271b55225")

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("username")
  })

})
