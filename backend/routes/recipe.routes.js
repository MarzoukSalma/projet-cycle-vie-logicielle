//routes/recipe.routes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const { authenticateToken } = require("../middleware/auth"); // adjust path if needed

// PUBLIC
router.get("/", recipeController.getAllRecipes);

// IMPORTANT: place this before `/:id` so "my" is not interpreted as an id
router.get("/my", authenticateToken, recipeController.getMyRecipes);

// Get single recipe (public)
router.get("/:id", recipeController.getRecipeById);

// PROTECTED (require login)
router.post("/", authenticateToken, recipeController.createRecipe);

// Like / Dislike (logged users only)
router.post("/:id/like", authenticateToken, recipeController.likeRecipe);
router.post("/:id/dislike", authenticateToken, recipeController.dislikeRecipe);

// Delete (only owner — controller checks ownership)
router.delete("/:id", authenticateToken, recipeController.deleteRecipe);

module.exports = router;
