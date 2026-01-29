// index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./models"); // Sequelize index.js

const recipeRoutes = require("./routes/recipe.routes");
const userRoutes = require("./routes/user.routes");
const ingredientRoutes = require("./routes/ingredient.routes");
const recipeTryRoutes = require("./routes/recipeTry.routes");
const searchRoutes = require("./routes/search.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// ⚠️ IMPORTANT POUR RAILWAY
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Route test
app.get("/", (req, res) => {
  res.send("RecipeShare backend is runninggg 👨‍🍳🔥");
});

// Routes API
app.use("/api/chat", chatRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeTryRoutes); // tries liés aux recettes
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);

// 🚀 Start server ONLY if DB connection works
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");

    // 🔴 LA LIGNE CRITIQUE POUR RAILWAY
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });
