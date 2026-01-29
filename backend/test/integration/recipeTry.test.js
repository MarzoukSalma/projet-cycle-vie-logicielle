const request = require("supertest")
const app = require("../../app")
const db = require("../../models")

// 🔐 mock auth middleware
jest.mock("../../middleware/auth", () => ({
  authenticateToken: (req, res, next) => {
    req.user = {
      id: "69e64163-1fdf-4004-b0e5-2a2271b55225",
    }
    next()
  },
  optionalAuth: (req, res, next) => next(),
  checkOwnership: (req, res, next) => next(),
}))

describe("RecipeTry routes", () => {
  // 🔑 use a REAL recipeId from your DB
  const recipeId = "05935b32-fad8-49a0-acf8-667d5929bdd9"

  it("GET /api/recipes/:recipeId/tries should return tries", async () => {
    const res = await request(app)
      .get(`/api/recipes/${recipeId}/tries`)

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it("POST /api/recipes/:recipeId/try should create a try", async () => {
    const res = await request(app)
      .post(`/api/recipes/${recipeId}/try`)
      .set("Authorization", "Bearer fake-token")
      .send({
        comment: "Loved this recipe!",
        rating: 5,
      })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("id")
  })
})

afterAll(async () => {
  await db.sequelize.close()
})
