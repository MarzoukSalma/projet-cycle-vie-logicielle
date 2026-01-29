jest.mock("../../models", () => ({
  RecipeTry: {
    findAll: jest.fn(),
  },
  User: {},
}))

const { getTriesByRecipeId } = require("../../controllers/recipeTry.controller")
const { RecipeTry } = require("../../models")

describe("getTriesByRecipeId", () => {
  beforeEach(() => jest.clearAllMocks())

  it("should return all tries for a recipe", async () => {
    const req = { params: { recipeId: "recipe-1" } }
    const res = { json: jest.fn() }

    RecipeTry.findAll.mockResolvedValue([{ id: "try-1" }])

    await getTriesByRecipeId(req, res)

    expect(RecipeTry.findAll).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith([{ id: "try-1" }])
  })

  it("should return 500 on error", async () => {
    const req = { params: { recipeId: "recipe-1" } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    RecipeTry.findAll.mockRejectedValue(new Error("DB error"))

    await getTriesByRecipeId(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})
