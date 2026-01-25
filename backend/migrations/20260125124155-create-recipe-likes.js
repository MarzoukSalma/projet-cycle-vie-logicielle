"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RecipeLikes", {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        primaryKey: true,
      },
      recipeId: {
        type: Sequelize.UUID, 
        allowNull: false,
        references: {
          model: "Recipes",
          key: "id",
        },
        onDelete: "CASCADE",
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable("RecipeLikes")
  },
}
