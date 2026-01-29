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
  optionalAuth: (req, res, next) => {
    req.user = {
      id: "69e64163-1fdf-4004-b0e5-2a2271b55225",
    }
    next()
  },
  checkOwnership: (req, res, next) => next(),
}))

describe("Recipe routes", () => {
  let recipeId

  // 🔑 get a real recipe from DB
  beforeAll(async () => {
    const recipe = await db.Recipe.findOne()
    recipeId = recipe.id
  })

  // 🌍 PUBLIC / OPTIONAL AUTH
  it("GET /api/recipes should return all recipes", async () => {
    const res = await request(app).get("/api/recipes")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it("GET /api/recipes/:id should return a recipe", async () => {
    const res = await request(app).get(`/api/recipes/${recipeId}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("id", recipeId)
  })

  // 🔐 PROTECTED
  it("GET /api/recipes/my should return my recipes", async () => {
    const res = await request(app)
      .get("/api/recipes/my")
      .set("Authorization", "Bearer fake-token")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it("GET /api/recipes/liked should return liked recipes", async () => {
    const res = await request(app)
      .get("/api/recipes/liked")
      .set("Authorization", "Bearer fake-token")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

afterAll(async () => {
  await db.sequelize.close()
})
