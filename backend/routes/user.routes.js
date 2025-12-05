const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser); // 👈 ADD THIS
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

module.exports = router;
