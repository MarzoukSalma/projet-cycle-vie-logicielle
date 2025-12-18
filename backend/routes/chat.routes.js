const express = require("express");
const router = express.Router();
const { chatWithFoodAssistant } = require("../controllers/chat.controller");
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, chatWithFoodAssistant);

module.exports = router;
