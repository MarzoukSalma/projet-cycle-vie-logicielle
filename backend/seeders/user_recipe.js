require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../models");

async function seed() {
  try {
    await db.sequelize.sync({ force: true }); // ⚠️ RESET DB
    console.log("🗑️ Database reset");

    // ----------------
    // USERS
    // ----------------
    const passwordHash = await bcrypt.hash("123456", 10);

    const users = await db.User.bulkCreate([
      {
        username: "doudou",
        email: "doudou@example.com",
        passwordHash,
        bio: "Frontend dev tester",
      },
      {
        username: "chef",
        email: "chef@example.com",
        passwordHash,
        bio: "I love cooking",
      },
    ]);

    console.log("👤 Users seeded");

    // ----------------
    // RECIPES
    // ----------------
    await db.Recipe.bulkCreate([
      {
        title: "Classic Tagine",
        description: "Traditional Moroccan tagine",
        steps: ["Prepare ingredients", "Cook slowly"],
        userId: users[0].id,
        likesCount: 3,
      },
      {
        title: "Pasta Carbonara",
        description: "Italian classic",
        steps: ["Boil pasta", "Mix eggs & cheese"],
        userId: users[1].id,
        likesCount: 5,
      },
    ]);

    console.log("🍽️ Recipes seeded");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
