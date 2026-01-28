'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Récupère la définition de la table
    const table = await queryInterface.describeTable('Recipes');

    // Supprime seulement si la colonne existe
    if (table.likesCount) {
      await queryInterface.removeColumn('Recipes', 'likesCount');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Recipes', 'likesCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  }
};
