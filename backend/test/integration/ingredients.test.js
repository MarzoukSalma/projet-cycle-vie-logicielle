const request = require("supertest")
const app = require("../../app")
const db = require("../../models")

describe("Ingredient routes", () => {

  it("GET /api/ingredients/all should return all ingredients", async () => {
    const res = await request(app)
      .get("/api/ingredients/all")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it("GET /api/ingredients/search should return matching ingredients", async () => {
    const res = await request(app)
      .get("/api/ingredients/search")
      .query({ q: "tom" }) // example keyword

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

})

afterAll(async () => {
  await db.sequelize.close()
})
