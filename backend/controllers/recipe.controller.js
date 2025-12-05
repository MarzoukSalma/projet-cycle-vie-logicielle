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
    const {
      userId,
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
