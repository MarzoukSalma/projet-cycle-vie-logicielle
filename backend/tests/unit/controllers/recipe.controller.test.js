const { createRecipe } = require("../../../controllers/recipe.controller");

// On mock le model Recipe (pour ne PAS parler à la vraie DB)
jest.mock("../../../models", () => ({
  Recipe: {
    create: jest.fn(),
  },
}));

const { Recipe } = require("../../../models");

describe("createRecipe Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Recipe.create.mockReset();
  });

  test("should return 400 if userId or title is missing", async () => {
    req.body = {
      userId: null,
      title: "",
    };

    await createRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "userId and title are required",
    });
  });
});
