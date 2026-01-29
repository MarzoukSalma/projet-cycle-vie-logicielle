jest.mock("../../models", () => ({
  Ingredient: {
    findAll: jest.fn(),
  },
}))

const { searchIngredients } = require("../../controllers/ingredient.controller")
const { Ingredient } = require("../../models")

describe("searchIngredients", () => {
  beforeEach(() => jest.clearAllMocks())

  it("should return empty array if query is missing or too short", async () => {
    const req = { query: { q: "a" } }
    const res = { json: jest.fn() }

    await searchIngredients(req, res)

    expect(res.json).toHaveBeenCalledWith([])
    expect(Ingredient.findAll).not.toHaveBeenCalled()
  })

  it("should return ingredients matching query", async () => {
    const req = { query: { q: "tom" } }
    const res = { json: jest.fn() }

    const mockIngredients = [
      { id: 1, name: "tomate" },
      { id: 2, name: "tomate cerise" },
    ]

    Ingredient.findAll.mockResolvedValue(mockIngredients)

    await searchIngredients(req, res)

    expect(Ingredient.findAll).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(mockIngredients)
  })

  it("should return 500 on error", async () => {
    const req = { query: { q: "tom" } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    Ingredient.findAll.mockRejectedValue(new Error("DB error"))

    await searchIngredients(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})
