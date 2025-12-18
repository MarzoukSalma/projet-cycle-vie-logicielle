// controllers/recipeTry.controller.js
const db = require("../models");
const { RecipeTry, Recipe, User } = db;

// POST /api/recipes/:recipeId/try

exports.createRecipeTry = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const {  commentText, imageUrl } = req.body;
 const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "userId est requis" });
    }

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    // Optionnel : empêcher de marquer plusieurs fois la même recette
    const alreadyTried = await RecipeTry.findOne({
      where: { userId, recipeId },
    });
    if (alreadyTried) {
      return res.status(400).json({
        message: "Tu as déjà marqué cette recette comme essayée",
      });
    }

    const newTry = await RecipeTry.create({
      userId,
      recipeId,
      commentText: commentText || null,
      imageUrl: imageUrl || null,
    });

    // Recharge avec les infos de l'utilisateur qui a essayé
    await newTry.reload({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl"],
        },
      ],
    });

    return res.status(201).json(newTry);
  } catch (err) {
    console.error("Erreur lors de la création du try:", err);
    return res.status(500).json({
      message: "Erreur serveur lors de l'essai de la recette",
      error: err.message,
    });
  }
};

// GET /api/recipes/:recipeId/tries
exports.getTriesByRecipeId = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const tries = await RecipeTry.findAll({
      where: { recipeId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatarUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(tries);
  } catch (err) {
    console.error("Erreur lors de la récupération des tries:", err);
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};