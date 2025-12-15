"use strict";
const crypto = require('crypto');

// Fonction pour générer un UUID v4
function uuidv4() {
  return crypto.randomUUID();
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Récupérer les utilisateurs et recettes
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const recipes = await queryInterface.sequelize.query(
      'SELECT id FROM "Recipes"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || recipes.length === 0) {
      throw new Error('Exécutez d\'abord les seeders des utilisateurs et recettes.');
    }

    const recipeTries = [
      {
        id: uuidv4(),
        userId: users[1].id,
        recipeId: recipes[0].id,
        commentText: 'Excellente recette ! J\'ai suivi les instructions à la lettre et c\'était délicieux. Toute ma famille a adoré.',
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[2].id,
        recipeId: recipes[0].id,
        commentText: 'Très bonne mais j\'ai rajouté un peu plus d\'ail car j\'adore ça. Parfait pour un dîner rapide en semaine.',
        imageUrl: 'https://images.unsplash.com/photo-1627662168758-1e1256ee3d4d?w=600',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[3].id,
        recipeId: recipes[1].id,
        commentText: 'Recette simple et saine. J\'ai utilisé des légumes bio du marché et c\'était parfait. Je referai sans hésiter !',
        imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[0].id,
        recipeId: recipes[2].id,
        commentText: 'Un classique indémodable. Le poulet était super juteux et les pommes de terre bien dorées. Merci pour la recette !',
        imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[4].id,
        recipeId: recipes[2].id,
        commentText: 'Première fois que je réussis un poulet rôti aussi bien ! Les herbes donnent un goût incroyable.',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[1].id,
        recipeId: recipes[3].id,
        commentText: 'La sauce César était parfaite ! Un peu longue à préparer mais ça vaut le coup.',
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[0].id,
        recipeId: recipes[4].id,
        commentText: 'Coloré, sain et délicieux ! J\'ai ajouté des graines de tournesol pour le croquant. Super bowl !',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[2].id,
        recipeId: recipes[4].id,
        commentText: 'Parfait pour un déjeuner sain et complet. J\'ai remplacé le tofu par des pois chiches.',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[3].id,
        recipeId: recipes[5].id,
        commentText: 'Un vrai délice ! La meringue était parfaite, bien croustillante à l\'extérieur et moelleuse à l\'intérieur.',
        imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[4].id,
        recipeId: recipes[6].id,
        commentText: 'Curry délicieux et réconfortant. J\'ai ajouté un peu de lait de coco pour plus de crémeux.',
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[0].id,
        recipeId: recipes[7].id,
        commentText: 'Les meilleures lasagnes que j\'ai faites ! Généreuses et savoureuses. Parfait pour recevoir.',
        imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[1].id,
        recipeId: recipes[7].id,
        commentText: 'Un peu long à préparer mais le résultat en vaut vraiment la peine. Toute la famille a adoré !',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[3].id,
        recipeId: recipes[6].id,
        commentText: 'Simple et efficace. J\'ai utilisé un mélange d\'épices maison et c\'était top !',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('RecipeTries', recipeTries, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RecipeTries', null, {});
  },
};