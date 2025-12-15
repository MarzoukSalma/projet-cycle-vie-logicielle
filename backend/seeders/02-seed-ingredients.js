"use strict";
const crypto = require('crypto');

// Fonction pour générer un UUID v4
function uuidv4() {
  return crypto.randomUUID();
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const ingredients = [
      // Légumes
      { id: uuidv4(), name: 'Tomate', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Oignon', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Ail', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Carotte', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Pomme de terre', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Courgette', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Poivron', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Aubergine', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Épinards', createdAt: new Date(), updatedAt: new Date() },
      
      // Protéines
      { id: uuidv4(), name: 'Poulet', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Bœuf', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Poisson blanc', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Saumon', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Œufs', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Tofu', createdAt: new Date(), updatedAt: new Date() },
      
      // Produits laitiers
      { id: uuidv4(), name: 'Lait', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Crème fraîche', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Beurre', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Fromage râpé', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Parmesan', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Mozzarella', createdAt: new Date(), updatedAt: new Date() },
      
      // Féculents & céréales
      { id: uuidv4(), name: 'Pâtes', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Riz', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Farine', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Pain', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Quinoa', createdAt: new Date(), updatedAt: new Date() },
      
      // Condiments & épices
      { id: uuidv4(), name: 'Huile d\'olive', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Sel', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Poivre', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Basilic', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Thym', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Persil', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Paprika', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Cumin', createdAt: new Date(), updatedAt: new Date() },
      
      // Autres
      { id: uuidv4(), name: 'Bouillon de légumes', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Sauce tomate', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Citron', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Sucre', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Chocolat noir', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Vanille', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('Ingredients', ingredients, {});
    return ingredients;
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ingredients', null, {});
  },
};