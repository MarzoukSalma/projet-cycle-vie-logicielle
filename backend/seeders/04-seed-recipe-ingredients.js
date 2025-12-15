"use strict";
const crypto = require('crypto');

// Fonction pour générer un UUID v4
function uuidv4() {
  return crypto.randomUUID();
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Récupérer les recettes et ingrédients
    const recipes = await queryInterface.sequelize.query(
      'SELECT id, title FROM "Recipes"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const ingredients = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Ingredients"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (recipes.length === 0 || ingredients.length === 0) {
      throw new Error('Exécutez d\'abord les seeders des recettes et ingrédients.');
    }

    // Fonction helper pour trouver un ingrédient par nom
    const findIngredient = (name) => ingredients.find(i => i.name === name)?.id;

    const recipeIngredients = [];

    // Spaghetti Carbonara
    const carbonara = recipes.find(r => r.title === 'Spaghetti Carbonara');
    if (carbonara) {
      recipeIngredients.push(
        { id: uuidv4(), recipeId: carbonara.id, ingredientId: findIngredient('Pâtes'), quantity: '400g', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: carbonara.id, ingredientId: findIngredient('Œufs'), quantity: '4 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: carbonara.id, ingredientId: findIngredient('Parmesan'), quantity: '100g', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: carbonara.id, ingredientId: findIngredient('Poivre'), quantity: '1 cuillère à café', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: carbonara.id, ingredientId: findIngredient('Sel'), quantity: 'Au goût', createdAt: new Date(), updatedAt: new Date() }
      );
    }

    // Ratatouille
    const ratatouille = recipes.find(r => r.title === 'Ratatouille Provençale');
    if (ratatouille) {
      recipeIngredients.push(
        { id: uuidv4(), recipeId: ratatouille.id, ingredientId: findIngredient('Aubergine'), quantity: '2 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: ratatouille.id, ingredientId: findIngredient('Courgette'), quantity: '2 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: ratatouille.id, ingredientId: findIngredient('Poivron'), quantity: '2 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: ratatouille.id, ingredientId: findIngredient('Tomate'), quantity: '4 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: ratatouille.id, ingredientId: findIngredient('Oignon'), quantity: '1 unité', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: ratatouille.id, ingredientId: findIngredient('Ail'), quantity: '3 gousses', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: ratatouille.id, ingredientId: findIngredient('Huile d\'olive'), quantity: '4 cuillères à soupe', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: ratatouille.id, ingredientId: findIngredient('Thym'), quantity: '2 branches', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: ratatouille.id, ingredientId: findIngredient('Basilic'), quantity: 'Quelques feuilles', createdAt: new Date(), updatedAt: new Date() }
      );
    }

    // Poulet Rôti
    const poulet = recipes.find(r => r.title === 'Poulet Rôti aux Herbes');
    if (poulet) {
      recipeIngredients.push(
        { id: uuidv4(), recipeId: poulet.id, ingredientId: findIngredient('Poulet'), quantity: '1 entier (1,5kg)', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: poulet.id, ingredientId: findIngredient('Pomme de terre'), quantity: '6 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: poulet.id, ingredientId: findIngredient('Carotte'), quantity: '4 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: poulet.id, ingredientId: findIngredient('Ail'), quantity: '4 gousses', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: poulet.id, ingredientId: findIngredient('Thym'), quantity: '3 branches', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: poulet.id, ingredientId: findIngredient('Huile d\'olive'), quantity: '3 cuillères à soupe', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: poulet.id, ingredientId: findIngredient('Sel'), quantity: 'Au goût', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: poulet.id, ingredientId: findIngredient('Poivre'), quantity: 'Au goût', createdAt: new Date(), updatedAt: new Date() }
      );
    }

    // Salade César
    const cesar = recipes.find(r => r.title === 'Salade César Maison');
    if (cesar) {
      recipeIngredients.push(
        { id: uuidv4(), recipeId: cesar.id, ingredientId: findIngredient('Poulet'), quantity: '2 filets', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: cesar.id, ingredientId: findIngredient('Pain'), quantity: '4 tranches', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: cesar.id, ingredientId: findIngredient('Parmesan'), quantity: '80g', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: cesar.id, ingredientId: findIngredient('Ail'), quantity: '2 gousses', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: cesar.id, ingredientId: findIngredient('Citron'), quantity: '1 unité', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: cesar.id, ingredientId: findIngredient('Huile d\'olive'), quantity: '3 cuillères à soupe', createdAt: new Date(), updatedAt: new Date() }
      );
    }

    // Buddha Bowl
    const buddha = recipes.find(r => r.title === 'Buddha Bowl Végétarien');
    if (buddha) {
      recipeIngredients.push(
        { id: uuidv4(), recipeId: buddha.id, ingredientId: findIngredient('Quinoa'), quantity: '200g', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: buddha.id, ingredientId: findIngredient('Tofu'), quantity: '200g', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: buddha.id, ingredientId: findIngredient('Épinards'), quantity: '150g', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: buddha.id, ingredientId: findIngredient('Carotte'), quantity: '2 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: buddha.id, ingredientId: findIngredient('Citron'), quantity: '1 unité', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: buddha.id, ingredientId: findIngredient('Huile d\'olive'), quantity: '2 cuillères à soupe', createdAt: new Date(), updatedAt: new Date() }
      );
    }

    // Tarte au Citron
    const tarte = recipes.find(r => r.title === 'Tarte au Citron Meringuée');
    if (tarte) {
      recipeIngredients.push(
        { id: uuidv4(), recipeId: tarte.id, ingredientId: findIngredient('Farine'), quantity: '250g', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: tarte.id, ingredientId: findIngredient('Beurre'), quantity: '125g', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: tarte.id, ingredientId: findIngredient('Citron'), quantity: '4 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: tarte.id, ingredientId: findIngredient('Œufs'), quantity: '5 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: tarte.id, ingredientId: findIngredient('Sucre'), quantity: '200g', createdAt: new Date(), updatedAt: new Date() }
      );
    }

    // Curry de Légumes
    const curry = recipes.find(r => r.title === 'Curry de Légumes');
    if (curry) {
      recipeIngredients.push(
        { id: uuidv4(), recipeId: curry.id, ingredientId: findIngredient('Pomme de terre'), quantity: '3 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: curry.id, ingredientId: findIngredient('Carotte'), quantity: '2 unités', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: curry.id, ingredientId: findIngredient('Courgette'), quantity: '1 unité', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: curry.id, ingredientId: findIngredient('Oignon'), quantity: '1 unité', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: curry.id, ingredientId: findIngredient('Ail'), quantity: '2 gousses', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: curry.id, ingredientId: findIngredient('Cumin'), quantity: '1 cuillère à café', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: curry.id, ingredientId: findIngredient('Paprika'), quantity: '1 cuillère à café', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: curry.id, ingredientId: findIngredient('Bouillon de légumes'), quantity: '200ml', createdAt: new Date(), updatedAt: new Date() }
      );
    }

    // Lasagnes
    const lasagnes = recipes.find(r => r.title === 'Lasagnes Bolognaise');
    if (lasagnes) {
      recipeIngredients.push(
        { id: uuidv4(), recipeId: lasagnes.id, ingredientId: findIngredient('Bœuf'), quantity: '500g haché', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: lasagnes.id, ingredientId: findIngredient('Sauce tomate'), quantity: '500ml', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: lasagnes.id, ingredientId: findIngredient('Oignon'), quantity: '1 unité', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: lasagnes.id, ingredientId: findIngredient('Ail'), quantity: '2 gousses', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: lasagnes.id, ingredientId: findIngredient('Lait'), quantity: '500ml', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: lasagnes.id, ingredientId: findIngredient('Beurre'), quantity: '50g', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: lasagnes.id, ingredientId: findIngredient('Farine'), quantity: '50g', createdAt: new Date(), updatedAt: new Date() },
        { id: uuidv4(), recipeId: lasagnes.id, ingredientId: findIngredient('Fromage râpé'), quantity: '200g', createdAt: new Date(), updatedAt: new Date() }
      );
    }

    await queryInterface.bulkInsert('RecipeIngredients', recipeIngredients, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RecipeIngredients', null, {});
  },
};