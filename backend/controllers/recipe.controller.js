// controllers/recipe.controller.js
const db = require("../models");
const { Recipe, Ingredient, RecipeIngredient } = db;

/**
 * GET /api/recipes
 * Get all recipes with ingredients
 */
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    return res.status(500).json({ message: "Error fetching recipes" });
  }
};

/**
 * GET /api/recipes/:id
 */
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id, {
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return res.status(500).json({ message: "Error fetching recipe" });
  }
};

/**
 * POST /api/recipes
 * Create recipe + auto-create ingredients if not exist
 */
exports.createRecipe = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const userId = req.user.id;
    const {
      title,
      description,
      imageUrl,
      steps,
      prepTimeMinutes,
      cookTimeMinutes,
      totalTimeMinutes,
      ingredients,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // 1️⃣ Create recipe
    const recipe = await Recipe.create(
      {
        userId,
        title,
        description,
        imageUrl,
        steps,
        prepTimeMinutes,
        cookTimeMinutes,
        totalTimeMinutes,
      },
      { transaction }
    );

    // 2️⃣ Handle ingredients
    if (Array.isArray(ingredients) && ingredients.length > 0) {
     for (const item of ingredients) {
  let ingredient;

  // CASE 1: ingredientId sent
  if (item.ingredientId) {
    ingredient = await Ingredient.findByPk(item.ingredientId, { transaction });
    if (!ingredient) {
      throw new Error("Ingredient not found");
    }
  }

  // CASE 2: ingredient name sent
  else if (item.name) {
    const ingredientName = item.name.trim().toLowerCase();
    [ingredient] = await Ingredient.findOrCreate({
      where: { name: ingredientName },
      defaults: { name: ingredientName },
      transaction,
    });
  }

  else {
    throw new Error("Ingredient must have id or name");
  }

  await RecipeIngredient.create(
    {
      recipeId: recipe.id,
      ingredientId: ingredient.id,
      quantity: item.quantity || null,
    },
    { transaction }
  );
}
    }

    await transaction.commit();

    return res.status(201).json(recipe);
  } catch (err) {
    await transaction.rollback();
    console.error("Error creating recipe:", err);
    return res.status(500).json({
      message: "Error creating recipe",
      error: err.message,
    });
  }
};

/**
 * POST /api/recipes/:id/like
 */
exports.likeRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.likesCount = (recipe.likesCount || 0) + 1;
    await recipe.save();

    return res.json({
      message: "Recipe liked successfully",
      likesCount: recipe.likesCount,
    });
  } catch (err) {
    console.error("Error liking recipe:", err);
    return res.status(500).json({ message: "Error liking recipe" });
  }
};

/**
 * POST /api/recipes/:id/dislike
 */
exports.dislikeRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.likesCount = Math.max((recipe.likesCount || 0) - 1, 0);
    await recipe.save();

    return res.json({
      message: "Recipe disliked successfully",
      likesCount: recipe.likesCount,
    });
  } catch (err) {
    console.error("Error disliking recipe:", err);
    return res.status(500).json({ message: "Error disliking recipe" });
  }
};

/**
 * DELETE /api/recipes/:id
 */
exports.deleteRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.userId !== userId) {
      return res.status(403).json({ message: "Not your recipe" });
    }

    await recipe.destroy();

    return res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    return res.status(500).json({ message: "Error deleting recipe" });
  }
};

/**
 * GET /api/recipes/my
 */
exports.getMyRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    const recipes = await Recipe.findAll({
      where: { userId },
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(recipes);
  } catch (err) {
    console.error("Error fetching user's recipes:", err);
    return res.status(500).json({
      message: "Error fetching user's recipes",
    });
  }
};
