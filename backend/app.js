// backend/app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const recipeRoutes = require("./routes/recipe.routes");
const userRoutes = require("./routes/user.routes");
const ingredientRoutes = require("./routes/ingredient.routes");
const recipeTryRoutes = require("./routes/recipeTry.routes");
const searchRoutes = require("./routes/search.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.send("RecipeShare backend is runninggg 👨‍🍳🔥");
});

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeTryRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
