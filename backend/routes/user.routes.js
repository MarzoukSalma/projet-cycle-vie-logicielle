const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { authenticateToken } = require("../middleware/auth");

// Auth
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/google", userController.googleAuth); //Google authetification

router.put("/settings", authenticateToken, userController.updateUserSettings);

// Public visited user
router.get("/:id", userController.getVisitedUserProfile);
router.get("/:id/recipes", userController.getVisitedUserRecipes);

router.post("/forgot-password", userController.forgotPassword)
router.post("/reset-password", userController.resetPassword)


module.exports = router;