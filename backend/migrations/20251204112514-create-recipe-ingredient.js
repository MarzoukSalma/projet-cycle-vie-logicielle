"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RecipeIngredients", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      recipeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Recipes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ingredientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Ingredients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: {
        type: Sequelize.STRING,
        allowNull: true, // "2 cups", "1 tbsp", etc.
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Optionnel: empêcher les doublons recette + ingredient
    await queryInterface.addConstraint("RecipeIngredients", {
      fields: ["recipeId", "ingredientId"],
      type: "unique",
      name: "recipe_ingredient_unique_pair",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("RecipeIngredients");
  },
};
