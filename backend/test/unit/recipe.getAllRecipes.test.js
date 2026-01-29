const { getAllRecipes } = require("../../controllers/recipe.controller")
const db = require("../../models")

jest.mock("../../models")

describe("getAllRecipes", () => {
  it("should return transformed recipes", async () => {
    db.Recipe.findAll.mockResolvedValue([
      {
        toJSON: () => ({
          id: "r1",
          userId: "u1",
          ingredients: [],
          tries: [],
          author: {},
        }),
      },
    ])

    db.RecipeLike.findAll.mockResolvedValue([])
    db.sequelize = { fn: jest.fn(), col: jest.fn() }

    const req = { user: null }
    const res = { json: jest.fn() }

    await getAllRecipes(req, res)

    expect(res.json).toHaveBeenCalled()
  })
})
