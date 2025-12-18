const express = require("express");
const router = express.Router();
const recipeTryController = require("../controllers/recipeTry.controller");
const { authenticateToken } = require("../middleware/auth");

// /api/recipes/:recipeId/try
router.post("/:recipeId/try", authenticateToken, recipeTryController.createRecipeTry);

// /api/recipes/:recipeId/tries
router.get("/:recipeId/tries", recipeTryController.getTriesByRecipeId);

module.exports = router;
