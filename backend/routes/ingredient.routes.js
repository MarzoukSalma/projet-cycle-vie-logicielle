const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredient.controller");
const { authenticateToken } = require("../middleware/auth"); // adjust path if needed

router.get("/search", ingredientController.searchIngredients);
router.get("/all", ingredientController.getAllIngredients);
module.exports = router;
