"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Récupérer quelques users
    const users = await queryInterface.sequelize.query(
      'SELECT id, username FROM "Users" ORDER BY "createdAt" ASC LIMIT 5;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length) {
      throw new Error('Aucun user trouvé. Lance d’abord le seeder Users.');
    }

    // 2) Récupérer quelques recipes
    const recipes = await queryInterface.sequelize.query(
      'SELECT id, title FROM "Recipes" ORDER BY "createdAt" ASC LIMIT 8;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!recipes.length) {
      throw new Error('Aucune recipe trouvée. Lance d’abord le seeder Recipes.');
    }

    // Helpers (safe si tu as moins de rows que prévu)
    const U = (i) => users[Math.min(i, users.length - 1)].id;
    const R = (i) => recipes[Math.min(i, recipes.length - 1)].id;

    const now = new Date();

    // 3) Likes (éviter doublons userId+recipeId)
    const likes = [
      // chef_marie likes
      { userId: U(0), recipeId: R(0), createdAt: now, updatedAt: now },
      { userId: U(0), recipeId: R(3), createdAt: now, updatedAt: now },

      // cooking_pro likes
      { userId: U(1), recipeId: R(0), createdAt: now, updatedAt: now },
      { userId: U(1), recipeId: R(1), createdAt: now, updatedAt: now },
      { userId: U(1), recipeId: R(7), createdAt: now, updatedAt: now },

      // foodlover_sam likes
      { userId: U(2), recipeId: R(0), createdAt: now, updatedAt: now },
      { userId: U(2), recipeId: R(2), createdAt: now, updatedAt: now },
      { userId: U(2), recipeId: R(5), createdAt: now, updatedAt: now },

      // veggie_chef likes
      { userId: U(3), recipeId: R(1), createdAt: now, updatedAt: now },
      { userId: U(3), recipeId: R(4), createdAt: now, updatedAt: now },
      { userId: U(3), recipeId: R(6), createdAt: now, updatedAt: now },

      // baker_emma likes
      { userId: U(4), recipeId: R(5), createdAt: now, updatedAt: now },
      { userId: U(4), recipeId: R(7), createdAt: now, updatedAt: now },
    ];

    await queryInterface.bulkInsert("RecipeLikes", likes, {});
  },

  async down(queryInterface) {
    // Simple: effacer tout
    await queryInterface.bulkDelete("RecipeLikes", null, {});
  },
};