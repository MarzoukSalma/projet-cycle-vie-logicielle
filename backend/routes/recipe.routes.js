//routes/recipe.routes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const { authenticateToken } = require("../middleware/auth"); // adjust path if needed
const { optionalAuth } = require("../middleware/auth")



router.get("/", optionalAuth, recipeController.getAllRecipes)

// IMPORTANT: place this before `/:id` so "my" is not interpreted as an id
router.get("/stories", optionalAuth, recipeController.getTopRecipesStories)

router.get("/my", authenticateToken, recipeController.getMyRecipes);
router.get("/liked", authenticateToken, recipeController.getMyLikedRecipes)

// Get single recipe (public)
router.get("/:id",optionalAuth, recipeController.getRecipeById);

// PROTECTED (require login)
router.post("/", authenticateToken, recipeController.createRecipe);

// Like / Dislike (logged users only)
router.post("/:id/like", authenticateToken, recipeController.likeRecipe);
router.post("/:id/dislike", authenticateToken, recipeController.dislikeRecipe);

// Update recipe (only owner — controller checks ownership)
router.put("/:id", authenticateToken, recipeController.updateRecipe);

// Delete (only owner — controller checks ownership)
router.delete("/:id", authenticateToken, recipeController.deleteRecipe);

module.exports = router;
