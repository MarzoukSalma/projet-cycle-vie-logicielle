// server.js
require("dotenv").config();

const express = require("express");
const db = require("./models"); // Sequelize index.js
const recipeRoutes = require("./routes/recipe.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour lire JSON
app.use(express.json());

// Simple route pour tester
app.get("/", (req, res) => {
  res.send("RecipeShare backend is running 👨‍🍳🔥");
});

// Routes pour recipes
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);

// Start server ONLY if DB connection works
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });



  