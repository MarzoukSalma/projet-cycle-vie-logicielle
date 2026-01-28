"use strict";
const crypto = require('crypto');

// Fonction pour générer un UUID v4
function uuidv4() {
  return crypto.randomUUID();
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Récupérer les utilisateurs existants
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" LIMIT 5',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      throw new Error('Aucun utilisateur trouvé. Exécutez d\'abord le seeder des utilisateurs.');
    }

    const recipes = [
      {
        id: uuidv4(),
        userId: users[0].id,
        title: 'Spaghetti Carbonara',
        description: 'Un grand classique italien crémeux et savoureux, parfait pour un repas rapide et délicieux.',
        imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
        steps: `1. Faites cuire les spaghettis dans de l'eau bouillante salée selon les instructions du paquet.
2. Pendant ce temps, faites revenir les lardons dans une poêle jusqu'à ce qu'ils soient croustillants.
3. Dans un bol, battez les œufs avec le parmesan râpé, le sel et le poivre.
4. Égouttez les pâtes en réservant un peu d'eau de cuisson.
5. Mélangez rapidement les pâtes chaudes avec les lardons et la préparation aux œufs hors du feu.
6. Ajoutez un peu d'eau de cuisson si nécessaire pour obtenir une texture crémeuse.
7. Servez immédiatement avec du parmesan supplémentaire.`,
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        totalTimeMinutes: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[1].id,
        title: 'Ratatouille Provençale',
        description: 'Un plat végétarien coloré et sain, gorgé de saveurs méditerranéennes.',
        imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800',
        steps: `1. Coupez tous les légumes (aubergine, courgette, poivron, tomate) en dés réguliers.
2. Faites revenir l'oignon et l'ail dans l'huile d'olive.
3. Ajoutez l'aubergine et faites cuire 5 minutes.
4. Incorporez la courgette et le poivron, cuisez 5 minutes supplémentaires.
5. Ajoutez les tomates, le thym, le basilic, sel et poivre.
6. Laissez mijoter à feu doux pendant 30 minutes en remuant de temps en temps.
7. Servez chaud ou tiède avec du pain frais.`,
        prepTimeMinutes: 20,
        cookTimeMinutes: 45,
        totalTimeMinutes: 65,
      
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[0].id,
        title: 'Poulet Rôti aux Herbes',
        description: 'Un poulet juteux et doré, parfumé aux herbes de Provence.',
        imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
        steps: `1. Préchauffez le four à 200°C.
2. Badigeonnez le poulet d'huile d'olive et frottez-le avec du sel, poivre, thym et ail écrasé.
3. Placez le poulet dans un plat allant au four avec des pommes de terre et carottes coupées.
4. Enfournez pour 1h15, en arrosant régulièrement avec le jus de cuisson.
5. Vérifiez la cuisson en piquant la cuisse : le jus doit être clair.
6. Laissez reposer 10 minutes avant de découper.
7. Servez avec les légumes rôtis.`,
        prepTimeMinutes: 15,
        cookTimeMinutes: 75,
        totalTimeMinutes: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[2].id,
        title: 'Salade César Maison',
        description: 'Une salade fraîche et croquante avec une sauce César onctueuse.',
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
        steps: `1. Préparez la sauce : mélangez mayonnaise, parmesan, jus de citron, ail écrasé, sel et poivre.
2. Lavez et essorez la salade romaine, coupez-la en morceaux.
3. Faites griller des croûtons dans une poêle avec un peu d'huile d'olive.
4. Faites cuire le poulet assaisonné dans une poêle, puis découpez-le en lamelles.
5. Dans un grand saladier, mélangez la salade avec la sauce.
6. Ajoutez les croûtons, le poulet et des copeaux de parmesan.
7. Servez immédiatement.`,
        prepTimeMinutes: 20,
        cookTimeMinutes: 10,
        totalTimeMinutes: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[3].id,
        title: 'Buddha Bowl Végétarien',
        description: 'Un bol complet et équilibré rempli de nutriments et de saveurs.',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
        steps: `1. Faites cuire le quinoa selon les instructions du paquet.
2. Coupez le tofu en cubes et faites-le revenir dans une poêle avec de la sauce soja.
3. Faites cuire les épinards à la vapeur pendant 3 minutes.
4. Préparez des bâtonnets de carotte crue et des tranches d'avocat.
5. Dans un bol, disposez le quinoa au centre.
6. Disposez harmonieusement tous les légumes et le tofu autour.
7. Arrosez d'une vinaigrette au citron et à l'huile d'olive.`,
        prepTimeMinutes: 15,
        cookTimeMinutes: 20,
        totalTimeMinutes: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[4].id,
        title: 'Tarte au Citron Meringuée',
        description: 'Un dessert classique avec une crème citronnée acidulée et une meringue légère.',
        imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800',
        steps: `1. Préparez la pâte sablée, étalez-la et garnissez un moule à tarte. Piquez le fond.
2. Faites cuire à blanc à 180°C pendant 15 minutes.
3. Pour la crème : mélangez le jus et zeste de citron, sucre, œufs et beurre dans une casserole.
4. Cuisez à feu doux en remuant jusqu'à épaississement.
5. Versez la crème sur la pâte cuite et laissez refroidir.
6. Montez les blancs en neige avec du sucre pour la meringue.
7. Déposez la meringue sur la tarte et dorez au four 5 minutes.`,
        prepTimeMinutes: 30,
        cookTimeMinutes: 25,
        totalTimeMinutes: 55,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[1].id,
        title: 'Curry de Légumes',
        description: 'Un curry végétarien épicé et réconfortant, parfait avec du riz basmati.',
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        steps: `1. Faites revenir l'oignon et l'ail dans l'huile.
2. Ajoutez le curry, le cumin et le paprika, faites griller 30 secondes.
3. Incorporez les légumes coupés en morceaux (pomme de terre, carotte, courgette).
4. Versez le lait de coco et le bouillon de légumes.
5. Laissez mijoter 25 minutes jusqu'à ce que les légumes soient tendres.
6. Rectifiez l'assaisonnement avec sel, poivre et jus de citron.
7. Servez avec du riz basmati et de la coriandre fraîche.`,
        prepTimeMinutes: 15,
        cookTimeMinutes: 30,
        totalTimeMinutes: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: users[2].id,
        title: 'Lasagnes Bolognaise',
        description: 'Des lasagnes généreuses et gratinées, un régal pour toute la famille.',
        imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800',
        steps: `1. Préparez la sauce bolognaise : faites revenir oignon et ail, ajoutez la viande hachée.
2. Incorporez la sauce tomate, les herbes, sel et poivre. Laissez mijoter 20 minutes.
3. Préparez une béchamel : faites fondre le beurre, ajoutez la farine puis le lait progressivement.
4. Dans un plat, alternez couches de pâtes, bolognaise, béchamel et fromage.
5. Terminez par une couche de béchamel et de fromage râpé.
6. Enfournez à 180°C pendant 35-40 minutes jusqu'à ce que le dessus soit doré.
7. Laissez reposer 10 minutes avant de servir.`,
        prepTimeMinutes: 30,
        cookTimeMinutes: 60,
        totalTimeMinutes: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Recipes', recipes, {});
    return recipes;
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Recipes', null, {});
  },
};