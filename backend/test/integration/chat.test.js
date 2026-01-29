const request = require("supertest")
const app = require("../../app")
const db = require("../../models")

// ✅ Mock the chat controller (NO Groq call)
jest.mock("../../controllers/chat.controller", () => ({
  chatWithFoodAssistant: (req, res) => {
    res.json({ reply: "Mocked AI response" })
  }
}))

// ✅ Mock auth middleware
jest.mock("../../middleware/auth", () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: "69e64163-1fdf-4004-b0e5-2a2271b55225" }
    next()
  },
  optionalAuth: (req, res, next) => next(),
  checkOwnership: (req, res, next) => next(),
}))

describe("Chat routes", () => {
  it("POST /api/chat should return AI reply for authenticated user", async () => {
    const res = await request(app)
      .post("/api/chat")
      .set("Authorization", "Bearer fake-token")
      .send({
        message: "Hello AI",
      })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("reply", "Mocked AI response")
  })
})

afterAll(async () => {
  await db.sequelize.close()
})
