jest.mock("../../models", () => ({
  Ingredient: {
    findAll: jest.fn(),
  },
}))

const { getAllIngredients } = require("../../controllers/ingredient.controller")
const { Ingredient } = require("../../models")

describe("getAllIngredients", () => {
  beforeEach(() => jest.clearAllMocks())

  it("should return all ingredients", async () => {
    const req = {}
    const res = { json: jest.fn() }

    const mockIngredients = [
      { id: 1, name: "tomate" },
      { id: 2, name: "oignon" },
    ]

    Ingredient.findAll.mockResolvedValue(mockIngredients)

    await getAllIngredients(req, res)

    expect(Ingredient.findAll).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(mockIngredients)
  })

  it("should return 500 on error", async () => {
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    Ingredient.findAll.mockRejectedValue(new Error("DB error"))

    await getAllIngredients(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})
