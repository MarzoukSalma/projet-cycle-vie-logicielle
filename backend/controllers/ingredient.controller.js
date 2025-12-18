// controllers/ingredient.controller.js
const db = require("../models");
const { Ingredient } = db;
const { Op } = require("sequelize");

// GET /api/ingredients/search?q=tomate
// Recherche d'ingrédients par nom (utilisé dans le front pour l'autocomplétion lors de la création de recette)
exports.searchIngredients = async (req, res) => {
  try {
    const { q } = req.query;

    // On exige au moins 2 caractères pour éviter trop de résultats
    if (!q || q.trim().length < 2) {
      return res.json([]); // tableau vide si query trop courte
    }

    const ingredients = await Ingredient.findAll({
      where: {
        name: {
          [Op.iLike]: `%${q.trim()}%`, // recherche insensible à la casse
        },
      },
      attributes: ["id", "name"], // on renvoie seulement ce qui est utile au front
      order: [["name", "ASC"]],
      limit: 15, // limite raisonnable pour l'autocomplétion
    });

    return res.json(ingredients);
  } catch (err) {
    console.error("Erreur recherche ingrédients :", err);
    return res.status(500).json({
      message: "Erreur lors de la recherche d'ingrédients",
      error: err.message,
    });
  }
};


 exports.getAllIngredients = async (req, res) => {
  try {
     const ingredients = await Ingredient.findAll({
      order: [["name", "ASC"]],
    });
    return res.json(ingredients);
 } catch (err) {
    return res.status(500).json({ message: "Erreur" });   }
 };