// routes/recipe.routes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");

// GET /api/recipes
router.get("/", recipeController.getAllRecipes);

// GET /api/recipes/:id
router.get("/:id", recipeController.getRecipeById);

// POST /api/recipes
router.post("/", recipeController.createRecipe);

// POST /api/recipes/:id/like
router.post("/:id/like", recipeController.likeRecipe);

module.exports = router;
