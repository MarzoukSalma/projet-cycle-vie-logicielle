jest.mock("../../models", () => ({
  RecipeTry: {
    findOne: jest.fn(),
  },
}))

const { deleteRecipeTry } = require("../../controllers/recipeTry.controller")
const { RecipeTry } = require("../../models")

describe("deleteRecipeTry", () => {
  beforeEach(() => jest.clearAllMocks())

  it("should delete the try if user is owner", async () => {
    const req = {
      params: { recipeId: "recipe-1", tryId: "try-1" },
      user: { id: "user-1" },
    }

    const res = { json: jest.fn() }

    const mockTry = {
      userId: "user-1",
      destroy: jest.fn(),
    }

    RecipeTry.findOne.mockResolvedValue(mockTry)

    await deleteRecipeTry(req, res)

    expect(mockTry.destroy).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
  })

  it("should return 404 if try not found", async () => {
    const req = {
      params: { recipeId: "recipe-1", tryId: "try-1" },
      user: { id: "user-1" },
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    RecipeTry.findOne.mockResolvedValue(null)

    await deleteRecipeTry(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it("should return 403 if user is not owner", async () => {
    const req = {
      params: { recipeId: "recipe-1", tryId: "try-1" },
      user: { id: "user-2" },
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    RecipeTry.findOne.mockResolvedValue({
      userId: "user-1",
    })

    await deleteRecipeTry(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
  })
})
