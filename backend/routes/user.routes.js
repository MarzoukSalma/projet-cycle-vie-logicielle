const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { authenticateToken } = require("../middleware/auth");

// Auth
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/settings", authenticateToken, userController.updateUserSettings);

// Public visited user
router.get("/:id", userController.getVisitedUserProfile);
router.get("/:id/recipes", userController.getVisitedUserRecipes);

module.exports = router;
