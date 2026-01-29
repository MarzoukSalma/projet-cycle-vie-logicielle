jest.mock("../../models", () => ({
  RecipeTry: {
    create: jest.fn(),
  },
  Recipe: {
    findByPk: jest.fn(),
  },
  User: {},
}))

const { createRecipeTry } = require("../../controllers/recipeTry.controller")
const { RecipeTry, Recipe } = require("../../models")

describe("createRecipeTry", () => {
  beforeEach(() => jest.clearAllMocks())

  it("should create a recipe try successfully", async () => {
    const req = {
      params: { recipeId: "recipe-1" },
      body: { commentText: "Nice recipe", imageUrl: null },
      user: { id: "user-1" },
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    Recipe.findByPk.mockResolvedValue({ id: "recipe-1" })

    const mockTry = { reload: jest.fn() }
    RecipeTry.create.mockResolvedValue(mockTry)

    await createRecipeTry(req, res)

    expect(Recipe.findByPk).toHaveBeenCalledWith("recipe-1")
    expect(RecipeTry.create).toHaveBeenCalled()
    expect(mockTry.reload).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it("should return 404 if recipe not found", async () => {
    const req = {
      params: { recipeId: "bad-id" },
      body: {},
      user: { id: "user-1" },
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    Recipe.findByPk.mockResolvedValue(null)

    await createRecipeTry(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it("should return 500 on error", async () => {
    const req = {
      params: { recipeId: "recipe-1" },
      body: {},
      user: { id: "user-1" },
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    Recipe.findByPk.mockRejectedValue(new Error("DB error"))

    await createRecipeTry(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})
