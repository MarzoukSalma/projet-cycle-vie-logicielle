// routes/user.routes.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");


// Auth
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/settings", authenticateToken, userController.updateUserSettings);


module.exports = router; 
