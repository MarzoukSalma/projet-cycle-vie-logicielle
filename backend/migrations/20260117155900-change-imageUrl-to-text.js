'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Recipes', 'imageUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('RecipeTries', 'imageUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('Users', 'avatarUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Recipes', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('RecipeTries', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Users', 'avatarUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
