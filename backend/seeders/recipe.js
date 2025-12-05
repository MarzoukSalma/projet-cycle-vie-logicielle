"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "Recipes",
      [
        {
          id: uuidv4(),
          userId: "1b71569a-16e5-4363-80ed-ed76897d08a0", // 👈 IMPORTANT
          title: "Spaghetti Bolognese",
          description: "Classic Italian pasta.",
          imageUrl: null,
          steps: "1. Cook pasta\n2. Add sauce",
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          totalTimeMinutes: 30,
          likesCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Recipes", null, {});
  },
};
