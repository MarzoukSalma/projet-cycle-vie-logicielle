// controllers/recipe.controller.js
const db = require("../models");
const { Recipe } = db;

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    return res.status(500).json({ message: "Error fetching recipes" });
  }
};

// GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return res.status(500).json({ message: "Error fetching recipe" });
  }
};

// POST /api/recipes
exports.createRecipe = async (req, res) => {
  try {
  const  userId = req.user.id;
    const {
      title,
      description,
      imageUrl,
      steps,
      prepTimeMinutes,
      cookTimeMinutes,
      totalTimeMinutes,
    } = req.body;

    if (!userId || !title) {
      return res
        .status(400)
        .json({ message: "userId and title are required" });
    }

    const newRecipe = await Recipe.create({
      userId,
      title,
      description,
      imageUrl,
      steps,
      prepTimeMinutes,
      cookTimeMinutes,
      totalTimeMinutes,
      // likesCount will default to 0
    });

    return res.status(201).json(newRecipe);
  } catch (err) {
    console.error("Error creating recipe:", err);
   return res.status(400).json({
    message: "Error creating recipe",
    error: err.message,      // 👈 add this
  });
  }
};

// POST /api/recipes/:id/like
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
// POST /api/recipes/:id/dislike
exports.dislikeRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Prevent negative likes
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



// GET /api/recipes/my
exports.getMyRecipes = async (req, res) => {
  try {
    const userId = req.user.id;   // 👈 logged-in user
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const recipes = await Recipe.findAll({
      where: { userId },
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
