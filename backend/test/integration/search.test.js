const request = require("supertest")
const app = require("../../app")
const db = require("../../models")

describe("Search routes", () => {

  it("GET /api/search should return search results", async () => {
    const res = await request(app)
      .get("/api/search")
      .query({ q: "tomato" }) // keyword to search

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
  })

})

afterAll(async () => {
  await db.sequelize.close()
})
