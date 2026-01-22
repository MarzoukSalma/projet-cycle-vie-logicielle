const express = require("express");
const router = express.Router();
const recipeTryController = require("../controllers/recipeTry.controller");
const { authenticateToken } = require("../middleware/auth");

// /api/recipes/:recipeId/try
router.post("/:recipeId/try", authenticateToken, recipeTryController.createRecipeTry);

// /api/recipes/:recipeId/tries
router.get("/:recipeId/tries", recipeTryController.getTriesByRecipeId);

// /api/recipes/:recipeId/tries/:tryId
router.delete("/:recipeId/tries/:tryId", authenticateToken, recipeTryController.deleteRecipeTry);

module.exports = router;
