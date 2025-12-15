"use strict";
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Fonction pour générer un UUID v4
function uuidv4() {
  return crypto.randomUUID();
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        id: uuidv4(),
        username: 'chef_marie',
        email: 'marie@example.com',
        passwordHash: hashedPassword,
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        bio: 'Passionnée de cuisine française traditionnelle. J\'adore partager mes recettes de famille.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        username: 'cooking_pro',
        email: 'pro@example.com',
        passwordHash: hashedPassword,
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        bio: 'Chef professionnel avec 15 ans d\'expérience. Spécialiste en cuisine méditerranéenne.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        username: 'foodlover_sam',
        email: 'sam@example.com',
        passwordHash: hashedPassword,
        avatarUrl: 'https://i.pravatar.cc/150?img=33',
        bio: 'Amateur de bonne cuisine et de pâtisserie. Toujours à la recherche de nouvelles saveurs!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        username: 'veggie_chef',
        email: 'veggie@example.com',
        passwordHash: hashedPassword,
        avatarUrl: 'https://i.pravatar.cc/150?img=47',
        bio: 'Cuisine végétarienne et vegan créative. La santé dans l\'assiette!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        username: 'baker_emma',
        email: 'emma@example.com',
        passwordHash: hashedPassword,
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        bio: 'Pâtissière amatrice. J\'aime créer des desserts qui font sourire.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Users', users, {});
    
    // Sauvegarder les IDs pour les utiliser dans d'autres seeders
    return users;
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};