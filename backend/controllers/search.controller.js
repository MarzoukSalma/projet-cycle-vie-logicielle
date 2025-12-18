// controllers/search.controller.js
const db = require("../models");
const { Recipe, Ingredient, User } = db;
const { Op } = require("sequelize");

// GET /api/search?q=spaghetti
// Recherche globale : recettes par titre/description, ingrédients par nom, et recettes contenant un ingrédient
exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    // Validation : query minimale
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        message: "La requête de recherche doit avoir au moins 2 caractères",
      });
    }

    const searchTerm = q.trim();

    // 1. Recherche recettes par titre ou description
    const recipes = await Recipe.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } },
        ],
      },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "avatarUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 20, // Limite pour éviter surcharge
    });

    // 2. Recherche ingrédients par nom
    const ingredients = await Ingredient.findAll({
      where: {
        name: { [Op.iLike]: `%${searchTerm}%` },
      },
      order: [["name", "ASC"]],
      limit: 10,
    });

    // 3. Bonus : recettes contenant un ingrédient similaire (many-to-many)
    const recipesWithIngredient = await Recipe.findAll({
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          where: { name: { [Op.iLike]: `%${searchTerm}%` } },
          required: true, // Seulement les recettes qui matchent
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "avatarUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    return res.json({
      recipes,
      ingredients,
      recipesWithIngredient,
    });
  } catch (err) {
    console.error("Erreur lors de la recherche globale :", err);
    return res.status(500).json({
      message: "Erreur serveur lors de la recherche",
      error: err.message,
    });
  }
};