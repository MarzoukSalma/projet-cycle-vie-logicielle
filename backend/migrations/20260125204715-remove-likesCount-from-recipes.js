'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Recipes', 'likesCount');
  },

  down: async (queryInterface, Sequelize) => {
    // In case you need to rollback
    await queryInterface.addColumn('Recipes', 'likesCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  }
};